import type { Metadata } from "next";
import { ArrowLink } from "@/components/Button";
import { WeeklyRhythm } from "@/components/WeeklyRhythm";
import { bulletin } from "@/content/bulletin";
import { getCalendar } from "@/lib/calendar";
import { eventWhen } from "@/lib/format";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Weekly Bulletin",
  description:
    "This week's bulletin from Central Church of Christ in downtown Little Rock — announcements, events, and prayer requests, plus the bulletin archive.",
};


export const revalidate = 900;

export default async function BulletinPage() {
  const { recurring, upcoming } = await getCalendar();
  const thisWeek = upcoming.slice(0, 3);
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8 lg:px-14 lg:py-16">
      <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">
        This Week
      </span>
      <h1 className="mt-2.5 mb-3 font-display text-[36px] leading-[1] tracking-[-.035em] lg:mb-4 lg:text-[56px] lg:tracking-[-.04em]">
        This Week&rsquo;s Bulletin
      </h1>
      <p className="m-0 text-base leading-[1.65] text-body lg:text-[19px]">
        Week of {bulletin.weekOf}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:mt-10 lg:grid-cols-[1.5fr_1fr] lg:gap-8">
        <div className="flex flex-col gap-6">
          <section className="rounded-2xl border border-line p-6 lg:p-7">
            <h2 className="m-0 mb-4 font-display text-[22px] tracking-[-.02em]">
              Announcements
            </h2>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {bulletin.announcements.map((a) => (
                <li
                  key={a.slice(0, 32)}
                  className="border-b border-line pb-3 text-[15.5px] leading-[1.6] text-body last:border-0 last:pb-0"
                >
                  {a}
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-2xl border border-line p-6 lg:p-7">
            <h2 className="m-0 mb-4 font-display text-[22px] tracking-[-.02em]">
              Events this week
            </h2>
            <div className="flex flex-col gap-3">
              {thisWeek.map((e) => (
                <Link
                  key={e.slug}
                  href={`/events/${e.slug}`}
                  className="flex justify-between gap-4 border-b border-line pb-3 text-[15.5px] text-ink no-underline last:border-0 last:pb-0 hover:text-primary"
                >
                  <span className="font-semibold">{e.title}</span>
                  <span className="text-right text-muted">{eventWhen(e)}</span>
                </Link>
              ))}
            </div>
          </section>
          <section className="rounded-2xl border border-teal-border bg-teal-50 p-6 lg:p-7">
            <h2 className="m-0 mb-4 font-display text-[22px] tracking-[-.02em]">
              Prayer requests
            </h2>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {bulletin.prayerRequests.map((p) => (
                <li
                  key={p.slice(0, 32)}
                  className="text-[15.5px] leading-[1.6] text-teal-ink"
                >
                  {p}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-6">
            <span className="text-[11px] font-bold tracking-[.16em] uppercase text-muted">
              Download
            </span>
            <p className="m-0 text-[15.5px] leading-[1.6] text-body">
              Prefer the full bulletin? Download this week&rsquo;s PDF.
            </p>
            <ArrowLink href="/bulletin">Bulletin PDF</ArrowLink>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl border border-line p-6">
            <span className="text-[11px] font-bold tracking-[.16em] uppercase text-muted">
              Archive
            </span>
            {bulletin.archive.map((date) => (
              <span
                key={date}
                className="border-b border-line pb-2.5 text-[15.5px] font-semibold text-body last:border-0 last:pb-0"
              >
                Week of {date}
              </span>
            ))}
          </div>
          <WeeklyRhythm events={recurring} />
        </aside>
      </div>
    </div>
  );
}
