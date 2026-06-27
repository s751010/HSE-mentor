import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const auth = req.headers.get("Authorization");
  if (!auth) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: cors });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const svc = createClient(SUPABASE_URL, SERVICE_KEY);

  // Verify user JWT
  const { data: { user }, error } = await svc.auth.getUser(auth.replace("Bearer ", ""));
  if (error || !user) {
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401, headers: cors });
  }

  // OpenAI key stored in platform_secrets (service_role only — never in client code)
  const { data: secretData } = await svc
    .from("platform_secrets")
    .select("value")
    .eq("key", "openai_api_key")
    .single();
  const OPENAI_KEY = (secretData?.value ?? "").trim();
  if (!OPENAI_KEY) {
    return new Response(JSON.stringify({ error: "لم يتم تكوين مفتاح AI" }), { status: 503, headers: cors });
  }

  // Server-side rate limiting
  const today = new Date().toISOString().split("T")[0];
  const { data: usage } = await svc.from("ai_usage").select("count").eq("user_id", user.id).eq("date", today).maybeSingle();
  const { data: cfg } = await svc.from("founder_config").select("config").eq("id", "main").single();
  const limit: number = cfg?.config?.settings?.ailimit ?? 40;
  const count: number = usage?.count ?? 0;

  if (count >= limit) {
    return new Response(
      JSON.stringify({ error: `وصلت للحد اليومي (${limit} طلب). جرّب غداً.` }),
      { status: 429, headers: cors }
    );
  }

  await svc.from("ai_usage").upsert({
    user_id: user.id,
    date: today,
    count: count + 1,
    updated_at: new Date().toISOString(),
  });

  // Forward to OpenAI
  const body = await req.json();
  let oaRes: Response;
  try {
    oaRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (_e) {
    return new Response(JSON.stringify({ error: "تعذّر الاتصال بـ OpenAI" }), { status: 502, headers: cors });
  }

  const data = await oaRes.json();

  // Token + cost accounting (never block the response on this)
  try {
    const u = data?.usage;
    if (oaRes.ok && u) {
      // OpenAI prices per 1M tokens (USD). Order matters: check "gpt-4o-mini" before "gpt-4o".
      const PRICES: Record<string, { in: number; out: number }> = {
        "gpt-4o-mini": { in: 0.15, out: 0.60 },
        "gpt-4o": { in: 2.50, out: 10.00 },
      };
      const model = String(body?.model ?? "gpt-4o-mini").toLowerCase();
      let price = PRICES["gpt-4o-mini"];
      if (model.startsWith("gpt-4o-mini")) price = PRICES["gpt-4o-mini"];
      else if (model.startsWith("gpt-4o")) price = PRICES["gpt-4o"];

      const pt: number = u.prompt_tokens ?? 0;
      const ct: number = u.completion_tokens ?? 0;
      const cost = (pt * price.in + ct * price.out) / 1_000_000;

      const { data: cur } = await svc
        .from("ai_usage")
        .select("prompt_tokens,completion_tokens,cost_usd")
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle();

      await svc
        .from("ai_usage")
        .update({
          prompt_tokens: Number(cur?.prompt_tokens ?? 0) + pt,
          completion_tokens: Number(cur?.completion_tokens ?? 0) + ct,
          cost_usd: Number(cur?.cost_usd ?? 0) + cost,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("date", today);
    }
  } catch (_e) {
    // accounting failure must not affect the user response
  }

  return new Response(JSON.stringify(data), {
    status: oaRes.status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
});
