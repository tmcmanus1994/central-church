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
  weekOf: "November 22, 2026",

  announcements: [
    {
      title: "Thank you, Central family",
      body: "A big, big thank you for all the ways you supported the Friends and Family meal on Wednesday! Check out the recap post on our Facebook page — and while you're perusing, be sure to watch Matt's Kids Closet video from last week. It was record breaking!",
    },
    {
      title: "Toy Store needs you — December 12",
      body: "Mark your calendar for Saturday, December 12, 7 AM to noon. This is an all-hands-on-deck kind of event, and a great way to share a morning! Volunteer to wrap presents, shop with a Central friend, be a wrapped-gift wheeler, or — most underestimatedly necessary — dispense tape. Never underestimate the need for efficient tape dispensers. For the shoppers, gift ideas (and links!) for each age group are posted in the Facebook group, and a printed gift guide with photos is on the lobby table. Take a peek at the stockings in the lobby to see which groups need some support, and keep an eye on Black Friday and Cyber Monday sales — there's always something! Our goal is 1,620 gifts. Thank you for loving these families in our Central community!",
      href: "https://links.breezechms.com/ls/click?upn=u001.I1QWnEUjRQZmeILWJHEKPU4O4vzzz8eV-2BGcq3KM7D2Uewf1tcPqQEO5kTANtgBiKcof2i6S4swlmyp7YpmkU8a8aTZrWWn-2BHRSns07lRzds-3Dmbca_Ku09AMy-2B3ZRmoeP2WV7CZI-2BJM-2Fi0nwKLi1tQUOIAw-2FicUOU25O2ryf-2BhNjP62rjZtVnPWhsN-2Fuuz253MmgKCBmJ-2Bo5Anxrrkp38s9EOcNI4C1R9lsjGsHoB4K8YIBUsHS6B-2Fb8l7nZNOJ3zW4uyktezVXvl-2BTdcV0JLzLv-2BvG-2Fjw-2FywPlN-2BazpaderA6rOCYT4JtOZa24wQcMdR7QR02dtG-2BIgtpVgMff6QNzfAGPGlY9XKbv2kqM-2FTPoU6kupLt-2FfQYJ9Hm6JPnMhamG6jIwXrMdp7l9fh1xcVTiHx-2FpCgv-2FDO1Djaei2GWjSr4RfYS",
      contact: { name: "Lacey Hines", email: "lacey@arcentralchurch.org" },
    },
    {
      title: "Wednesday nights — no class this week, Advent starts December 2",
      body: "There will be no Wednesday night class this week, November 25. Next week, on the 2nd, the Advent series begins and runs for three weeks (December 2, 9, and 16), hosted by Steven Hovater and company in Fellowship East. All are welcome! Helping Hands will pause for the month of December, and kids' classes continue as usual for those three weeks. Note there will be no Wednesday night class on December 23 or 30.",
    },
    {
      title: "Fatherhood workshops with Every Arkansan",
      body: "Central is partnering with Every Arkansan to host a series of workshops about fatherhood. The first workshop is Wednesday, December 2, from 5 to 7 PM in Fellowship West. If you'd like more info, contact Brian Beck or Carson Miller.",
    },
    {
      title: "West balcony closing for a facelift",
      body: "Balcony sitters, get ready for the closure of the West balcony — signs will be posted. Work will reconvene in the West balcony in the coming weeks, so if that's your chosen seat, please enjoy a change of scenery in the East balcony in the interim while ole Westie gets a facelift and new bulbs.",
    },
    {
      title: "Central Teens",
      body: "Small group tonight at the Mosleys' — let James know if you're going to be there! The Progressive Dinner is Sunday, December 13. Reminder that students should bring a small ($5) gift for the gift exchange.",
      contact: { name: "James Mosley", email: "james@arcentralchurch.org" },
    },
    {
      title: "Ministry leaders — meeting December 7",
      body: "Ministry leaders, mark your calendar for a meeting on Monday, December 7. An RSVP is coming your way via email — be on the lookout!",
    },
    {
      title: "Year-end giving statements",
      body: "Year-end giving statements will be sent via email again this year. Now is a good time to check that your contact info is correct on Breeze. Email Jessica if you need help.",
      contact: { name: "Jessica Ward", email: "jessica@arcentralchurch.org" },
    },
    {
      title: "New Safe Team signage",
      body: "You'll notice the new Safe Team signage around Central's campus. The team is standing by and regularly checking communications. If you have any questions about the signs or the Safe Team, scan the QR code, reply to the weekly email, or stop a staff member. You can also read about our approach and report a concern on the Safety page.",
      href: "/safety",
    },
    {
      title: "Coming up",
      body: "Today: Sunday Funday for 2nd graders, and Mixgiving for The Mix. Family Style Communion is Sunday, December 6, and small groups meet that day too. Toy Store prep runs December 7–11, and the 30's Christmas Party is Saturday, December 12.",
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
      name: "Advent Wednesdays",
      detail:
        "No class on Wednesday, November 25. The Advent series begins December 2 and runs three weeks (December 2, 9, and 16) — all are welcome. No Wednesday night class on December 23 or 30.",
      room: "Fellowship East",
      teacher: "Steven Hovater and company",
    },
    {
      name: "Helping Hands",
      detail:
        "An actionable opportunity to offer support and assistance to existing Central ministries. Paused for the month of December.",
      room: "SGC Upstairs, Kids Closet hallway",
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
    "Welcome",
    "Awesome God (He is Faithful)",
    "Majestic",
    "There is a Redeemer (287)",
    "Communion: Tommy Gault",
    "Father God",
    "Dismiss Children's Church",
    "Goodness of God",
    "Scripture Reading",
    "Sermon: Steven Hovater",
    "Thank You, Lord (781)",
    "Family News",
    "Gratitude",
    "Sending Blessing",
  ],

  kidsClosetNeeds: [
    "Clothes — all kid sizes",
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
    "November 15, 2026",
    "November 8, 2026",
    "November 1, 2026",
    "October 25, 2026",
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
