-- Central Shop: delivery option (pick up at Central, or ship out of state).
--
-- Run once in the Supabase SQL Editor after the earlier shop migrations.
-- Safe to re-run.
--
-- shop_settings.shipping_fee_cents: added to the order total when the
-- buyer chooses shipping. 0 means shipping is free; change it in Table
-- Editor and the page picks it up within a minute.
--
-- shop_orders.delivery_method / shipping_address / shipping_cents: what the
-- buyer chose, the address they typed (street, unit, city, state, zip), and
-- the fee that was in force when they ordered. Shipping is only offered to
-- addresses outside Arkansas; the site and the order API both enforce it.

alter table public.shop_settings
  add column if not exists shipping_fee_cents integer not null default 0
  check (shipping_fee_cents >= 0);

do $$
begin
  if not exists (select 1 from pg_type where typname = 'shop_delivery_method') then
    create type public.shop_delivery_method as enum ('pickup', 'ship');
  end if;
end $$;

alter table public.shop_orders
  add column if not exists delivery_method public.shop_delivery_method not null default 'pickup';

alter table public.shop_orders
  add column if not exists shipping_address jsonb;

alter table public.shop_orders
  add column if not exists shipping_cents integer not null default 0;
