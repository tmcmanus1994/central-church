"use client";

import { useState } from "react";

/**
 * A YouTube video that loads its iframe only once played — same
 * click-to-load pattern as the Camp Caudle video cards, applied to YouTube
 * instead of Vimeo. Used for both the live embed and the "last Sunday"
 * replay; autoloading either would cost real mobile data for visitors who
 * never press play.
 *
 * `youtube-nocookie.com` skips setting cookies until playback starts.
 */
export function LiveEmbed({
  videoId,
  title,
  badge,
  className = "aspect-video w-full",
}: {
  videoId: string;
  title: string;
  /** e.g. "LIVE NOW" — shown as a badge until the visitor presses play. */
  badge?: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-line bg-coal ${className}`}
    >
      {playing ? (
        <iframe
          title={title}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <>
          {/* Plain <img>, not next/image — a hotlinked thumbnail from
              i.ytimg.com doesn't need Next's optimizer, and skipping it
              avoids a remotePatterns entry for a domain used in one spot. */}
          <img
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${title}`}
            className="group absolute inset-0 flex size-full items-center justify-center bg-coal/45 transition-colors hover:bg-coal/55"
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-white/95 transition-transform group-hover:scale-105">
              <span
                aria-hidden
                className="ml-1 border-y-[11px] border-l-[18px] border-y-transparent border-l-primary-deep"
              />
            </span>
          </button>
          {badge ? (
            <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-[11px] font-bold tracking-[.08em] text-white uppercase">
              <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-white" />
              {badge}
            </span>
          ) : null}
        </>
      )}
    </div>
  );
}
