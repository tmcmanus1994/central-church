import type { ChurchEvent } from "./events";

/**
 * Events as the bulletin has them.
 *
 * The printed bulletin is the church's source of truth, and it consistently
 * knows things the calendar doesn't: events that were never added, real names
 * for entries someone abbreviated, and the description that makes an event
 * make sense to a stranger. This list is cross-referenced against the feeds
 * in lib/calendar.ts:
 *
 *   · A calendar entry matching one of these takes the bulletin's **title,
 *     description, and location** — that's where the bulletin is better.
 *   · The calendar keeps its own **date and time**, because it's edited
 *     continuously while the bulletin is a weekly snapshot.
 *   · Anything here the calendar has no match for is **added outright**, so a
 *     forgotten calendar entry doesn't mean a missing event on the site.
 *
 * `aliases` are the shorthand the calendar actually uses. "with Stephen" sat
 * on the Teens calendar as a half-typed title; the bulletin supplied the rest
 * of the name, and the alias is what stitches the two together.
 *
 * Times are only set where the bulletin states one. Everything else is
 * `allDay`, which renders as a date without inventing a time.
 */
export interface BulletinEvent extends ChurchEvent {
  /** Titles the calendar might use for the same event. */
  aliases?: string[];
}

export const bulletinEvents: BulletinEvent[] = [
  {
    slug: "promotion-sunday",
    title: "Promotion Sunday",
    start: "2026-08-02T09:00:00-05:00",
    allDay: true,
    location: "Central Kids Wing",
    description:
      "Every elementary student moves up to their new grade level class. Rising 6th graders are the exception — they promote on Wednesday, August 5.",
    tag: "Central Kids",
    ministrySlug: "children",
    aliases: ["Promotions Sunday", "Promotion Sunday (K-5th)"],
  },
  {
    slug: "sunday-funday",
    title: "Sunday Funday",
    start: "2026-08-02T09:00:00-05:00",
    allDay: true,
    location: "Central Kids Wing",
    description: "For kindergarten and first grade.",
    tag: "Central Kids",
    ministrySlug: "children",
    aliases: ["Central Kids Sunday Funday", "Sunday Funday (K&1st gr.)"],
  },
  {
    slug: "thirties-potluck",
    title: "30s Potluck",
    start: "2026-08-02T09:00:00-05:00",
    allDay: true,
    location: "Fellowship East",
    description: "A potluck for the 30s class after morning worship.",
    tag: "All Church",
    aliases: ["30's potluck", "30s potluck"],
  },
  {
    slug: "donut-sale",
    title: "Donut Sale for Peru",
    start: "2026-08-02T09:00:00-05:00",
    allDay: true,
    location: "823 W 6th St, Little Rock",
    description:
      "The Kids Ministry sells donuts to fund a month of a tutor's salary at Casa Hogar El Amor de Dios — the Love of God Children's Home — in Arequipa, Peru.",
    tag: "Central Kids",
    ministrySlug: "children",
    aliases: ["Donuts", "Donut Sale"],
  },
  {
    slug: "ice-cream-social",
    title: "Ice Cream Social",
    start: "2026-08-02T18:30:00-05:00",
    location: "Central Gym",
    description:
      "Bring a pint of your favorite flavor — toppings and water are complimentary. A thank-you and see-you-later to this summer's interns.",
    tag: "All Church",
  },
  {
    slug: "back-to-school-event",
    title: "Back to School Event",
    start: "2026-08-05T09:00:00-05:00",
    allDay: true,
    location: "823 W 6th St, Little Rock",
    description:
      "Central's annual Back to School Event, together with the Friends & Family Meal. Bring school supply donations to the building any time before August 2, or give through the online portal and we'll shop for you. Amazon and Walmart wish lists are posted on Facebook.",
    tag: "Outreach",
    ministrySlug: "outreach",
    aliases: [
      "Back to School Event/Friends & Family Meal",
      "Friends & Family Meal",
      "Back to School",
    ],
  },
  {
    slug: "sixth-grade-promotion",
    title: "6th Grade Promotion",
    start: "2026-08-05T18:30:00-05:00",
    location: "Central Kids Wing",
    description:
      "Rising 6th graders have their own promotion on Wednesday night. Watch your email for details from Tammy and James.",
    tag: "Central Kids",
    ministrySlug: "children",
  },
  {
    slug: "fun-with-stephen",
    title: "Fun with Stephen",
    start: "2026-08-07T09:00:00-05:00",
    allDay: true,
    location: "823 W 6th St, Little Rock",
    description: "A Central Teens night with Stephen.",
    tag: "Central Teens",
    ministrySlug: "teens",
    aliases: ["with Stephen", "Fun w/ Stephen"],
  },
  {
    slug: "canvas-community-meal",
    title: "Canvas Community Meal",
    start: "2026-08-12T18:00:00-05:00",
    location: "823 W 6th St, Little Rock",
    description:
      "Serving the homeless community an evening meal, as we do the second Wednesday of every month.",
    tag: "Outreach",
    ministrySlug: "outreach",
    aliases: ["Canvas", "Canvas Community", "Canvas Meal"],
  },
  {
    slug: "shannabration",
    title: "Shannabration",
    start: "2026-08-23T17:00:00-05:00",
    location: "Central Gym",
    description:
      "A 25th work-anniversary celebration honoring Shannon Cooper — wear Kelly green if you've got it, and bring a side or dessert to share (green beans are popular, but feel free to branch out).",
    tag: "All Church",
  },
  {
    slug: "central-discovery",
    title: "Central Discovery",
    start: "2026-08-23T09:00:00-05:00",
    location: "Worship Center Lobby",
    description:
      "A quarterly \"get to know Central\" class. If you're new around here, this is for you.",
    tag: "All Church",
  },
  {
    slug: "mix-bentonville-trip",
    title: "Mix Trip to Bentonville",
    start: "2026-08-15T09:00:00-05:00",
    allDay: true,
    location: "Bentonville, AR",
    offsite: true,
    description: "A trip to Bentonville for The Mix, Central's young adult community.",
    tag: "All Church",
    aliases: ["Mix trip to Bentonville"],
  },
  {
    slug: "mentor-info-meeting",
    title: "Mentor Info Meeting",
    start: "2026-08-25T09:00:00-05:00",
    allDay: true,
    location: "823 W 6th St, Little Rock",
    description:
      "Interested in mentoring this year? OnRamp Mentoring follows the school year and meets one evening a week on Tuesdays. There's already a waiting list of mentees, so come find out what's involved.",
    tag: "Outreach",
    ministrySlug: "outreach",
    aliases: ["Mentor Interest Meeting", "OnRamp Info Meeting"],
  },
  {
    slug: "mentorship-kickoff",
    title: "OnRamp Mentoring Kickoff",
    start: "2026-09-01T09:00:00-05:00",
    allDay: true,
    location: "823 W 6th St, Little Rock",
    description:
      "Mentoring starts back for the school year, meeting Tuesday evenings.",
    tag: "Outreach",
    ministrySlug: "outreach",
    aliases: ["Mentorship Kickoff", "OnRamp Kickoff", "Mentoring Kickoff"],
  },
  {
    slug: "encouragers-kickoff",
    title: "Encouragers Kickoff",
    start: "2026-08-27T10:30:00-05:00",
    location: "Fellowship East",
    description:
      "Encouragers Class starts back for the 2026-27 season, resuming the study of Job, meeting Thursdays at 10:30 AM in Fellowship East.",
    tag: "All Church",
    aliases: ["Encouragers Returns", "Encouragers Class"],
  },
  {
    slug: "area-wide-worship",
    title: "Area Wide Worship Night",
    start: "2026-08-30T18:00:00-05:00",
    location: "823 W 6th St, Little Rock",
    description:
      "Central hosts the central Arkansas family of churches for an evening of song and prayer. No childcare is provided, though the kids area will be open for movers and shakers.",
    tag: "All Church",
    aliases: ["Area Wide Worship"],
  },
  {
    slug: "sunday-funday-5-6",
    title: "Sunday Funday (5th/6th)",
    start: "2026-08-16T09:00:00-05:00",
    allDay: true,
    location: "Central Kids Wing",
    description: "For 5th and 6th graders.",
    tag: "Central Kids",
    ministrySlug: "children",
    aliases: ["Sunday Funday (5/6th)"],
  },
  {
    slug: "small-group-info-fair",
    title: "Small Group Informational Fair",
    start: "2026-08-23T09:00:00-05:00",
    allDay: true,
    location: "Worship Center Lobby",
    description:
      "Questions about how small groups work at Central — by age and location? Stop by the lobby after worship. A sign-up form is also on Facebook, the HUB, or with your class leader. Groups kick off September 13.",
    tag: "Life Groups",
    ministrySlug: "life-groups",
    aliases: ["Small Group fair", "Small Groups Info Fair"],
  },
];

