-- ════════════════════════════════════════════════════════════════
-- Auth: no email verification — accounts are created, auto-confirmed,
-- stored in public.profiles, and usable (login) immediately.
-- Applied live to project wxrukupcyfypnqnotmxv; kept here for reproducibility.
-- ════════════════════════════════════════════════════════════════

-- 1) One-time backfill: confirm any pending accounts + ensure they have profiles
update auth.users
set email_confirmed_at = coalesce(email_confirmed_at, now())
where email_confirmed_at is null;

insert into public.profiles (id, email, name, created_at)
select u.id, u.email,
       coalesce(u.raw_user_meta_data->>'name', split_part(u.email,'@',1)),
       u.created_at
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;

-- 2) Auto-confirm every NEW account at insert time (skips email verification)
create or replace function public.auto_confirm_user() returns trigger as $$
begin
  if new.email_confirmed_at is null then
    new.email_confirmed_at := now();
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists auto_confirm_on_signup on auth.users;
create trigger auto_confirm_on_signup
  before insert on auth.users
  for each row execute function public.auto_confirm_user();

-- 3) Always store the new user in public.profiles (server-side guarantee,
--    independent of the client-side upsert)
create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, email, name, created_at)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    now()
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
