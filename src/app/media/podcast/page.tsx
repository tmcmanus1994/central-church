import type { Metadata } from "next";
import { ImageSlot } from "@/components/ImageSlot";
import { podcastEpisodes } from "@/content/media";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Central Church Podcast | Sermons from Little Rock, AR",
  description:
    "Listen to sermons from Central Church of Christ in downtown Little Rock — new episodes every week from Sunday worship.",
};

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export default function PodcastPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8 lg:px-14 lg:py-16">
      <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">
        Media · Podcast
      </span>
      <h1 className="mt-2.5 mb-3 font-display text-[36px] leading-[1] tracking-[-.035em] lg:mb-4 lg:text-[56px] lg:tracking-[-.04em]">
        The Central Church Podcast
      </h1>
      <p className="m-0 max-w-[680px] text-base leading-[1.65] text-body lg:text-[19px]">
        Sunday&rsquo;s message, wherever your week takes you. New episodes every
        week from worship at Central.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href="https://podcasts.apple.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-[46px] items-center rounded-full border-[1.5px] border-primary px-[22px] text-[15px] font-bold text-primary no-underline hover:bg-teal-50"
        >
          Apple Podcasts
        </a>
        <a
          href="https://rss.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-[46px] items-center rounded-full border-[1.5px] border-primary px-[22px] text-[15px] font-bold text-primary no-underline hover:bg-teal-50"
        >
          RSS
        </a>
        <a
          href={site.socials.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-[46px] items-center rounded-full border-[1.5px] border-primary px-[22px] text-[15px] font-bold text-primary no-underline hover:bg-teal-50"
        >
          YouTube
        </a>
      </div>

      <div className="mt-8 flex flex-col gap-4 lg:mt-12">
        {podcastEpisodes.map((ep, i) => (
          <article
            key={ep.slug}
            className={`flex flex-col gap-4 rounded-2xl border border-line p-5 sm:flex-row sm:items-center sm:gap-6 lg:p-6 ${
              i === 0 ? "bg-surface" : ""
            }`}
          >
            <ImageSlot
              alt=""
              label="episode art"
              className="h-[120px] w-full shrink-0 rounded-xl sm:size-[120px]"
            />
            <div className="flex flex-1 flex-col gap-1.5">
              {i === 0 ? (
                <span className="text-[11px] font-bold tracking-[.1em] uppercase text-primary">
                  Latest episode
                </span>
              ) : null}
              <h2 className="m-0 font-display text-[21px] leading-[1.2] tracking-[-.015em] lg:text-2xl">
                {ep.title}
              </h2>
              <span className="text-[14.5px] text-muted">
                {ep.speaker} · {fmtDate(ep.date)} · {ep.duration}
              </span>
              {ep.blurb ? (
                <p className="m-0 text-[15px] leading-[1.55] text-body">
                  {ep.blurb}
                </p>
              ) : null}
            </div>
            <a
              href={site.socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[46px] shrink-0 items-center justify-center rounded-full bg-primary px-[22px] text-[15px] font-bold text-white no-underline hover:bg-primary-deep"
            >
              Listen
            </a>
          </article>
        ))}
      </div>
      <p className="mt-8 text-[14.5px] text-muted">
        Episode list is a placeholder — the full feed wires up to the podcast
        RSS in the automation pass.
      </p>
    </div>
  );
}
