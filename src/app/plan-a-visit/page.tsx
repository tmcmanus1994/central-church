import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { ArrowLink } from "@/components/Button";
import { Faq } from "@/components/Faq";
import { ImageSlot } from "@/components/ImageSlot";
import { VisitForm } from "@/components/VisitForm";
import { site, fullAddress } from "@/lib/site";

export const metadata: Metadata = {
  title: "Plan a Visit",
  description:
    "Planning your first visit to Central Church of Christ in downtown Little Rock? Find service times, parking, what to expect, and what's available for kids.",
};

const expectChips = [
  "≈75 minute service",
  "Jeans or suits",
  "Lyrics on screen",
  "Communion weekly",
];

const faqItems = [
  {
    question: "How long is a Central Church service?",
    answer:
      "A Central service runs about 75 minutes. We open with congregational singing — lyrics are projected on screen so you can sing along or simply take it in, whatever feels comfortable. Worship includes songs, church news, communion, and an encouraging message about following Jesus together.",
  },
  {
    question: "What's the culture like at Central Church?",
    answer:
      "Casual and relaxed. Come as you are — jeans are as welcome as suits. Central is a diverse downtown Little Rock congregation, and Sundays feel like a family reunion.",
  },
  {
    question: "What about my kids?",
    answer:
      "We offer kids' classes during worship (following communion) for ages 3–5, with lessons, songs, and games. We want to be accessible for every family — if your child has special needs, let us know and we'll make sure they're cared for.",
  },
];

