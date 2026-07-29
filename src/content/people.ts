export interface Person {
  name: string;
  role: string;
  /**
   * Staff only. Elders are deliberately left without one — they're
   * volunteers, and the office fields anything meant for them.
   */
  email?: string;
  bio?: string;
  /** Path under /public. Omit when no headshot exists — the card falls back
   *  to a neutral placeholder and still reads correctly. */
  photo?: string;
}

export const leadMinister: Person = {
  name: "Steven Hovater",
  email: "steven@arcentralchurch.org",
  role: "Lead Minister",
  photo: "/photos/leadership-steven-hovater.webp",
  bio: "Steven has served as Lead Minister at Central for three years, guiding our church through preaching and teaching that invites us to listen for God's voice together. He is passionate about helping people grow a vibrant spirituality by connecting deeply with God and one another. His vision is for Central to be a Spirit-filled community where relationships flourish — reminding us that the most powerful truth is that we are loved by God.",
};

export const ministryLeaders: Person[] = [
  {
    name: "Tammy Beck",
    email: "tammy@arcentralchurch.org",
    role: "Children's Minister",
    photo: "/photos/leadership-tammy-beck.webp",
    bio: "Tammy has served at Central for 20 years, joyfully helping kids see God with childlike clarity. She is passionate about guiding children and families closer to Jesus and equipping parents to lead their kids to Him. Her vision: every child learns to trust Jesus and knows they are deeply loved by God.",
  },
  {
    name: "James Mosley",
    email: "james@arcentralchurch.org",
    role: "Student Minister",
    photo: "/photos/leadership-james-mosley.webp",
    bio: "James has served since June 2024, working alongside teens and volunteers to create a culture of love in a challenging world. He is passionate about helping every student know they are loved by God and have a place in His Kingdom — and he'll remind you that teens are truly awesome.",
  },
  {
    name: "Matt Thomas",
    email: "matt@arcentralchurch.org",
    role: "Outreach Minister",
    photo: "/photos/leadership-matt-thomas.webp",
    bio: "Matt joined Central in September 2024. He is passionate about meeting people where they are and sharing the life-changing news of Jesus. His vision: uniting God's children from every walk of life into one Spirit-filled family, where all are welcome to serve and be served.",
  },
];

export const elders: Person[] = [
  { name: "Mark Adkison", role: "Elder", photo: "/photos/leadership-mark-adkison.webp" },
  { name: "Brian Beck", role: "Elder", photo: "/photos/leadership-brian-beck.webp" },
  { name: "Mac Bell", role: "Elder", photo: "/photos/leadership-mac-bell.webp" },
  { name: "Will Hogg", role: "Elder", photo: "/photos/leadership-will-hogg.webp" },
  { name: "Bill Lamb", role: "Elder", photo: "/photos/leadership-bill-lamb.webp" },
  { name: "James Meadors", role: "Elder", photo: "/photos/leadership-james-meadors.webp" },
  { name: "Dennis Mitchell", role: "Elder", photo: "/photos/leadership-dennis-mitchell.webp" },
  { name: "Terry Shaw", role: "Elder", photo: "/photos/leadership-terry-shaw.webp" },
  { name: "Peyton Tucker", role: "Elder", photo: "/photos/leadership-peyton-tucker.webp" },
  { name: "Anthony Wilson", role: "Elder", photo: "/photos/leadership-anthony-wilson.webp" },
];

export const staff: Person[] = [
  { name: "Shannon Cooper", email: "shannon@arcentralchurch.org", role: "Executive Minister", photo: "/photos/leadership-shannon-cooper.webp" },
  { name: "Meech Geter", email: "meech@arcentralchurch.org", role: "Youth Leader", photo: "/photos/leadership-meech-geter.webp" },
  { name: "Lacey Hines", email: "lacey@arcentralchurch.org", role: "Kids Closet Lead", photo: "/photos/leadership-lacey-hines.webp" },
  { name: "Travelle McManus", email: "travelle@arcentralchurch.org", role: "Communication Director", photo: "/photos/leadership-travelle-mcmanus.webp" },
  { name: "Ian Miller", email: "ian@arcentralchurch.org", role: "Apprentice", photo: "/photos/leadership-ian-miller.webp" },
  { name: "Chad Tappe", email: "ctappe@cacmustangs.org", role: "Worship Leader", photo: "/photos/leadership-chad-tappe.webp" },
  { name: "Jessica Ward", email: "jessica@arcentralchurch.org", role: "Administrator", photo: "/photos/leadership-jessica-ward.webp" },
];

