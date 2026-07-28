import { recurringEvents } from "@/content/events";
import { recurringWhen } from "@/lib/format";
import { ArrowLink } from "./Button";

/** The seven-item weekly rhythm list, reused on the homepage and events page. */
export function WeeklyRhythm({
  columns = false,
  subscribeLink = true,
}: {
  columns?: boolean;
  subscribeLink?: boolean;
}) {
  if (columns) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-5 lg:p-8">
        <span className="text-xs font-bold tracking-[.14em] uppercase text-muted">
          Our weekly rhythm
        </span>
        <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {recurringEvents.map((e) => (
            <div
              key={e.slug}
              className="flex justify-between gap-4 border-b border-line pb-3 text-[15px] lg:text-[15.5px]"
            >
              <span className="font-semibold">{e.title}</span>
              <span className="text-right text-muted">{recurringWhen(e)}</span>
            </div>
          ))}
          {subscribeLink ? (
            <div className="flex items-center text-[15.5px]">
              <ArrowLink href="/events">Subscribe to our calendar</ArrowLink>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      {recurringEvents.map((e) => (
        <div
          key={e.slug}
          className="flex justify-between gap-4 border-b border-line px-4 py-3.5 text-[15px] last:border-0 lg:px-5 lg:py-[18px] lg:text-base"
        >
          <span className="font-semibold">{e.title}</span>
          <span className="text-right text-muted">{recurringWhen(e)}</span>
        </div>
      ))}
    </div>
  );
}
