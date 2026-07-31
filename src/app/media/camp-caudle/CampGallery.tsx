"use client";

import { useState } from "react";
import Image from "next/image";
import type { CampVideo } from "@/content/camp-caudle";
import { campCaudleAlbumForYear } from "@/content/photo-albums";
import { Button } from "@/components/Button";
import { Reveal } from "@/components/Reveal";

/**
 * Videos load their Vimeo iframe only once played — 39 embeds on one page
 * would be punishing on mobile data, and most visitors watch one or two.
 */
function VideoCard({
  video,
  hasThumbnail,
}: {
  video: CampVideo;
  hasThumbnail: boolean;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure className="m-0 flex flex-col gap-2.5">
      <div className="relative aspect-video overflow-hidden rounded-xl border border-line bg-coal">
        {playing ? (
          <iframe
            title={video.title}
            src={`${video.embedUrl}?autoplay=1`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full border-0"
          />
        ) : (
          <>
            {hasThumbnail ? (
              <Image
                src={`/photos/camp-caudle/${video.slug}.jpg`}
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            ) : null}
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Play ${video.title}`}
              className={`group absolute inset-0 flex size-full items-center justify-center transition-colors ${
                hasThumbnail
                  ? "bg-coal/30 hover:bg-coal/45"
                  : "bg-primary-deep/90 hover:bg-primary-deep"
              }`}
            >
              <span className="flex size-16 items-center justify-center rounded-full bg-white/95 transition-transform group-hover:scale-105">
                <span
                  aria-hidden
                  className="ml-1 border-y-[11px] border-l-[18px] border-y-transparent border-l-primary-deep"
                />
              </span>
            </button>
          </>
        )}
      </div>
      <figcaption className="flex flex-col gap-0.5">
        <span className="font-display text-[16.5px] leading-snug text-ink">
          {video.title}
        </span>
        <a
          href={video.vimeoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13.5px] font-semibold text-primary no-underline hover:text-primary-deep"
        >
          Watch on Vimeo →
        </a>
      </figcaption>
    </figure>
  );
}

export function CampGallery({
  years,
  videos,
  thumbnailSlugs,
}: {
  years: string[];
  videos: CampVideo[];
  thumbnailSlugs: string[];
}) {
  const [activeYear, setActiveYear] = useState<string>(years[0]);
  const shown = videos.filter((v) => v.year === activeYear);
  const thumbnails = new Set(thumbnailSlugs);
  // Matched by year inside the album title ("Camp Caudle 2024") — a year
  // with no album yet just means no button, not a crash.
  const album = campCaudleAlbumForYear(activeYear);

  return (
    <>
      <div
        role="group"
        aria-label="Filter by year"
        className="no-scrollbar -mx-5 mt-8 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:mt-10 lg:px-0"
      >
        {years.map((year) => {
          const active = year === activeYear;
          return (
            <button
              key={year}
              type="button"
              aria-pressed={active}
              onClick={() => setActiveYear(year)}
              className={`shrink-0 rounded-full px-[18px] py-[11px] text-[14.5px] transition-colors ${
                active
                  ? "bg-primary font-bold text-white"
                  : "border border-line font-semibold text-body hover:border-primary hover:text-primary"
              }`}
            >
              {year}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="m-0 text-[15px] text-muted">
          {shown.length} {shown.length === 1 ? "video" : "videos"} from{" "}
          {activeYear}
        </p>
        {/* Just a link out to Google Photos, not an embed — same as the main gallery. */}
        {album ? (
          <Button href={album.href} variant="outline" size="md">
            Photos from {activeYear} ({album.count})
          </Button>
        ) : null}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
        {shown.map((video, i) => (
          <Reveal key={video.slug} delay={(i % 6) * 60}>
            <VideoCard video={video} hasThumbnail={thumbnails.has(video.slug)} />
          </Reveal>
        ))}
      </div>
    </>
  );
}
