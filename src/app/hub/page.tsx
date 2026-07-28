import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/Button";
import { EventCard } from "@/components/EventCard";
import { WeeklyRhythm } from "@/components/WeeklyRhythm";
import { getSpotlightEvent, upcomingEvents } from "@/content/events";
import { blogPosts } from "@/content/blog";
import { site, fullAddress } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hub",
  description:
    "Everything at Central in one place — this week's events, service times, giving, ministries, and media.",
  robots: { index: false, follow: true },
};

/**
 * The member-facing quick-access screen: one tap to anything, sized for a
 * phone. This is the layout the companion app's home tab will inherit, so it
 * stays a single column of large targets rather than a marketing page.
 */
const tiles = [
  { label: "Plan a Visit", href: "/plan-a-visit", note: "First time here?" },
  { label: "This Week", href: "/events", note: "Events & calendar" },
  { label: "Bulletin", href: "/bulletin", note: "This week's announcements" },
  { label: "Watch Live", href: "/media/live", note: "Sundays 10:15 AM" },
  { label: "Photo Gallery", href: "/media/photos", note: "Albums" },
  { label: "Camp Caudle", href: "/media/camp-caudle", note: "Every video by year" },
  { label: "Central Kids", href: "/ministries/children", note: "Birth–5th grade" },
  { label: "Central Teens", href: "/ministries/teens", note: "Middle & high school" },
  { label: "Life Groups", href: "/ministries/life-groups", note: "By age and stage" },
  { label: "Kids Closet", href: "/ministries/kids-closet", note: "Wed & Fri, 9–11 AM" },
  { label: "Iglesia", href: "/iglesia", note: "Domingos 1:30 PM" },
  { label: "Blog", href: "/blog", note: "Reflections & prayer" },
];

export default function HubPage() {
  const spotlight = getSpotlightEvent();
  const next = upcomingEvents.filter((e) => !e.spotlight).slice(0, 2);
  const latestPost = blogPosts[0];

  return (
    <div className="mx-auto max-w-[720px] px-5 py-8 lg:py-12">
      <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">
        Central Hub
      </span>
      <h1 className="mt-2.5 mb-4 font-display text-[34px] leading-[1.04] tracking-[-.035em] lg:text-[44px]">
        Everything in one place
      </h1>

      {/* Service times + directions */}
      <div className="flex flex-col gap-3 rounded-2xl border border-teal-border bg-teal-50 p-5">
        <span className="text-[11px] font-bold tracking-[.14em] uppercase text-primary-deep">
          This Sunday
        </span>
        <div className="flex flex-col gap-2 text-[15.5px] text-ink">
          {site.serviceTimes.map((t) => (
            <div key={t.label} className="flex justify-between gap-4">
              <span>{t.short}</span>
              <span className="font-bold">{t.when}</span>
            </div>
          ))}
        </div>
        <div className="mt-1 flex flex-col gap-2.5 sm:flex-row">
          <Button href={site.mapsUrl} size="md" full>
            Directions
          </Button>
          <Button href={site.phoneHref} variant="outline" size="md" full>
            Call the office
          </Button>
        </div>
        <span className="text-[14px] text-teal-ink">{fullAddress}</span>
      </div>

      {/* Give */}
      <div className="mt-4">
        <Button href={site.giveUrl} variant="give" full>
          Give
        </Button>
      </div>

      {/* Coming up */}
      <h2 className="mt-8 mb-4 font-display text-[24px] tracking-[-.025em]">
        Coming up
      </h2>
      <div className="flex flex-col gap-4">
        {[spotlight, ...next].filter(Boolean).map((event) => (
          <EventCard key={event!.slug} event={event!} />
        ))}
      </div>
      <div className="mt-4">
        <Button href="/events" variant="outline" size="md" full>
          See all events
        </Button>
      </div>

      {/* Quick links */}
      <h2 className="mt-10 mb-4 font-display text-[24px] tracking-[-.025em]">
        Quick links
      </h2>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {tiles.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className="flex min-h-[64px] flex-col justify-center rounded-xl border border-line px-4 py-3 no-underline transition-colors hover:border-teal-border hover:bg-teal-50/50"
          >
            <span className="font-display text-[17px] tracking-[-.01em] text-ink">
              {tile.label}
            </span>
            <span className="text-[13.5px] text-muted">{tile.note}</span>
          </Link>
        ))}
      </div>

      {/* Weekly rhythm */}
      <h2 className="mt-10 mb-4 font-display text-[24px] tracking-[-.025em]">
        Every week
      </h2>
      <WeeklyRhythm />

      {/* Latest read */}
      <Link
        href={`/blog/${latestPost.slug}`}
        className="mt-8 flex flex-col gap-1.5 rounded-2xl border border-line bg-surface p-5 no-underline"
      >
        <span className="text-[11px] font-bold tracking-[.1em] uppercase text-primary">
          Latest from the blog
        </span>
        <span className="font-display text-[19px] leading-snug tracking-[-.015em] text-ink">
          {latestPost.title}
        </span>
        <span className="text-[14px] text-muted">{latestPost.author}</span>
      </Link>
    </div>
  );
}
