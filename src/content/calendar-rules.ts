/**
 * Rules for turning the staff calendars into a public events list.
 *
 * The calendars carry everything the office needs to run the building —
 * meetings, time off, room bookings — alongside the events the congregation
 * actually cares about. These rules decide what reaches the website.
 *
 * All of it is tunable here. If something public gets hidden, or something
 * internal slips through, this is the only file to edit. Every filtered
 * event is logged during the build so mistakes are easy to spot.
 */

/**
 * Titles matching any of these never reach the site.
 *
 * Kept deliberately specific — a rule that's too broad silently hides real
 * events, which is worse than an occasional admin entry slipping through.
 */
export const PRIVATE_PATTERNS: RegExp[] = [
  // Meetings that aren't congregational gatherings
  /\bstaff\s+meeting\b/i,
  /\b(elders?|deacons?|board|committee|leadership)\s+meeting\b/i,
  /\bbudget\b/i,
  /\bcounting\b/i,
  /\bcheck[- ]?in\s+meeting\b/i,
  /\b1[-: ]?on[-: ]?1\b/i,

  // Time off and absence
  /\bout\s+of\s+(the\s+)?office\b/i,
  /\bOOO\b/,
  /\b(PTO|vacation|sabbatical)\b/i,
  /\b(day|time|week)s?\s+off\b/i,
  /\boffice\s+closed\b/i,
  /^\S+(\s+\S+)?\s+(is\s+)?(out|off|away|gone)\b/i,

  // Room and equipment bookings
  /\breserv(ed|ation|ing)\b/i,
  /\bbooked\b/i,
  /\bhold\b/i,
  /\bblocked\b/i,
  /\bgym\s+(use|rental)\b/i,
  /\brental\b/i,

  // Building operations
  /\b(set[- ]?up|tear[- ]?down|teardown)\b/i,
  /\b(cleaning|custodial|custodian|maintenance|repair)\b/i,
  /\bdeep\s+clean\b/i,
  /\bwalk[- ]?through\b/i,

  // Private family use of the building
  /\bwedding\b/i,
  /\brehearsal\s+dinner\b/i,
  /\bmemorial\s+service\b/i,

  // Generic placeholders
  /^(busy|tentative|placeholder|tbd|test)\b/i,
];

/**
 * Entries that read as unfinished rather than private — a title someone
 * started and saved before typing the rest, like "with Stephen" sitting on
 * the Teens calendar. A dangling connector can't begin a real event name.
 *
 * These are hidden but logged apart from the private ones, because the fix
 * is on the calendar rather than in this file: give the entry a full title
 * and it publishes on the next revalidate.
 */
export const INCOMPLETE_PATTERNS: RegExp[] = [
  /^(with|w\/|and|&|plus|featuring|feat\.?)\b/i,
  /^[-–—,:;·|]/,
];

/**
 * Escape hatch. A title matching one of these is always published, even if a
 * pattern above would have hidden it. Use this when a real event happens to
 * contain a flagged word — "Volunteer Set-Up Party", say.
 */
export const ALWAYS_PUBLIC: string[] = [];

/** Titles hidden outright, matched case-insensitively after normalising. */
export const ALWAYS_PRIVATE: string[] = [];

/**
 * Places that mean "at the church building". Anything else in an event's
 * location is treated as off-site, so a trip shows where it's actually going
 * rather than Central's address.
 */
export const CENTRAL_LOCATIONS: string[] = [
  "823 w 6th",
  "823 west 6th",
  "central church",
  "central church of christ",
  "worship center",
  "auditorium",
  "sanctuary",
  "foyer",
  "lobby",
  "fellowship hall",
  "fellowship east",
  "fellowship west",
  "spiritual growth center",
  "growth center",
  "family life center",
  "youth center",
  "youth room",
  "central kids",
  "kids wing",
  "kids closet",
  "nursery",
  "classroom",
  "room ",
  "gym",
  "parking lot",
  "west lot",
  "east lot",
  "annex",
  "kitchen",
  "library",
  "onsite",
  "on site",
  "church",
];

/**
 * Locations for events whose calendar entry leaves it blank or vague. Keyed
 * by the event slug. Use it when a trip's destination lives in the title
 * rather than the location field.
 */
export const LOCATION_OVERRIDES: Record<string, string> = {
  // "silver-dollar-city-trip": "Silver Dollar City, Branson, MO",
};

/**
 * Noise Google Calendar titles tend to carry. Applied in order; the first
 * capture group becomes the cleaned title.
 */
export const TITLE_CLEANUP: { pattern: RegExp; replace: string }[] = [
  // Leading ministry prefixes: "CC - ", "Kids: ", "Teens — "
  { pattern: /^(?:CC|CCoC|Central)\s*[-–—:]\s*/i, replace: "" },
  // Trailing room notes: "Encouragers (Fellowship Hall)"
  { pattern: /\s*\((?:in\s+)?[^)]*(?:room|hall|center|centre|wing|lot)\)\s*$/i, replace: "" },
  // Trailing organiser initials: "Story Time - TB"
  { pattern: /\s*[-–—]\s*[A-Z]{2,3}\s*$/, replace: "" },
  // Collapse whitespace
  { pattern: /\s{2,}/g, replace: " " },
];
