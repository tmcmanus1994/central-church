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
  "home.welcome": "/photos/home-welcome.webp",
  /** Ministry tiles. Title sits bottom-left over a dark gradient. */
  "home.tile.children": "/photos/home-tile-children.webp",
  "home.tile.teens": "/photos/home-tile-teens.webp",
  "home.tile.life-groups": "/photos/home-tile-life-groups.webp",
  /** Latest sermon thumbnail. Falls back to the branded placeholder. */
  "home.sermon": "/photos/media-placeholder.webp",

  // ── Plan a Visit ────────────────────────────────────────────────────────
  /** Greeters at the 6th Street entrance. */
  /** Shares the New to Central photo — same welcome, same face. */
  "visit.hero": "/photos/home-welcome.webp",
  /** What a first visit feels like — people, not architecture. */
  "visit.what-to-expect": "/photos/visit-what-to-expect.webp",
  /** Parking diagram — re-export of the current site's diagram. */
  "visit.parking": "/photos/visit-where-to-park.webp",
  /** A kids' Bible class. Portrait crop. */
  "visit.kids": "/photos/visit-kids.webp",
  /** The accessible entrance. Portrait crop. */
  "visit.accessibility": "/photos/visit-accessibility.webp",

  // ── About ───────────────────────────────────────────────────────────────
  /** The congregation together — archival or current. */
  "about.congregation": "/photos/about-story.webp",

  // ── Missionaries ────────────────────────────────────────────────────────
  "missionaries.bills": "/photos/missionaries-bills.webp",
  "missionaries.daggetts": "/photos/missionaries-daggetts.webp",

  // ── Ministry pages (one per ministry slug) ──────────────────────────────
  // Ministry banners are drawn, not photographed — see MinistryBanner.tsx.
  // The photos that used to fill them moved into the galleries below.
  /** Square headshot for the ministry contact block. */
  "ministry.children.contact": "/photos/leadership-tammy-beck.webp",
  "ministry.teens.contact": "/photos/leadership-james-mosley.webp",
  "ministry.kids-closet.contact": "/photos/leadership-lacey-hines.webp",
  "ministry.outreach.contact": "/photos/leadership-matt-thomas.webp",
  "ministry.iglesia.contact": "/photos/leadership-matt-thomas.webp",
  "ministry.life-groups.contact": "/photos/leadership-shannon-cooper.webp",

  // ── Media hub ───────────────────────────────────────────────────────────
  "media.sermon": "/photos/media-placeholder.webp",
  "media.live": "/photos/media-placeholder.webp",
  /** Falls back to the most recent post's thumbnail — see media.ts. */
  "media.blog": null,
} satisfies Record<string, string | null>;

/**
 * Gallery images per ministry — each page shows 4–12. Add paths to fill;
 * an empty array renders four placeholder tiles.
 */
export const galleries: Record<string, string[]> = {
  children: [
    "/photos/ministry-children-hero.webp",
    "/photos/kids-gallery-1.webp",
    "/photos/kids-gallery-2.webp",
    "/photos/kids-gallery-3.webp",
    "/photos/kids-gallery-4.webp",
  ],
  teens: [
    "/photos/ministry-teens-hero.webp",
    "/photos/teens-gallery-1.webp",
    "/photos/teens-gallery-2.webp",
    "/photos/teens-gallery-3.webp",
    "/photos/teens-gallery-4.webp",
  ],
  "life-groups": [
    "/photos/life-groups-gallery-1.webp",
    "/photos/life-groups-gallery-2.webp",
    "/photos/life-groups-gallery-3.webp",
    "/photos/life-groups-gallery-4.webp",
    "/photos/life-groups-gallery-5.webp",
  ],
  "kids-closet": [
    "/photos/ministry-kids-closet-hero.webp",
    "/photos/kids-closet-gallery-1.webp",
    "/photos/kids-closet-gallery-2.webp",
    "/photos/kids-closet-gallery-3.webp",
    "/photos/kids-closet-gallery-4.webp",
  ],
  "freedom-prayer": ["/photos/ministry-freedom-prayer-hero.webp"],
  iglesia: [
    "/photos/iglesia-gallery-1.webp",
    "/photos/iglesia-gallery-2.webp",
    "/photos/iglesia-gallery-3.webp",
    "/photos/iglesia-gallery-4.webp",
    "/photos/iglesia-gallery-5.webp",
  ],
};

/** Annual-event photos, keyed by ministry slug then event title. */
export const annualPhotos: Record<string, Record<string, string>> = {
  children: {
    "Easter Egg Hunt": "/photos/kids-easter-egg-hunt.webp",
    "Kids Week": "/photos/kids-week.webp",
    "Trunk or Treat": "/photos/kids-trunk-or-treat.webp",
  },
  teens: {
    "Camp Caudle": "/photos/teens-camp-caudle.webp",
    Winterfest: "/photos/teens-winterfest.webp",
    Uplift: "/photos/teens-uplift.webp",
  },
};

/** Returns the photo path for a key, or undefined to keep the placeholder. */
export function photo(key: PhotoKey): string | undefined {
  return photos[key] ?? undefined;
}

/**
 * Branded fallback for media that has no thumbnail of its own — the Central
 * wordmark over the building. Better than an empty frame in a media grid.
 */
export const mediaPlaceholder = "/photos/media-placeholder.webp";
