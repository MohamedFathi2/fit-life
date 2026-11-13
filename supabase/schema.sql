-- FitLife — Supabase schema. Run once in Supabase → SQL Editor → New query → Run.
-- Every row belongs to one user; row-level security makes sure nobody can read or write anyone else's data.

-- 1) Documents: all app data (plan, daily logs, workouts, body entries, notes…) as JSON documents.
create table if not exists public.docs (
  user_id    uuid        not null default auth.uid() references auth.users (id) on delete cascade,
  col        text        not null,            -- collection: settings | plan | days | workouts | body | checkins | notes | foods | active
  id         text        not null,            -- document id within the collection (often a date)
  data       jsonb,
  deleted    boolean     not null default false,
  client_ts  bigint      not null,            -- device clock (ms) of the last edit; newest edit wins
  updated_at timestamptz not null default now(),
  primary key (user_id, col, id)
);
create index if not exists docs_user_updated on public.docs (user_id, updated_at);

alter table public.docs enable row level security;
drop policy if exists "docs: own rows" on public.docs;
create policy "docs: own rows" on public.docs
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Last-write-wins: ignore an update that is older than what is already stored,
-- and stamp server time so other devices can pull "everything changed since X".
create or replace function public.docs_lww() returns trigger
language plpgsql set search_path = '' as $$
begin
  if tg_op = 'UPDATE' and new.client_ts < old.client_ts then
    return old;
  end if;
  new.updated_at := clock_timestamp();
  return new;
end $$;
drop trigger if exists docs_lww on public.docs;
create trigger docs_lww before insert or update on public.docs
  for each row execute function public.docs_lww();

-- 2) Progress photos: a private storage bucket; each user can only touch files under "<their user id>/".
insert into storage.buckets (id, name, public)
values ('photos', 'photos', false)
on conflict (id) do nothing;

drop policy if exists "photos: own files read" on storage.objects;
drop policy if exists "photos: own files write" on storage.objects;
drop policy if exists "photos: own files update" on storage.objects;
drop policy if exists "photos: own files delete" on storage.objects;
create policy "photos: own files read" on storage.objects for select to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "photos: own files write" on storage.objects for insert to authenticated
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "photos: own files update" on storage.objects for update to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "photos: own files delete" on storage.objects for delete to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
