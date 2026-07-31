import type { Metadata } from "next";
import Link from "next/link";
import { ImageSlot } from "@/components/ImageSlot";
import { Reveal } from "@/components/Reveal";
import { mediaPlaceholder } from "@/content/photos";
import { photoAlbums as albums } from "@/content/photo-albums";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description:
    "Photo albums from life at Central Church of Christ in downtown Little Rock — Trunk or Treat, Easter, Camp Caudle and more.",
};

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

      <Reveal className="mt-8 rounded-2xl border border-teal-border bg-teal-50 p-6 lg:mt-10 lg:p-8">
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
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-6">
        {albums.map((album, i) => {
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
          return (
            <Reveal key={album.title} delay={(i % 6) * 60}>
              {album.href ? (
                <a
                  href={album.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cls}
                >
                  {inner}
                </a>
              ) : (
                <div className={cls}>{inner}</div>
              )}
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
