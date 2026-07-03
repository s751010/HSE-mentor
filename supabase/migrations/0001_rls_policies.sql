-- ═══════════════════════════════════════════════════════════════════════
-- مرشد السلامة — Row Level Security policies
-- ═══════════════════════════════════════════════════════════════════════
-- WHY: The client uses the public anon key (this is normal), so ALL data
-- protection depends on RLS. Without the policies below, any authenticated
-- user could read every other user's progress/photos, and could overwrite
-- the shared `founder_config` row (e.g. raise the AI limit or change the
-- landing content). These policies close that gap.
--
-- HOW TO APPLY: run this in the Supabase SQL editor (or `supabase db push`).
-- Safe to re-run: policies are dropped-if-exists before being recreated.
--
-- Founder identity is matched by email via auth.jwt(). Change the address
-- below if the founder account changes.
-- ═══════════════════════════════════════════════════════════════════════

-- Helper: is the current request the founder?
create or replace function public.is_founder()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'seeaf2013@gmail.com';
$$;

-- ── user_progress ─────────────────────────────────────────────────────
alter table public.user_progress enable row level security;

drop policy if exists user_progress_owner_select on public.user_progress;
drop policy if exists user_progress_owner_write  on public.user_progress;
drop policy if exists user_progress_founder_read  on public.user_progress;

create policy user_progress_owner_select on public.user_progress
  for select using (auth.uid() = user_id);
create policy user_progress_owner_write on public.user_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- Founder analytics needs to read all rows (read-only).
create policy user_progress_founder_read on public.user_progress
  for select using (public.is_founder());

-- ── photo_history ─────────────────────────────────────────────────────
alter table public.photo_history enable row level security;

drop policy if exists photo_history_owner_all on public.photo_history;

create policy photo_history_owner_all on public.photo_history
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── profiles ──────────────────────────────────────────────────────────
alter table public.profiles enable row level security;

drop policy if exists profiles_owner_all    on public.profiles;
drop policy if exists profiles_founder_read on public.profiles;

create policy profiles_owner_all on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);
create policy profiles_founder_read on public.profiles
  for select using (public.is_founder());

-- ── ai_usage ──────────────────────────────────────────────────────────
-- Written server-side by the edge function (service role bypasses RLS).
-- Clients only need to read their own rows; founder reads all for analytics.
alter table public.ai_usage enable row level security;

drop policy if exists ai_usage_owner_read   on public.ai_usage;
drop policy if exists ai_usage_founder_read  on public.ai_usage;

create policy ai_usage_owner_read on public.ai_usage
  for select using (auth.uid() = user_id);
create policy ai_usage_founder_read on public.ai_usage
  for select using (public.is_founder());

-- ── founder_config ────────────────────────────────────────────────────
-- Single shared row (id='main'): readable by everyone (drives the landing
-- page + tool visibility), but writable ONLY by the founder.
alter table public.founder_config enable row level security;

drop policy if exists founder_config_public_read on public.founder_config;
drop policy if exists founder_config_founder_write on public.founder_config;

create policy founder_config_public_read on public.founder_config
  for select using (true);
create policy founder_config_founder_write on public.founder_config
  for all using (public.is_founder()) with check (public.is_founder());

-- ── platform_secrets ──────────────────────────────────────────────────
-- Holds the OpenAI key. Only the service role (edge function) may touch it.
-- Enabling RLS with NO policies means anon/authenticated clients get nothing.
alter table public.platform_secrets enable row level security;

drop policy if exists platform_secrets_no_client on public.platform_secrets;
-- (intentionally no permissive policy — service role bypasses RLS)
