import type { Metadata } from "next";
import Link from "next/link";
import { ministries } from "@/content/ministries";

export const metadata: Metadata = {
  title: "Ministries",
  description:
    "Find your place at Central Church of Christ in downtown Little Rock — Central Kids, Central Teens, Life Groups, Iglesia, Kids Closet, and Freedom Prayer.",
};

export default function MinistriesPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-8 lg:px-14 lg:py-16">
      <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">
        Ministries
      </span>
      <h1 className="mt-2.5 mb-3 font-display text-[36px] leading-[1] tracking-[-.035em] lg:mb-4 lg:text-6xl lg:tracking-[-.04em]">
        Find your place
      </h1>
      <p className="m-0 max-w-[720px] text-base leading-[1.65] text-body text-pretty-wrap lg:text-[19px]">
        Sunday morning is only the beginning. Central&rsquo;s ministries serve
        every age and stage — and our neighbors across Little Rock.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-5">
        {ministries.map((ministry) => (
          <Link
            key={ministry.slug}
            href={
              ministry.slug === "iglesia"
                ? "/iglesia"
                : `/ministries/${ministry.slug}`
            }
            className="flex min-h-[180px] flex-col gap-2 rounded-2xl border border-line bg-surface p-6 no-underline transition-colors hover:border-teal-border hover:bg-teal-50/60"
          >
            <span className="font-display text-[22px] tracking-[-.02em] text-ink">
              {ministry.shortName}
            </span>
            <span
              lang={ministry.lang}
              className="text-[14.5px] leading-[1.5] text-body"
            >
              {ministry.tileBlurb}
            </span>
            <span className="mt-auto text-[14.5px] font-bold text-primary">
              {ministry.lang === "es" ? "Conócenos" : "Learn more"} →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
