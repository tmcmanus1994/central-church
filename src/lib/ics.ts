/**
 * Minimal iCalendar parser — enough for Google Calendar's public .ics feeds.
 *
 * Deliberately not a full RFC 5545 implementation: it reads the fields the
 * site actually renders and leaves recurrence rules unexpanded, because the
 * design shows recurring events as a weekly rhythm list rather than as dated
 * instances.
 */

export interface IcsEvent {
  uid: string;
  summary: string;
  description?: string;
  location?: string;
  /** ISO 8601 with offset */
  start: string;
  end?: string;
  allDay: boolean;
  rrule?: string;
  /** Last modified, used to pick a winner when feeds overlap. */
  sequence: number;
}

/** Offset of `tz` from UTC, in ms, at a given instant. */
function tzOffsetMs(utcMs: number, tz: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(utcMs));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const asUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour") % 24,
    get("minute"),
    get("second"),
  );
  return asUtc - utcMs;
}

/**
 * Converts a wall-clock time in `tz` to a real instant. Two passes because the
 * offset itself depends on the instant (DST boundaries).
 */
function zonedToDate(
  y: number,
  mo: number,
  d: number,
  h: number,
  mi: number,
  s: number,
  tz: string,
): Date {
  const guess = Date.UTC(y, mo - 1, d, h, mi, s);
  let utc = guess - tzOffsetMs(guess, tz);
  utc = guess - tzOffsetMs(utc, tz);
  return new Date(utc);
}

/** Formats a Date as ISO 8601 carrying `tz`'s offset rather than Z. */
function toZonedIso(date: Date, tz: string): string {
  const offMs = tzOffsetMs(date.getTime(), tz);
  const sign = offMs >= 0 ? "+" : "-";
  const abs = Math.abs(offMs);
  const hh = String(Math.floor(abs / 3_600_000)).padStart(2, "0");
  const mm = String(Math.floor((abs % 3_600_000) / 60_000)).padStart(2, "0");
  const local = new Date(date.getTime() + offMs).toISOString().slice(0, 19);
  return `${local}${sign}${hh}:${mm}`;
}

/** Parses DTSTART/DTEND in any of the three shapes Google emits. */
function parseDateValue(
  raw: string,
  params: Record<string, string>,
  defaultTz: string,
): { iso: string; allDay: boolean } {
  const value = raw.trim();

  // VALUE=DATE:20260808 — an all-day event
  if (params.VALUE === "DATE" || /^\d{8}$/.test(value)) {
    const y = +value.slice(0, 4);
    const mo = +value.slice(4, 6);
    const d = +value.slice(6, 8);
    return {
      iso: toZonedIso(zonedToDate(y, mo, d, 0, 0, 0, defaultTz), defaultTz),
      allDay: true,
    };
  }

  const m = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/);
  if (!m) return { iso: value, allDay: false };
  const [, y, mo, d, h, mi, s, zulu] = m;

  // Trailing Z means UTC; otherwise TZID (or the calendar's default zone)
  const date = zulu
    ? new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +s))
    : zonedToDate(+y, +mo, +d, +h, +mi, +s, params.TZID || defaultTz);

  return { iso: toZonedIso(date, defaultTz), allDay: false };
}

/** Unescapes TEXT values per RFC 5545. */
function unescapeText(v: string): string {
  return v
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}

/** Joins folded lines: a leading space or tab continues the previous line. */
function unfold(text: string): string[] {
  const out: string[] = [];
  for (const line of text.replace(/\r\n/g, "\n").split("\n")) {
    if (/^[ \t]/.test(line) && out.length) out[out.length - 1] += line.slice(1);
    else out.push(line);
  }
  return out;
}

/** "20260808" → "20260807", month and year rollover included. */
function previousDate(yyyymmdd: string): string {
  const prev = new Date(
    Date.UTC(
      +yyyymmdd.slice(0, 4),
      +yyyymmdd.slice(4, 6) - 1,
      +yyyymmdd.slice(6, 8) - 1,
    ),
  );
  const pad = (n: number, w = 2) => String(n).padStart(w, "0");
  return `${pad(prev.getUTCFullYear(), 4)}${pad(prev.getUTCMonth() + 1)}${pad(prev.getUTCDate())}`;
}

export function parseIcs(text: string, defaultTz = "America/Chicago"): IcsEvent[] {
  const events: IcsEvent[] = [];
  let current: Partial<IcsEvent> | null = null;
  let cancelled = false;

  for (const line of unfold(text)) {
    if (line === "BEGIN:VEVENT") {
      current = { sequence: 0 };
      cancelled = false;
      continue;
    }
    if (line === "END:VEVENT") {
      if (current?.uid && current.summary && current.start && !cancelled) {
        // A malformed all-day entry can end before it starts once DTEND is
        // made inclusive. Drop the end rather than render a negative range.
        if (current.end && new Date(current.end) < new Date(current.start)) {
          delete current.end;
        }
        events.push(current as IcsEvent);
      }
      current = null;
      continue;
    }
    if (!current) continue;

    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const rawName = line.slice(0, colon);
    const value = line.slice(colon + 1);
    const [name, ...paramParts] = rawName.split(";");
    const params: Record<string, string> = {};
    for (const p of paramParts) {
      const eq = p.indexOf("=");
      if (eq > -1) params[p.slice(0, eq).toUpperCase()] = p.slice(eq + 1);
    }

    switch (name.toUpperCase()) {
      case "UID":
        current.uid = value.trim();
        break;
      case "SUMMARY":
        current.summary = unescapeText(value).trim();
        break;
      case "DESCRIPTION":
        current.description = unescapeText(value).trim();
        break;
      case "LOCATION":
        current.location = unescapeText(value).trim();
        break;
      case "RRULE":
        current.rrule = value.trim();
        break;
      case "SEQUENCE":
        current.sequence = Number(value) || 0;
        break;
      case "STATUS":
        if (value.trim().toUpperCase() === "CANCELLED") cancelled = true;
        break;
      case "DTSTART": {
        const { iso, allDay } = parseDateValue(value, params, defaultTz);
        current.start = iso;
        current.allDay = allDay;
        break;
      }
      case "DTEND": {
        const raw = value.trim();
        const isDate = params.VALUE === "DATE" || /^\d{8}$/.test(raw);
        /**
         * RFC 5545 makes an all-day DTEND *exclusive*: an event on Aug 7 and
         * nothing else carries DTEND 20260808. Step back a day so `end` is
         * the last day the event actually runs, which is what the renderers
         * assume — otherwise every all-day event reads a day long.
         */
        const { iso } = parseDateValue(
          isDate ? previousDate(raw) : raw,
          params,
          defaultTz,
        );
        current.end = iso;
        break;
      }
    }
  }

  return events;
}
