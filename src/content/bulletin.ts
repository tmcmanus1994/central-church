/**
 * The current week's bulletin. Automation parses this out of the weekly PDF;
 * until that's wired up it's edited here. Both /bulletin and /hub read from
 * this file so the two never drift apart.
 */

export interface Bulletin {
  /** Human-readable week label, e.g. "July 26, 2026" */
  weekOf: string;
  announcements: string[];
  prayerRequests: string[];
  /** Past weeks, newest first. */
  archive: string[];
}

export const bulletin: Bulletin = {
  weekOf: "July 26, 2026",
  announcements: [
    "Backpack Giveaway volunteers meet Saturday at 8:15 AM in the west lot — bring a folding table if you have one.",
    "Small Group Fair is coming September 3. Every Life Group leader in one room — find where you fit this fall.",
    "Kids Closet needs gently used fall clothing, sizes preemie through YXL.",
  ],
  prayerRequests: [
    "The Huntsville Mission Trip team, traveling August 15–17.",
    "Families preparing for a new school year across Little Rock.",
  ],
  archive: [
    "July 19, 2026",
    "July 12, 2026",
    "July 5, 2026",
    "June 28, 2026",
  ],
};
