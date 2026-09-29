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
  weekOf: "September 20, 2026",

  announcements: [
    {
      title: "City Connections hygiene drive — all month",
      body: "September is hygiene product collection month, partnering with City Connections to serve Little Rock students and their families. Drop items in the collection bin in the lobby any Sunday this month.",
    },
    {
      title: "Auditorium ceiling repairs — balcony seating unavailable",
      body: "Repairs on the auditorium ceiling above the balcony are underway and looking better all the time. While the work continues, that area isn't suitable for seating — if you usually sit in the balcony, please sit elsewhere for now. Signs will mark off the areas to avoid.",
    },
    {
      title: "Ministry Leaders — meeting tomorrow at 6",
      body: "The Ministry Leaders meeting is tomorrow, September 21, at 6 PM. RSVP if you haven't already!",
    },
    {
      title: "Thank you — Driving for Diapers",
      body: "Thank you to everyone who supported the Kids Closet through the Men's Ministry golf tournament, Driving for Diapers! Any boost to the Kids Closet's stock is a win — 400 families are served each week.",
    },
    {
      title: "Trunk or Treat — sign up to help, October 25",
      body: "Trunk or Treat is October 25, and it's an all-hands-on-deck event — sign up to run a trunk, run a game, or help with food (check the weekly email for the sign-up link). More than anything, be prayerful that we'll make new connections and deepen relationships with the neighbors we know. A candy donation bin will be in the lobby soon to reward the costumed ones — toss in a bag, dealer's choice.",
    },
    {
      title: "Family Style Communion — September 27",
      body: "Next Sunday, September 27, communion will be served family style during the service.",
    },
    {
      title: "New Wednesday class starting in October",
      body: "Starting the first Wednesday in October, Robert Hinojosa leads a new class, Healthy Communication in Relationships. Helping Hands also resumes that week.",
    },
    {
      title: "Men's Retreat — Roots Run Deep",
      body: "A weekend of faith, fellowship, community, and adventure for the men of Central, September 25–26 at Corin Read Christian Camp in Bauxite. $20 covers lodging and meals. If you haven't signed up yet, now's the time — tell your friends. RSVP by September 20 for details.",
      contact: { name: "Ben Thomas" },
    },
    {
      title: "Central Teens — fall sign-ups are open",
      body: "Sign-ups are live for the Fall Retreat and Teen Campout — check the shared Google Doc for all the details. The Campout is now confirmed for October 16–18 at Lake Ouachita. Also: SDC is waitlist only, so pay today to confirm your spot before the trip on September 26.",
      contact: { name: "James Mosley", email: "james@arcentralchurch.org" },
    },
    {
      title: "Ladies Day — October 24",
      body: "The annual Ladies Day at the Adkisons' is October 24 — mark your calendar, save the date. Guys, that Saturday is officially a Dadurday.",
    },
    {
      title: "Around the building",
      body: "Take a glance at the desk in the lobby — a little collection of items left behind over the past few weeks is waiting to be claimed (that travel mug you've been missing might be there). Some kid items are in the blue bin in the Kids Area hallway too. And our resident \"wee church mice\" have been leaving behind empty communion cups around the auditorium again — sleight-of-hand pros, save the tricks for family game night and toss your cups on the way out.",
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
      detail: "Starting a study of Romans this Thursday, September 24. Meets in Fellowship East.",
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
        "An actionable opportunity to offer support and assistance to existing Central ministries. On pause while the women's class meets; expected back in October.",
      room: "SGC Upstairs, Kids Closet hallway",
    },
    {
      name: "3M's: Mind, Muscle, Ministry",
      detail:
        "Physical activity meets ministry — six weeks, for anyone who wants to intentionally build strength in mind and body.",
      room: "Gym",
      teacher: "Josh Ward",
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
    "As you enter the auditorium, pick up a communion packet in the lobby",
    "Doxology (66)",
    "Welcome",
    "Just a Little Talk with Jesus (959)",
    "Psalm 23 (Taste & See)",
    "Revelation Song",
    "Communion",
    "Turn Your Eyes Upon Jesus (276)",
    "Hosanna You're My King",
    "Dismiss Children's Church",
    "Hymn of Heaven",
    "Scripture Reading",
    "Sermon: Steven Hovater",
    "Covenant of Love",
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
