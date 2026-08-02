import type { Metadata } from "next";
import { ArrowLink } from "@/components/Button";
import { ImageSlot } from "@/components/ImageSlot";
import { LiveNowBadge } from "@/components/LiveNowBadge";
import { Reveal } from "@/components/Reveal";
import { blogPosts } from "@/content/blog";
import { mediaPlaceholder } from "@/content/photos";

export const metadata: Metadata = {
  title: "Media",
  description:
    "Sermons, live stream, and stories from Central Church of Christ in downtown Little Rock — listen to the podcast, watch live, or read the blog.",
};

/**
 * The blog card shows the newest post's own artwork rather than a fixed image,
 * so the media hub refreshes itself whenever something is published. Anything
 * without artwork of its own falls back to the branded placeholder.
 */
const latestPost = blogPosts[0];

export default function MediaHubPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-8 lg:px-14 lg:py-16">
      <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">
        Media
      </span>
      <h1 className="mt-2.5 mb-3 font-display text-[36px] leading-[1] tracking-[-.035em] lg:mb-4 lg:text-6xl lg:tracking-[-.04em]">
        Latest from Central
      </h1>
      <p className="m-0 max-w-[720px] text-base leading-[1.65] text-body lg:text-[19px]">
        Catch up on Sunday&rsquo;s message, join the live stream, or read
        stories from around the congregation.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:mt-12 lg:grid-cols-3 lg:gap-6">
        <Reveal className="flex flex-col gap-3 rounded-2xl border border-line p-6">
          <ImageSlot
            src="/photos/kids-trunk-or-treat.webp"
            sizes="(min-width: 1024px) 33vw, 100vw"
            alt=""
            label="album cover"
            className="aspect-[16/10] w-full rounded-xl"
          />
          <span className="text-xs font-bold tracking-[.1em] uppercase text-primary">
            Photo Gallery
          </span>
          <h2 className="m-0 font-display text-[22px] leading-[1.15] tracking-[-.02em]">
            Albums from life at Central
          </h2>
          <span className="text-[14.5px] text-muted">
            Trunk or Treat · Easter · Camp Caudle
          </span>
          <ArrowLink href="/media/photos" className="mt-auto text-[15px]">
            Browse albums
          </ArrowLink>
        </Reveal>
        <Reveal delay={60} className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-6">
          <div className="relative">
            <ImageSlot
              photoKey="media.live"
              sizes="(min-width: 1024px) 33vw, 100vw"
              alt=""
              label="live stream still"
              variant="dark"
              className="aspect-[16/10] w-full rounded-xl"
            />
            <LiveNowBadge className="absolute left-3 top-3" />
          </div>
          <span className="text-xs font-bold tracking-[.1em] uppercase text-primary">
            Live Stream
          </span>
          <h2 className="m-0 font-display text-[22px] leading-[1.15] tracking-[-.02em]">
            Worship with us from anywhere
          </h2>
          <span className="text-[14.5px] text-muted">
            Sundays · 10:15 AM Central
          </span>
          <ArrowLink href="/media/live" className="mt-auto text-[15px]">
            Watch live
          </ArrowLink>
        </Reveal>
        <Reveal delay={120} className="flex flex-col gap-3 rounded-2xl border border-line p-6">
          <ImageSlot
            src={latestPost.image ?? mediaPlaceholder}
            sizes="(min-width: 1024px) 33vw, 100vw"
            alt=""
            label="blog photo"
            className="aspect-[16/10] w-full rounded-xl"
          />
          <span className="text-xs font-bold tracking-[.1em] uppercase text-primary">
            Blog
          </span>
          <h2 className="m-0 font-display text-[22px] leading-[1.15] tracking-[-.02em] text-pretty-wrap">
            {latestPost.title}
          </h2>
          <span className="text-[14.5px] text-muted">{latestPost.author}</span>
          <ArrowLink href="/blog" className="mt-auto text-[15px]">
            Read the blog
          </ArrowLink>
        </Reveal>
      </div>

      <Reveal className="mt-6 rounded-2xl border border-teal-border bg-teal-50 p-6 lg:mt-8 lg:p-8">
        <span className="text-xs font-bold tracking-[.14em] uppercase text-teal-muted">
          This week&rsquo;s bulletin
        </span>
        <p className="mt-2 mb-3 max-w-[640px] text-[15.5px] leading-[1.6] text-teal-ink">
          Announcements, events, and prayer requests for the week — updated
          every Sunday.
        </p>
        <ArrowLink href="/bulletin">Read the bulletin</ArrowLink>
      </Reveal>
    </div>
  );
}
