"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site, fullAddress } from "@/lib/site";

const navItems = [
  { label: "This Week", href: "/events" },
  { label: "About", href: "/about" },
  { label: "Ministries", href: "/ministries" },
  { label: "Media", href: "/media" },
];

const sheetItems = [
  { label: "Plan a Visit", href: "/plan-a-visit" },
  ...navItems,
  { label: "Bulletin", href: "/bulletin" },
  { label: "Iglesia · En Español", href: "/iglesia" },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center no-underline" aria-label={`${site.name} — home`}>
      <Image
        src="/brand/logo-color.webp"
        alt={site.name}
        width={720}
        height={186}
        priority
        className="h-9 w-auto lg:h-11"
      />
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      {/* Info bar — service times above the fold on every page */}
      <div className="bg-primary text-[12px] text-teal-pale lg:text-[13px]">
        <div className="mx-auto flex h-9 max-w-[1440px] items-center justify-between gap-4 px-5 lg:h-11 lg:px-14">
          <p className="m-0 truncate">
            <span className="hidden lg:inline">
              Sun 9:15 Classes · 10:15 Worship · 1:30 Español
              <span className="mx-3 opacity-50">|</span>
              Wed 6:30 Classes
            </span>
            <span className="lg:hidden">Sun 10:15 AM · Wed 6:30 PM</span>
          </p>
          <p className="m-0 shrink-0">
            <a
              href={site.mapsUrl}
              className="text-teal-pale no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="hidden lg:inline">{fullAddress}</span>
              <span className="lg:hidden">{site.address.street}</span>
            </a>
            <span className="mx-3 hidden opacity-50 lg:inline">|</span>
            <a
              href={site.phoneHref}
              className="hidden text-teal-pale no-underline lg:inline"
            >
              {site.phone}
            </a>
          </p>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-5 lg:h-[82px] lg:px-14">
        <Logo />
        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 text-[15.5px] font-semibold lg:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`no-underline transition-colors hover:text-primary ${
                pathname.startsWith(item.href) ? "text-primary" : "text-[#2A2622]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2.5 lg:gap-3">
          <Link
            href="/plan-a-visit"
            className="hidden h-[46px] items-center rounded-full border-[1.5px] border-primary px-[22px] text-[15px] font-bold text-primary no-underline hover:bg-teal-50 lg:inline-flex"
          >
            Plan a Visit
          </Link>
          <a
            href={site.giveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center rounded-full bg-accent px-4 text-sm font-bold text-white no-underline hover:bg-accent-deep lg:h-[46px] lg:px-6 lg:text-[15px]"
          >
            Give
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="flex size-11 flex-col items-center justify-center gap-1 rounded-xl border border-line lg:hidden"
          >
            {open ? (
              <span className="font-display text-lg leading-none">✕</span>
            ) : (
              <>
                <span className="h-0.5 w-[18px] bg-ink" />
                <span className="h-0.5 w-[18px] bg-ink" />
                <span className="h-0.5 w-[18px] bg-ink" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      {open ? (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="border-t border-line bg-white px-5 pt-2 pb-5 lg:hidden"
        >
          <ul className="m-0 list-none p-0">
            {sheetItems.map((item) => (
              <li key={item.href} className="border-b border-line last:border-0">
                <Link
                  href={item.href}
                  className="block py-4 font-display text-lg tracking-[-.01em] text-ink no-underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2 text-[14.5px] text-muted">
            <span>Sun 9:15 Classes · 10:15 Worship · 1:30 Español</span>
            <span>Wed 6:30 Classes</span>
            <a href={site.phoneHref} className="font-bold text-primary no-underline">
              {site.phone}
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
