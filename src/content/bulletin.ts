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
  weekOf: "October 4, 2026",

  announcements: [
    {
      title: "It's Harvest Month!",
      body: "Each Sunday brings the sweet clanging of coins in the galvanized tub as the children race to the front of the auditorium with their offering. Their collection will fund food items for Thanksgiving meals for friends and neighbors of Central. This first Sunday of Harvest focuses on a local ministry near and dear to our hearts — Kids Closet! Lacey Hines will share information and updates from this year and goals for 2027. In the next few weeks we'll hear from our mission teams from around the world and another local ministry we treasure.",
    },
    {
      title: "Scaffolding in the East balcony",
      body: "Steven Swible is diligently addressing the ceiling tile replacements and repainting, so there's a new addition to the balcony: scaffolding. Pat him on the back for a job well done when you see him. Please continue to avoid the East side of the second floor.",
    },
    {
      title: "Trunk or Treat — candy collection",
      body: "The Trunk-or-Treat candy collection bin is in the lobby for a 25-day residency. Bring a bag or two in the next couple of weeks to supply the costumed ones. Trunks and volunteers are still needed for games, food, or setup at our annual fall event on Sunday, October 25.",
      href: "https://links.breezechms.com/ls/click?upn=u001.I1QWnEUjRQZmeILWJHEKPU4O4vzzz8eV-2BGcq3KM7D2Uewf1tcPqQEO5kTANtgBiKnuZt0OMW4pla3cuasSKqaA-3D-3Dwzii_Ku09AMy-2B3ZRmoeP2WV7CZI-2BJM-2Fi0nwKLi1tQUOIAw-2FicUOU25O2ryf-2BhNjP62rjZtVnPWhsN-2Fuuz253MmgKCBmCZsnQvBxp0BIrqUv5tPmnXjk9qmjuTe-2F0pBiSW4a1Q2v0IFLiRHGf1eP3ENQCi0xbxQI9JqeCVGBhbOfE2Hpk1um-2FQAWQCHnGWb4WRCD9rcfT39PlgeIrNP5AAgHoasH7u0dma-2BISShTTqVdN7Q9BCJXoaM7p5up6l6-2BGTiQBgVNHNTgMuun59fqXgpXmvJm0erT5mI7EaB5VWOMfzP3bfJxBlQWfAIRNQW43lpZWt",
    },
    {
      title: "Ladies Day — October 24",
      body: "The annual women's ministry Ladies Day at the Adkisons' farm is coming up on October 24! Courtney Hirscheider will be speaking about \"follow is a verb.\" You'll want to be there! Guys, that Saturday is officially a Dadurday.",
    },
    {
      title: "Sunday Funday has moved",
      body: "If you were planning to send your child to Sunday Funday, note that it has been rescheduled for October 18.",
    },
    {
      title: "Central Teens — Area Wide and Campout",
      body: "Area Wide worship is tonight — we can't wait to worship together. The Fall Campout at Lake Ouachita is almost here (October 16–18, $30). Check the Google doc for departure details and the packing list. Sign-ups are also live for the Fall Retreat.",
      contact: { name: "James Mosley", email: "james@arcentralchurch.org" },
    },
    {
      title: "Canvas Community Meal — October 14",
      body: "The next Canvas Community Meal is October 14. Rick and Barbara Jones would love a couple of extra helping hands for meal prep on site, or maybe in a more creative way.",
    },
    {
      title: "Sewing Group — Fridays",
      body: "Did you know Central has a sewing room and some talented seamstresses, too? A group of skilled ladies meets every Friday morning from 9 to 11. Anyone is welcome — if you have an affinity for sewing, want to learn a new skill, or need the aid of a sewing connoisseur. They also have several perpetual projects in motion that anyone with some experience can join in on. Nancy Lamb and Barbara Jones are your go-to ladies to contact.",
    },
    {
      title: "Small Groups — October 4 and 18",
      body: "Small groups meet October 4 and October 18. If you've held off on signing up, there's no time like the present — fill out the sign-up form on Facebook or the HUB, or reply to the weekly email to get connected.",
    },
    {
      title: "New members",
      body: "Last week two new families were welcomed, officially, to Central: Mason & Anna Burt and Grant & Julianne Tiller. Take a minute to meet and greet them.",
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
      detail: "Kicked off a study of Romans — come on and chat about it. Meets in Fellowship East.",
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
      name: "Run the Race",
      detail: "Physical activity meets ministry. Meets for six weeks.",
      room: "Gym",
      teacher: "Andrew Cheffins & Josh Ward",
    },
    {
      name: "Healthy Communication in Relationships",
      detail: "A class focusing on communication practices — the dos and don'ts — in relationships.",
      room: "Fellowship West",
      teacher: "Robert Hinojosa",
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
    "We Shall Assemble",
    "Welcome / Harvest Introduction — Lacey Hines",
    "Light the Fire",
    "Listen to Our Hearts (810)",
    "I Stand in Awe",
    "Communion — JaMarcus Joseph",
    "Jesus Let Us Come to Know You",
    "Dismiss Children's Church / Children's Giving",
    "Heart of Worship",
    "Scripture Reading",
    "Sermon: Steven Hovater",
    "Gratitude",
    "Harvest Month: Kids Closet — Lacey Hines",
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
