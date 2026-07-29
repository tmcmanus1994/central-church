"use client";

import { useState } from "react";
import { EventCard } from "@/components/EventCard";
import { ImageSlot } from "@/components/ImageSlot";
import { EventRow } from "@/components/EventRow";
import { WeeklyRhythm } from "@/components/WeeklyRhythm";
import type { ChurchEvent, EventTag } from "@/content/events";
import { eventWhen } from "@/lib/format";
import { paletteFor } from "@/lib/ministry-colors";

const FILTERS: { label: string; tag: EventTag | null }[] = [
  { label: "All Events", tag: null },
  { label: "Central Teens", tag: "Central Teens" },
  { label: "Central Kids", tag: "Central Kids" },
  { label: "Outreach", tag: "Outreach" },
];

function monthRangeLabel(events: ChurchEvent[]) {
  if (events.length === 0) return "";
  const fmt = (iso: string) =>
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  const first = fmt(events[0].start);
  const last = fmt(events[events.length - 1].start);
  if (first === last) return first;
  const [fMonth, year] = [first.split(" ")[0], last.split(" ")[1]];
  return `${fMonth} – ${last.split(" ")[0]} ${year}`;
}

export function EventsExplorer({
  upcoming,
  recurring,
  spotlight,
}: {
  upcoming: ChurchEvent[];
  recurring: ChurchEvent[];
  spotlight?: ChurchEvent;
}) {
  const [active, setActive] = useState<EventTag | null>(null);
  const filtered = active
    ? upcoming.filter((e) => e.tag === active)
    : upcoming;
  const list = filtered.filter((e) => e.slug !== spotlight?.slug);
  const secondary = upcoming.find(
    (e) => e.slug !== spotlight?.slug && (!active || e.tag === active),
  );
  const showSpotlightZone = spotlight && (!active || spotlight.tag === active);

  return (
    <>
      {/* Filters */}
      <div
        role="group"
        aria-label="Filter events"
        className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto border-b border-line px-5 py-3.5 lg:mx-0 lg:border-0 lg:px-0 lg:pt-8 lg:pb-0"
      >
        {FILTERS.map((f) => {
          const isActive = active === f.tag;
          // Each filter wears the color its events wear, so the chip row
          // doubles as the legend for the list below it.
          const c = paletteFor(f.tag ?? undefined);
          return (
            <button
              key={f.label}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActive(f.tag)}
              className={`shrink-0 rounded-full px-[15px] py-[9px] text-[13.5px] font-semibold transition-colors lg:px-[18px] lg:py-[11px] lg:text-[14.5px] ${
                isActive
                  ? `font-bold ${c.solid}`
                  : `border border-line hover:border-transparent ${c.text} ${c.hoverChip}`
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Spotlight zone */}
      {showSpotlightZone ? (
        <section className="-mx-5 mt-5 border-y border-line bg-surface px-5 py-6 lg:mx-0 lg:mt-10 lg:rounded-2xl lg:border lg:p-8">
          <span className="text-xs font-bold tracking-[.14em] uppercase text-muted">
            Spotlight
          </span>
          <div className="mt-4 grid grid-cols-1 gap-5 lg:mt-5 lg:grid-cols-[1.45fr_1fr] lg:gap-6">
            <div className="flex flex-col overflow-hidden rounded-[18px] border border-line bg-white">
              {spotlight.image ? (
                <ImageSlot
                  src={spotlight.image}
                  alt=""
                  className="aspect-[16/9] w-full"
                  sizes="(min-width: 1024px) 60vw, 100vw"
                />
              ) : null}
              <div className="flex flex-col gap-3 p-5 lg:p-7">
                <span
                  className={`inline-flex w-fit items-center rounded-full px-3 py-[6px] text-[11px] font-bold tracking-[.1em] uppercase ${paletteFor(spotlight.tag).chip}`}
                >
                  {spotlight.tag} · {eventWhen(spotlight)}
                </span>
                <h2 className="m-0 font-display text-[26px] leading-[1.1] tracking-[-.025em] text-pretty-wrap lg:text-[34px] lg:tracking-[-.03em]">
                  {spotlight.title}
                </h2>
                {spotlight.description ? (
                  <p className="m-0 max-w-[640px] text-[15.5px] leading-[1.6] text-body lg:text-[16.5px]">
                    {spotlight.description.split("\n")[0]}
                  </p>
                ) : null}
                <div className="mt-1.5 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
                  <a
                    href={`/events/${spotlight.slug}`}
                    className="inline-flex h-[50px] items-center justify-center rounded-full bg-accent px-6 text-[15.5px] font-bold text-white no-underline hover:bg-accent-deep"
                  >
                    {spotlight.ctaLabel ?? "Details & sign up"}
                  </a>
                  <a
                    href={`/events/${spotlight.slug}`}
                    className="inline-flex h-[50px] items-center justify-center rounded-full border-[1.5px] border-primary px-6 text-[15.5px] font-bold text-primary no-underline hover:bg-teal-50"
                  >
                    Add to calendar
                  </a>
                </div>
              </div>
            </div>
            {secondary ? (
              <div className="hidden lg:block">
                <EventCard event={secondary} />
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Recurring + Upcoming */}
      <section className="mt-8 grid grid-cols-1 gap-10 lg:mt-14 lg:grid-cols-[1fr_1.6fr] lg:gap-14">
        <div className="order-last lg:order-first">
          <h2 className="m-0 mb-1.5 font-display text-[24px] tracking-[-.025em] lg:text-[32px]">
            Recurring Events
          </h2>
          <p className="m-0 mb-5 text-[15px] leading-[1.6] text-muted lg:mb-6 lg:text-base">
            Our weekly rhythm. No sign-up needed — just come.
          </p>
          <WeeklyRhythm events={recurring} />
        </div>
        <div>
          <h2 className="m-0 mb-1.5 font-display text-[24px] tracking-[-.025em] lg:text-[32px]">
            Upcoming Events
          </h2>
          <p className="m-0 mb-5 text-[15px] leading-[1.6] text-muted lg:mb-6 lg:text-base">
            {monthRangeLabel(filtered)} · {filtered.length}{" "}
            {filtered.length === 1 ? "event" : "events"}
          </p>
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line-dark bg-surface p-8 text-center text-[15.5px] text-body">
              Nothing on the calendar for this filter yet — check back soon, or
              see all events.
            </div>
          ) : (
            <div className="flex flex-col gap-3 lg:gap-3.5">
              {(showSpotlightZone ? list : filtered).map((event) => (
                <EventRow key={event.slug} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
