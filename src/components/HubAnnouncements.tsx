"use client";

import { useState } from "react";
import type { BulletinAnnouncement } from "@/content/bulletin";

/**
 * The Hub's announcements as a list of collapsed rows: every title is visible
 * at a glance, and a tap opens the one you want. The full-text version made
 * the Hub a very long scroll on a phone — announcements sit right under the
 * action buttons, so nine open paragraphs pushed everything else below them
 * (what's on, prayer, service times) well off the first screen.
 *
 * The first announcement starts open so the section reads as content rather
 * than a bare list of headings. "Show all" expands everything for anyone who
 * prefers to read straight through.
 */
export function HubAnnouncements({ items }: { items: BulletinAnnouncement[] }) {
  const [open, setOpen] = useState<Set<string>>(() => new Set(items.slice(0, 1).map((a) => a.title)));
  const allOpen = open.size === items.length;

  function toggle(title: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }

  return (
    <section className="mt-7 rounded-2xl border border-line p-5 lg:p-6">
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <h2 className="m-0 font-display text-[21px] tracking-[-.02em]">Announcements</h2>
        <button
          type="button"
          onClick={() => setOpen(allOpen ? new Set() : new Set(items.map((a) => a.title)))}
          className="text-[13.5px] font-bold text-primary hover:opacity-80"
        >
          {allOpen ? "Collapse all" : "Show all"}
        </button>
      </div>
      <ul className="m-0 flex list-none flex-col p-0">
        {items.map((a, i) => {
          const isOpen = open.has(a.title);
          const panelId = `hub-announcement-${i}`;
          return (
            <li key={a.title} className="border-b border-line last:border-0">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(a.title)}
                className="flex w-full items-center justify-between gap-4 py-3.5 text-left"
              >
                <span className="text-[15.5px] leading-[1.4] font-semibold text-ink">{a.title}</span>
                <span
                  aria-hidden="true"
                  className={`shrink-0 text-primary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
              <div
                id={panelId}
                hidden={!isOpen}
                className="pb-4 text-[15.5px] leading-[1.6] text-body"
              >
                <p className="m-0">{a.body}</p>
                {a.href ? (
                  <a
                    href={a.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-[14.5px] font-bold text-primary"
                  >
                    Sign up →
                  </a>
                ) : null}
                {a.contact ? (
                  <p className="m-0 mt-2 text-[14px] text-muted">
                    Contact{" "}
                    {a.contact.email ? (
                      <a href={`mailto:${a.contact.email}`} className="text-primary">
                        {a.contact.name}
                      </a>
                    ) : (
                      a.contact.name
                    )}
                    .
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
