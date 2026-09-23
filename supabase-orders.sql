-- Run in Supabase SQL Editor
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_id text unique,
  payment_id text,
  name text,
  email text,
  phone text,
  product_name text,
  product_id text,
  amount numeric,
  status text default 'paid',
  delivered boolean default false,
  created_at timestamptz default now()
);

alter table orders disable row level security;
grant select, insert, update, delete on public.orders to anon;
