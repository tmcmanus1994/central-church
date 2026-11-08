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
  weekOf: "November 8, 2026",

  announcements: [
    {
      title: "Canvas Community Meal — this Wednesday, November 11",
      body: "The Canvas meal is this week, Wednesday, November 11. Note that meal prep will be Tuesday afternoon. Rick and Barbara Jones are the contacts if you'd like to help.",
    },
    {
      title: "Friends and Family Meal — November 18",
      body: "The Friends and Family meal coincides with the sharing of Thanksgiving meal boxes. This is a Friendsgiving-style meal, so sign up to participate and love on our friends and neighbors — bring a dish or a side, or help serve.",
      href: "https://links.breezechms.com/ls/click?upn=u001.I1QWnEUjRQZmeILWJHEKPU4O4vzzz8eV-2BGcq3KM7D2UVZhyFrUShK-2Bkt6Hje6i1LB9-2Fa2-2B5e25h1xI7maeE0nGXAUea7bm1e7kKnv94zl8o-3DwSI__Ku09AMy-2B3ZRmoeP2WV7CZI-2BJM-2Fi0nwKLi1tQUOIAw-2FicUOU25O2ryf-2BhNjP62rjZtVnPWhsN-2Fuuz253MmgKCBjrlnAxGE99H5TX874T3ABIP3AuQHyMTyBKGcqQOd1DtTpEc-2BOAx9QdHSEf4WzpSMIi-2Bep9HUMS0uSRgT8zwB79nxoKiO4I2mt5GfNCjgXs8vih7lUXWCM2JEL-2BGOFgO-2FPGHFJb1zJYVP5vReDDFP1WMu7n5rzkvLNpQ6XHZTggC44W7A1tyLCSi2U-2BhSkrEp3Yv3VfXIAO4EkVWDhWY9OzNi6n7aALs3AIecuqfZb82",
    },
    {
      title: "Toy Store — volunteer sign-up is live for December 12",
      body: "Check out the sign-up for Toy Store on Saturday, December 12, from 7 AM to noon. Types of volunteers needed: holly jolly shoppers, wrappers, food servers, greeters, and present transporters. Volunteers must ooh and ahh over all gift choices and wrap jobs. (The author does not make the rules, just communicates them.) There are fliers on the front table of the foyer with gift ideas for all ages, and you may notice an awesome gift tracker hanging in the lobby — it's for fun and the visually inclined. We'll serve 270 kids this year, and there's a list of families who would be grateful for a prayer partner in the weeks leading up; contact Lacey to get paired with one.",
      href: "https://links.breezechms.com/ls/click?upn=u001.I1QWnEUjRQZmeILWJHEKPU4O4vzzz8eV-2BGcq3KM7D2Uewf1tcPqQEO5kTANtgBiKcof2i6S4swlmyp7YpmkU8a8aTZrWWn-2BHRSns07lRzds-3Dmbca_Ku09AMy-2B3ZRmoeP2WV7CZI-2BJM-2Fi0nwKLi1tQUOIAw-2FicUOU25O2ryf-2BhNjP62rjZtVnPWhsN-2Fuuz253MmgKCBmJ-2Bo5Anxrrkp38s9EOcNI4C1R9lsjGsHoB4K8YIBUsHS6B-2Fb8l7nZNOJ3zW4uyktezVXvl-2BTdcV0JLzLv-2BvG-2Fjw-2FywPlN-2BazpaderA6rOCYT4JtOZa24wQcMdR7QR02dtG-2BIgtpVgMff6QNzfAGPGlY9XKbv2kqM-2FTPoU6kupLt-2FfQYJ9Hm6JPnMhamG6jIwXrMdp7l9fh1xcVTiHx-2FpCgv-2FDO1Djaei2GWjSr4RfYS",
      contact: { name: "Lacey Hines", email: "lacey@arcentralchurch.org" },
    },
    {
      title: "New Safe Team signage",
      body: "You'll notice the new Safe Team signage around Central's campus. The team is standing by and regularly checking communications. If you have any questions about the signs or the Safe Team, scan the QR code, reply to the weekly email, or stop a staff member. You can also read about our approach and report a concern on the Safety page.",
      href: "/safety",
    },
    {
      title: "Central Teens — Trivia Night today, Fall Retreat next weekend",
      body: "Teens and 30's are gathering for Trivia Night today — by their powers combined, those trivia questions don't stand a chance! The anticipation for delicious dips is also high. Next weekend, November 13–15, is the Fall Retreat at Corin Read Christian Camp ($50; check the Google Doc for the details). And the Progressive Dinner is December 15 — students should bring a small ($5) gift for the gift exchange.",
      contact: { name: "James Mosley", email: "james@arcentralchurch.org" },
    },
    {
      title: "Wednesday nights in November",
      body: "Steven Hovater's three-week study on discernment and decisions continues in Fellowship East — the one adult class option for November. There are no classes on Wednesday, November 25. The annual Advent \"class\" begins December 2 and runs December 9 and 16 as well; all adults are welcome for a night of worship and discussion.",
    },
    {
      title: "Coming up",
      body: "The Mix will have \"Mixgiving\" in a few weeks, and Iglesia will have a special Thanksgiving gathering at the end of the month. The first week of December is the calm before the Toy Store prep storm — and Family Style Communion is scheduled for that first Sunday, December 6.",
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
      name: "Discernment & Decisions",
      detail:
        "Does God care what I do next? A three-week adult Bible study starting November 4 — the one adult class option for November. No classes on Wednesday, November 25.",
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
      name: "The Mix — Making Disciples 101",
      detail: "A community of young adults.",
      room: "SGC Upstairs",
      teacher: "Meech Geter",
    },
  ],

  orderOfWorship: [
    "As you enter the auditorium, pick up a communion packet in the lobby",
    "Humble Yourself (745)",
    "Welcome: Steven Hovater",
    "Deep Calls to Deep",
    "Be With Me, Lord (778)",
    "I Come to the Garden Alone (595)",
    "Communion: Peyton Tucker",
    "Quiet My Soul",
    "Be Still & Know (31)",
    "Arms of Love",
    "Prayer for Loss",
    "Dismiss Children's Church / Children's Giving",
    "What a Friend We Have in Jesus (800)",
    "Scripture Reading",
    "Sermon: Steven Hovater",
    "All in All (484)",
    "Family News",
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
