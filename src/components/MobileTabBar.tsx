"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

/**
 * Sticky bottom bar keeping the three visitor jobs one tap away:
 * Plan a Visit · This Week · Give. Becomes the app's tab bar.
 */
export function MobileTabBar() {
  const pathname = usePathname();
  const tabs = [
    {
      label: "Plan a Visit",
      href: "/plan-a-visit",
      active: pathname.startsWith("/plan-a-visit"),
      activeColor: "text-primary",
      chip: "bg-primary",
    },
    {
      label: "This Week",
      href: "/events",
      active: pathname.startsWith("/events"),
      activeColor: "text-primary",
      chip: "bg-primary",
    },
    {
      label: "Give",
      href: site.giveUrl,
      active: false,
      activeColor: "text-accent-deep",
      chip: "bg-accent",
    },
  ];

  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-px border-t border-line bg-line pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      {tabs.map((tab) => {
        const inner = (
          <>
            <span
              aria-hidden
              className={`size-5 rounded-[5px] ${
                tab.active || tab.label === "Give" ? tab.chip : "bg-line-dark"
              }`}
            />
            <span
              className={`text-[11.5px] font-bold ${
                tab.active
                  ? tab.activeColor
                  : tab.label === "Give"
                    ? "text-accent-deep"
                    : "text-body"
              }`}
            >
              {tab.label}
            </span>
          </>
        );
        const cls =
          "flex h-16 flex-col items-center justify-center gap-1 bg-white no-underline";
        return tab.href.startsWith("http") ? (
          <a
            key={tab.label}
            href={tab.href}
            className={cls}
            target="_blank"
            rel="noopener noreferrer"
          >
            {inner}
          </a>
        ) : (
          <Link key={tab.label} href={tab.href} className={cls}>
            {inner}
          </Link>
        );
      })}
    </nav>
  );
}
