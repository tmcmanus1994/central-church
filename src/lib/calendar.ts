import type { ChurchEvent, EventTag } from "@/content/events";
import {
  recurringEvents as seedRecurring,
  upcomingEvents as seedUpcoming,
} from "@/content/events";
import { eventPhotos } from "@/content/event-photos";
import { parseIcs, type IcsEvent } from "./ics";

/**
 * Pulls events from the church's Google Calendars.
 *
 * Each ministry keeps its own calendar and only public events go on them, so
 * the calendar itself is the filter — there's no allow-list to maintain here,
 * and nothing private is ever fetched.
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
  const slug = slugify(ics.summary);
  return {
    slug,
    title: ics.summary,
    start: ics.start,
    end: ics.end,
    allDay: ics.allDay || undefined,
    location: ics.location?.trim() || "823 W 6th St, Little Rock",
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
    return { recurring: seedRecurring, upcoming: seedUpcoming, live: false };
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
    return { recurring: seedRecurring, upcoming: seedUpcoming, live: false };
  }

  // Same event on two calendars: keep the first, so feed order decides.
  const bySlug = new Map<string, ChurchEvent>();
  for (const event of all) {
    if (!bySlug.has(event.slug)) bySlug.set(event.slug, event);
  }
  const merged = [...bySlug.values()];

  const now = Date.now();
  const horizon = now + HORIZON_DAYS * 86_400_000;

  const recurring = merged
    .filter((e) => e.recurring)
    .sort((a, b) => a.title.localeCompare(b.title));

  const upcoming = merged
    .filter((e) => !e.recurring)
    .filter((e) => {
      const end = new Date(e.end ?? e.start).getTime();
      const start = new Date(e.start).getTime();
      return end >= now && start <= horizon;
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  return { recurring, upcoming, live: true };
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
