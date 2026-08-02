import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLink, Button } from "@/components/Button";
import { PrayerRequestForm } from "@/components/PrayerRequestForm";
import { WeeklyRhythm } from "@/components/WeeklyRhythm";
import { Reveal } from "@/components/Reveal";
import { bulletin } from "@/content/bulletin";
import { getCalendar, getCalendarSpotlight } from "@/lib/calendar";
import { blogPosts } from "@/content/blog";
import { eventWhen } from "@/lib/format";
import { site, fullAddress } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hub",
  description:
    "This week at Central — announcements, events, prayer requests, service times, and quick links.",
  robots: { index: false, follow: true },
};

/**
 * The member-facing weekly screen. Reads like the bulletin: what's happening
 * comes first, links come last. Single column of large targets, sized for a
 * phone — this is the layout the companion app's home tab inherits.
 */
const links = [
  { label: "Plan a Visit", href: "/plan-a-visit", note: "First time here?" },
  { label: "All Events", href: "/events", note: "Full calendar" },
  { label: "Full Bulletin", href: "/bulletin", note: "PDF & archive" },
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

export const revalidate = 900;

export default async function HubPage() {
  const [{ recurring, upcoming }, spotlight] = await Promise.all([
    getCalendar(),
    getCalendarSpotlight(),
  ]);
  const thisWeek = [
    spotlight,
    ...upcoming.filter((e) => e.slug !== spotlight?.slug),
  ]
    .filter(Boolean)
    .slice(0, 4);
  const latestPost = blogPosts[0];

  return (
    <div className="mx-auto max-w-[720px] px-5 py-8 lg:py-12">
      <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">
        Central Hub
      </span>
      <h1 className="mt-2.5 mb-1 font-display text-[34px] leading-[1.04] tracking-[-.035em] lg:text-[44px]">
        This week at Central
      </h1>
      <p className="m-0 text-[15.5px] text-muted">Week of {bulletin.weekOf}</p>

      {/* Guest sign-in — first thing on the page on purpose, for anyone
          landing here Sunday morning without a "Central Hub" login yet. */}
      <a
        href="https://lrcentralchurch.breezechms.com/form/eea89d"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-7 flex items-center justify-between gap-4 rounded-2xl bg-primary-deep px-5 py-5 no-underline lg:px-6 lg:py-6"
      >
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-[.14em] uppercase text-teal-light">
            First time here?
          </span>
          <span className="font-display text-[21px] tracking-[-.015em] text-white">
            Guest Sign-In
          </span>
          <span className="text-[14.5px] text-teal-pale">
            Let us know you&rsquo;re here — takes 30 seconds
          </span>
        </div>
        <span aria-hidden className="shrink-0 font-display text-2xl text-white">
          →
        </span>
      </a>

      {/* Announcements lead — same content as the bulletin */}
      <Reveal as="section" className="mt-7 rounded-2xl border border-line p-5 lg:p-6">
        <h2 className="m-0 mb-3.5 font-display text-[21px] tracking-[-.02em]">
          Announcements
        </h2>
        <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
          {bulletin.announcements.map((a) => (
            <li
              key={a.title}
              className="border-b border-line pb-3.5 text-[15.5px] leading-[1.6] last:border-0 last:pb-0"
            >
              <span className="block font-semibold text-ink">{a.title}</span>
              <span className="text-body">{a.body}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* What's on */}
      <Reveal as="section" className="mt-4 rounded-2xl border border-line p-5 lg:p-6">
        <h2 className="m-0 mb-3.5 font-display text-[21px] tracking-[-.02em]">
          What&rsquo;s on
        </h2>
        <div className="flex flex-col">
          {thisWeek.map((event) => (
            <Link
              key={event!.slug}
              href={`/events/${event!.slug}`}
              className="flex justify-between gap-4 border-b border-line py-3 text-[15.5px] text-ink no-underline first:pt-0 last:border-0 last:pb-0 hover:text-primary"
            >
              <span className="font-semibold">{event!.title}</span>
              <span className="shrink-0 text-right text-muted">
                {eventWhen(event!).split(" · ")[0]}
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-4">
          <ArrowLink href="/events">See the full calendar</ArrowLink>
        </div>
      </Reveal>

      {/* Prayer — named requests stay in the printed bulletin, not on a public URL */}
      <Reveal as="section" className="mt-4 rounded-2xl border border-teal-border bg-teal-50 p-5 lg:p-6">
        <h2 className="m-0 mb-3.5 font-display text-[21px] tracking-[-.02em]">
          Prayer
        </h2>
        <div className="flex flex-col gap-3">
          {bulletin.prayer.map((s) => (
            <div key={s.heading}>
              <span className="mb-1 block text-[11px] font-bold tracking-[.14em] uppercase text-teal-ink">
                {s.heading}
              </span>
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {s.items.map((p) => (
                  <li
                    key={p.slice(0, 32)}
                    className="text-[15.5px] leading-[1.6] text-teal-ink"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <PrayerRequestForm />
        </div>
      </Reveal>

      {/* Times, directions, giving */}
      <Reveal as="section" className="mt-4 rounded-2xl border border-line p-5 lg:p-6">
        <h2 className="m-0 mb-3.5 font-display text-[21px] tracking-[-.02em]">
          Service times
        </h2>
        <div className="flex flex-col gap-2 text-[15.5px] text-ink">
          {site.serviceTimes.map((t) => (
            <div key={t.label} className="flex justify-between gap-4">
              <span>{t.short}</span>
              <span className="font-bold">{t.when}</span>
            </div>
          ))}
        </div>
        <p className="mt-3.5 mb-3 text-[14.5px] text-muted">{fullAddress}</p>
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <Button href={site.mapsUrl} size="md" full>
            Directions
          </Button>
          <Button href={site.phoneHref} variant="outline" size="md" full>
            Call the office
          </Button>
        </div>
        <div className="mt-2.5">
          <Button href={site.giveUrl} variant="give" full>
            Give
          </Button>
        </div>
      </Reveal>

      {/* Weekly rhythm */}
      <h2 className="mt-9 mb-4 font-display text-[24px] tracking-[-.025em]">
        Every week
      </h2>
      <WeeklyRhythm events={recurring} />

      {/* Quick links last */}
      <h2 className="mt-9 mb-4 font-display text-[24px] tracking-[-.025em]">
        Quick links
      </h2>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex min-h-[64px] flex-col justify-center rounded-xl border border-line px-4 py-3 no-underline transition-colors hover:border-teal-border hover:bg-teal-50/50"
          >
            <span className="font-display text-[17px] tracking-[-.01em] text-ink">
              {link.label}
            </span>
            <span className="text-[13.5px] text-muted">{link.note}</span>
          </Link>
        ))}
      </div>

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
