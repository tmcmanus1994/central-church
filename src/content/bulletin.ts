/**
 * The current week's bulletin, parsed from the weekly PDF.
 *
 * The printed bulletin is the church's source of truth: it carries events the
 * calendar misses, real names for entries the calendar abbreviates, and the
 * standing information (classes, ongoing ministries, order of worship) that
 * never appears on a calendar at all. Everything here comes from that PDF and
 * the Friday newsletter.
 *
 * `node scripts/import-bulletin.mjs <pdf>` parses a new bulletin into a draft
 * under `content-drafts/`, listing what changed and what needs a human read.
 * The curated copy below is then updated from it — the script never
 * overwrites this file, because bulletin shorthand ("30's potluck", "Chili
 * and Pushups") needs rewriting before it's public-facing.
 *
 * Both /bulletin and /hub read from here, so the two never drift apart.
 */

export interface BulletinAnnouncement {
  title: string;
  body: string;
  /** Staff contact only — member phone numbers and emails never publish. */
  contact?: { name: string; email?: string };
  href?: string;
}

export interface OngoingActivity {
  name: string;
  when?: string;
  detail: string;
  contact?: string;
  /** Links to the ministry page when one covers it. */
  href?: string;
}

export interface BulletinClass {
  name: string;
  detail: string;
  room?: string;
  teacher?: string;
}

/**
 * Sections the bulletin carries that a public website should not.
 *
 * Named health details, member phone numbers, family showers, and weekly
 * giving figures are all fine in a printed bulletin handed to the
 * congregation and wrong on a page anyone can find in a search engine. They
 * are parsed and kept here so the information isn't lost, and withheld from
 * rendering by the flags below.
 */
export const bulletinPolicy = {
  /** Named prayer requests carry health information about real people. */
  publishPrayerList: false,
  /** Weekly offering and budget figures. */
  publishGiving: false,
  /** Wedding and baby showers — member-personal, not church programming. */
  publishShowers: false,
};

export interface Bulletin {
  /** Human-readable week label, e.g. "July 26, 2026" */
  weekOf: string;
  /** Set once the weekly PDF is uploaded to /public/bulletins/. */
  pdfPath?: string;
  announcements: BulletinAnnouncement[];
  ongoing: OngoingActivity[];
  sundayClasses: BulletinClass[];
  wednesdayClasses: BulletinClass[];
  orderOfWorship: string[];
  kidsClosetNeeds: string[];
  /** Withheld unless `bulletinPolicy.publishGiving`. */
  giving: { lastWeek: string; weeklyBudget: string; ways: string[] };
  /** Withheld unless `bulletinPolicy.publishPrayerList`. */
  prayer: { heading: string; items: string[] }[];
  /** Past weeks, newest first. */
  archive: string[];
}