export default function PlanAVisitPage() {
  return (
    <>
      {/* Hero — image first on mobile, split on desktop */}
      <section className="grid grid-cols-1 lg:grid-cols-2 lg:items-stretch">
        <ImageSlot
          photoKey="visit.hero"
          sizes="(min-width: 1024px) 50vw, 100vw"
          alt="Greeters welcoming visitors at the 6th Street entrance"
          label="greeters at the 6th St entrance"
          className="order-first h-[230px] lg:order-last lg:h-auto lg:min-h-[540px]"
        />
        <div className="flex flex-col justify-center gap-4 px-5 py-7 lg:gap-5 lg:px-14 lg:py-20">
          <span className="hidden text-xs font-bold tracking-[.14em] uppercase text-primary lg:block">
            Plan a Visit
          </span>
          <h1 className="m-0 font-display text-[34px] leading-[1.02] tracking-[-.035em] text-pretty-wrap lg:text-6xl lg:leading-none lg:tracking-[-.04em]">
            Plan Your Visit to Central Church
          </h1>
          <p className="m-0 max-w-[520px] text-base leading-[1.65] text-body text-pretty-wrap lg:text-[19px]">
            We know walking into a new church for the first time can be
            nerve-racking. We want to make your first Sunday at Central in
            downtown Little Rock a great one — here&rsquo;s everything you need
            to know before you arrive.
          </p>
          <div className="mt-1 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
            <Button href="#contact">Let us know you&rsquo;re coming</Button>
            <Button href={site.mapsUrl} variant="outline">
              Get directions
            </Button>
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section className="border-y border-line bg-surface px-5 py-10 lg:px-14 lg:py-20">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div className="flex flex-col gap-3.5 lg:gap-[18px]">
            <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">
              What to expect
            </span>
            <h2 className="m-0 font-display text-[26px] leading-[1.08] tracking-[-.025em] text-pretty-wrap lg:text-[40px] lg:tracking-[-.03em]">
              One big reunion — come as you are
            </h2>
            <p className="m-0 text-base leading-[1.65] text-body text-pretty-wrap lg:text-[18.5px]">
              Sundays at Central are exciting, casual, and relaxed — one big
              reunion where you come as you are. You&rsquo;ll be welcomed as our
              guest the moment you walk in the door.
            </p>
            <div className="mt-1 flex flex-wrap gap-2 lg:gap-3">
              {expectChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-line bg-white px-3.5 py-2 text-[13.5px] font-semibold lg:px-[15px] lg:py-[9px] lg:text-[14.5px]"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
          <ImageSlot
            photoKey="visit.worship"
            sizes="(min-width: 1024px) 50vw, 100vw"
            alt="The congregation singing during Sunday worship"
            label="worship photo · wide, warm"
            className="aspect-[16/10] w-full rounded-2xl"
          />
        </div>
      </section>

      {/* Service times & location */}
      <section className="mx-auto max-w-[1440px] px-5 py-10 lg:px-14 lg:py-20">
        <h2 className="m-0 mb-6 font-display text-[26px] tracking-[-.025em] lg:mb-8 lg:text-[40px] lg:tracking-[-.03em]">
          Service Times &amp; Location
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_1.2fr] lg:gap-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-line p-6 lg:p-7">
            <span className="text-[11px] font-bold tracking-[.16em] uppercase text-muted">
              Times
            </span>
            <div className="flex flex-col gap-3 text-[15.5px] lg:text-[16.5px]">
              {site.serviceTimes.map((t, i) => (
                <div
                  key={t.label}
                  className={`flex justify-between gap-4 ${
                    i < site.serviceTimes.length - 1
                      ? "border-b border-line pb-3"
                      : ""
                  }`}
                >
                  <span>{t.label}</span>
                  <span className="font-bold">{t.when}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-2xl border border-teal-border bg-teal-50 p-6 lg:p-7">
            <span className="text-[11px] font-bold tracking-[.16em] uppercase text-teal-muted">
              Where to park
            </span>
            <ImageSlot
              photoKey="visit.parking"
              sizes="(min-width: 1024px) 25vw, 100vw"
              alt="Diagram of parking around the Central building"
              label="parking diagram (keep current)"
              variant="teal"
              className="aspect-square w-full rounded-xl"
            />
            <p className="m-0 text-[15.5px] leading-[1.6] text-teal-ink">
              Free lot on the west side of the building off W 6th St, plus
              street parking. Enter through the doors under the awning —
              greeters are there.
            </p>
          </div>
          <div className="flex flex-col gap-4 rounded-2xl border border-line p-6 lg:p-7">
            <span className="text-[11px] font-bold tracking-[.16em] uppercase text-muted">
              Find us
            </span>
            <iframe
              title={`Map showing ${fullAddress}`}
              src={site.mapEmbedUrl}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-square w-full rounded-xl border-0"
            />
            <p className="m-0 text-[16.5px] leading-[1.6]">
              {site.address.street}
              <br />
              {site.address.city}, {site.address.state} {site.address.zip}
              <br />
              <a href={site.phoneHref} className="font-bold text-primary no-underline">
                {site.phone}
              </a>
            </p>
            <ArrowLink href={site.mapsUrl}>Open in Maps</ArrowLink>
          </div>
        </div>
      </section>

      {/* Kids & accessibility */}
      <section className="mx-auto max-w-[1440px] px-5 pb-10 lg:px-14 lg:pb-20">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          <div className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-6 sm:flex-row lg:p-8">
            <ImageSlot
              photoKey="visit.kids"
              sizes="160px"
              alt="A kids' Bible class in the Central Kids wing"
              label="kids class"
              className="aspect-[4/5] w-full shrink-0 rounded-xl sm:w-[160px]"
            />
            <div className="flex flex-col gap-2.5">
              <h3 className="m-0 font-display text-[21px] tracking-[-.02em] lg:text-[26px]">
                What about my kids?
              </h3>
              <p className="m-0 text-base leading-[1.6] text-body">
                Kids&rsquo; classes run during worship (right after communion)
                for ages 3–5, with lessons, songs, and games. Check-in is in the
                Central Kids wing.
              </p>
              <ArrowLink href="/ministries/children" className="mt-auto text-[15.5px]">
                Central Kids
              </ArrowLink>
            </div>
          </div>
          <div className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-6 sm:flex-row lg:p-8">
            <ImageSlot
              photoKey="visit.accessibility"
              sizes="160px"
              alt="The accessible entrance to the building"
              label="accessible entry"
              className="aspect-[4/5] w-full shrink-0 rounded-xl sm:w-[160px]"
            />
            <div className="flex flex-col gap-2.5">
              <h3 className="m-0 font-display text-[21px] tracking-[-.02em] lg:text-[26px]">
                Accessibility
              </h3>
              <p className="m-0 text-base leading-[1.6] text-body">
                We want to be accessible for every family. If your child has
                special needs, let us know and we&rsquo;ll make sure they&rsquo;re
                cared for.
              </p>
              <ArrowLink href="#contact" className="mt-auto text-[15.5px]">
                Resources for families
              </ArrowLink>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-line bg-surface px-5 py-10 lg:px-14 lg:py-20">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 lg:grid-cols-[.85fr_1.15fr] lg:gap-16">
          <h2 className="m-0 font-display text-[26px] leading-[1.08] tracking-[-.025em] lg:text-[40px] lg:tracking-[-.03em]">
            Frequently Asked Questions
          </h2>
          <Faq items={faqItems} />
        </div>
      </section>

      {/* Contact form */}
      <section id="contact" className="bg-primary-deep px-5 py-10 text-white lg:px-14 lg:py-20">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="flex flex-col gap-3.5 lg:gap-4">
            <span className="text-[11px] font-bold tracking-[.14em] uppercase text-teal-light lg:text-xs">
              Let us know you&rsquo;re coming
            </span>
            <h2 className="m-0 font-display text-[26px] leading-[1.06] tracking-[-.025em] text-pretty-wrap lg:text-[44px] lg:tracking-[-.03em]">
              Ready to visit Central in person?
            </h2>
            <p className="m-0 max-w-[420px] text-[15.5px] leading-[1.6] text-teal-pale lg:text-[18.5px]">
              We can&rsquo;t wait to meet you. Fill out the form and we&rsquo;ll
              be looking for you on Sunday.
            </p>
          </div>
          <VisitForm />
        </div>
      </section>
    </>
  );
}
