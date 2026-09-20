-- Run this in Supabase SQL Editor

-- Products table
create table if not exists products (
  id text primary key,
  name text not null,
  original_price numeric not null,
  sale_price numeric not null,
  category text default 'Software',
  badge text default '',
  image text default '',
  description text default '',
  active boolean default true,
  show_timer boolean default true,
  seo jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Site settings table
create table if not exists settings (
  id text primary key default 'global',
  data jsonb not null default '{}'
);

-- Enable public read (store is public)
alter table products enable row level security;
alter table settings enable row level security;

-- Anyone can read active products
create policy "Public read products" on products
  for select using (true);

-- Anon can do everything (admin uses anon key with password check in app)
create policy "Anon full access products" on products
  for all using (true) with check (true);

create policy "Anon full access settings" on settings
  for all using (true) with check (true);

-- Insert default settings
insert into settings (id, data) values ('global', '{
  "siteName": "KeyStore India",
  "tagline": "Genuine Software Keys at India'\''s Best Prices",
  "metaTitle": "Buy Genuine Windows & Office Keys at Best Price in India | KeyStore India",
  "metaDesc": "Get 100% genuine Windows 11, Windows 10, MS Office 2024 activation keys at lowest prices in India. Instant digital delivery. Lifetime validity.",
  "ogImage": "",
  "gscVerification": "",
  "robotsTxt": "User-agent: *\nAllow: /\nSitemap: https://cdkeys.site/sitemap.xml",
  "analyticsId": "",
  "buyNowUrl": "",
  "whatsappNumber": ""
}') on conflict (id) do nothing;

-- Supabase Storage bucket for images
insert into storage.buckets (id, name, public) 
values ('product-images', 'product-images', true)
on conflict do nothing;

-- Allow public read of images
create policy "Public read images" on storage.objects
  for select using (bucket_id = 'product-images');

-- Allow anon upload
create policy "Anon upload images" on storage.objects
  for insert with check (bucket_id = 'product-images');

create policy "Anon update images" on storage.objects
  for update using (bucket_id = 'product-images');

create policy "Anon delete images" on storage.objects
  for delete using (bucket_id = 'product-images');
