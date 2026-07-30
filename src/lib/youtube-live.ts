import { unstable_cache } from "next/cache";
import { supabaseAdmin } from "./supabase";

/**
 * "Is Central live right now?" — polls the YouTube Data API, stores the
 * answer in Supabase, and hands it to the site as one small object.
 *
 * Scheduling follows Part 5, Option B of the setup guide: no cron. Page
 * renders call `getLivestreamState()`, which is `unstable_cache`-wrapped at
 * 180s — the first visitor after the cache expires pays for a fresh poll,
 * everyone else gets what's cached. `/api/youtube/poll` (route.ts alongside
 * this file) exists for manual refreshes during testing, and doubles as the
 * entry point for Vercel Cron (Option A) if that's ever needed — same
 * function either way, just triggered differently.
 */

export type LiveStatus = "LIVE" | "UPCOMING" | "REPLAY";

export interface LivestreamState {
  status: LiveStatus;
  live_video_id: string | null;
  upcoming_video_id: string | null;
  upcoming_start: string | null;
  latest_vod_id: string | null;
  latest_vod_title: string | null;
  latest_vod_date: string | null;
  updated_at: string;
}

/**
 * What the site shows with nothing configured yet: no live/upcoming stream
 * known, so the UI falls back to the generic "join us Sunday" copy it always
 * had. Also what a poll returns if a step fails partway through — stale is
 * fine, a blank Live section isn't.
 */
const UNCONFIGURED_STATE: LivestreamState = {
  status: "UPCOMING",
  live_video_id: null,
  upcoming_video_id: null,
  upcoming_start: null,
  latest_vod_id: null,
  latest_vod_title: null,
  latest_vod_date: null,
  updated_at: new Date(0).toISOString(),
};

const YT_BASE = "https://www.googleapis.com/youtube/v3";

async function ytFetch<T>(
  path: string,
  params: Record<string, string>,
): Promise<T | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return null;

  const url = new URL(`${YT_BASE}/${path}`);
  url.searchParams.set("key", apiKey);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.error(
        `YouTube API ${path} responded ${res.status}: ${(await res.text()).slice(0, 300)}`,
      );
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`YouTube API ${path} unreachable:`, err);
    return null;
  }
}

/**
 * True during the window a Sunday morning stream would actually be live
 * (America/Chicago, 9:30 AM – 12:30 PM). Only checked in this window because
 * `eventType=live` costs 100 quota units — polling it all week for a stream
 * that only ever runs Sunday mornings would burn quota for nothing.
 */
export function isSundayLiveWindow(now = new Date()): boolean {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  if (get("weekday") !== "Sun") return false;
  const minutesSinceMidnight = Number(get("hour")) * 60 + Number(get("minute"));
  return minutesSinceMidnight >= 9 * 60 + 30 && minutesSinceMidnight <= 12 * 60 + 30;
}

interface YtSearchResponse {
  items?: { id?: { videoId?: string } }[];
}

async function findLiveVideoId(channelId: string): Promise<string | null> {
  const data = await ytFetch<YtSearchResponse>("search", {
    part: "id",
    channelId,
    eventType: "live",
    type: "video",
  });
  return data?.items?.[0]?.id?.videoId ?? null;
}

interface YtVideosResponse {
  items?: {
    id: string;
    snippet?: {
      title?: string;
      description?: string;
      thumbnails?: { high?: { url?: string }; default?: { url?: string } };
    };
    liveStreamingDetails?: {
      scheduledStartTime?: string;
      actualStartTime?: string;
      actualEndTime?: string;
    };
  }[];
}

async function findUpcoming(
  channelId: string,
): Promise<{ videoId: string; scheduledStart: string | null } | null> {
  const search = await ytFetch<YtSearchResponse>("search", {
    part: "id",
    channelId,
    eventType: "upcoming",
    type: "video",
    order: "date",
  });
  const videoId = search?.items?.[0]?.id?.videoId;
  if (!videoId) return null;

  const details = await ytFetch<YtVideosResponse>("videos", {
    part: "liveStreamingDetails",
    id: videoId,
  });
  const scheduledStart =
    details?.items?.[0]?.liveStreamingDetails?.scheduledStartTime ?? null;
  return { videoId, scheduledStart };
}

/**
 * Cheap freshness check (2 quota units total), run on every poll regardless
 * of the live/upcoming checks above. Reads the channel's uploads playlist —
 * every YouTube channel has one, and its ID is always the channel ID with
 * "UC" swapped for "UU" — and archives anything with an actualEndTime
 * (a completed stream) into `sermons`.
 */
