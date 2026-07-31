import type { Metadata } from "next";
import { ImageSlot } from "@/components/ImageSlot";
import { Reveal } from "@/components/Reveal";
import type { PhotoKey } from "@/content/photos";
import { missionaries } from "@/content/people";

export const metadata: Metadata = {
  title: "Missionaries We Support",
  description:
    "Central Church of Christ supports mission work around the world — meet the Bills family at Heritage Christian University and the Daggetts in Arequipa, Peru.",
};

export default function MissionariesPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-8 lg:px-14 lg:py-16">
      <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">
        About · Missions
      </span>
      <h1 className="mt-2.5 mb-3 font-display text-[36px] leading-[1] tracking-[-.035em] lg:mb-4 lg:text-6xl lg:tracking-[-.04em]">
        Our Missionaries
      </h1>
      <p className="m-0 max-w-[720px] text-base leading-[1.65] text-body text-pretty-wrap lg:text-[19px]">
        Central supports mission work around the world — from theological
        education in Africa to house churches and community development in
        Peru.
      </p>

      <div className="mt-8 flex flex-col gap-8 lg:mt-12 lg:gap-12">
        {missionaries.map((team, i) => (
          <Reveal as="section"
            key={team.slug}
            className={`grid grid-cols-1 gap-6 rounded-[18px] border border-line p-5 lg:grid-cols-2 lg:items-center lg:gap-12 lg:p-10 ${
              i % 2 === 1 ? "bg-surface" : ""
            }`}
          >
            <ImageSlot
              photoKey={`missionaries.${team.slug}` as PhotoKey}
              sizes="(min-width: 1024px) 50vw, 100vw"
              alt={`The ${team.heading.replace("Meet the ", "")} family`}
              label="family photo"
              className={`aspect-[5/3] w-full rounded-2xl ${
                i % 2 === 1 ? "lg:order-last" : ""
              }`}
            />
            <div className="flex flex-col gap-4">
              <h2 className="m-0 font-display text-[26px] tracking-[-.025em] lg:text-4xl lg:tracking-[-.03em]">
                {team.heading}
              </h2>
              {team.paragraphs.map((p) => (
                <p
                  key={p.slice(0, 32)}
                  className="m-0 text-base leading-[1.7] text-body text-pretty-wrap lg:text-[17px]"
                >
                  {p}
                </p>
              ))}
              <div className="mt-1 flex flex-wrap gap-x-6 gap-y-2">
                {team.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] font-bold text-primary no-underline hover:text-primary-deep"
                  >
                    {link.label} →
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
