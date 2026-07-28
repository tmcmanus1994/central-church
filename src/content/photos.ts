/**
 * Photo registry — the single place to wire real photography into the site.
 *
 * HOW TO ADD A PHOTO
 *   1. Drop the file in `public/photos/`
 *   2. Fill in the matching key below, e.g. `"home.hero": "/photos/home-hero.jpg"`
 *
 * That's it. Any key left as `null` keeps its striped placeholder and stays
 * correctly laid out, so photos can land one at a time without breaking a page.
 *
 * Keys are named `<page>.<section>` to match how the shot list is organised.
 * Event and blog photos are NOT here — those travel with their own content
 * (`image` on each event in events.ts, and on each post in media.ts).
 */

export type PhotoKey = keyof typeof photos;

export const photos = {
  // ── Homepage ────────────────────────────────────────────────────────────
  /** Congregation in worship — wide, warm. Headline sits over the left half. */
  "home.hero": "/photos/home-hero.webp",
  /** Lobby welcome — a greeter meeting a first-time visitor. */
  "home.welcome": null,
  /** Ministry tiles. Title sits bottom-left over a dark gradient. */
  "home.tile.children": null,
  "home.tile.teens": null,
  "home.tile.life-groups": null,
  /** Latest sermon thumbnail — a YouTube still is fine. */
  "home.sermon": null,

  // ── Plan a Visit ────────────────────────────────────────────────────────
  /** Greeters at the 6th Street entrance. */
  "visit.hero": null,
  /** Congregation singing — wide. */
  "visit.worship": null,
  /** Parking diagram — re-export of the current site's diagram. */
  "visit.parking": "/photos/visit-where-to-park.webp",
  /** A kids' Bible class. Portrait crop. */
  "visit.kids": null,
  /** The accessible entrance. Portrait crop. */
  "visit.accessibility": "/photos/visit-accessibility.webp",

  // ── About ───────────────────────────────────────────────────────────────
  /** The congregation together — archival or current. */
  "about.congregation": "/photos/about-story.webp",

  // ── Missionaries ────────────────────────────────────────────────────────
  "missionaries.bills": null,
  "missionaries.daggetts": null,

  // ── Ministry pages (one per ministry slug) ──────────────────────────────
  /** Ultra-wide banner. Ministry name sits bottom-left in white. */
  "ministry.children.hero": null,
  "ministry.teens.hero": null,
  "ministry.life-groups.hero": null,
  "ministry.kids-closet.hero": null,
  "ministry.freedom-prayer.hero": null,
  "ministry.iglesia.hero": null,
  /** Square headshot for the ministry contact block. */
  "ministry.children.contact": null,
  "ministry.teens.contact": null,
  "ministry.kids-closet.contact": null,

  // ── Media hub ───────────────────────────────────────────────────────────
  "media.sermon": null,
  "media.live": null,
  "media.blog": null,
} satisfies Record<string, string | null>;

/**
 * Gallery images per ministry — each page shows 4–12. Add paths to fill;
 * an empty array renders four placeholder tiles.
 */
export const galleries: Record<string, string[]> = {
  children: [
    "/photos/kids-gallery-1.webp",
    "/photos/kids-gallery-2.webp",
    "/photos/kids-gallery-3.webp",
    "/photos/kids-gallery-4.webp",
  ],
  teens: [],
  "life-groups": [],
  "kids-closet": [],
  "freedom-prayer": [],
  iglesia: [
    "/photos/iglesia-gallery-1.webp",
    "/photos/iglesia-gallery-2.webp",
    "/photos/iglesia-gallery-3.webp",
    "/photos/iglesia-gallery-4.webp",
  ],
};

/** Annual-event photos, keyed by ministry slug then event title. */
export const annualPhotos: Record<string, Record<string, string>> = {
  children: {
    "Easter Egg Hunt": "/photos/kids-easter-egg-hunt.webp",
    "Kids Week": "/photos/kids-week.webp",
    "Trunk or Treat": "/photos/kids-trunk-or-treat.webp",
  },
  teens: {},
};

/** Returns the photo path for a key, or undefined to keep the placeholder. */
export function photo(key: PhotoKey): string | undefined {
  return photos[key] ?? undefined;
}
