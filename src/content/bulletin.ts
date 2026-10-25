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
  weekOf: "October 25, 2026",

  announcements: [
    {
      title: "Fall Fest featuring Trunk or Treat — tonight!",
      body: "Today is Fall Fest, 4–5:30 PM at 9th St. Park / MLK Elementary: Trunk or Treat from 4–4:20, then games and fun until 5:30. Come one, come all! Those candies are going to collect themselves and those costumes are just waiting for rave reviews. Play your cards right and a cake walk could be tempted by a trade. Who can say?",
      href: "https://links.breezechms.com/ls/click?upn=u001.I1QWnEUjRQZmeILWJHEKPU4O4vzzz8eV-2BGcq3KM7D2Uewf1tcPqQEO5kTANtgBiKnuZt0OMW4pla3cuasSKqaA-3D-3Dwzii_Ku09AMy-2B3ZRmoeP2WV7CZI-2BJM-2Fi0nwKLi1tQUOIAw-2FicUOU25O2ryf-2BhNjP62rjZtVnPWhsN-2Fuuz253MmgKCBmCZsnQvBxp0BIrqUv5tPmnXjk9qmjuTe-2F0pBiSW4a1Q2v0IFLiRHGf1eP3ENQCi0xbxQI9JqeCVGBhbOfE2Hpk1um-2FQAWQCHnGWb4WRCD9rcfT39PlgeIrNP5AAgHoasH7u0dma-2BISShTTqVdN7Q9BCJXoaM7p5up6l6-2BGTiQBgVNHNTgMuun59fqXgpXmvJm0erT5mI7EaB5VWOMfzP3bfJxBlQWfAIRNQW43lpZWt",
    },
    {
      title: "Harvest Sunday — today",
      body: "Today is Harvest! Baskets will be passed the traditional way to collect checks or cash offerings. Digital gifts can be made through the giving portal on the website or by scanning the QR code in the bulletin, and if you're not quite prepared to give today, pledge cards are on the offering stands at the entrance and exit of the auditorium. At the end of service, Weston Woodruff will give a wee little presentation of financials and goals for this year's Harvest giving — never take your bathroom break during this segment of worship.",
    },
    {
      title: "Central Teens — gym hangout tonight, Fall Retreat, Trivia Night",
      body: "Teen parents, ICYMI: teens are invited to hang in the gym after Fall Fest tonight, 6–8 PM, for games and whatever else James has in store. Sign-ups are live for the Fall Retreat, November 13–15 ($50) — check the Google Doc for all the info. And save the date: the Teens and 30's Trivia Night is November 8.",
      contact: { name: "James Mosley", email: "james@arcentralchurch.org" },
    },
    {
      title: "Toy Store — think teens",
      body: "It's always time for Toy Store! Donations for all ages are welcome — there are over 70 families participating. Last year we served 100 teens, and we expect that age group to be the largest one again. The ask: if you're out and about and wonder who to shop for, think teens. Hint: gift cards are great options!",
    },
    {
      title: "November 1 — a full day of things to know",
      body: "Daylight Saving ends — fall back! It's also Family Style Communion, and small groups meet. If you've held off on signing up for a small group, fill out the sign-up form on Facebook or the HUB.",
    },
    {
      title: "Friends and Family Meal — November 18",
      body: "November 18 is the next Friends and Family Meal. It's also a collaboration with the Kids Ministry, packing and distributing Thanksgiving food boxes. Save the date and plan to join in!",
    },
    {
      title: "Iglesia Fall Retreat — this weekend, October 30–November 1",
      body: "Iglesia's fall retreat at Corin Read Christian Camp is this coming weekend.",
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
      name: "Pray, Rep, Repeat",
      detail:
        "Physical activity meets ministry — a six-week class wrapping up at the end of October.",
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
    "Blessed Be the Lord, God Almighty (72)",
    "Welcome: Harvest",
    "Days of Elijah",
    "Hymn of Heaven",
    "Communion",
    "Sweet Adoration",
    "Dismiss Children's Church / Children's Giving",
    "Lord, Reign in Me",
    "Scripture Reading",
    "Sermon: Nathan Bills",
    "If You Say Go",
    "Harvest Highlight",
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
    "October 18, 2026",
    "October 11, 2026",
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
