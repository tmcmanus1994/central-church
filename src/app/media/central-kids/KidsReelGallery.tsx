"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { KidsReel } from "@/content/kids-reels";
import { ShareButton } from "@/components/ShareButton";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

/**
 * The Camp Caudle gallery, pared down: a reel loads its Vimeo iframe only
 * once played, each card has a share button, and a shared link
 * (/media/central-kids#slug) scrolls to that reel and opens it.
 */
function ReelCard({ reel, thumbnail }: { reel: KidsReel; thumbnail?: string }) {
  const [playing, setPlaying] = useState(false);
  const shareUrl = `${site.url}/media/central-kids#${reel.slug}`;

  useEffect(() => {
    function openIfTargeted() {
      if (window.location.hash !== `#${reel.slug}`) return;
      setPlaying(true);
      document.getElementById(reel.slug)?.scrollIntoView({ block: "center" });
    }
    openIfTargeted();
    // Also covers a shared link tapped while this page is already open.
    window.addEventListener("hashchange", openIfTargeted);
    return () => window.removeEventListener("hashchange", openIfTargeted);
  }, [reel.slug]);

  return (
    <figure id={reel.slug} className="m-0 flex scroll-mt-28 flex-col gap-2.5">
      <div className="relative aspect-video overflow-hidden rounded-xl border border-line bg-coal">
        {playing ? (
          <iframe
            title={reel.title}
            src={`${reel.embedUrl}?autoplay=1`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full border-0"
          />
        ) : (
          <>
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            ) : null}
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Play ${reel.title}`}
              className={`group absolute inset-0 flex size-full items-center justify-center transition-colors ${
                thumbnail ? "bg-coal/30 hover:bg-coal/45" : "bg-primary-deep/90 hover:bg-primary-deep"
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
      <figcaption className="flex flex-col gap-1">
        <span className="text-[11px] font-bold tracking-[.12em] uppercase text-primary">
          {reel.month} {reel.year}
        </span>
        <span className="font-display text-[16.5px] leading-snug text-ink">{reel.title}</span>
        <span className="flex items-center gap-4">
          <a
            href={reel.vimeoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13.5px] font-semibold text-primary no-underline hover:text-primary-deep"
          >
            Watch on Vimeo →
          </a>
          <ShareButton url={shareUrl} title={reel.title} text="A Central Kids reel from Central Church of Christ" />
        </span>
      </figcaption>
    </figure>
  );
}

export function KidsReelGallery({
  years,
  reels,
  thumbnails,
}: {
  years: string[];
  reels: KidsReel[];
  thumbnails: Record<string, string>;
}) {
  const [activeYear, setActiveYear] = useState<string>(years[0]);
  const shown = reels.filter((r) => r.year === activeYear);

  return (
    <>
      {/* Year chips only earn their place once there's a second year to switch to. */}
      {years.length > 1 ? (
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
      ) : null}

      <p className="m-0 mt-6 text-[15px] text-muted lg:mt-8">
        {shown.length} {shown.length === 1 ? "reel" : "reels"} from {activeYear}
      </p>

      <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
        {shown.map((reel, i) => (
          <Reveal key={reel.slug} delay={(i % 6) * 60}>
            <ReelCard reel={reel} thumbnail={thumbnails[reel.slug]} />
          </Reveal>
        ))}
      </div>
    </>
  );
}
