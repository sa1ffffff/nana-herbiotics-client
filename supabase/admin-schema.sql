-- Nana Herbiotics: admin features (products, orders, review moderation, image storage).
-- Run this once in Supabase: SQL Editor > New query > paste the whole file > Run.
-- Safe to run again later; it drops and recreates its own objects.

-- ───────────────────────── Admin check ─────────────────────────
-- True only for a signed-in Google account whose email is one of these two.
-- Edit this list if you ever add another admin.
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(
    (auth.jwt() ->> 'email') in ('saifullahwasim1@gmail.com', 'nanaherbiotics@gmail.com'),
    false
  )
$$;

-- ───────────────────────── Reviews: moderation + dynamic products ─────────────────────────
-- Admin-added products use generated ids, so the review table can no longer check
-- product_id against a fixed list of 8 names.
alter table public.reviews drop constraint if exists reviews_product_id_check;

drop policy if exists "admin manage reviews" on public.reviews;
create policy "admin manage reviews" on public.reviews
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ───────────────────────── Products ─────────────────────────
create table if not exists public.products (
  id          text primary key,
  name        text not null check (char_length(name) between 1 and 80),
  category    text not null check (category in ('shampoos', 'hair-care', 'skin-care', 'soaps')),
  size        text not null check (char_length(size) between 1 and 40),
  price       integer not null check (price > 0),
  short       text not null check (char_length(short) between 1 and 160),
  long        text not null check (char_length(long) between 1 and 2000),
  ingredients text[] not null default '{}',
  badges      text[] not null default '{}',
  image       text not null,
  alt         text not null check (char_length(alt) between 1 and 200),
  created_at  timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "read products" on public.products;
create policy "read products" on public.products
  for select to anon, authenticated
  using (true);

drop policy if exists "admin manage products" on public.products;
create policy "admin manage products" on public.products
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ───────────────────────── Orders ─────────────────────────
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  order_id        text not null unique,
  customer_name   text not null,
  customer_email  text not null,
  customer_phone  text not null,
  products        jsonb not null,
  subtotal        integer not null,
  delivery        integer not null default 0,
  total           integer not null,
  city            text not null,
  address         text not null,
  notes           text,
  created_at      timestamptz not null default now()
);

alter table public.orders enable row level security;

-- Checkout runs with no login, so anyone can record an order (never read one back).
drop policy if exists "place order" on public.orders;
create policy "place order" on public.orders
  for insert to anon, authenticated
  with check (true);

drop policy if exists "admin read orders" on public.orders;
create policy "admin read orders" on public.orders
  for select to authenticated
  using (public.is_admin());

drop policy if exists "admin delete orders" on public.orders;
create policy "admin delete orders" on public.orders
  for delete to authenticated
  using (public.is_admin());

-- ───────────────────────── Storage: product images ─────────────────────────
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "read product images" on storage.objects;
create policy "read product images" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists "admin upload product images" on storage.objects;
create policy "admin upload product images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "admin replace product images" on storage.objects;
create policy "admin replace product images" on storage.objects
  for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "admin delete product images" on storage.objects;
create policy "admin delete product images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

-- Check: should print the two admin emails -> true, and (if you're signed in as
-- anyone else) false for everyone else.
select public.is_admin();
