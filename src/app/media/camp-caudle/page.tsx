import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { ArrowLink } from "@/components/Button";
import { campVideos, campYears } from "@/content/camp-caudle";
import { CampGallery } from "./CampGallery";

export const metadata: Metadata = {
  title: "Camp Caudle Videos",
  description:
    "Every Camp Caudle video from Central Teens — daily recaps, Thunderdome, Paint War, and Slip 'n Slide, gathered by year.",
};

/**
 * Thumbnails live in public/photos/camp-caudle/{slug}.jpg — dropping one in
 * with the right slug is all it takes to give a video a poster image; a
 * video with no matching file just keeps the flat placeholder, so a future
 * CMS import never breaks this page.
 */
function readThumbnailSlugs(): string[] {
  const dir = path.join(process.cwd(), "public/photos/camp-caudle");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).map((f) => f.replace(/\.[^.]+$/, ""));
}

export default function CampCaudlePage() {
  const thumbnailSlugs = readThumbnailSlugs();
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-8 lg:px-14 lg:py-16">
      <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">
        Media · Central Teens
      </span>
      <h1 className="mt-2.5 mb-3 font-display text-[36px] leading-[1] tracking-[-.035em] lg:mb-4 lg:text-6xl lg:tracking-[-.04em]">
        Camp Caudle
      </h1>
      <p className="m-0 max-w-[720px] text-base leading-[1.65] text-body text-pretty-wrap lg:text-[19px]">
        Every summer our teens head to Camp Caudle in Hector, Arkansas for a
        full week of spiritual growth and lifelong friendship. Here&rsquo;s the
        whole archive — daily recaps, Thunderdome, Paint War and all.
      </p>
      <div className="mt-4">
        <ArrowLink href="/ministries/teens">About Central Teens</ArrowLink>
      </div>

      <CampGallery
        years={campYears}
        videos={campVideos}
        thumbnailSlugs={thumbnailSlugs}
      />
    </div>
  );
}
