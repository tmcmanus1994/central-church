import Link from "next/link";
import type { ChurchEvent } from "@/content/events";
import { dayOfMonth, eventTimeRange, eventWhen, monthShort } from "@/lib/format";
import { ImageSlot } from "./ImageSlot";
import { Tag } from "./Tag";

/** Date chip + optional thumb + title/time/tag — the chronological Upcoming list. */
export function EventRow({ event }: { event: ChurchEvent }) {
  const timeLine = event.allDay
    ? `${eventWhen(event)} · ${event.location}`
    : `${eventTimeRange(event)} · ${event.location}`;
  return (
    <Link
      href={`/events/${event.slug}`}
      className="flex items-center gap-4 rounded-2xl border border-line p-3.5 text-ink no-underline transition-colors hover:border-teal-border hover:bg-teal-50/40 lg:gap-6 lg:p-[18px]"
    >
      <div className="w-[58px] shrink-0 rounded-xl bg-teal-50 py-2.5 text-center lg:w-[78px] lg:py-3">
        <div className="text-[10px] font-bold tracking-[.1em] uppercase text-teal-muted lg:text-[11px]">
          {monthShort(event.start)}
        </div>
        <div className="font-display text-[22px] leading-[1.1] text-primary-deep lg:text-[28px]">
          {dayOfMonth(event.start)}
        </div>
      </div>
      {event.image ? (
        <ImageSlot
          src={event.image}
          alt=""
          className="hidden aspect-[16/10] w-[150px] shrink-0 rounded-[10px] lg:block"
          sizes="150px"
        />
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col gap-1 lg:gap-[5px]">
        {event.tag ? (
          <span className="hidden lg:inline-flex">
            <Tag>{event.tag}</Tag>
          </span>
        ) : null}
        <span className="font-display text-[17px] tracking-[-.015em] text-pretty-wrap lg:text-[22px] lg:tracking-[-.02em]">
          {event.title}
        </span>
        <span className="text-[13.5px] text-muted lg:text-[14.5px]">
          {timeLine}
        </span>
      </div>
      <span className="hidden shrink-0 text-[15px] font-bold text-primary lg:inline">
        Details →
      </span>
    </Link>
  );
}
