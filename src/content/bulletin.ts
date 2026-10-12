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
  weekOf: "October 11, 2026",

  announcements: [
    {
      title: "Harvest Month — week two",
      body: "This week's Harvest focus is Andy Landes with Contact Mission Church in Tulsa and the Daggetts' work in Peru — not local, but local to us. Central members will share about both works, their updates, and plans for the future. Kids' Harvest giving continues every Sunday in the galvanized tub up front, and they're well on their way to funding Thanksgiving meals for friends and neighbors of Central. Be prayerful in the coming weeks for our mission teams far away and the community we joyfully serve.",
    },
    {
      title: "Canvas Community Meal — this Wednesday",
      body: "Wednesday, October 14 is the next Canvas meal. Rick and Barbara Jones are the contacts for helping prep and serve on site — the more the merrier.",
    },
    {
      title: "Wednesday nights — new policy for students",
      body: "If you don't wrangle someone between the ages of 10 and 18, scroll on past. For everyone else: with the utmost kindness, the gym is off limits for unsupervised students. Students stay with their parent or guardian until the doors of the teen area open at 6:15. It may take a few weeks to settle into the new rhythm — thanks for taking student safety seriously.",
    },
    {
      title: "Fall Fest (formerly Trunk or Treat) — October 25",
      body: "Trunk or Treat has a new name: Fall Fest, happening Sunday, October 25 from 4–5:30 PM at 9th St. Park / MLK Elementary. Sign up to do a trunk for the kids to show off their costumes — it doesn't have to be elaborate unless that's your style; candy and a friendly face are all that's really required. There are plenty of behind-the-scenes ways to help too (games, food, setup), and a bin in the lobby is collecting candy donations in the coming weeks.",
      href: "https://links.breezechms.com/ls/click?upn=u001.I1QWnEUjRQZmeILWJHEKPU4O4vzzz8eV-2BGcq3KM7D2Uewf1tcPqQEO5kTANtgBiKnuZt0OMW4pla3cuasSKqaA-3D-3Dwzii_Ku09AMy-2B3ZRmoeP2WV7CZI-2BJM-2Fi0nwKLi1tQUOIAw-2FicUOU25O2ryf-2BhNjP62rjZtVnPWhsN-2Fuuz253MmgKCBmCZsnQvBxp0BIrqUv5tPmnXjk9qmjuTe-2F0pBiSW4a1Q2v0IFLiRHGf1eP3ENQCi0xbxQI9JqeCVGBhbOfE2Hpk1um-2FQAWQCHnGWb4WRCD9rcfT39PlgeIrNP5AAgHoasH7u0dma-2BISShTTqVdN7Q9BCJXoaM7p5up6l6-2BGTiQBgVNHNTgMuun59fqXgpXmvJm0erT5mI7EaB5VWOMfzP3bfJxBlQWfAIRNQW43lpZWt",
    },
    {
      title: "New Wednesday class — Healthy Communication in Relationships",
      body: "Robert Hinojosa's new class on the dos and don'ts of communication in relationships just started in Fellowship West. There's still time to join in.",
    },
    {
      title: "Central Teens — Campout this weekend",
      body: "The Fall Campout at Lake Ouachita is this weekend, October 16–18 ($30) — check the Google Doc for departure details and the packing list. Sign-ups are live for the Fall Retreat too. And save the date: a Teens and 30's Trivia Night on November 15.",
      contact: { name: "James Mosley", email: "james@arcentralchurch.org" },
    },
    {
      title: "Small Groups — October 18",
      body: "Small groups meet next Sunday, October 18. If you've held off on signing up, there's no time like the present — fill out the sign-up form on Facebook or the HUB, or reply to the weekly email to get connected.",
    },
    {
      title: "Ladies Day — October 24",
      body: "The annual Ladies Day at the Adkisons' is October 24 — mark your calendar, save the date. Guys, that Saturday is officially a Dadurday.",
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
      detail: "Studying Romans this fall. Meets in Fellowship East.",
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
        "Donate items in the foyer any time. Appointments can be made for large donations. Extra hands are needed hanging donations Wednesday mornings, 9–11 AM — come one week a month or every week.",
      contact: "Lacey Hines or Lizzie Wolhuter",
      href: "/ministries/kids-closet",
    },
    {
      name: "Sewing Group",
      when: "Fridays, 9–11 AM",
      detail: "Meets in the sewing room. Anyone is welcome, with a project in hand or willing to take one up.",
      contact: "Nancy Lamb or Barbara Jones",
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
    {
      name: "Book Study",
      when: "Starts Tuesday, September 15, 7:30 PM — every other week",
      detail:
        "Reading Inexpressible: Hesed and the Mystery of God's Lovingkindness by Michael Card, at a member's home. Message Andrea Tappe or Mary Joy Wilson for a headcount or help getting the book.",
      contact: "Andrea Tappe or Mary Joy Wilson",
    },
    {
      name: "Virtual Bible Study",
      when: "Weekly, online",
      detail: "Jane Estes hosts a weekly virtual bible study, sharing each week's topic on the Central Facebook page.",
      contact: "Jane Estes",
    },
  ],

  sundayClasses: [
    {
      name: "Adult Classes",
      detail:
        "Adult classes begin a study of Luke this September, running through the end of November — pre-work for Advent season.",
      room: "Fellowship East & West, SGC Upstairs",
    },
    {
      name: "Bible 101",
      detail: "Got a question? Come as you are — no need to be an expert. Limited seating.",
      room: "SGC Library",
      teacher: "Shannon Cooper",
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
      name: "Healthy Communication in Relationships",
      detail:
        "A class focusing on communication practices — the dos and don'ts — in relationships.",
      room: "Fellowship West",
      teacher: "Robert Hinojosa",
    },
    {
      name: "Strong Temple",
      detail:
        "Physical activity meets ministry — six weeks, for anyone who wants to intentionally build strength in mind and body.",
      room: "Gym",
      teacher: "Andrew Cheffins & Josh Ward",
    },
    {
      name: "The Mix — Making Disciples 101",
      detail: "A community of young adults.",
      room: "SGC Upstairs",
      teacher: "Meech Geter",
    },
  ],

  orderOfWorship: [
    "As you enter the auditorium, pick up a communion packet in the lobby",
    "Doxology (66)",
    "Welcome: Josiah Cooper & Caleb Cavenaugh",
    "Our God is an Awesome God",
    "Our God, He is Alive (23)",
    "Communion: Daggett Family",
    "Arms of Love",
    "Dismiss Children's Church / Children's Giving",
    "Lord, I Lift Your Name on High",
    "Scripture Reading",
    "Sermon: Steven Hovater",
    "Thank You, Lord (781)",
    "Family News",
    "Sending Blessing",
  ],

  kidsClosetNeeds: [
    "Summer clothes — all kid sizes",
    "Children's shoes",
    "Diapers — sizes 5 & 6, and pull-ups 4T & 5T",
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

  archive: [
    "September 27, 2026",
    "September 20, 2026",
    "September 13, 2026",
    "September 6, 2026",
    "August 30, 2026",
    "August 23, 2026",
    "August 16, 2026",
    "August 9, 2026",
    "August 2, 2026",
    "July 26, 2026",
    "July 19, 2026",
    "July 12, 2026",
    "July 5, 2026",
    "June 28, 2026",
  ],
};
