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

/** "Sat Aug 8 · 9:00 AM" for one-day events, "Aug 15–17" for multi-day */
export function eventWhen(event: ChurchEvent) {
  if (event.allDay && event.end) {
    const sameMonth = monthShort(event.start) === monthShort(event.end);
    const endPart = sameMonth
      ? fmt(event.end, { day: "numeric" })
      : fmt(event.end, { month: "short", day: "numeric" });
    return `${fmt(event.start, { month: "short", day: "numeric" })}–${endPart}`;
  }
  return `${fmt(event.start, { weekday: "short", month: "short", day: "numeric" })} · ${timeOf(event.start)}`;
}

/** "Saturday, August 8, 2026" */
export function eventDateLong(event: ChurchEvent) {
  return fmt(event.start, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
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
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toStamp(event.start)}/${toStamp(event.end ?? event.start)}`,
    location: event.location,
    details: event.description ?? "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
