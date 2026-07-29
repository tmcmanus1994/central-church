/**
 * Event data. In production this file (or a JSON file it reads) is written by
 * the church's automation — the shape below is the contract from the handoff.
 * Every field except title/start/location is optional: cards, rows, and detail
 * pages must render without image, description, or CTA.
 */

export type EventTag =
  | "Outreach"
  | "Central Kids"
  | "Central Teens"
  | "Life Groups"
  | "All Church";

export interface ChurchEvent {
  slug: string;
  title: string;
  /** ISO 8601, America/Chicago */
  start: string;
  end?: string;
  allDay?: boolean;
  location: string;
  /** True when the event happens somewhere other than the church building. */
  offsite?: boolean;
  description?: string;
  /**
   * Path under /public when the automation supplies a photo; `null` means the
   * event explicitly has no image and renders the text-only card variant.
   * `undefined` renders the placeholder slot until photography lands.
   */
  image?: string | null;
  tag?: EventTag;
  recurring?: boolean;
  /** Simplified RRULE, e.g. "FREQ=WEEKLY;BYDAY=SU" */
  rrule?: string;
  spotlight?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
  ministrySlug?: string;
}

export const recurringEvents: ChurchEvent[] = [
  {
    slug: "sunday-classes",
    title: "Sunday Classes",
    start: "2026-08-02T09:15:00-05:00",
    end: "2026-08-02T10:00:00-05:00",
    location: "823 W 6th St, Little Rock",
    recurring: true,
    rrule: "FREQ=WEEKLY;BYDAY=SU",
  },
  {
    slug: "worship",
    title: "Worship",
    start: "2026-08-02T10:15:00-05:00",
    end: "2026-08-02T11:45:00-05:00",
    location: "Worship Center",
    recurring: true,
    rrule: "FREQ=WEEKLY;BYDAY=SU",
  },
  {
    slug: "spanish-worship",
    title: "Spanish Speaking Worship",
    start: "2026-08-02T13:30:00-05:00",
    end: "2026-08-02T14:30:00-05:00",
    location: "Worship Center",
    recurring: true,
    rrule: "FREQ=WEEKLY;BYDAY=SU",
    ministrySlug: "iglesia",
  },
  {
    slug: "wednesday-classes",
    title: "Wednesday Classes",
    start: "2026-08-05T18:30:00-05:00",
    end: "2026-08-05T19:30:00-05:00",
    location: "823 W 6th St, Little Rock",
    recurring: true,
    rrule: "FREQ=WEEKLY;BYDAY=WE",
  },
  {
    slug: "encouragers",
    title: "Encouragers",
    start: "2026-08-06T10:30:00-05:00",
    end: "2026-08-06T11:30:00-05:00",
    location: "823 W 6th St, Little Rock",
    recurring: true,
    rrule: "FREQ=WEEKLY;BYDAY=TH",
  },
  {
    slug: "friday-story-time",
    title: "Friday Story Time",
    start: "2026-08-07T10:00:00-05:00",
    end: "2026-08-07T11:30:00-05:00",
    location: "Central Kids Wing",
    recurring: true,
    rrule: "FREQ=WEEKLY;BYDAY=FR",
    ministrySlug: "children",
  },
  {
    slug: "kids-closet-hours",
    title: "Kids Closet",
    start: "2026-08-05T09:00:00-05:00",
    end: "2026-08-05T11:00:00-05:00",
    location: "823 W 6th St, Little Rock",
    recurring: true,
    rrule: "FREQ=WEEKLY;BYDAY=WE,FR",
    ministrySlug: "kids-closet",
  },
];

export const upcomingEvents: ChurchEvent[] = [
  {
    slug: "back-to-school-backpack-giveaway",
    title: "Back to School Backpack Giveaway",
    start: "2026-08-08T09:00:00-05:00",
    end: "2026-08-08T11:00:00-05:00",
    location: "Central's west parking lot",
    image: "/photos/event-backpack-giveaway.webp",
    description:
      "Every August, Central hands out free backpacks and school supplies to families across downtown Little Rock. Students pick their own bag and fill it with the supplies on their grade's list — no paperwork, no requirements. Come early; we serve until supplies run out.\n\nVolunteers meet in the west lot at 8:15 AM to set up tables and sort supplies by grade. If you can bring a folding table or a canopy, let Matt know when you sign up.",
    tag: "Outreach",
    spotlight: true,
    ctaLabel: "Volunteer sign-up",
    ctaHref: "/plan-a-visit#contact",
  },
  {
    slug: "ice-cream-social",
    title: "Ice Cream Social",
    start: "2026-08-09T18:00:00-05:00",
    end: "2026-08-09T19:30:00-05:00",
    location: "Fellowship Hall",
    image: "/photos/event-ice-cream-social.webp",
    description:
      "Cold treats and good company as we kick off the school year together. Bring the whole family — we'll have the freezers full.",
    tag: "All Church",
  },
  {
    slug: "huntsville-mission-trip",
    title: "Huntsville Mission Trip",
    start: "2026-08-15T00:00:00-05:00",
    end: "2026-08-17T23:59:00-05:00",
    allDay: true,
    location: "Huntsville, AR",
    description:
      "Three days serving alongside the Huntsville congregation — work projects, shared meals, and worship together. Sign up by August 8.",
    tag: "Outreach",
  },
  {
    slug: "central-kids-sunday-funday",
    title: "Central Kids Sunday Funday",
    start: "2026-08-23T16:00:00-05:00",
    end: "2026-08-23T17:30:00-05:00",
    location: "Central Kids Wing",
    description:
      "Games, snacks, and a short lesson to close out summer. For kids birth through 5th grade and their families.",
    image: null,
    tag: "Central Kids",
    ministrySlug: "children",
  },
  {
    slug: "small-group-fair",
    title: "Small Group Fair",
    start: "2026-09-03T18:30:00-05:00",
    end: "2026-09-03T19:30:00-05:00",
    location: "Spiritual Growth Center",
    description:
      "Meet every Life Group leader in one room and find where you fit this fall.",
    tag: "Life Groups",
    ministrySlug: "life-groups",
  },
  {
    slug: "st-louis-trip",
    title: "St. Louis Trip",
    start: "2026-09-19T00:00:00-05:00",
    end: "2026-09-21T23:59:00-05:00",
    allDay: true,
    location: "St. Louis, MO",
    image: "/photos/event-st-louis-trip.webp",
    description:
      "A weekend away for Central Teens — service, sightseeing, and time together on the road.",
    tag: "Central Teens",
    ministrySlug: "teens",
  },
];

export const allEvents = [...recurringEvents, ...upcomingEvents];

export function getEvent(slug: string) {
  return allEvents.find((e) => e.slug === slug);
}

export function getSpotlightEvent() {
  return upcomingEvents.find((e) => e.spotlight);
}

export function getRecurringForMinistry(ministrySlug: string) {
  return recurringEvents.filter((e) => e.ministrySlug === ministrySlug);
}
