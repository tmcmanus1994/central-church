/**
 * Google Photos albums, newest first, exactly as the office keeps them.
 *
 * The single list behind both /media/photos and the "Photos from this year"
 * button on /media/camp-caudle. Photos aren't mirrored into the repo — Camp
 * Caudle 2026 alone is 1,630 of them — so every album is a link out to the
 * shared Google Photos album.
 */
export interface PhotoAlbum {
  title: string;
  count: string;
  blurb: string;
  href: string;
  cover?: string;
}

export const photoAlbums: PhotoAlbum[] = [
  {
    title: "Camp Caudle 2026",
    count: "1,630 photos",
    blurb: "A week in Hector, Arkansas with Central Teens.",
    href: "https://photos.app.goo.gl/Po9aM3z62oCBjFV76",
    cover: "/photos/teens-camp-caudle.webp",
  },
  {
    title: "Mentorship Program Graduation",
    count: "12 photos",
    blurb: "Closing out a year of OnRamp Mentoring.",
    href: "https://photos.app.goo.gl/hLBpDiqKJvnaUhqi7",
  },
  {
    title: "Easter Sunday 2026",
    count: "61 photos",
    blurb: "One of the fullest Sundays of the year.",
    href: "https://photos.app.goo.gl/f3tk3PBpbRKqBu696",
  },
  {
    title: "Easter Egg Hunt 2026",
    count: "68 photos",
    blurb: "Central Kids and half the neighbourhood on the lawn.",
    href: "https://photos.app.goo.gl/UapAG99PmHvxz9Fe6",
    cover: "/photos/kids-easter-egg-hunt.webp",
  },
  {
    title: "Central Family Day 2026",
    count: "54 photos",
    blurb: "The whole church together for the afternoon.",
    href: "https://photos.app.goo.gl/vLykCWfNbUVFnq7D6",
  },
  {
    title: "Trunk-or-Treat 2025",
    count: "53 photos",
    blurb: "Decorated cars and candy in the parking lot.",
    href: "https://photos.app.goo.gl/JCYCmXsxezenvZbd9",
    cover: "/photos/kids-trunk-or-treat.webp",
  },
  {
    title: "Camp Caudle 2025",
    count: "555 photos",
    blurb: "Another week on the Illinois Bayou.",
    href: "https://photos.app.goo.gl/fAL3bwwLo49CNzWA7",
  },
  {
    title: "Trunk-or-Treat 2024",
    count: "145 photos",
    blurb: "The Sunday before Halloween, west lot.",
    href: "https://photos.app.goo.gl/88SucPyQt4nQ6Gsw7",
  },
  {
    title: "Camp Caudle 2024",
    count: "1,378 photos",
    blurb: "Camp week, top to bottom.",
    href: "https://photos.app.goo.gl/JaCyvshWxGk4rDCc8",
  },
  {
    title: "Camp Caudle 2023",
    count: "320 photos",
    blurb: "Camp week, top to bottom.",
    href: "https://photos.app.goo.gl/vPQMdjL7yRbzC7y39",
  },
  {
    title: "Camp Caudle 2022",
    count: "1,039 photos",
    blurb: "Camp week, top to bottom.",
    href: "https://photos.app.goo.gl/VqmhFmFMa38ipiaU8",
  },
  {
    title: "Easter Egg Hunt",
    count: "63 photos",
    blurb: "An earlier year on the lawn.",
    href: "https://photos.app.goo.gl/XeFr2qX9V3R4CaLF8",
  },
  {
    title: "Trunk-or-Treat 2022",
    count: "80 photos",
    blurb: "Where the tradition picked up steam.",
    href: "https://photos.app.goo.gl/rZAjUHrQut3kNo1fA",
  },
];

/**
 * Finds the album for a given Camp Caudle year by matching the year inside
 * the album title — "Camp Caudle 2024" for "2024" — so a year with no album
 * yet (or a typo in a future upload) just means no button, not a crash.
 */
export function campCaudleAlbumForYear(year: string): PhotoAlbum | undefined {
  return photoAlbums.find(
    (a) => /^camp caudle\b/i.test(a.title) && a.title.includes(year),
  );
}