export interface Missionary {
  slug: string;
  heading: string;
  paragraphs: string[];
  links: { label: string; href: string }[];
}

export const missionaries: Missionary[] = [
  {
    slug: "bills",
    heading: "Meet the Bills",
    paragraphs: [
      "Since 2019, Team Bills — Nathan, Jenni, Sam, Ruby, Judah, and John Moses — has served at Heritage Christian University. Dr. Nathan is Dean of the School of Humanities and Social Sciences, Senior Lecturer in Theology and Ministry, and Ambassador to International Partners.",
      "Jenni is principal of Team Bills Academy, the homeschool bonanza enrolling four wonderful students. The family lives on campus and is deeply involved in the campus church.",
    ],
    links: [
      {
        label: "Learn More About Heritage Christian University",
        href: "https://hcuc.edu.gh/",
      },
      {
        label: "HCCF-USA",
        href: "https://hccf.networkforgood.com/projects/69796-bills-family-fundraiser_ongoing",
      },
      {
        label: "Bills' Newsletter",
        href: "https://us19.campaign-archive.com/home/?u=7f2d442a1d0cadf9559791b71&id=4ed2ea3493",
      },
    ],
  },
  {
    slug: "daggetts",
    heading: "Meet the Daggetts",
    paragraphs: [
      "Since 2014 in Arequipa, Peru, Team Daggett — Jeremy, Katie, Adileen, and Kinney — has shared faith and hope with house churches, mentored families, and worked in sustainable community development.",
      "Jeremy serves with the Christian Urban Development Association, a faith-based nonprofit empowering communities through education, small-business coaching, and community building. Katie ministers with the church and with marginalized groups. Together they direct Harding University Latin America, giving students immersive cross-cultural faith experiences.",
    ],
    links: [
      { label: "Learn More about Team Arequipa", href: "http://teamarequipa.net/" },
      {
        label: "Learn more about the Christian Urban Development Association",
        href: "http://cudaperu.org/",
      },
      {
        label: "Learn more about Harding University Latin America",
        href: "http://harding.edu/hula",
      },
      {
        label: "Daggetts' Newsletter",
        href: "https://us2.campaign-archive.com/home/?u=e215b79214f050690b805e451&id=584e1af41d",
      },
    ],
  },
];

/** Every staff member, in the order they appear on the leadership page. */
export const allStaff: Person[] = [leadMinister, ...ministryLeaders, ...staff];

/**
 * Name → email, for turning a staff mention anywhere on the site into a
 * contact button. Matches on the full name and on the first name alone,
 * because bulletin copy and event descriptions say "Contact Matt".
 */
const CONTACTS: Map<string, Person> = new Map();
for (const person of allStaff) {
  if (!person.email) continue;
  CONTACTS.set(person.name.toLowerCase(), person);
  const first = person.name.split(" ")[0].toLowerCase();
  // Skip a first name two people share — "James" is ambiguous against the
  // elder James Meadors only, but guard the general case anyway.
  if (!CONTACTS.has(first)) CONTACTS.set(first, person);
}

export function staffByName(name: string): Person | undefined {
  return CONTACTS.get(name.trim().toLowerCase());
}

/**
 * Who owns an event, by its tag.
 *
 * Most events resolve their contact through the hosting ministry page, but
 * Outreach has no page of its own and All Church has no single owner. This
 * fills the gap so an Outreach event still shows Matt.
 */
export const CONTACT_BY_TAG: Record<string, string> = {
  "Central Teens": "James Mosley",
  "Central Kids": "Tammy Beck",
  Outreach: "Matt Thomas",
  "Life Groups": "Shannon Cooper",
};
