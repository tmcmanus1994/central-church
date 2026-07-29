import type { Metadata } from "next";
import { ArrowLink } from "@/components/Button";
import { ImageSlot } from "@/components/ImageSlot";
import { PersonCard, PersonTile } from "@/components/PersonCard";
import { elders, leadMinister, ministryLeaders, staff } from "@/content/people";

export const metadata: Metadata = {
  title: "Our Leadership",
  description:
    "Meet the ministers, elders, and staff of Central Church of Christ in downtown Little Rock.",
};

export default function LeadershipPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-8 lg:px-14 lg:py-16">
      <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">
        Leadership
      </span>
      <h1 className="mt-2.5 mb-6 font-display text-[36px] leading-[1.06] tracking-[-.035em] lg:mb-8 lg:text-[44px]">
        Our Leadership
      </h1>

      {/* Lead Minister feature */}
      <div className="flex flex-col gap-6 rounded-[18px] border border-line bg-surface p-5 lg:flex-row lg:items-center lg:gap-12 lg:p-8">
        <ImageSlot
          src={leadMinister.photo}
          sizes="(min-width: 1024px) 360px, 100vw"
          focus="top"
          alt="Portrait of Steven Hovater"
          label="portrait 4:5"
          className="aspect-[4/5] w-full shrink-0 rounded-[14px] sm:max-w-[320px] lg:w-[360px] lg:max-w-none"
        />
        <div className="flex flex-col gap-3 lg:gap-3.5">
          <span className="text-xs font-bold tracking-[.12em] uppercase text-primary">
            {leadMinister.role}
          </span>
          <h2 className="m-0 font-display text-[24px] tracking-[-.02em] lg:text-[38px] lg:tracking-[-.03em]">
            {leadMinister.name}
          </h2>
          <p className="m-0 max-w-[680px] text-[15.5px] leading-[1.65] text-body text-pretty-wrap lg:text-[17.5px] lg:leading-[1.7]">
            {leadMinister.bio}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <ArrowLink href="/media/live">Watch recent services</ArrowLink>
            {leadMinister.email ? (
              <ArrowLink href={`mailto:${leadMinister.email}`}>
                Email Steven
              </ArrowLink>
            ) : null}
          </div>
        </div>
      </div>

      {/* Ministry leaders */}
      <h2 className="mt-10 mb-5 font-display text-[24px] tracking-[-.025em] lg:mt-14 lg:text-[28px]">
        Ministry Leaders
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {ministryLeaders.map((person) => (
          <PersonCard key={person.name} person={person} />
        ))}
      </div>

      {/* Elders */}
      <h2 className="mt-10 mb-5 font-display text-[24px] tracking-[-.025em] lg:mt-14 lg:text-[28px]">
        Elders
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
        {elders.map((person) => (
          <PersonTile key={person.name} person={person} showRole={false} />
        ))}
      </div>

      {/* Staff */}
      <h2 className="mt-10 mb-5 font-display text-[24px] tracking-[-.025em] lg:mt-14 lg:text-[28px]">
        Staff
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
        {staff.map((person) => (
          <PersonTile key={person.name} person={person} />
        ))}
      </div>
    </div>
  );
}
