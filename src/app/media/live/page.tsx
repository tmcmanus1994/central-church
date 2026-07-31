import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/Button";
import { site, youtubeLiveUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Live Stream",
  description:
    "Watch Central Church of Christ live from downtown Little Rock — Sunday worship streams at 10:15 AM Central on YouTube.",
};

/**
 * A pure outbound moment, not an embedded player — people engage with the
 * stream better on YouTube itself (comments, likes, subscriptions), and a
 * poster/iframe that's dark most of the week reads as broken. This page's
 * only job is to get a visitor onto YouTube at the right place.
 */
export default function LivePage() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8 lg:px-14 lg:py-16">
      <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">
        Media · Live
      </span>
      <h1 className="mt-2.5 mb-3 font-display text-[36px] leading-[1] tracking-[-.035em] lg:mb-4 lg:text-[56px] lg:tracking-[-.04em]">
        Watch Central Live
      </h1>
      <p className="m-0 max-w-[680px] text-base leading-[1.65] text-body lg:text-[19px]">
        Can&rsquo;t be with us in person? Worship streams live on YouTube every
        Sunday. Pull up a chair — you&rsquo;re part of the family either way.
      </p>

      <div className="relative mt-8 flex flex-col items-start gap-5 overflow-hidden rounded-[18px] border border-line bg-coal p-6 text-white lg:mt-10 lg:p-10">
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
            10:15 AM Central · {site.address.street}, {site.address.city},{" "}
            {site.address.state}
          </span>
        </div>
        <p className="relative m-0 max-w-[520px] text-[15px] leading-[1.6] text-[#B8B2A6]">
          The stream goes live shortly before 10:15 and stays up as a replay
          afterward — comment, like, and subscribe while you&rsquo;re there.
        </p>
        <span className="relative">
          <Button href={youtubeLiveUrl} variant="white">
            Watch on YouTube
          </Button>
        </span>
      </div>
    </div>
  );
}
