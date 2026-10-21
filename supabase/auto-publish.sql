-- Publish reviews instantly (no approval step).
-- Run once in Supabase: SQL Editor > New query > paste > Run.
-- You can still hide a review later by unticking "approved" in the Table Editor.

alter table public.reviews alter column approved set default true;

drop policy if exists "submit review" on public.reviews;
create policy "submit review" on public.reviews
  for insert to anon, authenticated
  with check (approved = true);

-- Publish anything that was waiting (except the setup test rows).
update public.reviews set approved = true where name not like 'TEST%';
delete from public.reviews where name like 'TEST%';
