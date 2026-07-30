"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarIcon, HubIcon, VisitIcon } from "./TabBarIcons";

/**
 * Sticky bottom bar keeping the three most-used screens one tap away:
 * Plan a Visit · Hub · Events. Give stays reachable in the header, which is
 * never hidden on mobile, so dropping it here doesn't remove it from the
 * phone — it just stops competing for space with the three people actually
 * reach for mid-week. Becomes the app's tab bar.
 */
export function MobileTabBar() {
  const pathname = usePathname();
  const tabs = [
    {
      label: "Plan a Visit",
      href: "/plan-a-visit",
      active: pathname.startsWith("/plan-a-visit"),
      Icon: VisitIcon,
    },
    {
      label: "Hub",
      href: "/hub",
      active: pathname.startsWith("/hub"),
      Icon: HubIcon,
    },
    {
      label: "Events",
      href: "/events",
      active: pathname.startsWith("/events"),
      Icon: CalendarIcon,
    },
  ];

  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-px border-t border-line bg-line pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      {tabs.map((tab) => (
        <Link
          key={tab.label}
          href={tab.href}
          aria-current={tab.active ? "page" : undefined}
          className={`flex h-16 flex-col items-center justify-center gap-1 bg-white no-underline ${
            tab.active ? "text-primary" : "text-body"
          }`}
        >
          <tab.Icon className="size-6" />
          <span className="text-[11.5px] font-bold">{tab.label}</span>
        </Link>
      ))}
    </nav>
  );
}
