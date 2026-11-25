import { toyStore } from "./toy-store";

/**
 * The homepage spotlight, by hand.
 *
 * It used to show whichever upcoming event had a photo. Now it's a short
 * list Travelle curates: add an entry here, give it an `until` date so it
 * retires itself, and the homepage banner rotates through whatever's
 * active. Order matters — the first entry shows first.
 */
export interface Spotlight {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  /** A photo, or the three shirts from the shop. */
  visual: { kind: "photo"; src: string; alt: string } | { kind: "shirts" };
  /** Background. */
  theme: "green" | "coal";
  /** ISO date (local, inclusive) after which it stops showing. */
  until?: string;
}

export const spotlights: Spotlight[] = [
  {
    id: "toy-store-2026",
    eyebrow: `${toyStore.date} · 7 AM to 12 PM`,
    title: "Christmas Toy Store",
    body: "Help us give 1,620 gifts so 189 families and 616 children have something to open on Christmas morning. Give, sign up to give gifts, or volunteer.",
    primary: { label: "Give, donate, or volunteer", href: "/toy-store" },
    secondary: { label: toyStore.links.gifts.label, href: toyStore.links.gifts.href },
    visual: { kind: "photo", src: toyStore.photo, alt: toyStore.imageAlt },
    theme: "green",
    until: "2026-12-12",
  },
  {
    id: "central-shop",
    eyebrow: "Central Merch · New",
    title: "Wear Central all week long",
    body: "Our skyline design on a tee, a crewneck, or a hoodie. Order online, pay with Cash App, Pushpay, or cash, and pick it up at church.",
    primary: { label: "Shop the collection", href: "/shop" },
    visual: { kind: "shirts" },
    theme: "coal",
  },
];

/** Entries whose `until` date hasn't passed, in order. */
export function activeSpotlights(now = new Date()): Spotlight[] {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago" }).format(now); // YYYY-MM-DD
  return spotlights.filter((s) => !s.until || s.until >= today);
}
