-- Central Shop: products, settings, orders, and the private receipts bucket.
--
-- Run this once in the Supabase SQL Editor (Project → SQL Editor → New query
-- → paste → Run). It is safe to re-run: every statement checks before it
-- creates. The site reads shop_products and shop_settings with the public
-- (anon) key under the policies below; shop_orders and the shop-receipts
-- bucket are only ever touched by the server with the service-role key —
-- see src/app/api/shop/orders/route.ts.
--
-- After running it, open Table Editor → shop_settings and replace the
-- placeholder values (Cashtag, Pushpay link and fund, cash recipients,
-- pickup details). Nothing in the code carries those facts.

-- Products ------------------------------------------------------------------

create table if not exists public.shop_products (
  id text primary key,                 -- 'tee', 'crew', 'hoodie'
  name text not null,                  -- 'T-Shirt'
  price_cents integer not null check (price_cents >= 0),
  sizes text[] not null default '{S,M,L,XL,2XL}',
  image_path text not null,            -- '/shop/tee.webp'
  image_alt text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

insert into public.shop_products (id, name, price_cents, image_path, image_alt, sort_order) values
  ('tee',    'T-Shirt',  1500, '/shop/tee.webp',    'Black Central Church T-shirt with the skyline stripe design', 1),
  ('crew',   'Crewneck', 2500, '/shop/crew.webp',   'Black Central Church crewneck sweatshirt with the skyline stripe design', 2),
  ('hoodie', 'Hoodie',   3000, '/shop/hoodie.webp', 'Black Central Church hoodie with the skyline stripe design', 3)
on conflict (id) do nothing;

-- Settings (one row) ---------------------------------------------------------

create table if not exists public.shop_settings (
  id integer primary key default 1 check (id = 1),
  is_open boolean not null default true,
  cashapp_cashtag text not null default '$CentralCashtag',
  pushpay_url text not null default 'https://example.com/pushpay',
  pushpay_fund text not null default '[Fund name]',
  cash_recipients text[] not null default '{"Travelle","Jessica Ward"}',
  pickup_details text not null default '[Pickup details]'
);

insert into public.shop_settings (id) values (1)
on conflict (id) do nothing;

-- Orders ---------------------------------------------------------------------

do $$
begin
  if not exists (select 1 from pg_type where typname = 'shop_payment_method') then
    create type public.shop_payment_method as enum ('cashapp', 'pushpay', 'cash');
  end if;
  if not exists (select 1 from pg_type where typname = 'shop_order_status') then
    create type public.shop_order_status as enum ('submitted', 'payment_confirmed', 'ready', 'picked_up', 'cancelled');
  end if;
end $$;

create table if not exists public.shop_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,   -- e.g. 'CC-7K4QX'
  created_at timestamptz not null default now(),
  customer_name text not null,
  customer_contact text not null,      -- phone or email, as typed
  items jsonb not null,                -- [{product_id, name, size, qty, unit_price_cents, line_total_cents}]
  total_cents integer not null,
  payment_method public.shop_payment_method not null,
  cash_recipient text,                 -- only when payment_method = 'cash'
  payment_reference text,              -- optional typed reference
  receipt_path text,                   -- path in the shop-receipts bucket, if uploaded
  status public.shop_order_status not null default 'submitted',
  admin_notes text,
  notification_sent_at timestamptz,
  constraint receipt_or_reference check (receipt_path is not null or coalesce(trim(payment_reference), '') <> '')
);

create index if not exists shop_orders_created_at_idx on public.shop_orders (created_at desc);

-- Security -------------------------------------------------------------------

alter table public.shop_products enable row level security;
alter table public.shop_settings enable row level security;
alter table public.shop_orders   enable row level security;

drop policy if exists "Public can read active products" on public.shop_products;
create policy "Public can read active products" on public.shop_products
  for select using (is_active);

drop policy if exists "Public can read shop settings" on public.shop_settings;
create policy "Public can read shop settings" on public.shop_settings
  for select using (true);

-- shop_orders gets NO public policies. Only the server (service role) reads
-- or writes it.

-- Receipts bucket (private: no public policies, so only the service role can
-- read or write objects in it) ---------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'shop-receipts',
  'shop-receipts',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf']
)
on conflict (id) do nothing;
