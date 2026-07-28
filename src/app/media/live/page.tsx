import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { ImageSlot } from "@/components/ImageSlot";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Live Stream",
  description:
    "Watch Central Church of Christ live from downtown Little Rock — Sunday worship streams at 10:15 AM Central on YouTube.",
};

export default function LivePage() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8 lg:px-14 lg:py-16">
      <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">
        Media · Live
      </span>
      <h1 className="mt-2.5 mb-3 font-display text-[36px] leading-[1] tracking-[-.035em] lg:mb-4 lg:text-[56px] lg:tracking-[-.04em]">
        Watch Central Live
      </h1>
      <p className="m-0 max-w-[680px] text-base leading-[1.65] text-body lg:text-[19px]">
        Can&rsquo;t be with us in person? Worship streams live on YouTube every
        Sunday. Pull up a chair — you&rsquo;re part of the family either way.
      </p>

      <div className="mt-8 overflow-hidden rounded-[18px] border border-line lg:mt-10">
        <ImageSlot
          alt="Live stream player"
          label="youtube live embed"
          variant="dark"
          className="aspect-video w-full"
        />
        <div className="flex flex-col gap-4 bg-surface p-5 sm:flex-row sm:items-center sm:justify-between lg:p-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">
              Next stream
            </span>
            <span className="font-display text-[21px] tracking-[-.015em]">
              Sunday Worship · 10:15 AM Central
            </span>
          </div>
          <Button href={site.socials.youtube} variant="primary">
            Watch on YouTube
          </Button>
        </div>
      </div>
    </div>
  );
}
