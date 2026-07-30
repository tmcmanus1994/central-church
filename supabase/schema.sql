-- YouTube Live integration schema.
--
-- Run this once in the Supabase SQL Editor (Project → SQL Editor → New query
-- → paste → Run) after creating the project. src/lib/youtube-live.ts is the
-- only thing that talks to these tables — see that file for how they're used.

-- Single-row state table: the current answer to "what should the Live
-- section show?" The site reads this row; it never queries YouTube directly.
create table livestream_state (
  id int primary key default 1 check (id = 1),
  status text not null check (status in ('LIVE','UPCOMING','REPLAY')),
  live_video_id text,          -- set when status = LIVE
  upcoming_video_id text,      -- set when a public stream is scheduled
  upcoming_start timestamptz,  -- scheduled start, if known
  latest_vod_id text,          -- most recent completed stream (always kept fresh)
  latest_vod_title text,
  latest_vod_date timestamptz,
  updated_at timestamptz default now()
);

-- Auto-archived past streams → powers the homepage "Latest media" card and
-- the Live Stream page's "Last Sunday at Central" section.
create table sermons (
  video_id text primary key,
  title text not null,
  description text,
  streamed_at timestamptz,
  thumbnail_url text,
  created_at timestamptz default now()
);

-- RLS: public read (the site's anon key can read both tables), service-role
-- write only (the poller is the only writer, using the secret key).
alter table livestream_state enable row level security;
alter table sermons enable row level security;
create policy "public read" on livestream_state for select using (true);
create policy "public read" on sermons for select using (true);
