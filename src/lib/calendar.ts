import type { ChurchEvent, EventTag } from "@/content/events";
import {
  recurringEvents as weeklyRhythm,
  upcomingEvents as seedUpcoming,
} from "@/content/events";
import { eventPhotos } from "@/content/event-photos";
import {
  ALWAYS_PRIVATE,
  ALWAYS_PUBLIC,
  CENTRAL_LOCATIONS,
  LOCATION_OVERRIDES,
  PRIVATE_PATTERNS,
  TITLE_CLEANUP,
} from "@/content/calendar-rules";
import { parseIcs, type IcsEvent } from "./ics";

/**
 * Pulls events from the church's Google Calendars.
 *
 * The calendars supply *dated* events only. The weekly rhythm — Sunday
 * classes through Kids Closet — is the fixed list in content/events.ts,
 * because the calendars carry far more repeating entries than the seven
 * things that actually meet each week, and they overlap each other.
 *
 * Each ministry keeps its own calendar, and those calendars run the building
 * as well as the congregation — so what arrives here needs filtering, tidying,
 * and de-duplicating before it's an events list. The rules live in
 * content/calendar-rules.ts; this file applies them.
 *
 * Feeds are configured by environment variable so calendar URLs stay out of
 * the repo. With none set, the site falls back to the seed data in
 * content/events.ts and everything still builds.
 */

/** Calendar → the tag its events carry through the UI. */
const FEEDS: { env: string; tag: EventTag; ministrySlug?: string }[] = [
  { env: "CALENDAR_ICS_CENTRAL_CHURCH", tag: "All Church" },
  { env: "CALENDAR_ICS_OUTREACH", tag: "Outreach" },
  { env: "CALENDAR_ICS_CENTRAL_TEENS", tag: "Central Teens", ministrySlug: "teens" },
  { env: "CALENDAR_ICS_CENTRAL_KIDS", tag: "Central Kids", ministrySlug: "children" },
];

/** How long a fetched feed is reused before Next re-fetches it. */
const REVALIDATE_SECONDS = 900;

/** How far ahead the Upcoming list looks. */
const HORIZON_DAYS = 240;

export function calendarConfigured(): boolean {
  return FEEDS.some((f) => Boolean(process.env[f.env]));
}

/** Strips the prefixes and room notes staff calendars accumulate. */
function cleanTitle(raw: string): string {
  let title = raw.trim();
  for (const { pattern, replace } of TITLE_CLEANUP) {
    title = title.replace(pattern, replace);
  }
  return title.trim() || raw.trim();
}

/**
 * Titles collapse to a comparison key so near-duplicates across calendars
 * merge: "Kid's Closet" and "Kids Closet Open" both become "kids closet".
 */
function dedupeKey(title: string): string {
  return cleanTitle(title)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\b(open|opens|meeting|class|classes|group|time)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** True when an event is office admin rather than something to publish. */
export function isPrivateEvent(title: string): boolean {
  const clean = cleanTitle(title);
  const lower = clean.toLowerCase();
  if (ALWAYS_PUBLIC.some((t) => lower === t.toLowerCase())) return false;
  if (ALWAYS_PRIVATE.some((t) => lower === t.toLowerCase())) return true;
  return PRIVATE_PATTERNS.some((re) => re.test(clean));
}

/**
 * Whether a location is somewhere other than the church building. Off-site
 * events show their own address instead of Central's — a trip to Silver
 * Dollar City shouldn't list 823 W 6th St.
 */
export function isOffsite(location?: string): boolean {
  if (!location) return false;
  const lower = location.toLowerCase();
  return !CENTRAL_LOCATIONS.some((known) => lower.includes(known));
}

/** "Back to School Backpack Giveaway" → "back-to-school-backpack-giveaway" */
function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

/**
 * Google descriptions often carry HTML. Strip it to plain text — the event
 * pages render descriptions as paragraphs, not markup.
 */
function toPlainText(html?: string): string | undefined {
  if (!html) return undefined;
  const text = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return text || undefined;
}

function toChurchEvent(
  ics: IcsEvent,
  tag: EventTag,
  ministrySlug: string | undefined,
): ChurchEvent {
  const title = cleanTitle(ics.summary);
  const slug = slugify(title);
  const rawLocation = LOCATION_OVERRIDES[slug] ?? ics.location?.trim() ?? "";
  const offsite = isOffsite(rawLocation);

  return {
    slug,
    title,
    start: ics.start,
    end: ics.end,
    allDay: ics.allDay || undefined,
    location: rawLocation || "823 W 6th St, Little Rock",
    offsite,
    description: toPlainText(ics.description),
    // Calendar entries carry no artwork, so photos come from the local map.
    image: eventPhotos[slug],
    tag,
    recurring: Boolean(ics.rrule),
    rrule: ics.rrule,
    ministrySlug,
  };
}

async function fetchFeed(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) {
      console.error(`Calendar feed responded ${res.status}: ${url.slice(0, 60)}…`);
      return null;
    }
    return await res.text();
  } catch (err) {
    console.error("Calendar feed unreachable:", err);
    return null;
  }
}

