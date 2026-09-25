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
    slug: "sunday-funday-sept-6",
    title: "Sunday Funday",
    start: "2026-09-06T09:00:00-05:00",
    allDay: true,
    location: "Central Kids Wing",
    description: "A morning of games and fun for Central Kids.",
    tag: "Central Kids",
    ministrySlug: "children",
  },
  {
    slug: "canvas-community-meal-sept9",
    title: "Canvas Community Meal",
    start: "2026-09-09T18:00:00-05:00",
    location: "823 W 6th St, Little Rock",
    description:
      "Serving the homeless community an evening meal, as we do the second Wednesday of every month.",
    tag: "Outreach",
    ministrySlug: "outreach",
    aliases: ["Canvas", "Canvas Community", "Canvas Meal"],
  },
  {
    slug: "mens-golf-tournament",
    title: "Men's Annual Golf Tournament — Driving for Diapers",
    start: "2026-09-19T07:30:00-05:00",
    location: "Rebsamen Golf Course, Little Rock, AR",
    offsite: true,
    description:
      "Fellowship, fun, and a little friendly frustration on the course. Entry fee includes a pack of size 5 diapers for Kids Closet, and additional packs shave strokes off the score of the golfer you're supporting — label your pack with their name to get the credit. Donations accepted through Wednesday, September 16.",
    tag: "All Church",
    aliases: ["Driving for Diapers"],
  },
  {
    slug: "mens-retreat",
    title: "Central Men's Retreat — Roots Run Deep",
    start: "2026-09-25T00:00:00-05:00",
    end: "2026-09-26T23:59:00-05:00",
    allDay: true,
    location: "Corin Read Christian Camp, Bauxite, AR",
    offsite: true,
    description:
      "A weekend of faith, fellowship, community, and adventure for the men of Central. $20 covers lodging and meals. RSVP by September 20.",
    tag: "All Church",
    aliases: ["Roots Run Deep"],
  },
  {
    slug: "small-groups-kickoff",
    title: "Small Groups Kickoff",
    start: "2026-09-13T09:00:00-05:00",
    allDay: true,
    location: "823 W 6th St, Little Rock",
    description:
      "Small Groups kick off for the year. If you're on the fence or need some direction, fill out the sign-up form on Facebook or the HUB.",
    tag: "Life Groups",
    ministrySlug: "life-groups",
  },
  {
    slug: "teens-small-group-kickoff",
    title: "Central Teens Small Group Kickoff",
    start: "2026-09-13T09:00:00-05:00",
    allDay: true,
    location: "The Mosley's",
    offsite: true,
    description: "Central Teens' small group kicks off at the Mosley's — RSVP for a food headcount.",
    tag: "Central Teens",
    ministrySlug: "teens",
  },
  {
    slug: "teens-sdc-trip",
    title: "Teens Trip — Silver Dollar City",
    start: "2026-09-26T09:00:00-05:00",
    allDay: true,
    location: "Silver Dollar City, Branson, MO",
    offsite: true,
    description: "Central Teens' trip to Silver Dollar City in Branson, Missouri.",
    tag: "Central Teens",
    ministrySlug: "teens",
    aliases: ["SDC", "SDC Trip", "Teens SDC Trip"],
  },
  {
    slug: "harvest-month",
    title: "Harvest Month",
    start: "2026-10-01T09:00:00-05:00",
    allDay: true,
    location: "823 W 6th St, Little Rock",
    description:
      "Weekly children's giving in the galvanized tub makes its comeback. More info as the first Sunday of the month gets closer.",
    tag: "All Church",
  },
  {
    slug: "sunday-funday-oct4",
    title: "Sunday Funday",
    start: "2026-10-04T09:00:00-05:00",
    allDay: true,
    location: "Central Kids Wing",
    description: "A morning of games and fun for Central Kids.",
    tag: "Central Kids",
    ministrySlug: "children",
  },
  {
    slug: "canvas-community-meal-oct14",
    title: "Canvas Community Meal",
    start: "2026-10-14T18:00:00-05:00",
    location: "823 W 6th St, Little Rock",
    description:
      "Serving the homeless community an evening meal, as we do the second Wednesday of every month.",
    tag: "Outreach",
    ministrySlug: "outreach",
    aliases: ["Canvas", "Canvas Community", "Canvas Meal"],
  },
  {
    slug: "trunk-or-treat",
    title: "Trunk or Treat",
    start: "2026-10-25T09:00:00-05:00",
    allDay: true,
    location: "823 W 6th St, Little Rock",
    description:
      "Candy donation bins will be in the lobby in the coming weeks to help supply games for the costumed ones.",
    tag: "All Church",
  },
  {
    slug: "central-discovery-oct",
    title: "Central Discovery",
    start: "2026-10-11T09:00:00-05:00",
    allDay: true,
    location: "Worship Center Lobby",
    description:
      "A quarterly \"get to know Central\" class. If you're new around here, this is for you.",
    tag: "All Church",
  },
  {
    slug: "teen-area-wide",
    title: "Teen Area Wide",
    start: "2026-10-04T09:00:00-05:00",
    allDay: true,
    location: "823 W 6th St, Little Rock",
    tag: "Central Teens",
    ministrySlug: "teens",
  },
  {
    slug: "ladies-day",
    title: "Ladies Day",
    start: "2026-10-24T09:00:00-05:00",
    allDay: true,
    location: "The Adkisons' Home",
    offsite: true,
    description: "Central's annual Ladies Day, hosted at the Adkisons'. Save the date!",
    tag: "All Church",
  },
  {
    slug: "ministry-leader-meeting",
    title: "Ministry Leader Meeting",
    start: "2026-09-21T09:00:00-05:00",
    allDay: true,
    location: "823 W 6th St, Little Rock",
    description: "Pushed back a week, to September 21 — check your email for details.",
    tag: "All Church",
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
  { item: "Madison Allen — baby shower, August 30, 1 PM, Gym Alcove", reason: "member-personal" },
  {
    item: "Sarah Laffoon — baby shower, September 13",
    reason:
      "member-personal; date corrected from September 14 — this week's bulletin says the 13th",
  },
  {
    item: "John Ramsey Allen (son of Jack & Madison Allen) — born September 10, temporary NICU stay",
    reason: "health information naming a minor — extra caution beyond the usual policy, per the Carson Brown precedent",
  },
  {
    item: "The Longo family (Bob and Amy) — grandson passed away unexpectedly, week of September 6",
    reason: "bereavement information about named individuals",
  },
  {
    item: "Caylie Mosley — expecting, January",
    reason: "member-personal, no public shower date given yet",
  },
  {
    item: "Bailey McManus — expecting, January",
    reason:
      "member-personal; shares a surname with Travelle — flagged in case it's his own family, for his call on whether to publish",
  },
  {
    item: "Emelia Duréy — baby shower, November 1, Central Church Alcove",
    reason: "member-personal",
  },
  {
    item: "Katie Watson — expecting, December",
    reason:
      "member-personal, no public shower date given yet; month corrected from January — this week's bulletin says December",
  },
  {
    item: "Brooke Money — expecting, February",
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
  {
    item: "Mo Brown — hospitalized for a second time this week, now home; meal train for the family",
    reason:
      "health information; the meal train sign-up is also withheld since publishing it would out the same hospitalization",
  },
  {
    item: "Matt McJunkins (friend of Scott & Amy Dutile) — recent back surgery",
    reason: "health information about a named individual",
  },
  {
    item: "Carson Brown (young son of Paden & Keith) — radiation treatment following tumor removal",
    reason: "health information naming a minor — extra caution beyond the usual policy",
  },
  {
    item: "Janet Hall — passed away the week of September 6; memorial service Thursday, September 17, 1 PM, Worship Center at Central",
    reason:
      "bereavement information about a named individual; per the Reese-Dobson precedent, memorial service details are withheld even when held at Central rather than off-site",
  },
  {
    item: "Mark Adkison & Pam Stamper — back issues",
    reason: "health information about named individuals",
  },
  {
    item: "Mark Adkison's dad, Ralph — cancer treatment",
    reason: "health information about a named individual",
  },
  {
    item: "Shelby Lillard (former member) — family prayer, her father passed away",
    reason: "bereavement information about a named individual",
  },
  {
    item: "Wilma Wilcox — family grieving her death",
    reason: "bereavement information about a named individual",
  },
  {
    item: "Graciella (Iglesia member) — mini stroke, prayers for her medical plan",
    reason: "health information about a named individual",
  },
  {
    item: "Gary Low — health struggles",
    reason: "health information about a named individual",
  },
  {
    item: "Roger Baker — health struggles",
    reason: "health information about a named individual",
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
