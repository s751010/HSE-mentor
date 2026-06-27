import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FOUNDER_EMAIL = "seeaf2013@gmail.com";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const auth = req.headers.get("Authorization");
  if (!auth) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: cors });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const svc = createClient(SUPABASE_URL, SERVICE_KEY);

  // Verify requester is the founder
  const { data: { user }, error } = await svc.auth.getUser(auth.replace("Bearer ", ""));
  if (error || !user || user.email !== FOUNDER_EMAIL) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: cors });
  }

  try {
    // Fetch all auth users with pagination
    const allUsers: any[] = [];
    let page = 1;
    const perPage = 1000;
    while (true) {
      const { data, error: listErr } = await svc.auth.admin.listUsers({ page, perPage });
      if (listErr) throw listErr;
      if (!data.users || data.users.length === 0) break;
      allUsers.push(...data.users);
      if (data.users.length < perPage) break;
      page++;
    }

    const result = allUsers.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.user_metadata?.name || "",
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
      email_confirmed_at: u.email_confirmed_at,
      confirmed: !!u.email_confirmed_at,
    }));

    return new Response(JSON.stringify({ users: result }), {
      status: 200,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: cors });
  }
});
