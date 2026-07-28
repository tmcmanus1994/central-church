import type { Metadata } from "next";
import { getMinistry, iglesiaEnglish } from "@/content/ministries";
import { IglesiaPage } from "./IglesiaPage";
import { site } from "@/lib/site";

const ministry = getMinistry("iglesia")!;

export const metadata: Metadata = {
  title: { absolute: ministry.metaTitle },
  description: ministry.metaDescription,
  alternates: {
    canonical: `${site.url}/iglesia`,
    languages: {
      es: `${site.url}/iglesia`,
      en: `${site.url}/plan-a-visit`,
    },
  },
};

export default function IglesiaRoute() {
  return <IglesiaPage es={ministry} en={iglesiaEnglish} />;
}
