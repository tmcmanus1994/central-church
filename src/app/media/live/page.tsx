import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/Button";
import { LiveNowBadge } from "@/components/LiveNowBadge";
import { Reveal } from "@/components/Reveal";
import { site, youtubeLiveUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Livestreams",
  description:
    "Watch Sunday worship live or catch up on a past service — Central Church of Christ streams every week on YouTube from downtown Little Rock.",
};

/**
 * A pure outbound moment, not an embedded player — people engage with the
 * stream better on YouTube itself (comments, likes, subscriptions), and a
 * poster/iframe that's dark most of the week reads as broken. This page's
 * only job is to get a visitor onto YouTube at the right place.
 *
 * Framed as an archive, not a "join us live right now" page — the hero and
 * the Live Now badge already send anyone visiting during the actual live
 * window straight to YouTube, so most visitors here land outside it,
 * browsing this week's stream or catching up on one they missed.
 */
export default function LivePage() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8 lg:px-14 lg:py-16">
      <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">
        Media · Live
      </span>
      <div className="mt-2.5 mb-3 flex flex-wrap items-center gap-3 lg:mt-3 lg:mb-4">
        <h1 className="m-0 font-display text-[36px] leading-[1] tracking-[-.035em] lg:text-[56px] lg:tracking-[-.04em]">
          Sunday Livestreams
        </h1>
        <LiveNowBadge />
      </div>
      <p className="m-0 max-w-[680px] text-base leading-[1.65] text-body lg:text-[19px]">
        Every Sunday&rsquo;s worship streams live and stays posted afterward
        as a replay — follow along from home, catch a service you missed,
        or revisit one that meant something to you.
      </p>

      <Reveal className="relative mt-8 flex flex-col items-start gap-5 overflow-hidden rounded-[18px] border border-line bg-coal p-6 text-white lg:mt-10 lg:p-10">
        <Image
          src="/photos/media-live-bg.webp"
          alt=""
          fill
          sizes="(min-width: 1024px) 1100px, 100vw"
          priority
          className="object-cover"
        />
        {/* Darkens the photo further so white text stays readable at any crop. */}
        <span aria-hidden className="absolute inset-0 bg-coal/55" />
        <span className="relative inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-[11px] font-bold tracking-[.08em] text-white uppercase">
          <svg viewBox="0 0 24 24" aria-hidden className="size-3.5 fill-white">
            <path d="M21.6 7.2s-.2-1.5-.9-2.2c-.8-.9-1.7-.9-2.1-1C15.9 3.8 12 3.8 12 3.8h0s-3.9 0-6.6.2c-.4 0-1.3.1-2.1 1-.7.7-.9 2.2-.9 2.2S2.2 9 2.2 10.7v1.6c0 1.8.2 3.6.2 3.6s.2 1.5.9 2.2c.8.9 1.9.8 2.4.9 1.7.2 7.3.2 7.3.2s3.9 0 6.6-.2c.4 0 1.3-.1 2.1-1 .7-.7.9-2.2.9-2.2s.2-1.8.2-3.6v-1.6c0-1.8-.2-3.5-.2-3.5zM9.9 14.6V8.9l5.8 2.9-5.8 2.8z" />
          </svg>
          Opens on YouTube
        </span>
        <div className="relative flex flex-col gap-1.5">
          <span className="font-display text-[26px] tracking-[-.015em] lg:text-[32px]">
            Sunday Worship
          </span>
          <span className="text-[16px] text-[#C9C3B8]">
            New streams every week, 10:15 AM Central · {site.address.street},{" "}
            {site.address.city}, {site.address.state}
          </span>
        </div>
        <p className="relative m-0 max-w-[520px] text-[15px] leading-[1.6] text-[#B8B2A6]">
          Browse the channel for this week&rsquo;s service or one from the
          archive — comment, like, and subscribe while you&rsquo;re there.
        </p>
        <span className="relative">
          <Button href={youtubeLiveUrl} variant="white">
            Watch on YouTube
          </Button>
        </span>
      </Reveal>
    </div>
  );
}
