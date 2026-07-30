import type { EventTag } from "@/content/events";
import { paletteFor } from "@/lib/ministry-colors";

/**
 * The ministry page banner, drawn rather than photographed.
 *
 * Every ministry banner used to be a photo, and the photos were the weakest
 * thing on those pages — a snapshot of a room tells a visitor nothing, and a
 * 21:9 crop of a group shot loses most of the group. This builds the banner
 * from what the site already has instead: the ministry's own color and an
 * architectural motif drawn from the Central mark.
 *
 * It costs nothing to load, is sharp at every width, and can't be cropped
 * badly. Each ministry reads as distinctly itself because the hue does the
 * work the photograph was failing to do.
 */

/**
 * Where each ministry's arches originate, and how tightly they're spaced.
 *
 * Two pairs share a hue — Central Kids with Kids Closet, Iglesia with Freedom
 * Prayer — because they genuinely are siblings. Varying the composition keeps
 * them from reading as the same banner twice: the arches rise from a different
 * corner on each page, so every ministry looks like itself.
 */
const COMPOSITION: Record<string, { x: string; y: string; gap: string }> = {
  children: { x: "82%", y: "155%", gap: "92px" },
  teens: { x: "16%", y: "150%", gap: "78px" },
  "life-groups": { x: "88%", y: "138%", gap: "108px" },
  "kids-closet": { x: "28%", y: "162%", gap: "84px" },
  outreach: { x: "50%", y: "-70%", gap: "98px" },
  "freedom-prayer": { x: "96%", y: "48%", gap: "70px" },
  iglesia: { x: "10%", y: "146%", gap: "96px" },
};

/** Which palette a ministry borrows. Slugs aren't event tags, so map them. */
const TAG_BY_SLUG: Record<string, EventTag> = {
  children: "Central Kids",
  teens: "Central Teens",
  "life-groups": "Life Groups",
  "kids-closet": "Central Kids",
  outreach: "Outreach",
  "freedom-prayer": "All Church",
  iglesia: "All Church",
};

export function MinistryBanner({
  slug,
  eyebrow,
  name,
  lang,
}: {
  slug: string;
  eyebrow: string;
  name: string;
  lang?: "es";
}) {
  const c = paletteFor(TAG_BY_SLUG[slug]);
  const composition = COMPOSITION[slug] ?? COMPOSITION.children;

  return (
    <section
      className={`relative flex w-full items-end overflow-hidden bg-gradient-to-br ${c.bannerFlat}`}
      lang={lang}
    >
      {/* The arch motif — see .ministry-arches in globals.css. */}
      <div
        aria-hidden
        className="ministry-arches absolute inset-0"
        style={
          {
            "--arch-x": composition.x,
            "--arch-y": composition.y,
            "--arch-gap": composition.gap,
          } as React.CSSProperties
        }
      />
      {/* Grounds the type without muddying the gradient above it. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/30 to-transparent"
      />
      <div className="relative flex w-full flex-col gap-2.5 px-5 pt-14 pb-7 lg:gap-3.5 lg:px-14 lg:pt-24 lg:pb-14">
        <span className="text-[11px] font-bold tracking-[.18em] uppercase text-white/75 lg:text-xs">
          {eyebrow}
        </span>
        <h1 className="m-0 max-w-[900px] font-display text-[34px] leading-[1.02] tracking-[-.035em] text-white text-pretty-wrap lg:text-[60px] lg:tracking-[-.04em]">
          {name}
        </h1>
      </div>
      {/* A bright hairline hands off to the white page below. */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-white/25" />
    </section>
  );
}
