-- Reset the reviews access rules. Safe to run any number of times.
-- Supabase: SQL Editor > New query > paste > Run.

alter table public.reviews enable row level security;
alter table public.reviews alter column approved set default true;

grant select, insert on public.reviews to anon, authenticated;

-- Remove every existing policy on the table, whatever it was named.
do $$
declare p record;
begin
  for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'reviews' loop
    execute format('drop policy %I on public.reviews', p.policyname);
  end loop;
end $$;

-- Anyone can read published reviews.
create policy "read approved reviews" on public.reviews
  for select to anon, authenticated
  using (approved);

-- Anyone can submit; reviews publish straight away.
create policy "submit review" on public.reviews
  for insert to anon, authenticated
  with check (approved);

-- Publish everything real, remove the setup test rows.
delete from public.reviews where name like 'TEST%';
update public.reviews set approved = true;

-- Check: this should list exactly the two policies above.
select policyname, cmd, roles from pg_policies where tablename = 'reviews';
