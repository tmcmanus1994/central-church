import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { SafetyReportForm } from "@/components/SafetyReportForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Safety at Central",
  description:
    "Central Church of Christ's commitment to a safe environment for kids and adults, and how to report a concern to our Safe Team — by form or by email.",
};

export default function SafetyPage() {
  return (
    <>
      <Reveal as="section" className="mx-auto max-w-[1440px] border-b border-line px-5 pt-8 pb-8 lg:px-14 lg:pt-[72px] lg:pb-14">
        <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">
          Safety
        </span>
        <h1 className="mt-2.5 mb-0 max-w-[900px] font-display text-[34px] leading-[1.02] tracking-[-.035em] lg:mt-3.5 lg:text-6xl lg:leading-none lg:tracking-[-.04em]">
          Keeping Central Safe
        </h1>
        <p className="m-0 mt-5 max-w-[720px] text-[17px] leading-[1.6] text-ink text-pretty-wrap lg:mt-6 lg:text-[21px]">
          Any time you gather a group of people together — a church, a school,
          anywhere — you have to be willing to do the uncomfortable work of
          keeping it safe. That&rsquo;s not a side project for us. It&rsquo;s
          a priority.
        </p>
      </Reveal>

      {/* Why this matters */}
      <Reveal as="section" className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-5 py-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-14 lg:px-14 lg:py-16">
        <h2 className="m-0 font-display text-[26px] leading-[1.08] tracking-[-.025em] lg:text-4xl lg:tracking-[-.03em]">
          Why this matters to us
        </h2>
        <div className="flex max-w-[760px] flex-col gap-5 lg:gap-[22px]">
          <p className="m-0 text-[17px] leading-[1.6] text-ink text-pretty-wrap lg:text-[21px] lg:leading-[1.65]">
            The church globally has had to reckon with what happens when
            safety isn&rsquo;t taken seriously — and we don&rsquo;t want to
            look away from that. Protecting each other isn&rsquo;t just about
            avoiding legal or insurance trouble. It&rsquo;s because every
            person here carries real dignity, and when we protect one
            another, we honor that.
          </p>
          <p className="m-0 text-base leading-[1.7] text-body text-pretty-wrap lg:text-[17.5px] lg:leading-[1.75]">
            We&rsquo;ve worked to rethink how we handle safety in Central
            Kids — new background-check processes, and training that
            specifically looks for signs of grooming and other warning signs,
            not just after-the-fact problems.
          </p>
          <p className="m-0 text-base leading-[1.7] text-body text-pretty-wrap lg:text-[17.5px] lg:leading-[1.75]">
            And this isn&rsquo;t only about children. Adults can be put in
            vulnerable places too. So we&rsquo;ve built a way to report not
            just abusive behavior, but the behavior that comes before
            it — the moments that make someone feel uncomfortable or unsafe,
            before they ever become something worse.
          </p>
          <p className="m-0 text-base leading-[1.7] text-body text-pretty-wrap lg:text-[17.5px] lg:leading-[1.75]">
            That&rsquo;s what our Safe Team is for — a small group set apart
            specifically to receive these reports and follow up on them, so
            nothing gets swept under the rug or forgotten. The Safe Team is
            separate from the security team you see on Sunday mornings,
            though the two work together.
          </p>
          <p className="m-0 text-base leading-[1.7] text-body text-pretty-wrap lg:text-[17.5px] lg:leading-[1.75]">
            We know a page like this can feel awkward to read, and reporting
            something can feel even more uncomfortable. But if we avoid the
            uncomfortable conversations because they&rsquo;re uncomfortable,
            people get hurt. We&rsquo;d rather do this work — even
            imperfectly, even when it&rsquo;s hard — than let something go
            unaddressed. We want Central to be a safe place, for kids and
            adults alike.
          </p>
        </div>
      </Reveal>

      {/* Report — form or email, equal footing */}
      <Reveal as="section" className="bg-primary-deep px-5 py-10 text-white lg:px-14 lg:py-16">
        <div className="mx-auto max-w-[1440px]">
          <span className="text-[11px] font-bold tracking-[.16em] uppercase text-teal-light lg:text-xs">
            Report a concern
          </span>
          <h2 className="mt-2.5 mb-3 font-display text-[26px] leading-[1.06] tracking-[-.025em] text-pretty-wrap lg:mt-3.5 lg:text-[44px] lg:tracking-[-.03em]">
            However feels easiest for you
          </h2>
          <p className="m-0 max-w-[640px] text-[15.5px] leading-[1.6] text-teal-pale lg:text-[18.5px]">
            Use the form below if you&rsquo;d like to walk through it
            question by question, or write to us directly if you&rsquo;d
            rather explain it in your own words. Either way reaches the same
            Safe Team, and you&rsquo;re welcome to stay anonymous.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-start lg:gap-10">
            <SafetyReportForm />

            <div className="flex flex-col gap-4 rounded-[18px] border border-white/20 bg-white/5 p-6 lg:p-8">
              <span className="text-[11px] font-bold tracking-[.16em] uppercase text-teal-light">
                Prefer to email?
              </span>
              <p className="m-0 text-[15.5px] leading-[1.6] text-teal-pale">
                Write to us directly and tell us what happened in your own
                words. This reaches the Safe Team the same way the form does.
              </p>
              <a
                href={`mailto:${site.safetyEmail}`}
                className="inline-flex h-14 items-center justify-center rounded-full border-[1.5px] border-white px-6 text-base font-bold text-white no-underline hover:bg-white/10"
              >
                {site.safetyEmail}
              </a>
              <p className="m-0 mt-2 text-[14px] leading-[1.6] text-teal-pale">
                You can also talk to any staff member or elder in person —
                we&rsquo;ll make sure it gets to the right people.
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </>
  );
}
