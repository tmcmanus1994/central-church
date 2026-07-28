import Image from "next/image";
import Link from "next/link";
import { site, fullAddress } from "@/lib/site";

const columns = [
  {
    heading: "Visit",
    links: [
      { label: "Plan a Visit", href: "/plan-a-visit" },
      { label: "This Week", href: "/events" },
      { label: "Events", href: "/events" },
      { label: "Bulletin", href: "/bulletin" },
    ],
  },
  {
    heading: "Ministries",
    links: [
      { label: "Central Kids", href: "/ministries/children" },
      { label: "Central Teens", href: "/ministries/teens" },
      { label: "Life Groups", href: "/ministries/life-groups" },
      { label: "Iglesia", href: "/iglesia" },
      { label: "Kids Closet", href: "/ministries/kids-closet" },
      { label: "Freedom Prayer", href: "/ministries/freedom-prayer" },
    ],
  },
  {
    heading: "About & Media",
    links: [
      { label: "What is Central", href: "/about" },
      { label: "Leadership", href: "/about/leadership" },
      { label: "Missionaries", href: "/about/missionaries" },
      { label: "Live Stream", href: "/media/live" },
      { label: "Podcast", href: "/media/podcast" },
      { label: "Blog", href: "/blog" },
    ],
  },
];

const socials = [
  { label: "IG", name: "Instagram", href: site.socials.instagram },
  { label: "FB", name: "Facebook", href: site.socials.facebook },
  { label: "YT", name: "YouTube", href: site.socials.youtube },
];

export function SiteFooter() {
  return (
    <footer className="bg-coal px-5 pt-12 pb-24 text-[#D9D3CA] lg:px-14 lg:pt-[72px] lg:pb-9">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.1fr] lg:gap-12">
        <div className="flex flex-col gap-[18px]">
          <Image
            src="/brand/logo-white.webp"
            alt={site.name}
            width={720}
            height={186}
            className="h-11 w-auto self-start"
          />
          <p className="m-0 max-w-[280px] text-[14.5px] leading-[1.6] text-[#9C958B]">
            A Church of Christ in downtown Little Rock, Arkansas, following
            Jesus together since our founding.
          </p>
          <div className="flex gap-2.5">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                aria-label={s.name}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-[42px] items-center justify-center rounded-full border border-[#363028] text-[11px] font-bold text-[#D9D3CA] no-underline hover:border-[#6E6862] lg:size-[38px]"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <nav key={col.heading} aria-label={col.heading} className="flex flex-col gap-3.5">
            <span className="text-[11px] tracking-[.16em] uppercase text-muted">
              {col.heading}
            </span>
            {col.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[15px] text-[#D9D3CA] no-underline hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ))}

        <div className="flex flex-col gap-4">
          <span className="text-[11px] tracking-[.16em] uppercase text-muted">
            Sundays & Wednesdays
          </span>
          <div className="flex flex-col gap-1.5 text-[14.5px]">
            {site.serviceTimes.map((t) => (
              <span key={t.label}>
                {t.label} · {t.when}
              </span>
            ))}
          </div>
          <a
            href={site.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14.5px] leading-[1.55] text-[#9C958B] no-underline hover:text-white"
          >
            {site.address.street}
            <br />
            {site.address.city}, {site.address.state} {site.address.zip}
          </a>
          <a
            href={site.phoneHref}
            className="text-[14.5px] text-[#9C958B] no-underline hover:text-white"
          >
            {site.phone}
          </a>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-[1440px] flex-col justify-between gap-4 border-t border-[#2A251F] pt-6 text-[13px] text-muted sm:flex-row sm:items-center lg:mt-14">
        <span>
          © {new Date().getFullYear()} {site.name} · Little Rock, Arkansas
        </span>
        <div className="flex gap-6">
          <Link href="/plan-a-visit#contact" className="text-muted no-underline hover:text-white">
            Contact
          </Link>
          <a
            href={site.giveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted no-underline hover:text-white"
          >
            Give
          </a>
          <Link href="/events" className="text-muted no-underline hover:text-white">
            Subscribe to Calendar
          </Link>
        </div>
      </div>
      <span className="sr-only">{fullAddress}</span>
    </footer>
  );
}
