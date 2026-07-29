import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MinistryPage } from "@/components/MinistryPage";
import { getMinistry, ministries } from "@/content/ministries";
import { getCalendar } from "@/lib/calendar";

export const revalidate = 900;

export function generateStaticParams() {
  // Iglesia lives at /iglesia (redirected in next.config.ts)
  return ministries
    .filter((m) => m.slug !== "iglesia")
    .map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const ministry = getMinistry((await params).slug);
  if (!ministry) return {};
  return {
    title: { absolute: ministry.metaTitle },
    description: ministry.metaDescription,
  };
}

export default async function MinistryRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ministry = getMinistry(slug);
  if (!ministry || slug === "iglesia") notFound();
  const { recurring } = await getCalendar();
  return (
    <MinistryPage
      ministry={ministry}
      recurring={recurring.filter((e) => e.ministrySlug === slug)}
    />
  );
}
