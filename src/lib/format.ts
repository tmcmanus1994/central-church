import type { ChurchEvent } from "@/content/events";

const TZ = "America/Chicago";

const DAY_NAMES: Record<string, string> = {
  SU: "Sun",
  MO: "Mon",
  TU: "Tue",
  WE: "Wed",
  TH: "Thu",
  FR: "Fri",
  SA: "Sat",
};

function fmt(iso: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", { timeZone: TZ, ...options }).format(
    new Date(iso),
  );
}

export function timeOf(iso: string) {
  return fmt(iso, { hour: "numeric", minute: "2-digit" });
}

/** "9:15" — meridiem stripped, for compact weekly-rhythm lists */
export function shortTimeOf(iso: string) {
  return timeOf(iso).replace(/\s?[AP]M$/i, "");
}

export function monthShort(iso: string) {
  return fmt(iso, { month: "short" });
}

export function dayOfMonth(iso: string) {
  return fmt(iso, { day: "2-digit" });
}

/** Days from a simplified RRULE: "FREQ=WEEKLY;BYDAY=WE,FR" → "Wed & Fri" */
export function rruleDays(rrule?: string) {
  const byday = rrule?.match(/BYDAY=([A-Z,]+)/)?.[1];
  if (!byday) return "";
  return byday
    .split(",")
    .map((d) => DAY_NAMES[d] ?? d)
    .join(" & ");
}

/** "Sun 9:15–10:00" or "Wed & Fri 9–11" style label for recurring events */
export function recurringWhen(event: ChurchEvent) {
  const days = rruleDays(event.rrule);
  const start = shortTimeOf(event.start);
  const end = event.end ? `–${shortTimeOf(event.end)}` : "";
  return `${days} ${start}${end}`.trim();
}

/**
 * "Sat Aug 8 · 9:00 AM" for a timed event, "Aug 15–17" across days, and just
 * "Fri Aug 7" for an all-day one.
 *
 * An all-day event never shows a clock time. Bulletin entries carry a
 * placeholder hour so they sort into the right day, and printing it would
 * advertise a start time nobody agreed to.
 */
export function eventWhen(event: ChurchEvent) {
  if (event.allDay) {
    const spansDays = event.end && dayKey(event.start) !== dayKey(event.end);
    if (!spansDays) {
      return fmt(event.start, { weekday: "short", month: "short", day: "numeric" });
    }
    const sameMonth = monthShort(event.start) === monthShort(event.end!);
    const endPart = sameMonth
      ? fmt(event.end!, { day: "numeric" })
      : fmt(event.end!, { month: "short", day: "numeric" });
    return `${fmt(event.start, { month: "short", day: "numeric" })}–${endPart}`;
  }
  return `${fmt(event.start, { weekday: "short", month: "short", day: "numeric" })} · ${timeOf(event.start)}`;
}

/** Calendar day in Chicago, for comparing two instants by date alone. */
function dayKey(iso: string) {
  return fmt(iso, { year: "numeric", month: "2-digit", day: "2-digit" });
}

/**
 * "Saturday, August 8, 2026", or "Monday, August 31 – Tuesday, September 1,
 * 2026" when the event spans days. A trip has to show both ends of itself.
 */
export function eventDateLong(event: ChurchEvent) {
  const long = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  } as const;

  if (!event.end || dayKey(event.start) === dayKey(event.end)) {
    return fmt(event.start, long);
  }

  const sameYear = fmt(event.start, { year: "numeric" }) === fmt(event.end, { year: "numeric" });
  const { year: _drop, ...noYear } = long;
  return `${fmt(event.start, sameYear ? noYear : long)} – ${fmt(event.end, long)}`;
}

/** "9:00 – 11:00 AM" */
export function eventTimeRange(event: ChurchEvent) {
  if (event.allDay) return "All day";
  if (!event.end) return timeOf(event.start);
  return `${timeOf(event.start).replace(/\s?[AP]M$/i, "")} – ${timeOf(event.end)}`;
}

/** Google Calendar "add to calendar" URL — no backend required */
export function addToCalendarUrl(event: ChurchEvent) {
  const toStamp = (iso: string) =>
    new Date(iso)
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  /**
   * All-day events use Google's bare YYYYMMDD form, where the end is
   * exclusive — so the inclusive end we store gets a day added back.
   */
  const dayStamp = (iso: string, plusDays = 0) => {
    // en-CA renders as YYYY-MM-DD, which parses unambiguously.
    const ymd = new Intl.DateTimeFormat("en-CA", {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(iso));
    const d = new Date(`${ymd}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + plusDays);
    return d.toISOString().slice(0, 10).replace(/-/g, "");
  };

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: event.allDay
      ? `${dayStamp(event.start)}/${dayStamp(event.end ?? event.start, 1)}`
      : `${toStamp(event.start)}/${toStamp(event.end ?? event.start)}`,
    location: event.location,
    details: event.description ?? "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