async function refreshSermonsAndLatest(
  channelId: string,
): Promise<{ id: string; title: string; date: string | null } | null> {
  const uploadsPlaylistId = `UU${channelId.slice(2)}`;
  const playlist = await ytFetch<{
    items?: { contentDetails?: { videoId?: string } }[];
  }>("playlistItems", {
    part: "contentDetails",
    playlistId: uploadsPlaylistId,
    maxResults: "10",
  });
  const videoIds = (playlist?.items ?? [])
    .map((i) => i.contentDetails?.videoId)
    .filter((id): id is string => Boolean(id));
  if (videoIds.length === 0) return null;

  const details = await ytFetch<YtVideosResponse>("videos", {
    part: "snippet,liveStreamingDetails",
    id: videoIds.join(","),
  });

  const completed = (details?.items ?? []).filter(
    (v) => v.liveStreamingDetails?.actualEndTime,
  );
  if (completed.length === 0) return null;

  completed.sort((a, b) => {
    const aEnd = a.liveStreamingDetails?.actualEndTime ?? "";
    const bEnd = b.liveStreamingDetails?.actualEndTime ?? "";
    return bEnd.localeCompare(aEnd);
  });

  if (supabaseAdmin) {
    const rows = completed.map((v) => ({
      video_id: v.id,
      title: v.snippet?.title ?? "Untitled",
      description: v.snippet?.description ?? null,
      streamed_at:
        v.liveStreamingDetails?.actualStartTime ??
        v.liveStreamingDetails?.actualEndTime ??
        null,
      thumbnail_url:
        v.snippet?.thumbnails?.high?.url ??
        v.snippet?.thumbnails?.default?.url ??
        null,
    }));
    const { error } = await supabaseAdmin.from("sermons").upsert(rows);
    if (error) console.error("Sermon archive upsert failed:", error.message);
  }

  const latest = completed[0];
  return {
    id: latest.id,
    title: latest.snippet?.title ?? "Untitled",
    date:
      latest.liveStreamingDetails?.actualStartTime ??
      latest.liveStreamingDetails?.actualEndTime ??
      null,
  };
}

async function readCurrentState(): Promise<LivestreamState | null> {
  if (!supabaseAdmin) return null;
  const { data } = await supabaseAdmin
    .from("livestream_state")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  return data as LivestreamState | null;
}

/**
 * Runs one full poll and writes the result to Supabase. Uncached — call this
 * directly for a manual refresh (the route handler does); page renders
 * should go through `getLivestreamState()` below instead.
 */
export async function pollYouTubeLive(): Promise<LivestreamState> {
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!channelId || !process.env.YOUTUBE_API_KEY) {
    return UNCONFIGURED_STATE;
  }

  const existing = await readCurrentState();

  const liveVideoId = isSundayLiveWindow() ? await findLiveVideoId(channelId) : null;

  // Reuse a known future-dated upcoming stream rather than re-searching for
  // it on every weekday poll — that search alone is 100 quota units.
  let upcomingVideoId = existing?.upcoming_video_id ?? null;
  let upcomingStart = existing?.upcoming_start ?? null;
  const upcomingStillAhead =
    upcomingStart !== null && new Date(upcomingStart).getTime() > Date.now();

  if (!liveVideoId && !upcomingStillAhead) {
    const found = await findUpcoming(channelId);
    upcomingVideoId = found?.videoId ?? null;
    upcomingStart = found?.scheduledStart ?? null;
  }

  const status: LiveStatus = liveVideoId
    ? "LIVE"
    : upcomingVideoId
      ? "UPCOMING"
      : "REPLAY";

  const latest = await refreshSermonsAndLatest(channelId);

  const state: LivestreamState = {
    status,
    live_video_id: liveVideoId,
    upcoming_video_id: upcomingVideoId,
    upcoming_start: upcomingStart,
    latest_vod_id: latest?.id ?? existing?.latest_vod_id ?? null,
    latest_vod_title: latest?.title ?? existing?.latest_vod_title ?? null,
    latest_vod_date: latest?.date ?? existing?.latest_vod_date ?? null,
    updated_at: new Date().toISOString(),
  };

  if (supabaseAdmin) {
    const { error } = await supabaseAdmin
      .from("livestream_state")
      .upsert({ id: 1, ...state });
    if (error) console.error("livestream_state upsert failed:", error.message);
  }

  return state;
}

/**
 * What page renders should call. Cached at 180s and tagged so the poll route
 * can force an immediate refresh (`revalidateTag("livestream-state")`)
 * during testing without waiting out the cache window.
 */
export const getLivestreamState = unstable_cache(
  async (): Promise<LivestreamState> => {
    if (!process.env.YOUTUBE_CHANNEL_ID || !process.env.YOUTUBE_API_KEY) {
      // Nothing configured — read Supabase directly if it exists (skips the
      // YouTube calls pollYouTubeLive() would otherwise short-circuit past
      // anyway), else fall back to the static "join us Sunday" state.
      const existing = await readCurrentState();
      return existing ?? UNCONFIGURED_STATE;
    }
    return pollYouTubeLive();
  },
  ["livestream-state"],
  { revalidate: 180, tags: ["livestream-state"] },
);

/** `youtube.com/channel/{id}/live` — always redirects to whatever's live or
 *  next scheduled, so it works as a fallback even when our own state is
 *  stale or wrong. */
export function watchLiveUrl(): string | null {
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  return channelId ? `https://www.youtube.com/channel/${channelId}/live` : null;
}
