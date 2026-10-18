/**
 * Event photos, keyed by event slug.
 *
 * Google Calendar entries carry no artwork, so this is where an event gets
 * its picture. The slug is derived from the event title — lowercase, spaces
 * and punctuation become hyphens. "Back to School Backpack Giveaway" becomes
 * "back-to-school-backpack-giveaway".
 *
 * HOW TO ADD ONE
 *   1. Drop the file in public/photos/
 *   2. Add a line below using the event's slug
 *
 * Titles that repeat year to year reuse the same photo automatically, so an
 * annual event only needs setting up once. An event with no entry here simply
 * renders without an image — no placeholder.
 */
export const eventPhotos: Record<string, string> = {
  "back-to-school-backpack-giveaway": "/photos/event-backpack-giveaway.webp",
  "ice-cream-social": "/photos/event-ice-cream-social.webp",
  "st-louis-trip": "/photos/event-st-louis-trip.webp",
  "camp-caudle": "/photos/teens-camp-caudle.webp",
  winterfest: "/photos/teens-winterfest.webp",
  uplift: "/photos/teens-uplift.webp",
  "easter-egg-hunt": "/photos/kids-easter-egg-hunt.webp",
  "kids-week": "/photos/kids-week.webp",
  // 2026 flyer, padded to 16:9 on its own purple so no slot crops the text.
  "trunk-or-treat": "/photos/event-fall-fest-2026.webp",
};
