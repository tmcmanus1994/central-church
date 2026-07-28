/**
 * The most recent service, surfaced on the homepage. Blog posts live in
 * blog.ts and Camp Caudle videos in camp-caudle.ts, both generated from CMS
 * exports; this stays hand-maintained until the sermon feed is wired up.
 */
export interface Sermon {
  title: string;
  speaker: string;
  date: string;
  duration: string;
}

export const latestSermon: Sermon = {
  title: "Listening for God's Voice Together",
  speaker: "Steven Hovater",
  date: "2026-07-26",
  duration: "38 min",
};
