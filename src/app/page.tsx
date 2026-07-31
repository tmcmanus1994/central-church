import Link from "next/link";
import { ArrowLink, Button } from "@/components/Button";
import { EventCard } from "@/components/EventCard";
import { ImageSlot } from "@/components/ImageSlot";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { SpotlightBanner } from "@/components/SpotlightBanner";
import { WeeklyRhythm } from "@/components/WeeklyRhythm";
import { getCalendar, getCalendarSpotlight } from "@/lib/calendar";
import { ministries } from "@/content/ministries";
import { blogPosts } from "@/content/blog";
import { latestSermon } from "@/content/media";
import { site, youtubeLiveUrl } from "@/lib/site";

const ministryTiles = [
  { slug: "children", photo: true, photoKey: "home.tile.children" },
  { slug: "teens", photo: true, photoKey: "home.tile.teens" },
  { slug: "life-groups", photo: true, photoKey: "home.tile.life-groups" },
  { slug: "iglesia", photo: false },
  { slug: "kids-closet", photo: false },
  { slug: "freedom-prayer", photo: false },
] as const;

/** Events come from Google Calendar; re-checked every 15 minutes. */
export const revalidate = 900;

export default async function HomePage() {
  const [{ recurring, upcoming }, spotlight] = await Promise.all([
    getCalendar(),
    getCalendarSpotlight(),
  ]);
  const thisWeek = upcoming.filter((e) => e.slug !== spotlight?.slug).slice(0, 4);
  const latestPost = blogPosts[0];

  return (
    <>
      {/* Hero — service times above the fold is non-negotiable */}
      <section className="relative flex min-h-[540px] items-stretch lg:min-h-[700px]">
        <ImageSlot
          photoKey="home.hero"
          priority
          focus="top"
          sizes="100vw"
          alt="The Central congregation gathered for worship"
          label="hero photo or 8s loop · congregation, wide, warm light"
          variant="dark"
          className="absolute inset-0"
        />
        <div className="relative flex w-full flex-1 items-center justify-center bg-gradient-to-t from-[#101315]/85 via-[#101315]/25 to-[#101315]/10 px-5 py-14 lg:px-14 lg:py-16">
          {/* Headline and service times stack, centred on both axes. */}
          <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-7 text-center lg:gap-8">
            <div className="flex max-w-[760px] flex-col items-center gap-4 lg:gap-[22px]">
              <p className="m-0 text-[11px] font-bold tracking-[.16em] uppercase text-teal-light lg:text-xs">
                Downtown Little Rock, Arkansas
              </p>
              <h1 className="m-0 font-display text-[42px] leading-[.98] font-bold tracking-[-.035em] text-white lg:text-[82px] lg:tracking-[-.04em]">
                {site.tagline}
              </h1>
              <p className="m-0 max-w-[600px] text-base leading-[1.5] text-[#DCE4E7] text-pretty-wrap lg:text-xl">
                A downtown Little Rock church made of imperfect people striving
                to love God and love others every day.
              </p>
              <div className="mt-1 flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:gap-3">
                <Button href="/plan-a-visit">Plan a Visit</Button>
                <Button href="/media/live" variant="outline-light">
                  Watch Live
                </Button>
              </div>
            </div>
            <div className="hidden w-full max-w-[400px] flex-col gap-3 rounded-[14px] border border-white/20 bg-white/10 px-6 py-5 text-left backdrop-blur-sm lg:flex">
              <span className="text-[11px] font-bold tracking-[.16em] uppercase text-teal-light">
                This Sunday
              </span>
              <div className="flex flex-col gap-2 text-[15.5px] text-white">
                {site.serviceTimes.slice(0, 3).map((t) => (
                  <div key={t.label} className="flex justify-between gap-5">
                    <span>{t.short}</span>
                    <span className="font-bold">{t.when}</span>
                  </div>
                ))}
                <div className="flex justify-between gap-5 border-t border-white/20 pt-2">
                  <span>Wednesday Classes</span>
                  <span className="font-bold">6:30 PM</span>
                </div>
              </div>
              <span className="text-sm leading-[1.5] text-[#C4D2D8]">
                {site.address.street}
                <br />
                {site.address.city}, {site.address.state} {site.address.zip}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile service-times card (the desktop hero card, stacked) */}
      <section className="flex flex-col gap-2.5 border-b border-teal-border bg-teal-50 p-5 lg:hidden">
        <span className="text-[11px] font-bold tracking-[.14em] uppercase text-primary-deep">
          This Sunday
        </span>
        <div className="flex flex-col gap-[7px] text-[15px] text-ink">
          {site.serviceTimes.map((t, i) => (
            <div
              key={t.label}
              className={`flex justify-between ${i === 3 ? "border-t border-[#D0DEE4] pt-[7px]" : ""}`}
            >
              <span>{t.short}</span>
              <span className="font-bold">{t.when}</span>
            </div>
          ))}
        </div>
        <a
          href={site.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[14.5px] font-bold text-primary-deep no-underline"
        >
          Directions to {site.address.street} →
        </a>
      </section>

      {/* Spotlight — automation-fed; renders nothing when there's no feature */}
      <SpotlightBanner event={spotlight} />

      {/* Welcome */}
      <Reveal as="section" className="mx-auto max-w-[1440px] px-5 pt-10 pb-7 lg:px-14 lg:pt-[88px] lg:pb-8">
        <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">
          Welcome
        </span>
        <h2 className="mt-2.5 mb-0 max-w-[560px] font-display text-[30px] leading-[1.08] tracking-[-.03em] text-pretty-wrap lg:mt-[18px] lg:text-[44px]">
          A Church in the Heart of Little Rock
        </h2>
        <p className="mt-4 mb-0 max-w-[840px] text-base leading-[1.65] text-body text-pretty-wrap lg:mt-5 lg:text-[19px]">
          Welcome to Central Church of Christ in downtown Little Rock, Arkansas.
          Our mission is to follow Jesus together as a diverse congregation that
          reflects our community. Join us for Bible classes Sunday mornings at
          9:15, worship at 10:15 AM, Spanish-language worship at 1:30 PM, and
          midweek classes Wednesdays at 6:30 PM. Whoever you are and wherever
          you&rsquo;re starting from, there&rsquo;s a place for you here.
        </p>
      </Reveal>

      {/* This Week at Central — automation-fed */}
      <Reveal as="section" className="mx-auto max-w-[1440px] px-5 pt-7 pb-10 lg:px-14 lg:pt-14 lg:pb-[88px]">
        <SectionHeader
          eyebrow="Automation-fed"
          title="This Week at Central"
          action={{ label: "See all events", href: "/events" }}
          rule
        />
        {/* Mobile: horizontal snap carousel · Desktop: 4-up grid — same card */}
        <div className="snap-row no-scrollbar -mx-5 mt-6 flex gap-3.5 overflow-x-auto px-5 lg:mx-0 lg:mt-8 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0">
          {thisWeek.map((event, i) => (
            <Reveal
              key={event.slug}
              delay={i * 80}
              className="w-[250px] shrink-0 lg:w-auto"
            >
              <EventCard event={event} />
            </Reveal>
          ))}
        </div>
        <div className="mt-6 lg:mt-10">
          <WeeklyRhythm events={recurring} columns />
        </div>
      </Reveal>

      {/* New here? */}
      <Reveal as="section" className="grid grid-cols-1 bg-primary-deep text-white lg:grid-cols-2">
        <ImageSlot
          photoKey="home.welcome"
          sizes="(min-width: 1024px) 50vw, 100vw"
          alt="A greeter welcoming a first-time visitor in the lobby"
          label="first-time visitor photo · lobby welcome"
          variant="navy"
          /**
           * Aspect-locked at every width. Left to stretch, the half-column
           * grows as wide as the screen while the text beside it sets a short
           * height, and the photo reads as a letterbox strip on large
           * displays. `min-h-full` still lets it fill the row if the text
           * happens to run taller.
           */
          className="aspect-[4/3] w-full lg:aspect-[3/2] lg:min-h-full lg:self-start"
        />
        <div className="flex flex-col justify-center gap-3.5 px-5 py-8 lg:gap-[22px] lg:px-16 lg:py-[72px]">
          <span className="text-[11px] font-bold tracking-[.14em] uppercase text-teal-light lg:text-xs">
            New here?
          </span>
          <h2 className="m-0 font-display text-[30px] leading-[1.06] tracking-[-.03em] text-pretty-wrap lg:text-[44px]">
            New to Central? We&rsquo;d Love to Meet You
          </h2>
          <p className="m-0 max-w-[460px] text-base leading-[1.6] text-teal-pale text-pretty-wrap lg:text-[18.5px]">
            Visiting a church for the first time can feel intimidating — we get
            it. Central is casual, warm, and glad you&rsquo;re here. Come as you
            are, and we&rsquo;ll help with the rest.
          </p>
          <div className="mt-1 self-stretch sm:self-start">
            <Button href="/plan-a-visit" variant="white" full>
              Plan Your First Visit
            </Button>
          </div>
        </div>
      </Reveal>

      {/* Ministries strip */}
      <Reveal as="section" className="mx-auto max-w-[1440px] px-5 py-10 lg:px-14 lg:py-[88px]">
        <SectionHeader
          title="Find your place"
          action={{ label: "All ministries", href: "/ministries" }}
        />
        <div className="mt-5 grid grid-cols-2 gap-3 lg:mt-8 lg:grid-cols-3 lg:gap-5">
          {ministryTiles.map((tile, i) => {
            const ministry = ministries.find((m) => m.slug === tile.slug)!;
            const href =
              ministry.slug === "iglesia" ? "/iglesia" : `/ministries/${ministry.slug}`;
            return tile.photo ? (
              <Reveal key={ministry.slug} delay={i * 60}>
                <Link
                  href={href}
                  className="relative flex h-[120px] items-end overflow-hidden rounded-[14px] p-3.5 no-underline lg:h-[260px] lg:rounded-2xl lg:p-6"
                >
                  <ImageSlot
                    photoKey={tile.photoKey}
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    alt=""
                    className="absolute inset-0"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-coal/70 to-transparent"
                  />
                  <span className="relative flex flex-col gap-1">
                    <span className="font-display text-lg tracking-[-.02em] text-white lg:text-2xl">
                      {ministry.shortName}
                    </span>
                    <span className="hidden text-[14.5px] text-[#DCD6CC] lg:block">
                      {ministry.tileBlurb}
                    </span>
                  </span>
                </Link>
              </Reveal>
            ) : (
              <Reveal key={ministry.slug} delay={i * 60}>
                <Link
                  href={href}
                  className={`flex h-[120px] flex-col gap-2 rounded-[14px] border p-3.5 no-underline lg:h-[260px] lg:rounded-2xl lg:p-6 ${
                    ministry.slug === "kids-closet"
                      ? "border-teal-border bg-teal-50"
                      : "border-line bg-surface"
                  }`}
                >
                  <span className="font-display text-lg tracking-[-.02em] text-ink lg:text-[22px]">
                    {ministry.shortName}
                  </span>
                  <span className="hidden text-[14.5px] leading-[1.5] text-body lg:block">
                    {ministry.tileBlurb}
                  </span>
                  <span className="mt-auto hidden text-[14.5px] font-bold text-primary lg:block">
                    {ministry.lang === "es" ? "Conócenos" : "Learn more"} →
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Reveal>

      {/* Latest media */}
      <Reveal as="section" className="mx-auto max-w-[1440px] px-5 pb-12 lg:px-14 lg:pb-24">
        <SectionHeader title="Latest from Central" rule />
        <div className="mt-6 grid grid-cols-1 gap-4 lg:mt-8 lg:grid-cols-[1.6fr_1fr] lg:gap-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-line p-4 lg:flex-row lg:gap-6 lg:p-6">
            <ImageSlot
              photoKey="home.sermon"
              sizes="(min-width: 1024px) 300px, 100vw"
              alt=""
              label="sermon thumbnail"
              className="aspect-[16/10] w-full shrink-0 rounded-xl lg:w-[300px]"
            />
            <div className="flex flex-col gap-2.5">
              <span className="text-[11px] font-bold tracking-[.1em] uppercase text-primary lg:text-xs">
                Latest service ·{" "}
                {new Intl.DateTimeFormat("en-US", {
                  timeZone: "America/Chicago",
                  month: "long",
                  day: "numeric",
                }).format(new Date(latestSermon.date))}
              </span>
              <h3 className="m-0 font-display text-[21px] leading-[1.15] tracking-[-.02em] lg:text-[26px]">
                {latestSermon.title}
              </h3>
              <span className="text-[14.5px] text-muted lg:text-[15px]">
                {latestSermon.speaker} · {latestSermon.duration}
              </span>
              <div className="mt-auto flex flex-col gap-2.5 pt-2 sm:flex-row">
                <Button href={youtubeLiveUrl} size="md">
                  Watch on YouTube
                </Button>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2.5 rounded-2xl border border-line bg-surface p-5 lg:p-6">
            <span className="text-xs font-bold tracking-[.1em] uppercase text-primary">
              From the blog
            </span>
            <h3 className="m-0 font-display text-[21px] leading-[1.18] tracking-[-.02em] text-pretty-wrap lg:text-2xl">
              {latestPost.title}
            </h3>
            <p className="m-0 text-[15px] leading-[1.6] text-body">
              {latestPost.excerpt}
            </p>
            <ArrowLink
              href={`/blog/${latestPost.slug}`}
              className="mt-auto text-[15px]"
            >
              Read the post
            </ArrowLink>
          </div>
        </div>
      </Reveal>
    </>
  );
}
