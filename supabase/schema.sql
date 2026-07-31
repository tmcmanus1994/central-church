-- Plan a Visit form storage.
--
-- Run this once in the Supabase SQL Editor (Project → SQL Editor → New query
-- → paste → Run). src/app/api/plan-a-visit/route.ts is the only thing that
-- writes here, using the service-role key — see that file for how it's used.

-- If this project previously ran the YouTube Live integration schema, drop
-- those tables — that feature has been cut in favor of linking straight to
-- YouTube (see .env.example and src/lib/site.ts).
drop table if exists livestream_state;
drop table if exists sermons;

create table if not exists visit_requests (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  service text,
  has_kids boolean not null default false,
  notes text,
  created_at timestamptz default now()
);

-- Safe to re-run: adds the column for anyone who already ran an earlier
-- version of this script without it.
alter table visit_requests add column if not exists has_kids boolean not null default false;

-- RLS enabled with no policies: only the service-role key (server-only, used
-- by the route handler) can read or write. The site's public anon key never
-- touches this table, so visit requests aren't publicly readable.
alter table visit_requests enable row level security;
