import type { Metadata } from "next";
import { ArrowLink } from "@/components/Button";
import { WeeklyRhythm } from "@/components/WeeklyRhythm";
import { bulletin, bulletinPolicy } from "@/content/bulletin";
import { getCalendar } from "@/lib/calendar";
import { eventWhen } from "@/lib/format";
import Link from "next/link";
import { StaffMention } from "@/components/ContactButton";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Weekly Bulletin",
  description:
    "This week's bulletin from Central Church of Christ in downtown Little Rock — announcements, events, classes, and the ministries that meet every week.",
};

export const revalidate = 900;

function Card({
  title,
  children,
  tone = "plain",
}: {
  title: string;
  children: React.ReactNode;
  tone?: "plain" | "teal";
}) {
  return (
    <Reveal as="section"
      className={
        tone === "teal"
          ? "rounded-2xl border border-teal-border bg-teal-50 p-6 lg:p-7"
          : "rounded-2xl border border-line p-6 lg:p-7"
      }
    >
      <h2 className="m-0 mb-4 font-display text-[22px] tracking-[-.02em]">
        {title}
      </h2>
      {children}
    </Reveal>
  );
}

export default async function BulletinPage() {
  const { recurring, upcoming } = await getCalendar();
  const thisWeek = upcoming.slice(0, 5);

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
          <Card title="Announcements">
            <ul className="m-0 flex list-none flex-col gap-5 p-0">
              {bulletin.announcements.map((a) => (
                <li
                  key={a.title}
                  className="border-b border-line pb-5 last:border-0 last:pb-0"
                >
                  <h3 className="m-0 mb-1.5 font-display text-[17px] tracking-[-.015em]">
                    {a.href ? (
                      <Link href={a.href} className="text-ink no-underline hover:text-primary">
                        {a.title}
                      </Link>
                    ) : (
                      a.title
                    )}
                  </h3>
                  <p className="m-0 text-[15.5px] leading-[1.6] text-body">
                    {a.body}
                  </p>
                  {a.contact ? (
                    <p className="m-0 mt-2 text-[14px] text-muted">
                      Contact{" "}
                      {a.contact.email ? (
                        <a href={`mailto:${a.contact.email}`} className="text-primary">
                          {a.contact.name}
                        </a>
                      ) : (
                        a.contact.name
                      )}
                      .
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Events this week">
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
            <div className="mt-4">
              <ArrowLink href="/events">All events</ArrowLink>
            </div>
          </Card>

          <Card title="Classes">
            <h3 className="m-0 mb-2 text-[11px] font-bold tracking-[.14em] uppercase text-primary">
              Sundays, 9 AM
            </h3>
            <ul className="m-0 mb-6 flex list-none flex-col gap-3 p-0">
              {bulletin.sundayClasses.map((c) => (
                <li key={c.name} className="text-[15.5px] leading-[1.6]">
                  <span className="font-semibold text-ink">{c.name}</span>
                  {c.room ? <span className="text-muted"> · {c.room}</span> : null}
                  <span className="block text-body">{c.detail}</span>
                </li>
              ))}
            </ul>
            <h3 className="m-0 mb-2 text-[11px] font-bold tracking-[.14em] uppercase text-primary">
              Wednesdays, 6:30 PM
            </h3>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {bulletin.wednesdayClasses.map((c) => (
                <li key={c.name} className="text-[15.5px] leading-[1.6]">
                  <span className="font-semibold text-ink">{c.name}</span>
                  {c.teacher ? (
                    <span className="text-muted"> · {c.teacher}</span>
                  ) : null}
                  {c.room ? <span className="text-muted"> · {c.room}</span> : null}
                  <span className="block text-body">{c.detail}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Ongoing at Central">
            <ul className="m-0 flex list-none flex-col gap-4 p-0">
              {bulletin.ongoing.map((o) => (
                <li
                  key={o.name}
                  className="border-b border-line pb-4 text-[15.5px] leading-[1.6] last:border-0 last:pb-0"
                >
                  <span className="font-semibold text-ink">
                    {o.href ? (
                      <Link href={o.href} className="text-ink no-underline hover:text-primary">
                        {o.name}
                      </Link>
                    ) : (
                      o.name
                    )}
                  </span>
                  {o.when ? <span className="text-muted"> · {o.when}</span> : null}
                  <span className="block text-body">{o.detail}</span>
                  {o.contact ? (
                    <span className="block text-[14px] text-muted">
                      Contact <StaffMention name={o.contact} />.
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </Card>

          {bulletinPolicy.publishPrayerList ? (
            <Card title="Prayer" tone="teal">
              <div className="flex flex-col gap-4">
                {bulletin.prayer.map((s) => (
                  <div key={s.heading}>
                    <h3 className="m-0 mb-1.5 text-[11px] font-bold tracking-[.14em] uppercase text-teal-ink">
                      {s.heading}
                    </h3>
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
            </Card>
          ) : (
            <Card title="Prayer" tone="teal">
              <p className="m-0 text-[15.5px] leading-[1.6] text-teal-ink">
                The full prayer list is in the printed bulletin and the weekly
                email. It names people and their circumstances, so it stays off
                the public site. We&rsquo;re praying for our missionaries — the
                Bills family in Ghana, the Cerecedos in Mexico, and the Daggetts
                in Peru — for our service members, and for our neighbors who are
                seeking the Lord.
              </p>
            </Card>
          )}
        </div>

        <aside className="flex flex-col gap-6">
          {bulletin.pdfPath ? (
            <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-6">
              <span className="text-[11px] font-bold tracking-[.16em] uppercase text-muted">
                Download
              </span>
              <p className="m-0 text-[15.5px] leading-[1.6] text-body">
                Prefer the full bulletin? Download this week&rsquo;s PDF.
              </p>
              <ArrowLink href={bulletin.pdfPath}>Bulletin PDF</ArrowLink>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 rounded-2xl border border-line p-6">
            <span className="text-[11px] font-bold tracking-[.16em] uppercase text-muted">
              Kids Closet needs
            </span>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {bulletin.kidsClosetNeeds.map((n) => (
                <li key={n} className="text-[15.5px] leading-[1.5] text-body">
                  {n}
                </li>
              ))}
            </ul>
            <ArrowLink href="/ministries/kids-closet">About Kids Closet</ArrowLink>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-line p-6">
            <span className="text-[11px] font-bold tracking-[.16em] uppercase text-muted">
              Order of worship
            </span>
            <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
              {bulletin.orderOfWorship.map((item) => (
                <li key={item} className="text-[15px] leading-[1.5] text-body">
                  {item}
                </li>
              ))}
            </ol>
          </div>

          <WeeklyRhythm events={recurring} />

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
        </aside>
      </div>
    </div>
  );
}
