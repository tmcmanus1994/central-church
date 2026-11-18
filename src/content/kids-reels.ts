/**
 * Central Kids Reels — a short monthly video celebrating what the kids have
 * been up to and achieved. Newest first.
 *
 * HOW TO ADD ONE
 *   Copy the top entry, change the slug/title/month/year, and paste the
 *   Vimeo link. `embedUrl` is the same number on player.vimeo.com. The
 *   thumbnail comes from Vimeo automatically (see lib/vimeo.ts), so there's
 *   nothing to upload.
 *
 * Deliberately simpler than Camp Caudle: no per-day kinds, no playlists.
 * Year chips appear on the page by themselves once a second year exists.
 */
export interface KidsReel {
  slug: string;
  title: string;
  /** Month the reel covers, e.g. "November" */
  month: string;
  year: string;
  /** Public Vimeo page */
  vimeoUrl: string;
  /** player.vimeo.com URL used by the embedded iframe */
  embedUrl: string;
}

export const kidsReels: KidsReel[] = [
  {
    slug: "central-kids-reel-nov-2026",
    title: "Central Kids Reel — November 2026",
    month: "November",
    year: "2026",
    vimeoUrl: "https://vimeo.com/1248028966?share=copy&fl=sv&fe=ci",
    embedUrl: "https://player.vimeo.com/video/1248028966",
  },
  {
    slug: "central-kids-reel-oct-2026",
    title: "Central Kids Reel — October 2026",
    month: "October",
    year: "2026",
    vimeoUrl: "https://vimeo.com/1248029472?share=copy&fl=sv&fe=ci",
    embedUrl: "https://player.vimeo.com/video/1248029472",
  },
];

/** Years present, newest first. */
export const kidsReelYears: string[] = [...new Set(kidsReels.map((r) => r.year))];

export const latestKidsReel: KidsReel = kidsReels[0];
