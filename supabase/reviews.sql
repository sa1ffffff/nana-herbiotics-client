-- Nana Herbiotics: product reviews
-- Run this once in the Supabase SQL editor (Dashboard > SQL > New query).

create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  product_id  text not null check (product_id in (
                'herbal-shampoo', 'hibiscus-shampoo', 'herbal-conditioner', 'herbal-face-wash',
                'herbal-body-wash', 'brightening-serum', 'acne-soap', 'brightening-soap')),
  name        text not null check (char_length(name) between 2 and 60),
  city        text check (city is null or char_length(city) <= 60),
  rating      smallint not null check (rating between 1 and 5),
  title       text check (title is null or char_length(title) <= 80),
  body        text not null check (char_length(body) between 10 and 1000),
  approved    boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists reviews_product_idx on public.reviews (product_id, created_at desc) where approved;

alter table public.reviews enable row level security;

-- Visitors can read approved reviews only.
drop policy if exists "read approved reviews" on public.reviews;
create policy "read approved reviews" on public.reviews
  for select to anon, authenticated
  using (approved);

-- Visitors can submit a review, but it always starts unapproved.
drop policy if exists "submit review" on public.reviews;
create policy "submit review" on public.reviews
  for insert to anon, authenticated
  with check (approved = false);

-- No update/delete policies: only you (from the dashboard / service role) can approve or remove reviews.
-- To approve: Table Editor > reviews > tick "approved" on the row.
