import type { Metadata } from "next";
import { ArrowLink } from "@/components/Button";
import { ImageSlot } from "@/components/ImageSlot";

export const metadata: Metadata = {
  title: "About Central Church of Christ | Our History & Mission",
  description:
    "Central Church of Christ has served downtown Little Rock for generations. Learn our history and our mission: Follow Jesus Together.",
};

const mission = [
  {
    word: "Follow",
    line: "We're learning to walk the way Jesus walked — together, at whatever pace each of us is moving.",
  },
  {
    word: "Jesus",
    line: "Not a program or a personality. Scripture, communion, and the person of Christ sit at the center of everything we do.",
  },
  {
    word: "Together",
    line: "Different backgrounds, cultures, ages, and perspectives in one downtown congregation — on purpose.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-[1440px] border-b border-line px-5 pt-8 pb-8 lg:px-14 lg:pt-[72px] lg:pb-14">
        <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">
          About
        </span>
        <h1 className="mt-2.5 mb-0 max-w-[900px] font-display text-[34px] leading-[1.02] tracking-[-.035em] lg:mt-3.5 lg:text-[64px] lg:leading-none lg:tracking-[-.04em]">
          About Central Church of Christ
        </h1>
      </section>

      {/* Our story */}
      <section className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-5 py-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-14 lg:px-14 lg:py-16">
        <h2 className="m-0 font-display text-[26px] leading-[1.08] tracking-[-.025em] lg:text-4xl lg:tracking-[-.03em]">
          Our Story
        </h2>
        <div className="flex max-w-[760px] flex-col gap-5 lg:gap-[22px]">
          <p className="m-0 text-[17px] leading-[1.6] text-ink text-pretty-wrap lg:text-[21px] lg:leading-[1.65]">
            Central Church of Christ is a body made of imperfect people striving
            to love God and love others every day. This singular body — as the
            Apostle Paul describes in Romans 12 — is made of many members.
          </p>
          <p className="m-0 text-base leading-[1.7] text-body text-pretty-wrap lg:text-[17.5px] lg:leading-[1.75]">
            At Central you&rsquo;ll find people from different backgrounds,
            cultures, ages, interests, and perspectives, gathered on the 800
            block of West Sixth Street in downtown Little Rock, Arkansas.
          </p>
          <p className="m-0 text-base leading-[1.7] text-body text-pretty-wrap lg:text-[17.5px] lg:leading-[1.75]">
            Our family is joyful to be together, excited to worship God, and
            deeply interested in how His Word continues to speak today. In an
            age of dissension and separatism, we celebrate the mission Central
            was built on: coming together in the uniting love of Jesus Christ.
          </p>
          <ImageSlot
            alt="The Central congregation gathered together"
            label="congregation photo · archival or current"
            className="mt-2 h-[200px] rounded-2xl lg:mt-3 lg:h-[340px]"
          />
        </div>
      </section>

      {/* FOLLOW / JESUS / TOGETHER — the strongest brand element, kept as a designed moment */}
      <section className="bg-primary-deep px-5 py-10 text-white lg:px-14 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <span className="text-[11px] font-bold tracking-[.16em] uppercase text-teal-light lg:text-xs">
            Our mission
          </span>
          <div className="mt-6 grid grid-cols-1 gap-6 lg:mt-8 lg:grid-cols-3 lg:gap-10">
            {mission.map((m, i) => (
              <div
                key={m.word}
                className={`flex flex-col gap-2 lg:gap-3.5 ${
                  i < mission.length - 1
                    ? "lg:border-r lg:border-white/20 lg:pr-8"
                    : ""
                }`}
              >
                <span className="font-display text-[46px] leading-[.94] tracking-[-.04em] lg:text-[76px] lg:leading-[.9]">
                  {m.word}
                </span>
                <p className="m-0 text-[15.5px] leading-[1.6] text-teal-pale lg:text-[17px] lg:leading-[1.65]">
                  {m.line}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Go deeper */}
      <section className="mx-auto grid max-w-[1440px] grid-cols-1 gap-4 px-5 py-10 sm:grid-cols-3 lg:gap-6 lg:px-14 lg:py-16">
        {[
          {
            title: "Our Leadership",
            blurb: "Meet the ministers, elders, and staff of Central.",
            href: "/about/leadership",
            label: "Meet the team",
          },
          {
            title: "Our Missionaries",
            blurb:
              "Central supports mission work from Heritage Christian University to Arequipa, Peru.",
            href: "/about/missionaries",
            label: "Meet our missionaries",
          },
          {
            title: "Plan a Visit",
            blurb: "The best way to know Central is a Sunday morning with us.",
            href: "/plan-a-visit",
            label: "Plan your visit",
          },
        ].map((card) => (
          <div
            key={card.href}
            className="flex flex-col gap-2.5 rounded-2xl border border-line bg-surface p-6 lg:p-7"
          >
            <h2 className="m-0 font-display text-[22px] tracking-[-.02em]">
              {card.title}
            </h2>
            <p className="m-0 text-[15.5px] leading-[1.6] text-body">
              {card.blurb}
            </p>
            <ArrowLink href={card.href} className="mt-auto text-[15px]">
              {card.label}
            </ArrowLink>
          </div>
        ))}
      </section>
    </>
  );
}
