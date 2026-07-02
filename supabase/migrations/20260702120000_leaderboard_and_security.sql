-- ═══════════════════════════════════════════════════════════════
-- مرشد السلامة — لوحة المتصدرين + تأمين الجداول (RLS)
-- طريقة التطبيق: افتح لوحة Supabase → SQL Editor → الصق الملف كاملاً → Run
-- الملف آمن للتشغيل المتكرر (idempotent).
-- ═══════════════════════════════════════════════════════════════

-- 1) جدول تقدم المستخدم (يُنشأ إن لم يكن موجوداً)
create table if not exists public.user_progress (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_progress enable row level security;

do $$ begin
  create policy "own progress select" on public.user_progress
    for select using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "own progress insert" on public.user_progress
    for insert with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "own progress update" on public.user_progress
    for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- 2) جدول سجل تحليل الصور (يُنشأ إن لم يكن موجوداً)
create table if not exists public.photo_history (
  id               bigint generated always as identity primary key,
  user_id          uuid not null references auth.users(id) on delete cascade,
  image_path       text,
  score            numeric,
  violations_count integer,
  summary          text,
  hse_data         jsonb,
  report_ref       text,
  created_at       timestamptz not null default now()
);

alter table public.photo_history enable row level security;

do $$ begin
  create policy "own photos select" on public.photo_history
    for select using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "own photos insert" on public.photo_history
    for insert with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "own photos delete" on public.photo_history
    for delete using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

create index if not exists photo_history_user_created_idx
  on public.photo_history (user_id, created_at desc);

-- 3) دالة لوحة المتصدرين (SECURITY DEFINER — تعرض الاسم وXP فقط، لا بيانات حساسة)
create or replace function public.get_leaderboard(p_limit integer default 10)
returns table (
  display_name text,
  xp           integer,
  streak       integer,
  is_me        boolean
)
language sql
security definer
set search_path = public
stable
as $$
  select
    coalesce(nullif(trim(up.data->'profile'->>'name'), ''), 'متدرب مجهول') as display_name,
    coalesce((up.data->>'xp')::integer, 0)                                  as xp,
    coalesce((up.data->>'streak')::integer, 0)                              as streak,
    (up.user_id = auth.uid())                                               as is_me
  from public.user_progress up
  where coalesce((up.data->>'xp')::integer, 0) > 0
  order by 2 desc, up.updated_at asc
  limit least(greatest(coalesce(p_limit, 10), 1), 50);
$$;

revoke all on function public.get_leaderboard(integer) from public;
grant execute on function public.get_leaderboard(integer) to authenticated;

-- 4) تذكير (لا يُنفَّذ): تأكد من وجود bucket تخزين باسم hse-images (خاص/private)
--    مع سياسات تسمح لكل مستخدم بالقراءة والكتابة داخل مجلده فقط:
--    (storage.foldername(name))[1] = auth.uid()::text
