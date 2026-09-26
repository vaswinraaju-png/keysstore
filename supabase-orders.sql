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

-- Coupons table
create table if not exists coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_percent numeric not null,
  active boolean default true,
  uses_left integer default null,
  expires_at timestamptz default null,
  created_at timestamptz default now()
);

alter table coupons disable row level security;
grant select, insert, update, delete on public.coupons to anon;

-- Insert test coupon
insert into coupons (code, discount_percent, active, uses_left)
values ('ASHHHHKSJDHCNIS99DISC', 99, true, 10);
