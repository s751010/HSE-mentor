import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { email } = await req.json();
    if (!email) return new Response(JSON.stringify({ error: "email required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

    // Find user by email and confirm them if created recently (last 15 min)
    const { data: users, error: listErr } = await admin.auth.admin.listUsers();
    if (listErr) throw listErr;

    const user = (users.users || []).find((u: { email?: string; created_at: string; email_confirmed_at?: string | null }) =>
      u.email === email && !u.email_confirmed_at &&
      (Date.now() - new Date(u.created_at).getTime()) < 15 * 60 * 1000
    );

    if (!user) return new Response(JSON.stringify({ ok: true, msg: "already confirmed or not found" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { error: updateErr } = await admin.auth.admin.updateUserById(user.id, { email_confirm: true });
    if (updateErr) throw updateErr;

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
