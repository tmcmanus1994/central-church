import type { Metadata } from "next";
import Link from "next/link";
import { ImageSlot } from "@/components/ImageSlot";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description:
    "Photo albums from life at Central Church of Christ in downtown Little Rock — Trunk or Treat, Easter, Camp Caudle and more.",
};

/**
 * Albums live in Google Photos. Set `href` on each to the shared album link;
 * an album without one renders as "Album coming soon" rather than a dead link.
 */
const albums: {
  title: string;
  blurb: string;
  href?: string;
  cover?: string;
}[] = [
  {
    title: "Trunk or Treat",
    blurb:
      "Decorated cars, candy, and the whole neighbourhood in the parking lot the Sunday before Halloween.",
    cover: "/photos/kids-trunk-or-treat.webp",
  },
  {
    title: "Easter",
    blurb:
      "The Easter Egg Hunt and Easter Sunday together — one of the biggest weekends on the calendar.",
    cover: "/photos/kids-easter-egg-hunt.webp",
  },
  {
    title: "Camp Caudle",
    blurb:
      "A week in Hector, Arkansas with Central Teens. Videos live on their own page.",
    cover: "/photos/teens-camp-caudle.webp",
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
        Albums from life at Central. Each one opens in Google Photos, where you
        can browse the full set and download anything you&rsquo;re in.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-6">
        {albums.map((album) => {
          const inner = (
            <>
              <ImageSlot
                src={album.cover}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 92vw"
                alt=""
                label="album cover"
                className="aspect-[4/3] w-full rounded-xl"
              />
              <span className="font-display text-[22px] tracking-[-.02em] text-ink">
                {album.title}
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
