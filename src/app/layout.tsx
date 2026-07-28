import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Central Church of Christ | Downtown Little Rock, AR",
    template: "%s | Central Church of Christ",
  },
  description:
    "Follow Jesus together at Central Church of Christ in downtown Little Rock. Worship Sundays at 10:15 AM, classes Wednesdays at 6:30 PM. Everyone is welcome.",
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
