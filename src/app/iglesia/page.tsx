import type { Metadata } from "next";
import { MinistryPage } from "@/components/MinistryPage";
import { getMinistry } from "@/content/ministries";
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

export default function IglesiaPage() {
  return <MinistryPage ministry={ministry} />;
}
