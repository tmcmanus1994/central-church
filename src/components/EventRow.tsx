import Link from "next/link";
import type { ChurchEvent } from "@/content/events";
import { dayOfMonth, eventTimeRange, eventWhen, monthShort } from "@/lib/format";
import { ImageSlot } from "./ImageSlot";
import { Tag } from "./Tag";
import { paletteFor } from "@/lib/ministry-colors";

/** Date chip + optional thumb + title/time/tag — the chronological Upcoming list. */
export function EventRow({ event }: { event: ChurchEvent }) {
  const timeLine = event.allDay
    ? `${eventWhen(event)} · ${event.location}`
    : `${eventTimeRange(event)} · ${event.location}`;
  // The date block carries the ministry's color, so a long list is scannable
  // by hue before a single title is read.
  const c = paletteFor(event.tag);
  return (
    <Link
      href={`/events/${event.slug}`}
      className={`flex items-center gap-4 rounded-2xl border border-line p-3.5 text-ink no-underline transition-colors lg:gap-6 lg:p-[18px] ${c.hover}`}
    >
      <div
        className={`w-[58px] shrink-0 rounded-xl py-2.5 text-center lg:w-[78px] lg:py-3 ${c.block}`}
      >
        <div
          className={`text-[10px] font-bold tracking-[.1em] uppercase lg:text-[11px] ${c.textSoft}`}
        >
          {monthShort(event.start)}
        </div>
        <div
          className={`font-display text-[22px] leading-[1.1] lg:text-[28px] ${c.text}`}
        >
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
      <span className={`hidden shrink-0 text-[15px] font-bold lg:inline ${c.text}`}>
        Details →
      </span>
    </Link>
  );
}
