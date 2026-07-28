import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileTabBar } from "@/components/MobileTabBar";
import { ChurchJsonLd } from "@/components/JsonLd";
import { site } from "@/lib/site";
// Self-hosted fonts (fontsource) — no external font requests at runtime.
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/manrope";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";

const DESCRIPTION =
  "Follow Jesus together at Central Church of Christ in downtown Little Rock. Worship Sundays at 10:15 AM, classes Wednesdays at 6:30 PM. Everyone is welcome.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Central Church of Christ | Downtown Little Rock, AR",
    template: "%s | Central Church of Christ",
  },
  description: DESCRIPTION,
  applicationName: site.name,
  keywords: [
    "church in Little Rock",
    "downtown Little Rock church",
    "Church of Christ Little Rock",
    "Little Rock AR church",
    "iglesia en Little Rock",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    url: site.url,
    title: "Central Church of Christ | Downtown Little Rock, AR",
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: site.name, description: DESCRIPTION },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#2F6E89",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <ChurchJsonLd />
        <SiteHeader />
        {/* pb clears the fixed mobile tab bar */}
        <main className="pb-16 lg:pb-0">{children}</main>
        <SiteFooter />
        <MobileTabBar />
      </body>
    </html>
  );
}
