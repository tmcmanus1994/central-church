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
  weekOf: "November 1, 2026",

  announcements: [
    {
      title: "A time to remember — today in worship",
      body: "This week worship will give space to remember. Remember losses — losses of people who are precious to us, and grief over losses in other shapes and forms. We'll share a family style communion and pray together a prayer of losses. Index cards will be on the communion tables for anyone who would like to name a loved one or another kind of loss, and elders and their wives will be on hand to receive them. Once communion has ended, the cards will be shared with the congregation, followed by the prayer for losses. If we are a people who follow Jesus together and rejoice with each other in times of gladness, then we will also be a people who mourn and grieve together.",
    },
    {
      title: "Today — fall back, and small groups meet",
      body: "Daylight Saving has ended, so enjoy the extra hour. Small groups meet today — if you've held off on signing up, fill out the sign-up form on Facebook or the HUB.",
    },
    {
      title: "Harvest — thank you",
      body: "Thank you for your cheerful and generous giving over the month of Harvest. Continue to be in prayer about the stewardship of the funds received and the missional ways they'll be used to the glory of the Lord next year. A broader Harvest update will be shared in a couple of weeks. Still planning to give? Visit the giving portal on the website or the Central HUB.",
    },
    {
      title: "Wednesday nights in November — Discernment & Decisions",
      body: "Starting November 4, Steven Hovater leads a three-week adult Bible study on discernment and decisions: does God care what I do next? It's the one adult class option for the month of November, in Fellowship East. There will be no classes on Wednesday, November 25. Looking ahead, the annual Advent \"class\" begins December 2 and runs the following two Wednesdays (December 2, 9, and 16) — all adults are welcome for a night of worship and discussion.",
    },
    {
      title: "Friends and Family Meal — November 18",
      body: "Save the date and plan to join in! The vibe is \"Friendsgiving\": a potluck with our friends who will receive the Thanksgiving boxes the Kids Ministry is packing. Sign up to bring a dish or a side, or to help serve the meal.",
      href: "https://links.breezechms.com/ls/click?upn=u001.I1QWnEUjRQZmeILWJHEKPU4O4vzzz8eV-2BGcq3KM7D2UVZhyFrUShK-2Bkt6Hje6i1LB9-2Fa2-2B5e25h1xI7maeE0nGXAUea7bm1e7kKnv94zl8o-3DwSI__Ku09AMy-2B3ZRmoeP2WV7CZI-2BJM-2Fi0nwKLi1tQUOIAw-2FicUOU25O2ryf-2BhNjP62rjZtVnPWhsN-2Fuuz253MmgKCBjrlnAxGE99H5TX874T3ABIP3AuQHyMTyBKGcqQOd1DtTpEc-2BOAx9QdHSEf4WzpSMIi-2Bep9HUMS0uSRgT8zwB79nxoKiO4I2mt5GfNCjgXs8vih7lUXWCM2JEL-2BGOFgO-2FPGHFJb1zJYVP5vReDDFP1WMu7n5rzkvLNpQ6XHZTggC44W7A1tyLCSi2U-2BhSkrEp3Yv3VfXIAO4EkVWDhWY9OzNi6n7aALs3AIecuqfZb82",
    },
    {
      title: "Toy Store — mark your calendar for December 12",
      body: "Toy Store is Saturday, December 12, and we'll serve 270 kids this year! A volunteer sign-up is coming your way in the next few weeks — this is an all-hands-on-deck kind of event and a great way to share a morning. Wrapping experience not required; there's something for everyone, even the young ones. For the shoppers, gift ideas (and links!) for each age group are posted in the Facebook group — every age is in need of gifts. And in these weeks leading up to Toy Store, there's a list of families who would be so grateful for you to partner with them in prayer. Contact Lacey to get paired with a family.",
      contact: { name: "Lacey Hines", email: "lacey@arcentralchurch.org" },
    },
    {
      title: "Central Teens — Trivia Night, Fall Retreat, Progressive Dinner",
      body: "The Teens and 30's Trivia Night is Sunday, November 8 — send chips, crackers, or a drink with your student. Sign-ups are live for the Fall Retreat, November 13–15 ($50); check the Google Doc for all the info. And the Progressive Dinner is December 15 — students should bring a small ($5) gift for the gift exchange.",
      contact: { name: "James Mosley", email: "james@arcentralchurch.org" },
    },
    {
      title: "Canvas Community Meal — November 11",
      body: "The next Canvas meal is Wednesday, November 11. Rick and Barbara Jones are the contacts if you'd like to help.",
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
