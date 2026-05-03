-- ============================================================================
-- Grafly remote-content schema
-- Paste this into: Supabase Dashboard -> SQL Editor -> New query -> Run
-- Idempotent: safe to re-run.
-- ============================================================================

-- Courses table: each row is one full Course (with all nested modules/lessons)
-- stored as JSONB. Keeping it denormalized makes adding/editing courses a
-- single-row operation and keeps the app's TS types unchanged.
create table if not exists public.app_courses (
  id          text primary key,
  order_idx   int  not null default 0,
  data        jsonb not null,
  enabled     boolean not null default true,
  updated_at  timestamptz not null default now()
);

create index if not exists app_courses_order_idx on public.app_courses (order_idx);

-- RLS: anyone (anon + authenticated) can READ enabled rows.
-- Only service_role (server-side scripts) can write.
alter table public.app_courses enable row level security;

drop policy if exists "anon read enabled courses" on public.app_courses;
create policy "anon read enabled courses"
  on public.app_courses
  for select
  to anon, authenticated
  using (enabled = true);

drop policy if exists "service role full access" on public.app_courses;
create policy "service role full access"
  on public.app_courses
  for all
  to service_role
  using (true)
  with check (true);

-- Public storage bucket for course images (mascots, design samples, etc.)
-- so future courses can reference asset URLs without bundling them in the APK.
insert into storage.buckets (id, name, public)
values ('course-assets', 'course-assets', true)
on conflict (id) do update set public = true;

-- Allow public read on the bucket (writes still require service_role).
drop policy if exists "public read course-assets" on storage.objects;
create policy "public read course-assets"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'course-assets');
