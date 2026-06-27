import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Deletes the requesting user's own account (auth record + owned rows).
// The user proves identity via their JWT; we never accept a user id from the body.
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const auth = req.headers.get("Authorization");
  if (!auth) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: cors });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const svc = createClient(SUPABASE_URL, SERVICE_KEY);

  const { data: { user }, error } = await svc.auth.getUser(auth.replace("Bearer ", ""));
  if (error || !user) {
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401, headers: cors });
  }

  try {
    const uid = user.id;
    // Best-effort cleanup of owned data (service role bypasses RLS)
    await svc.from("user_progress").delete().eq("user_id", uid);
    await svc.from("profiles").delete().eq("id", uid);
    await svc.from("photo_history").delete().eq("user_id", uid);
    await svc.from("ai_usage").delete().eq("user_id", uid);
    await svc.from("chat_stats").delete().eq("user_id", uid);
    await svc.from("testimonials").delete().eq("user_id", uid);
    // Finally delete the auth user
    const { error: delErr } = await svc.auth.admin.deleteUser(uid);
    if (delErr) throw delErr;
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...cors, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: cors });
  }
});
