import type { Metadata } from "next";
import Link from "next/link";
import { ImageSlot } from "@/components/ImageSlot";
import { mediaPlaceholder } from "@/content/photos";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description:
    "Photo albums from life at Central Church of Christ in downtown Little Rock — Trunk or Treat, Easter, Camp Caudle and more.",
};

/**
 * The albums, newest first, exactly as the office keeps them in Google Photos.
 *
 * Each links out to its shared album rather than mirroring thousands of
 * photos into the repo — Camp Caudle 2026 alone is 1,630. Covers reuse the
 * event photography already on the site, falling back to the branded
 * placeholder for albums with no matching shot.
 */
const albums: {
  title: string;
  count: string;
  blurb: string;
  href?: string;
  cover?: string;
}[] = [
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

export default function PhotoGalleryPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-8 lg:px-14 lg:py-16">
      <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">
        Media · Photos
      </span>
      <h1 className="mt-2.5 mb-3 font-display text-[36px] leading-[1] tracking-[-.035em] lg:mb-4 lg:text-6xl lg:tracking-[-.04em]">
        Photo Gallery
      </h1>
      <p className="m-0 max-w-[720px] text-base leading-[1.65] text-body text-pretty-wrap lg:text-[19px]">
        Albums from life at Central, newest first. Each one opens in Google
        Photos, where you can browse the full set and download anything
        you&rsquo;re in.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-6">
        {albums.map((album) => {
          const inner = (
            <>
              <ImageSlot
                src={album.cover ?? mediaPlaceholder}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 92vw"
                alt=""
                label="album cover"
                className="aspect-[4/3] w-full rounded-xl"
              />
              <span className="font-display text-[22px] leading-[1.15] tracking-[-.02em] text-ink">
                {album.title}
              </span>
              <span className="text-[13px] font-bold tracking-[.08em] uppercase text-muted">
                {album.count}
              </span>
              <span className="text-[15px] leading-[1.6] text-body">
                {album.blurb}
              </span>
              <span
                className={`mt-auto text-[15px] font-bold ${
                  album.href ? "text-primary" : "text-muted"
                }`}
              >
                {album.href ? "Open album →" : "Album coming soon"}
              </span>
            </>
          );
          const cls =
            "flex flex-col gap-3 rounded-2xl border border-line p-4 no-underline transition-colors hover:border-teal-border hover:bg-teal-50/40 lg:p-5";
          return album.href ? (
            <a
              key={album.title}
              href={album.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cls}
            >
              {inner}
            </a>
          ) : (
            <div key={album.title} className={cls}>
              {inner}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-teal-border bg-teal-50 p-6 lg:mt-10 lg:p-8">
        <span className="text-xs font-bold tracking-[.14em] uppercase text-teal-muted">
          Looking for Camp Caudle videos?
        </span>
        <p className="mt-2 mb-3 max-w-[640px] text-[15.5px] leading-[1.6] text-teal-ink">
          Every Camp Caudle video from 2022 onward is gathered by year on its
          own page.
        </p>
        <Link
          href="/media/camp-caudle"
          className="text-[15.5px] font-bold text-primary-deep no-underline"
        >
          Watch Camp Caudle videos →
        </Link>
      </div>
    </div>
  );
}
