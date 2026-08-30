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
    slug: "river-city-revival",
    title: "Revive Us Again — River City Ministry Revival",
    start: "2026-08-22T18:00:00-05:00",
    end: "2026-08-22T20:00:00-05:00",
    location: "River City Ministry, 1021 E Washington Ave, North Little Rock, AR 72114",
    offsite: true,
    description:
      "A summer revival and gospel meeting hosted by River City Ministry in North Little Rock, themed around 2 Chronicles 7:14. Speakers: Harold Young (5th St. Church of Christ, Newport), Keith Lape (River City Church, North Little Rock), and John Armstrong (River City Ministry). Refreshments served — come as you are, all are welcome.",
    tag: "All Church",
    aliases: ["Revive Us Again", "River City Revival", "Summer Revival"],
  },
  {
    slug: "shannabration",
    title: "Shannabration",
    start: "2026-08-23T17:00:00-05:00",
    end: "2026-08-23T20:00:00-05:00",
    location: "Central Gym",
    description:
      "A 25th work-anniversary celebration honoring Shannon Cooper, with indoor and outdoor seating and two lines of food. Wear Kelly green if you've got it, and bring a side or dessert to share (green beans are popular, but feel free to branch out) — or a card of appreciation if a public toast isn't your thing. The SGC and Worship Center will be closed for the event.",
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
    slug: "mentor-info-meeting",
    title: "Mentor Info Meeting",
    start: "2026-08-25T18:00:00-05:00",
    location: "823 W 6th St, Little Rock",
    description:
      "OnRamp Mentoring's informational meeting — for mentors only this week. The program starts back September 1, meeting one evening a week on Tuesdays through the school year.",
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
      "Fellowship, fun, and a little friendly frustration on the course. Entry fee includes a pack of size 5 diapers for Kids Closet, and additional packs shave strokes off the score of the golfer you're supporting — label your pack with their name to get the credit. Not playing? Drop diapers in the lobby bin leading up to the tournament. RSVP by September 8.",
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
    item: "Caylie Mosley — expecting, January",
    reason: "member-personal, no public shower date given yet",
  },
  {
    item: "Bailey McManus — expecting, January",
    reason:
      "member-personal; shares a surname with Travelle — flagged in case it's his own family, for his call on whether to publish",
  },
  {
    item: "Emelia Duréy — expecting, January",
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
    item: "Mo Brown — hospitalized with a serious infection, now home; meal train for the family",
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
