import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLink, Button } from "@/components/Button";
import { ImageSlot } from "@/components/ImageSlot";
import { Tag } from "@/components/Tag";
import {
  allEvents,
  getEvent,
  recurringEvents,
  upcomingEvents,
} from "@/content/events";
import { getMinistry } from "@/content/ministries";
import {
  addToCalendarUrl,
  eventDateLong,
  eventTimeRange,
  eventWhen,
  monthShort,
  recurringWhen,
} from "@/lib/format";
import { site, fullAddress } from "@/lib/site";

export function generateStaticParams() {
  return allEvents.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const event = getEvent((await params).slug);
  if (!event) return {};
  return {
    title: `${event.title} | Events`,
    description:
      event.description?.split("\n")[0] ??
      `${event.title} at Central Church of Christ in downtown Little Rock — ${eventWhen(event)}.`,
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const event = getEvent((await params).slug);
  if (!event) notFound();

  const ministry = event.ministrySlug ? getMinistry(event.ministrySlug) : null;
  const alsoThisMonth = upcomingEvents
    .filter(
      (e) =>
        e.slug !== event.slug && monthShort(e.start) === monthShort(event.start),
    )
    .slice(0, 3);
  const paragraphs = event.description?.split("\n").filter(Boolean) ?? [];
  const isRecurring = Boolean(event.recurring);

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-line px-5 py-3.5 text-[14.5px] text-muted lg:px-14 lg:py-5">
        <nav aria-label="Breadcrumb" className="mx-auto max-w-[1440px]">
          <Link href="/events" className="font-semibold text-primary no-underline">
            Events
          </Link>
          <span className="px-2">/</span>
          <span>{event.title}</span>
        </nav>
      </div>

      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-5 py-7 lg:grid-cols-[1.45fr_1fr] lg:gap-14 lg:px-14 lg:py-14 lg:pb-[88px]">
        <div className="flex flex-col gap-4 lg:gap-6">
          {event.image !== null ? (
            <ImageSlot
              src={event.image}
              alt=""
              label="event hero photo 16:9"
              className="h-[210px] rounded-[18px] lg:h-[420px]"
              sizes="(min-width: 1024px) 60vw, 100vw"
            />
          ) : null}
          {event.tag ? <Tag>{event.tag}</Tag> : null}
          <h1 className="m-0 font-display text-[32px] leading-[1.04] tracking-[-.03em] text-pretty-wrap lg:text-[52px] lg:leading-[1.02] lg:tracking-[-.035em]">
            {event.title}
          </h1>

          {/* Compact when/where on mobile; the aside handles desktop */}
          <div className="flex flex-col gap-2.5 rounded-[14px] border border-line bg-surface p-4 text-[15px] lg:hidden">
            <div className="flex justify-between gap-3">
              <span className="text-muted">When</span>
              <span className="text-right font-bold">
                {isRecurring ? recurringWhen(event) : eventWhen(event)}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted">Where</span>
              <span className="text-right font-bold">{event.location}</span>
            </div>
          </div>

          {paragraphs.length > 0 ? (
            paragraphs.map((p) => (
              <p
                key={p.slice(0, 32)}
                className="m-0 max-w-[700px] text-base leading-[1.7] text-body text-pretty-wrap lg:text-[19px]"
              >
                {p}
              </p>
            ))
          ) : (
            <p className="m-0 max-w-[700px] text-base leading-[1.7] text-body lg:text-[19px]">
              {isRecurring
                ? `${event.title} meets ${recurringWhen(event)} at ${event.location}. No sign-up needed — just come.`
                : `Join us for ${event.title} at ${event.location}.`}
            </p>
          )}

          {ministry ? (
            <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 lg:p-6">
              <span aria-hidden className="img-slot size-14 shrink-0 rounded-full lg:size-16" />
              <div className="flex flex-col gap-[3px]">
                <span className="text-xs font-bold tracking-[.1em] uppercase text-muted">
                  Hosted by
                </span>
                <span className="font-display text-[17px] tracking-[-.015em] lg:text-xl">
                  {ministry.shortName}
                  {ministry.contact ? ` · ${ministry.contact.name}` : ""}
                </span>
                <ArrowLink
                  href={
                    ministry.slug === "iglesia"
                      ? "/iglesia"
                      : `/ministries/${ministry.slug}`
                  }
                  className="text-[15px]"
                >
                  {ministry.shortName} ministry
                </ArrowLink>
              </div>
            </div>
          ) : null}
        </div>

        <aside className="flex flex-col gap-5">
          <div className="flex flex-col gap-[18px] rounded-[18px] border border-line bg-white p-6 shadow-[0_12px_32px_-18px_rgba(22,19,15,.28)] lg:p-7">
            <div className="flex flex-col gap-[5px]">
              <span className="text-[11px] font-bold tracking-[.16em] uppercase text-muted">
                When
              </span>
              {isRecurring ? (
                <span className="text-[17px] font-semibold">
                  {recurringWhen(event)} · every week
                </span>
              ) : (
                <>
                  <span className="text-[17px] font-semibold">
                    {eventDateLong(event)}
                  </span>
                  <span className="text-base text-body">
                    {eventTimeRange(event)}
                  </span>
                </>
              )}
            </div>
            <div className="flex flex-col gap-[5px] border-t border-line pt-[18px]">
              <span className="text-[11px] font-bold tracking-[.16em] uppercase text-muted">
                Where
              </span>
              <span className="text-[17px] font-semibold">{event.location}</span>
              <span className="text-base text-body">{fullAddress}</span>
            </div>
            <ImageSlot alt={`Map showing ${fullAddress}`} label="map embed" className="h-[150px] rounded-xl" />
            <div className="flex flex-col gap-2.5">
              {event.ctaLabel ? (
                <Button href={event.ctaHref ?? "/plan-a-visit#contact"} variant="give" full>
                  {event.ctaLabel}
                </Button>
              ) : null}
              <Button href={addToCalendarUrl(event)} variant="outline" full>
                Add to calendar
              </Button>
              <Button href={site.mapsUrl} variant="neutral" full>
                Get directions
              </Button>
            </div>
          </div>

          {alsoThisMonth.length > 0 ? (
            <div className="flex flex-col gap-3 rounded-[18px] border border-teal-border bg-teal-50 p-6">
              <span className="text-[11px] font-bold tracking-[.16em] uppercase text-teal-muted">
                Also this month
              </span>
              {alsoThisMonth.map((e) => (
                <Link
                  key={e.slug}
                  href={`/events/${e.slug}`}
                  className="text-base font-semibold text-ink no-underline hover:text-primary"
                >
                  {e.title} · {eventWhen(e).split(" · ")[0]}
                </Link>
              ))}
            </div>
          ) : null}

          {isRecurring ? (
            <div className="flex flex-col gap-3 rounded-[18px] border border-teal-border bg-teal-50 p-6">
              <span className="text-[11px] font-bold tracking-[.16em] uppercase text-teal-muted">
                Every week at Central
              </span>
              {recurringEvents
                .filter((e) => e.slug !== event.slug)
                .slice(0, 4)
                .map((e) => (
                  <Link
                    key={e.slug}
                    href={`/events/${e.slug}`}
                    className="text-base font-semibold text-ink no-underline hover:text-primary"
                  >
                    {e.title} · {recurringWhen(e)}
                  </Link>
                ))}
            </div>
          ) : null}
        </aside>
      </div>

      {/* Mobile sticky action bar */}
      <div className="sticky bottom-16 z-30 flex gap-2.5 border-t border-line bg-white px-5 py-3.5 lg:hidden">
        {event.ctaLabel ? (
          <a
            href={event.ctaHref ?? "/plan-a-visit#contact"}
            className="flex h-[52px] flex-1 items-center justify-center rounded-full bg-accent text-[15px] font-bold text-white no-underline"
          >
            {event.ctaLabel}
          </a>
        ) : null}
        <a
          href={addToCalendarUrl(event)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-[52px] flex-1 items-center justify-center rounded-full border-[1.5px] border-primary text-[15px] font-bold text-primary no-underline"
        >
          Add to calendar
        </a>
      </div>
    </>
  );
}
