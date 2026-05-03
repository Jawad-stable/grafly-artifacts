-- ============================================================================
-- Grafly: tighten security on remote-content tables and storage.
-- Paste into Supabase Dashboard -> SQL Editor -> New query -> Run.
-- Idempotent: safe to re-run.
-- ============================================================================

-- 1) app_courses: only SIGNED-IN users may read. Anon (random scrapers using
--    the public anon key) cannot list or read course content anymore.
alter table public.app_courses enable row level security;

drop policy if exists "anon read enabled courses" on public.app_courses;
drop policy if exists "authenticated read enabled courses" on public.app_courses;

create policy "authenticated read enabled courses"
  on public.app_courses
  for select
  to authenticated
  using (enabled = true);

-- service_role keeps full access for the seed script (already exists, recreate
-- defensively in case it was dropped).
drop policy if exists "service role full access" on public.app_courses;
create policy "service role full access"
  on public.app_courses
  for all
  to service_role
  using (true)
  with check (true);

-- 2) course-assets bucket: flip from public to private. Reads now require an
--    authenticated session (the app will mint short-lived signed URLs at
--    runtime). Existing image keys / paths don't change.
update storage.buckets set public = false where id = 'course-assets';

drop policy if exists "public read course-assets" on storage.objects;
drop policy if exists "authenticated read course-assets" on storage.objects;
create policy "authenticated read course-assets"
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'course-assets');

-- 3) Defensive: make sure RLS is enabled on the other public tables so a
--    future "alter table" or restore can't accidentally leave them open.
alter table public.game_state       enable row level security;
alter table public.critique_designs enable row level security;
