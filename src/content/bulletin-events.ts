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
    slug: "sunday-funday-oct18",
    title: "Sunday Funday",
    start: "2026-10-18T09:00:00-05:00",
    allDay: true,
    location: "Central Kids Wing",
    description: "A morning of games and fun for Central Kids.",
    tag: "Central Kids",
    ministrySlug: "children",
  },
  {
    slug: "canvas-community-meal-nov11",
    title: "Canvas Community Meal",
    start: "2026-11-11T18:00:00-06:00",
    location: "823 W 6th St, Little Rock",
    description:
      "Serving the homeless community an evening meal, as we do the second Wednesday of every month. Extra helping hands are welcome for meal prep on site.",
    tag: "Outreach",
    ministrySlug: "outreach",
    aliases: ["Canvas", "Canvas Community", "Canvas Meal"],
  },
  {
    slug: "trunk-or-treat",
    title: "Fall Festival & Trunk or Treat",
    start: "2026-10-25T16:00:00-05:00",
    end: "2026-10-25T17:30:00-05:00",
    location: "MLK Elementary School Playground / 9th St. Park, Little Rock",
    offsite: true,
    description:
      "Wear your costume! Trunk or Treating 4–4:20 PM, then games and fun until 5:30. Everything's free: hot dogs, games, face painting, tattoos, and a hayride. Want to help? Sign up to do a trunk — candy and a friendly face are all that's really required — or pitch in with games, food, or setup. A bin in the lobby collects candy donations for the friends and neighbors attending.",
    tag: "All Church",
    ctaLabel: "Sign up to help",
    ctaHref:
      "https://links.breezechms.com/ls/click?upn=u001.I1QWnEUjRQZmeILWJHEKPU4O4vzzz8eV-2BGcq3KM7D2Uewf1tcPqQEO5kTANtgBiKnuZt0OMW4pla3cuasSKqaA-3D-3Dwzii_Ku09AMy-2B3ZRmoeP2WV7CZI-2BJM-2Fi0nwKLi1tQUOIAw-2FicUOU25O2ryf-2BhNjP62rjZtVnPWhsN-2Fuuz253MmgKCBmCZsnQvBxp0BIrqUv5tPmnXjk9qmjuTe-2F0pBiSW4a1Q2v0IFLiRHGf1eP3ENQCi0xbxQI9JqeCVGBhbOfE2Hpk1um-2FQAWQCHnGWb4WRCD9rcfT39PlgeIrNP5AAgHoasH7u0dma-2BISShTTqVdN7Q9BCJXoaM7p5up6l6-2BGTiQBgVNHNTgMuun59fqXgpXmvJm0erT5mI7EaB5VWOMfzP3bfJxBlQWfAIRNQW43lpZWt",
    // The Google Calendar entry is titled "Fall Festival & Trunk or Treat";
    // without that alias it sat on the site as a second, bare copy.
    aliases: [
      "Fall Fest",
      "Fall Festival",
      "Fall Festival & Trunk or Treat",
      "Fall Festival and Trunk or Treat",
      "Fall Fest & Trunk or Treat",
      "Trunk or Treat",
      "Trunk-or-Treat",
    ],
  },
  {
    slug: "ladies-day",
    title: "Ladies Day",
    start: "2026-10-24T09:00:00-05:00",
    allDay: true,
    location: "The Adkisons' Farm",
    offsite: true,
    description:
      "Central's annual fall Ladies Day at the Adkisons' farm. Courtney Hirscheider will speak on \"follow is a verb.\" Soup and sweet fellowship are on the menu, outside barring rain — check the weather, carpool if you'd like, and be prepared to park in a field. Meal sign-up is on the Facebook page.",
    tag: "All Church",
    ctaLabel: "Meal sign-up",
    ctaHref:
      "https://links.breezechms.com/ls/click?upn=u001.I1QWnEUjRQZmeILWJHEKPU4O4vzzz8eV-2BGcq3KM7D2U1SnmdZkJLrD4vcyQWxqPFnXpJ58CeGddnCt5CUDVyrQs2UvwSOLGm8WxY4lYZ7WT72cJLu9jlYHJh2NQVkYl-2Fd07khHjac50yqGz2v8aqQoj3g6WnnJgin-2BE8vXnyv96eQuirorlHfSxknf7AhG9B4i9qeRwHVnMn5gRYTO-2BABK6rw3B0Ouwd9D2f3Wo6DlUOZWzr0UG5B-2FbccmQjCF6NiTdFAFTXGtpjQ4-2FLqsneJQiD0zqGlVcFtr-2FoJUuZ0sI2Ov0-2By3n5-2Bn2jC1MzA7Y0pN-2Fmy0cjmsf8T5cyda3ZGQ-3D-3D3AGw_Ku09AMy-2B3ZRmoeP2WV7CZI-2BJM-2Fi0nwKLi1tQUOIAw-2FicUOU25O2ryf-2BhNjP62rjZtVnPWhsN-2Fuuz253MmgKCBsuNuDvClcfFPnyKDwqKbJCrYx-2FDs3-2BoMKP104S45ribFDT6EXTvHArOcW38gxlxFYCNA-2B57AHccdu9m-2F9CmXZOoJj8ZDYmTU-2FyELWMpd4SihI9J1XAhUFEQMn2q60MNDqmgEUfWb8ZLHQzMLxOUCX7uuYTFBzqZCjbF7iBXHLigBlsBQsL8AwEjUAtZhUR9w35UPN-2FX-2BqPVnpraVP0-2FK-2FVvrZEnfuv9hJospyQAHxRT",
  },
  {
    slug: "e-durey-baby-shower",
    title: "Duréy Baby Shower",
    start: "2026-11-15T13:00:00-06:00",
    location: "Church Alcove",
    description: "Baby shower for Emelia Duréy, 1 PM in the alcove. Registered at Babylist.",
    tag: "All Church",
    aliases: ["E. Duréy baby shower", "E. Durey baby shower"],
  },
  {
    slug: "teens-fall-fest-hangout",
    title: "Teens Gym Hangout after Fall Fest",
    start: "2026-10-25T18:00:00-05:00",
    end: "2026-10-25T20:00:00-05:00",
    location: "823 W 6th St, Little Rock",
    description:
      "Teens are invited to hang in the gym after Fall Fest for games and whatever else James has in store.",
    tag: "Central Teens",
    ministrySlug: "teens",
    aliases: ["Teen Hangout", "Teens Hangout", "Gym Hangout"],
  },
  {
    slug: "teen-campout",
    title: "Teen Campout",
    start: "2026-10-16T00:00:00-05:00",
    end: "2026-10-18T23:59:00-05:00",
    allDay: true,
    location: "Lake Ouachita, AR",
    offsite: true,
    description:
      "Central Teens' fall campout at Lake Ouachita, $30. Check the shared Google Doc for departure details and the packing list.",
    tag: "Central Teens",
    ministrySlug: "teens",
    aliases: ["Camp Out", "Campout", "Teens Campout", "Fall Campout"],
  },
  {
    slug: "small-groups-oct18",
    title: "Small Groups Meet",
    start: "2026-10-18T09:00:00-05:00",
    allDay: true,
    location: "823 W 6th St, Little Rock",
    description:
      "Small groups meet. If you haven't signed up, fill out the sign-up form on Facebook or the HUB.",
    tag: "Life Groups",
    ministrySlug: "life-groups",
    aliases: ["Small groups meet"],
  },
  {
    slug: "iglesia-fall-retreat",
    title: "Iglesia Fall Retreat",
    start: "2026-10-30T00:00:00-05:00",
    end: "2026-11-01T23:59:00-06:00",
    allDay: true,
    location: "Corin Read Christian Camp, Bauxite, AR",
    offsite: true,
    description: "Fall retreat weekend for Iglesia, Central's Spanish-speaking congregation, at Corin Read Christian Camp.",
    tag: "All Church",
    ministrySlug: "iglesia",
    aliases: ["Iglesia Retreat", "Retiro de Otoño"],
  },
  {
    slug: "daylight-saving-ends",
    title: "Daylight Saving Time Ends",
    start: "2026-11-01T09:00:00-06:00",
    allDay: true,
    location: "823 W 6th St, Little Rock",
    description: "Fall back! Clocks go back one hour.",
    tag: "All Church",
    aliases: ["Daylight Savings"],
  },
  {
    slug: "family-style-communion-nov1",
    title: "Family Style Communion",
    start: "2026-11-01T09:00:00-06:00",
    allDay: true,
    location: "823 W 6th St, Little Rock",
    description:
      "A time to remember losses during worship: communion served family style, index cards on the tables to name a loved one or another kind of loss, and a prayer for losses shared together.",
    tag: "All Church",
    aliases: ["Family Communion", "Family-Style Communion"],
  },
  {
    slug: "sunday-funday-nov1",
    title: "Sunday Funday",
    start: "2026-11-01T09:00:00-06:00",
    allDay: true,
    location: "Central Kids Wing",
    description: "A morning of games and fun for Central Kids.",
    tag: "Central Kids",
    ministrySlug: "children",
  },
  {
    slug: "small-groups-nov1",
    title: "Small Groups Meet",
    start: "2026-11-01T09:00:00-06:00",
    allDay: true,
    location: "823 W 6th St, Little Rock",
    description:
      "Small groups meet. If you haven't signed up, fill out the sign-up form on Facebook or the HUB.",
    tag: "Life Groups",
    ministrySlug: "life-groups",
    aliases: ["Small groups meet"],
  },
  {
    slug: "teens-fall-retreat",
    title: "Central Teens Fall Retreat",
    start: "2026-11-13T00:00:00-06:00",
    end: "2026-11-15T23:59:00-06:00",
    allDay: true,
    location: "823 W 6th St, Little Rock",
    description:
      "Central Teens' Fall Retreat, $50. Sign-ups are live — check the shared Google Doc for all the info.",
    tag: "Central Teens",
    ministrySlug: "teens",
    aliases: ["Fall Retreat", "Teen Retreat", "Teens Fall Retreat"],
  },
  {
    slug: "teens-trivia-night",
    title: "Teens & 30's Trivia Night",
    // Oct 18 email said Nov 15; the Oct 25 PDF says Nov 8 in two places and
    // the email is silent, so the newer source wins. Flagged in the run summary.
    start: "2026-11-08T09:00:00-06:00",
    allDay: true,
    location: "823 W 6th St, Little Rock",
    description:
      "A trivia night for Central Teens and the 30's group. Send chips, crackers, or a drink with your student.",
    tag: "Central Teens",
    ministrySlug: "teens",
    aliases: ["Trivia Night", "Teens Trivia Night", "Teens/30's Trivia Night"],
  },
  {
    slug: "friends-family-meal-nov18",
    title: "Friends and Family Meal",
    start: "2026-11-18T09:00:00-06:00",
    allDay: true,
    location: "823 W 6th St, Little Rock",
    description:
      "A \"Friendsgiving\" potluck with our friends who will receive the Thanksgiving boxes the Kids Ministry is packing. Sign up to bring a dish or a side, or to help serve the meal.",
    tag: "All Church",
    ctaLabel: "Sign up to bring a dish",
    ctaHref:
      "https://links.breezechms.com/ls/click?upn=u001.I1QWnEUjRQZmeILWJHEKPU4O4vzzz8eV-2BGcq3KM7D2UVZhyFrUShK-2Bkt6Hje6i1LB9-2Fa2-2B5e25h1xI7maeE0nGXAUea7bm1e7kKnv94zl8o-3DwSI__Ku09AMy-2B3ZRmoeP2WV7CZI-2BJM-2Fi0nwKLi1tQUOIAw-2FicUOU25O2ryf-2BhNjP62rjZtVnPWhsN-2Fuuz253MmgKCBjrlnAxGE99H5TX874T3ABIP3AuQHyMTyBKGcqQOd1DtTpEc-2BOAx9QdHSEf4WzpSMIi-2Bep9HUMS0uSRgT8zwB79nxoKiO4I2mt5GfNCjgXs8vih7lUXWCM2JEL-2BGOFgO-2FPGHFJb1zJYVP5vReDDFP1WMu7n5rzkvLNpQ6XHZTggC44W7A1tyLCSi2U-2BhSkrEp3Yv3VfXIAO4EkVWDhWY9OzNi6n7aALs3AIecuqfZb82",
    aliases: ["Friends & Family Meal", "Friends and Family Dinner", "Thanksgiving Boxes", "Friendsgiving"],
  },
  {
    slug: "advent-class-dec2",
    title: "Advent Wednesday",
    start: "2026-12-02T18:30:00-06:00",
    end: "2026-12-02T19:30:00-06:00",
    location: "823 W 6th St, Little Rock",
    description:
      "The annual Advent \"class\" — a night of worship and discussion for all adults, on three consecutive Wednesdays: December 2, 9, and 16.",
    tag: "All Church",
    aliases: ["Advent", "Advent Class", "Advent Wednesdays"],
  },
  {
    slug: "advent-class-dec9",
    title: "Advent Wednesday",
    start: "2026-12-09T18:30:00-06:00",
    end: "2026-12-09T19:30:00-06:00",
    location: "823 W 6th St, Little Rock",
    description:
      "The annual Advent \"class\" — a night of worship and discussion for all adults, on three consecutive Wednesdays: December 2, 9, and 16.",
    tag: "All Church",
  },
  {
    slug: "advent-class-dec16",
    title: "Advent Wednesday",
    start: "2026-12-16T18:30:00-06:00",
    end: "2026-12-16T19:30:00-06:00",
    location: "823 W 6th St, Little Rock",
    description:
      "The annual Advent \"class\" — a night of worship and discussion for all adults, on three consecutive Wednesdays: December 2, 9, and 16.",
    tag: "All Church",
  },
  {
    slug: "toy-store-2026",
    title: "Toy Store",
    start: "2026-12-12T09:00:00-06:00",
    allDay: true,
    location: "823 W 6th St, Little Rock",
    description:
      "Central's Toy Store serves 270 kids this year. It's an all-hands-on-deck morning — wrapping experience not required, and there's something for everyone, even the young ones. A volunteer sign-up is coming; gift ideas and links for each age group are in the Facebook group.",
    tag: "Outreach",
    ministrySlug: "outreach",
    aliases: ["Toy Store 2026", "Christmas Toy Store"],
  },
  {
    slug: "teens-progressive-dinner",
    title: "Central Teens Progressive Dinner",
    start: "2026-12-15T18:00:00-06:00",
    location: "823 W 6th St, Little Rock",
    description:
      "Central Teens' Progressive Dinner. Students should bring a small ($5) gift for the gift exchange.",
    tag: "Central Teens",
    ministrySlug: "teens",
    aliases: ["Progressive Dinner", "Teen Progressive Dinner"],
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
    item: "Sarah Laffoon — baby shower, September 13; due October",
    reason:
      "member-personal; date corrected from September 14 — this week's bulletin says the 13th; due month added per this week's prayer list",
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
    item: "Katie Watson — expecting a girl, December (the Oct 18 email's shower attachment said boy; corrected in the Oct 25 email)",
    reason:
      "member-personal, no public shower date given yet; month corrected from January — this week's bulletin says December",
  },
  {
    item: "Jeanie Frauenthal — recovering from hip replacement surgery",
    reason: "health information about a named individual",
  },
  {
    item: "Georgia Walker — multi-car accident, banged up but doing well and home",
    reason: "health information about a named individual",
  },
  {
    item: "Phil Watts — stroke last week, left eye affected",
    reason: "health information about a named individual",
  },
  {
    item: "Het and Molly — engagement (praise)",
    reason: "member-personal family news, from the prayer list",
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
    item: "Mark Adkison's dad, Ralph Hazel — passed away (previously: cancer treatment)",
    reason: "bereavement information about a named individual",
  },
  {
    item: "Meech & TK Geter's grandmother — cancer treatment",
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
  {
    item: "The McEuen family — grieving the death of John (uncle to Matt McEuen)",
    reason: "bereavement information about named individuals",
  },
  {
    item: "Matt Thomas — hospitalized in Conway with a virus",
    reason: "health information about a named individual",
  },
  {
    item: "Nick Garlington — recovering from shoulder surgery",
    reason: "health information about a named individual",
  },
  {
    item: "Oden Moore (6, son of a friend of Becky Bell) — leukemia diagnosis",
    reason: "health information naming a minor — extra caution beyond the usual policy",
  },
  {
    item: "Emelia Duréy and Maggie Payne — expecting, January",
    reason: "member-personal, no public shower date given",
  },
  {
    item: "Barbara Hubert, Bobby Hall, Holly Perry — continued prayers",
    reason: "named prayer requests, presumed health-related",
  },
  {
    item: "Landon Dillie's personal email address (OnRamp Mentoring contact)",
    reason: "personal email address",
  },
  {
    item: "Rick and Barbara Jones's personal email address (Canvas meal prep helpers)",
    reason: "personal email address",
  },
  { item: "Weekly offering and budget figures", reason: "internal finances" },
  {
    item: "Harvest 2026 goal ($170,000) and the weekly Kids Harvest tub totals",
    reason: "giving figures — internal finances, same as the weekly offering",
  },
  {
    item: "November baby showers — Bailey McManus (Nov 1, 1 PM, Gym Alcove; Babylist registry linked in the email; expecting a girl), Caylie Mosley (Nov 7, 10:30 AM, at a member's home, registered at Target), Meika (Wilcox) Pratt (Nov 8), Katie Watson (Nov 14)",
    reason:
      "member-personal; Emelia Duréy's Nov 15 shower is the one exception, published at Travelle's explicit request",
  },
  {
    item: "Vera Pollard — complicated health issues",
    reason: "health information about a named individual",
  },
  {
    item: "Lena Wilson — health issues",
    reason: "health information about a named individual",
  },
  {
    item: "Merrily Low — dealing with Alzheimer's",
    reason: "health information about a named individual",
  },
  {
    item: "Madi Davis — expecting, February",
    reason: "member-personal, no public shower date given",
  },
  {
    item: "Kelsey Swearengen — expecting, March",
    reason: "member-personal, no public shower date given",
  },
  {
    item: "Trace and Sarah Laffoon — baby born September 28",
    reason: "member-personal family news, consistent with the shower and expecting-mother entries",
  },
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
  {
    item: "Linda Barnes — recovering from recent surgery",
    reason: "health information about a named individual",
  },
  {
    item: "Allie Varner — recovering from an emergency appendectomy",
    reason: "health information about a named individual",
  },
  {
    item: "Ramsey — receiving extra care in the NICU",
    reason: "health information naming a minor — extra caution beyond the usual policy",
  },
  {
    item: "The Byer family, neighbors to the Dutiles — Joe died last week unexpectedly from a heart attack",
    reason: "bereavement information about named individuals",
  },
];
