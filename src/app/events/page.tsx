import type { Metadata } from "next";
import { ArrowLink } from "@/components/Button";
import { getCalendar, getCalendarSpotlight } from "@/lib/calendar";
import { EventsExplorer } from "./EventsExplorer";

export const metadata: Metadata = {
  title: "Events & Calendar",
  description:
    "See what's happening at Central Church of Christ in downtown Little Rock — weekly worship and classes, ministry events, and community outreach.",
};

export const revalidate = 900;

export default async function EventsPage() {
  const [{ recurring, upcoming }, spotlight] = await Promise.all([
    getCalendar(),
    getCalendarSpotlight(),
  ]);
  return (
    <div className="mx-auto max-w-[1440px] px-5 pt-8 pb-12 lg:px-14 lg:pt-16 lg:pb-[88px]">
      <div className="flex items-start justify-between gap-8">
        <div>
          <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">
            This Week
          </span>
          <h1 className="mt-2.5 mb-3 font-display text-[36px] leading-[1] tracking-[-.035em] lg:mt-3.5 lg:mb-4 lg:text-6xl lg:tracking-[-.04em]">
            Events at Central Church
          </h1>
          <p className="m-0 max-w-[720px] text-base leading-[1.65] text-body text-pretty-wrap lg:text-[19px]">
            From weekly worship and Bible classes to community outreach across
            Little Rock and Central Arkansas, there&rsquo;s always something
            happening at Central.
          </p>
        </div>
        <ArrowLink href="/events" className="hidden shrink-0 pt-2 lg:block">
          Subscribe to our calendar
        </ArrowLink>
      </div>
      <EventsExplorer upcoming={upcoming} recurring={recurring} spotlight={spotlight} />
    </div>
  );
}