/**
 * Bulletin items deliberately kept off the public site.
 *
 * Showers, memorials, and anything naming a member's health belong in a
 * bulletin handed to the congregation, not on a page a search engine indexes.
 * They're recorded here so the information isn't lost and so a future pass
 * can surface them somewhere member-facing.
 */
export const withheldFromBulletin: { item: string; reason: string }[] = [
  { item: "Logan Patillo — wedding shower, August 9", reason: "member-personal" },
  { item: "Madison Allen — baby shower, August 30", reason: "member-personal" },
  { item: "Sarah Laffoon — baby shower, September 14", reason: "member-personal" },
  {
    item: "Caylie Mosley — expecting, January",
    reason: "member-personal, no public shower date given yet",
  },
  {
    item: "Virgie Reese-Dobson memorial service, August 8, Augusta, GA",
    reason: "private family service, out of state",
  },
  {
    item: "Named prayer requests (health, surgery, bereavement)",
    reason: "health information about named individuals",
  },
  { item: "Weekly offering and budget figures", reason: "internal finances" },
  {
    item: "Service members list — Tevin Patillo, Chris McNair, Cornelius Hood, Kyla Jeter",
    reason:
      "names members' family relations (incl. Travelle's own sister); held back for his call on whether to publish",
  },
  {
    item: "Sanchez Adoption Celebration, August 20",
    reason:
      "adoption involves a minor's privacy on a permanently public, indexable page; held back for a human call rather than publishing by default",
  },
];
