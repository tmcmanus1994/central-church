-- Central Shop: youth sizes on the T-shirt, and per-size sold-out flags.
--
-- Run once in the Supabase SQL Editor after the first shop migration. Safe
-- to re-run.
--
-- Size codes: S, M, L, XL, 2XL for adults; YS, YM, YL, YXL for youth. The
-- site shows youth codes as "Youth Small" etc. and groups them in their own
-- row on the size picker. Sizes stay per product, so any product can carry
-- any mix.
--
-- sold_out_sizes: codes from `sizes` that can't be ordered right now. They
-- show greyed out with a "Sold Out" note, and the order API refuses them.
-- Edit the array in Table Editor to mark a size sold out or back in stock;
-- the page picks it up within a minute, no deploy.

alter table public.shop_products
  add column if not exists sold_out_sizes text[] not null default '{}';

update public.shop_products
  set sizes = '{YS,YL,S,M,L,XL,2XL}'
  where id = 'tee';

update public.shop_products
  set sold_out_sizes = '{M}'
  where id = 'hoodie';
