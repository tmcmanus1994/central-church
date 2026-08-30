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
  weekOf: "August 30, 2026",

  announcements: [
    {
      title: "Area Wide Worship — tonight!",
      body: "Central hosts our central Arkansas family of churches for an evening of song and prayer, right here in the auditorium, starting at 6 tonight. Parking assistance will be available (we won't call it valet, but ask nicely). No childcare is provided, though the kids area will be open for movers and shakers. Help us have the building looking nice for our guests — a glance at your row for any trash before you head out this morning goes a long way.",
    },
    {
      title: "City Connections hygiene drive — starts today",
      body: "This week officially kicks off our month-long partnership with City Connections, collecting hygiene products for Little Rock students and their families. Drop items in the collection bins in the lobby — you've got four Sundays to fill them.",
    },
    {
      title: "OnRamp Mentoring starts back Tuesday",
      body: "Tuesday is the first day of Mentoring for 2026–2027. Pray for our friends who are mentoring and our friends who are being mentored, that they'd build relationship with each other and with Jesus — and check in with them from week to week. They'd love to share how it's going.",
    },
    {
      title: "Men's Golf Tournament — Driving for Diapers",
      body: "Central's annual golf tournament is September 19 at 7:30 AM at Rebsamen Golf Course. Entry fee includes a pack of size 5 diapers for Kids Closet, and additional packs shave strokes off the score of the golfer you're supporting — label your pack with their name to get the credit. Not playing? Drop diapers in the lobby bin leading up to the tournament. RSVP by September 8.",
      contact: { name: "Josh Ward" },
    },
    {
      title: "Men's Retreat — Roots Run Deep",
      body: "A weekend of faith, fellowship, community, and adventure for the men of Central, September 25–26 at Corin Read Christian Camp in Bauxite. $20 covers lodging and meals. RSVP by September 20 for details.",
      contact: { name: "Ben Thomas" },
    },
    {
      title: "New classes starting in September",
      body: "Sunday morning Adult classes begin a study of Luke this month, running through the end of November — handy pre-work heading into Advent season. A new Sunday class, Bible 101, is starting too: no expertise needed, just questions. Find it upstairs in the SGC Library, facilitated by Shannon Cooper — seats are limited. Wednesday nights, a new women's class, Wrestling with God, starts in Fellowship West with Abbie Miller leading a practical guide to abiding with God through seasons of wrestling with Him. Helping Hands is on pause for the month while the women's class meets, and expects to pick back up in October.",
    },
    {
      title: "A new fall workout class is coming",
      body: "A class for anyone who wants to intentionally build strength in mind and body starts in the gym in mid-September — six weeks, wrapping up at the end of October. Name still being workshopped. Reach out to Josh Ward for details or to donate equipment.",
      contact: { name: "Josh Ward" },
    },
    {
      title: "Central Teens — fall sign-ups are open",
      body: "Sign-ups are live for the Campout and Fall Retreat — check the shared Google Doc for all the details. Also: SDC is waitlist only now, so pay today to confirm your spot before it spins out September 26.",
      contact: { name: "James Mosley", email: "james@arcentralchurch.org" },
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
        "Donate items in the foyer any time. Appointments can be made for large donations. Extra hands are needed hanging donations Wednesday mornings, 9–11 AM — come one week a month or every week.",
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
        "An actionable opportunity to offer support and assistance to existing Central ministries. On pause for September while the women's class meets; expected back in October.",
      room: "SGC Upstairs, Kids Closet hallway",
    },
    {
      name: "Wrestling with God",
      detail:
        "A women's class working through a practical guide to abiding with God through seasons of wrestling with Him.",
      room: "Fellowship West",
      teacher: "Abbie Miller",
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
    "Make Me a Servant",
    "Welcome",
    "Days of Elijah",
    "I Know That My Redeemer Lives (528)",
    "Still",
    "Communion",
    "Create in Me a Clean Heart",
    "Prayer for the Lost",
    "Dismiss Children's Church",
    "Holy Forever",
    "Scripture Reading",
    "Sermon: Steven Hovater",
    "Light the Fire",
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
