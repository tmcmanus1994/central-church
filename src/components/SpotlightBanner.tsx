import type { ChurchEvent } from "@/content/events";
import { eventWhen } from "@/lib/format";
import { Button } from "./Button";
import { ImageSlot } from "./ImageSlot";

/**
 * The automation-fed featured-event slot. Some weeks there is no spotlight —
 * this component renders nothing at all in that case, and the homepage reads
 * as intentional either way.
 */
export function SpotlightBanner({ event }: { event?: ChurchEvent }) {
  if (!event) return null;
  return (
    <div className="border-b border-teal-border bg-teal-50 px-5 py-6 lg:px-14 lg:py-7">
      <div className="mx-auto flex max-w-[1328px] flex-col gap-5 rounded-2xl border border-teal-border bg-white p-4 lg:flex-row lg:items-center lg:gap-8 lg:py-3 lg:pr-7 lg:pl-3">
        <ImageSlot
          src={event.image}
          alt=""
          label="spotlight image"
          variant="teal"
          className="h-[150px] w-full shrink-0 rounded-xl lg:w-[260px]"
          sizes="(min-width: 1024px) 260px, 100vw"
        />
        <div className="flex flex-1 flex-col gap-2">
          <span className="inline-flex w-fit items-center rounded-full bg-accent-tint px-3 py-[6px] text-[11px] font-bold tracking-[.1em] uppercase text-accent-deep">
            Featured · {eventWhen(event)}
          </span>
          <h2 className="font-display text-[24px] leading-[1.12] tracking-[-.025em] text-pretty-wrap lg:text-[32px]">
            {event.title}
          </h2>
          {event.description ? (
            <p className="max-w-[660px] text-base leading-[1.55] text-body">
              {event.description.split("\n")[0]}
            </p>
          ) : null}
        </div>
        <div className="shrink-0">
          <Button href={`/events/${event.slug}`} variant="give">
            {event.ctaLabel ?? "Details & sign up"}
          </Button>
        </div>
      </div>
    </div>
  );
}
