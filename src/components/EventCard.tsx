import Link from "next/link";
import type { ChurchEvent } from "@/content/events";
import { eventWhen } from "@/lib/format";
import { ImageSlot } from "./ImageSlot";
import { Tag } from "./Tag";
import { paletteFor } from "@/lib/ministry-colors";

/**
 * The most reused component in the system — homepage grid, events spotlight,
 * mobile carousel, and eventually the app. Layout-portable: flex column, no
 * web-only tricks. Falls back to a text-only card when no image is supplied.
 */
export function EventCard({
  event,
  showImage = true,
}: {
  event: ChurchEvent;
  showImage?: boolean;
}) {
  // Events show an image only when one exists — never a placeholder, so a
  // photo-less event reads as a deliberate text card rather than a gap.
  const withImage = showImage && Boolean(event.image);
  // A rule across the top in the ministry's color: enough to tell a grid of
  // cards apart at a glance without tinting the whole card.
  const c = paletteFor(event.tag);
  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-2xl border border-line border-t-[3px] bg-white ${c.rule}`}
    >
      {withImage ? (
        <div className="relative">
          <ImageSlot
            src={event.image}
            alt=""
            className="aspect-[16/10] w-full"
            sizes="(min-width: 1024px) 25vw, 80vw"
          />
          {event.tag ? (
            <span className="absolute top-3 left-3">
              <Tag onImage>{event.tag}</Tag>
            </span>
          ) : null}
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-2.5 p-5 pb-6">
        {!withImage && event.tag ? <Tag>{event.tag}</Tag> : null}
        <span className={`text-xs font-bold tracking-[.1em] uppercase ${c.text}`}>
          {eventWhen(event)}
        </span>
        <h3 className="font-display text-[21px] leading-[1.2] tracking-[-.015em] text-ink text-pretty-wrap">
          {event.title}
        </h3>
        <span className="text-[14.5px] text-muted">{event.location}</span>
        {event.description ? (
          <p className="text-[14.5px] leading-[1.55] text-body text-pretty-wrap">
            {event.description.split("\n")[0]}
          </p>
        ) : null}
        <Link
          href={`/events/${event.slug}`}
          className={`mt-auto pt-3.5 text-[14.5px] font-bold no-underline hover:opacity-80 ${c.text}`}
        >
          Event details →
        </Link>
      </div>
    </article>
  );
}
