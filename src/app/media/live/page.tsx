import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { ImageSlot } from "@/components/ImageSlot";
import { LiveEmbed } from "@/components/LiveEmbed";
import { site } from "@/lib/site";
import { getLivestreamState, watchLiveUrl } from "@/lib/youtube-live";

export const metadata: Metadata = {
  title: "Live Stream",
  description:
    "Watch Central Church of Christ live from downtown Little Rock — Sunday worship streams at 10:15 AM Central on YouTube.",
};

/** "Sunday, August 2 at 10:15 AM" — the format matches events elsewhere. */
function formatScheduled(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default async function LivePage() {
  const state = await getLivestreamState();
  const watchUrl = watchLiveUrl() ?? site.socials.youtube;
  const isLive = state.status === "LIVE" && state.live_video_id;

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

      <div className="mt-8 overflow-hidden rounded-[18px] border border-line lg:mt-10">
        {isLive ? (
          <LiveEmbed
            videoId={state.live_video_id!}
            title="Central Church of Christ — Live"
            badge="LIVE NOW"
            className="aspect-video w-full"
          />
        ) : (
          <ImageSlot
            photoKey="media.live"
            alt="Live stream player"
            label="youtube live embed"
            variant="dark"
            className="aspect-video w-full"
          />
        )}
        <div className="flex flex-col gap-4 bg-surface p-5 sm:flex-row sm:items-center sm:justify-between lg:p-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">
              {isLive ? "Live now" : "Next stream"}
            </span>
            <span className="font-display text-[21px] tracking-[-.015em]">
              {!isLive && state.status === "UPCOMING" && state.upcoming_start
                ? formatScheduled(state.upcoming_start)
                : "Sunday Worship · 10:15 AM Central"}
            </span>
          </div>
          <Button href={watchUrl} variant="primary">
            Watch on YouTube
          </Button>
        </div>
      </div>

      {state.latest_vod_id ? (
        <div className="mt-10">
          <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">
            Last Sunday at Central
          </span>
          <div className="mt-3 max-w-[640px]">
            <LiveEmbed
              videoId={state.latest_vod_id}
              title={state.latest_vod_title ?? "Last Sunday's service"}
              className="aspect-video w-full"
            />
          </div>
          {state.latest_vod_title ? (
            <p className="m-0 mt-3 font-display text-[19px] tracking-[-.015em]">
              {state.latest_vod_title}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