export interface CalendarData {
  /** Always the fixed weekly list — never read from the feeds. */
  recurring: ChurchEvent[];
  upcoming: ChurchEvent[];
  /** False when no feed is configured or every feed failed. */
  live: boolean;
}

/**
 * Fetches and merges every configured calendar. Falls back to the seed data
 * whenever nothing usable comes back, so the site never renders an empty
 * calendar because of a transient network failure.
 */
export async function getCalendar(): Promise<CalendarData> {
  const configured = FEEDS.filter((f) => process.env[f.env]);
  if (configured.length === 0) {
    return { recurring: weeklyRhythm, upcoming: seedUpcoming, live: false };
  }

  const results = await Promise.all(
    configured.map(async (feed) => {
      const text = await fetchFeed(process.env[feed.env]!);
      if (!text) return [];
      return parseIcs(text).map((e) =>
        toChurchEvent(e, feed.tag, feed.ministrySlug),
      );
    }),
  );

  const all = results.flat();
  if (all.length === 0) {
    return { recurring: weeklyRhythm, upcoming: seedUpcoming, live: false };
  }

  // Drop office admin — meetings, time off, room bookings.
  const hidden: string[] = [];
  const publicEvents = all.filter((e) => {
    if (isPrivateEvent(e.title)) {
      hidden.push(e.title);
      return false;
    }
    return true;
  });
  if (hidden.length) {
    console.log(
      `Calendar: hid ${hidden.length} internal event(s): ${[...new Set(hidden)].join(", ")}`,
    );
  }

  /**
   * Repeating calendar entries never reach the site. The weekly rhythm is the
   * fixed list above, and everything else that repeats — overlapping series,
   * duplicate copies of the same class, standing holds — would only crowd it.
   */
  const dated: ChurchEvent[] = [];
  const dropped: string[] = [];
  for (const event of publicEvents) {
    if (event.recurring) dropped.push(event.title);
    else dated.push(event);
  }
  if (dropped.length) {
    console.log(
      `Calendar: skipped ${dropped.length} repeating entr(ies) — the weekly rhythm is fixed in content/events.ts: ${[...new Set(dropped)].join(", ")}`,
    );
  }

  /**
   * Merge near-duplicates among what's left: the same event sitting on two
   * ministry calendars, or entered twice under slightly different names. The
   * weekly rhythm's own keys are seeded first, so a one-off copy of something
   * that already meets weekly — an "Encouragers" entry on a Thursday — drops
   * out instead of appearing twice.
   */
  const byKey = new Map<string, ChurchEvent | null>(
    weeklyRhythm.map((e) => [dedupeKey(e.title), null]),
  );
  for (const event of dated) {
    const key = dedupeKey(event.title);
    if (byKey.has(key)) continue;
    byKey.set(key, event);
  }
  const merged = [...byKey.values()].filter((e): e is ChurchEvent => e !== null);

  const now = Date.now();
  const horizon = now + HORIZON_DAYS * 86_400_000;

  const upcoming = merged
    .filter((e) => {
      const end = new Date(e.end ?? e.start).getTime();
      const start = new Date(e.start).getTime();
      return end >= now && start <= horizon;
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  return { recurring: weeklyRhythm, upcoming, live: true };
}

/** All events, for routes that need to resolve a single slug. */
export async function getAllCalendarEvents(): Promise<ChurchEvent[]> {
  const { recurring, upcoming } = await getCalendar();
  return [...recurring, ...upcoming];
}

export async function getCalendarEvent(slug: string) {
  return (await getAllCalendarEvents()).find((e) => e.slug === slug);
}

/**
 * The featured event. Google Calendar has no "spotlight" field, so the next
 * event carrying a photo is promoted — that keeps the homepage banner looking
 * intentional without asking anyone to tag events specially.
 */
export async function getCalendarSpotlight(): Promise<ChurchEvent | undefined> {
  const { upcoming } = await getCalendar();
  return upcoming.find((e) => e.image) ?? upcoming[0];
}