export const bulletin: Bulletin = {
  weekOf: "July 26, 2026",

  announcements: [
    {
      title: "Back to School Event — August 5",
      body: "Central's annual Back to School Event and Friends & Family Meal is Wednesday, August 5. Bring school supply donations to the building any time before August 2, or give through the online portal and we'll shop for you. Amazon and Walmart wish lists are posted on Facebook and printed in the bulletin.",
      href: "/events",
    },
    {
      title: "Promotion Sunday — August 2",
      body: "Every elementary student moves up to their new grade level class on Sunday morning, August 2. Rising 6th graders are the exception: they'll have a special promotion on Wednesday, August 5. Watch your email for details from Tammy and James.",
      contact: { name: "Tammy Beck", email: "tammy@arcentralchurch.org" },
    },
    {
      title: "Online Bible Study — Wednesdays, 11 AM",
      body: "Jane Estes is hosting a weekly online Bible study beginning Wednesday, July 29, meeting Wednesdays from 11 AM to noon. RSVP so Jane can send you the meeting link. Details are on Facebook and in the weekly email.",
      contact: { name: "the church office", email: "office@arcentralchurch.org" },
    },
    {
      title: "Donut Sale for Peru — August 2",
      body: "The Kids Ministry sells donuts again on Sunday, August 2. Proceeds fund a month of a tutor's salary at Casa Hogar El Amor de Dios — the Love of God Children's Home — in Arequipa, Peru.",
    },
    {
      title: "OnRamp Mentoring starts back this fall",
      body: "Mentoring follows the school year and meets one night a week on Tuesday evenings. There's an interest meeting on August 25, and mentorship kicks off September 1. There's already a waiting list of mentees, so no need to wonder whether you'd be matched — dedicate an hour on Tuesdays and you will be.",
      contact: { name: "the church office", email: "office@arcentralchurch.org" },
    },
    {
      title: "ESL classes are starting",
      body: "Bi-weekly English classes are starting to support families we've met through Kids Closet. If you'd like to help facilitate lessons, get in touch.",
      contact: { name: "Matt Thomas", email: "matt@arcentralchurch.org" },
    },
    {
      title: "Reserving a room",
      body: "To use any space in the building, call or email Jessica in the church office to reserve it.",
      contact: { name: "Jessica Ward", email: "jessica@arcentralchurch.org" },
    },
  ],

  ongoing: [
    {
      name: "Small Groups",
      when: "Twice monthly, September–May",
      detail: "Small communities who meet twice a month through the school year.",
      contact: "Shannon Cooper",
      href: "/ministries/life-groups",
    },
    {
      name: "OnRamp Mentoring",
      when: "Tuesday evenings through the school year",
      detail: "One evening a week mentoring a friend from the Central community.",
      contact: "Landon Dillie",
    },
    {
      name: "Encouragers Class",
      when: "Thursdays at 10:30 AM, August–May",
      detail: "Meets in Fellowship East.",
    },
    {
      name: "Preschool Story Time",
      when: "Fridays at 10 AM",
      detail: "In the Kids Area, for preschoolers and their parents.",
      href: "/ministries/children",
    },
    {
      name: "Mt. Zion Food Pantry",
      detail:
        "Bring non-perishable food to the foyer any time to help stock the Free Little Food Pantry.",
      href: "/ministries/outreach",
    },
    {
      name: "Kids Closet",
      detail:
        "Donate items in the foyer any time. Appointments can be made for large donations.",
      contact: "Lacey Hines or Lizzie Wolhuter",
      href: "/ministries/kids-closet",
    },
    {
      name: "Freedom Prayer",
      detail:
        "An intentional time of prayer for a specific need or struggle, or to seek a deeper connection with God. Sign up on the website.",
    },
    {
      name: "Canvas Community",
      when: "Second Wednesday each month",
      detail: "Serving the homeless community an evening meal.",
      contact: "Matt Thomas",
      href: "/ministries/outreach",
    },
    {
      name: "Spanish Worship Service",
      when: "Weekly, in the Spiritual Growth Center",
      detail: "A weekly service for our Spanish-speaking neighbors.",
      contact: "Matt Thomas",
      href: "/iglesia",
    },
  ],

  sundayClasses: [
    {
      name: "Adult Classes",
      detail: "Adult classes are studying 1 Corinthians.",
      room: "Fellowship East & West, SGC Upstairs",
    },
    {
      name: "The Mix",
      detail: "A community of young adults.",
      room: "SGC Upstairs",
    },
    {
      name: "Teens",
      detail: "Teen area, SGC Upstairs.",
      room: "SGC Upstairs",
    },
    {
      name: "Kids",
      detail: "All ages, in the Kids Area.",
      room: "Kids Area",
    },
  ],

  wednesdayClasses: [
    {
      name: "Spiritual Formation",
      detail:
        "A textual study from the book of Acts focused on being formed by the Holy Spirit.",
      room: "Fellowship East",
      teacher: "Steven Hovater",
    },
    {
      name: "Helping Hands",
      detail:
        "An actionable opportunity to offer support and assistance to existing Central ministries.",
      room: "SGC Upstairs, Kids Closet hallway",
    },
    {
      name: "Share",
      detail: "Joining the work of God in spreading the good news.",
      room: "Fellowship West",
      teacher: "Shannon Cooper",
    },
    {
      name: "CoParenting & Self-Care",
      detail:
        "A class to help coparents, stepparents, and single parents navigate the stress and challenges of raising kids in a non-traditional setting.",
      room: "SGC Upstairs",
      teacher: "Chaney Monan",
    },
    {
      name: "The Mix — Making Disciples 101",
      detail: "A community of young adults.",
      room: "SGC Upstairs",
      teacher: "Meech Geter",
    },
  ],

  orderOfWorship: [
    "Step by Step (15)",
    "Welcome",
    "King of My Heart",
    "Seeking the Lost (624)",
    "Behold Our God",
    "Communion",
    "Do Not Fear",
    "Prayer for the Lost",
    "Dismiss Children's Church",
    "I Will Never Be the Same Again",
    "Scripture Reading",
    "Sermon: Steven Hovater",
    "He Leadeth Me (410)",
    "Family News",
    "Greatest Commands (448)",
    "Sending Blessing",
  ],

  kidsClosetNeeds: [
    "Summer clothes — all kid sizes",
    "Children's shoes",
    "Diapers, sizes 5, 6 and 7",
  ],

  giving: {
    lastWeek: "$16,757",
    weeklyBudget: "$20,000",
    ways: [
      "Dropbox in the lobby",
      "Central HUB",
      "Mail to P.O. Box 870, Little Rock, AR 72203",
    ],
  },

  prayer: [
    {
      heading: "Ongoing",
      items: [
        "Our friends and neighbors who are seeking the Lord, and those who are lost and trying to find their way.",
        "The homeless, the chronically ill, shut-ins, foster parents and children, the unemployed, the unsaved, the incarcerated, and those dealing with mental illness, grief, depression, and anxiety.",
      ],
    },
    {
      heading: "Our missionaries",
      items: [
        "The Bills Family (Ghana)",
        "The Cerecedos (Mexico)",
        "The Daggett Family (Peru)",
      ],
    },
  ],

  archive: ["July 19, 2026", "July 12, 2026", "July 5, 2026", "June 28, 2026"],
};
