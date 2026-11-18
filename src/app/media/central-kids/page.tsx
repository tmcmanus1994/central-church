import type { Metadata } from "next";
import { ArrowLink } from "@/components/Button";
import { kidsReels, kidsReelYears } from "@/content/kids-reels";
import { getVimeoThumbnails } from "@/lib/vimeo";
import { KidsReelGallery } from "./KidsReelGallery";

export const metadata: Metadata = {
  title: "Central Kids Reels",
  description:
    "Monthly video reels celebrating what the kids at Central Church of Christ have been up to — their milestones, achievements, and everyday moments.",
};

/** Posters come from Vimeo on a daily cache; a miss just shows the flat play tile. */
export const revalidate = 86_400;

export default async function CentralKidsReelsPage() {
  const thumbnails = await getVimeoThumbnails(kidsReels);
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-8 lg:px-14 lg:py-16">
      <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">
        Media · Central Kids
      </span>
      <h1 className="mt-2.5 mb-3 font-display text-[36px] leading-[1] tracking-[-.035em] lg:mb-4 lg:text-6xl lg:tracking-[-.04em]">
        Central Kids Reels
      </h1>
      <p className="m-0 max-w-[720px] text-base leading-[1.65] text-body text-pretty-wrap lg:text-[19px]">
        A short video each month celebrating what our kids have been up to —
        the milestones, the achievements, and the everyday moments worth
        remembering. Tap one to watch, or share it with family who&rsquo;d love
        to see.
      </p>
      <div className="mt-4">
        <ArrowLink href="/ministries/children">About Central Kids</ArrowLink>
      </div>

      <KidsReelGallery years={kidsReelYears} reels={kidsReels} thumbnails={thumbnails} />
    </div>
  );
}
