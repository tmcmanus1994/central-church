import type { Metadata } from "next";
import { ArrowLink } from "@/components/Button";
import { ImageSlot } from "@/components/ImageSlot";
import { PersonCard, PersonChip, StaffRow } from "@/components/PersonCard";
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
      <div className="flex flex-col gap-6 rounded-[18px] border border-line bg-surface p-5 lg:flex-row lg:items-center lg:gap-10 lg:p-8">
        <ImageSlot
          alt="Portrait of Steven Hovater"
          label="portrait 3:4"
          className="h-[240px] w-full shrink-0 rounded-[14px] lg:h-[340px] lg:w-[300px]"
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
          <ArrowLink href="/media/podcast">Listen to recent sermons</ArrowLink>
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

      {/* Elders + staff */}
      <div className="mt-10 grid grid-cols-1 gap-10 lg:mt-14 lg:grid-cols-2 lg:gap-12">
        <div>
          <h2 className="m-0 mb-[18px] font-display text-[24px] tracking-[-.025em] lg:text-[28px]">
            Elders
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {elders.map((name) => (
              <PersonChip key={name} name={name} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="m-0 mb-[18px] font-display text-[24px] tracking-[-.025em] lg:text-[28px]">
            Staff
          </h2>
          <div className="flex flex-col gap-3">
            {staff.map((person) => (
              <StaffRow key={person.name} person={person} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
