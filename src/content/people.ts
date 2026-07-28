export interface Person {
  name: string;
  role: string;
  bio?: string;
}

export const leadMinister: Person = {
  name: "Steven Hovater",
  role: "Lead Minister",
  bio: "Steven has served as Lead Minister at Central for three years, guiding our church through preaching and teaching that invites us to listen for God's voice together. He is passionate about helping people grow a vibrant spirituality by connecting deeply with God and one another. His vision is for Central to be a Spirit-filled community where relationships flourish — reminding us that the most powerful truth is that we are loved by God.",
};

export const ministryLeaders: Person[] = [
  {
    name: "Tammy Beck",
    role: "Children's Minister",
    bio: "Tammy has served at Central for 20 years, joyfully helping kids see God with childlike clarity. She is passionate about guiding children and families closer to Jesus and equipping parents to lead their kids to Him. Her vision: every child learns to trust Jesus and knows they are deeply loved by God.",
  },
  {
    name: "James Mosley",
    role: "Student Minister",
    bio: "James has served since June 2024, working alongside teens and volunteers to create a culture of love in a challenging world. He is passionate about helping every student know they are loved by God and have a place in His Kingdom — and he'll remind you that teens are truly awesome.",
  },
  {
    name: "Matt Thomas",
    role: "Outreach Minister",
    bio: "Matt joined Central in September 2024. He is passionate about meeting people where they are and sharing the life-changing news of Jesus. His vision: uniting God's children from every walk of life into one Spirit-filled family, where all are welcome to serve and be served.",
  },
];

export const elders: string[] = [
  "Mark Adkison",
  "Brian Beck",
  "Mac Bell",
  "Will Hogg",
  "Bill Lamb",
  "James Meadors",
  "Dennis Mitchell",
  "Terry Shaw",
  "Peyton Tucker",
  "Anthony Wilson",
];

export const staff: Person[] = [
  { name: "Shannon Cooper", role: "Executive Minister" },
  { name: "Meech Geter", role: "Youth Leader" },
  { name: "Lacey Hines", role: "Kids Closet Lead" },
  { name: "Travelle McManus", role: "Communication Director" },
  { name: "Ian Miller", role: "Apprentice" },
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
      { label: "Heritage Christian University", href: "https://www.hcu.edu" },
      { label: "HCCF-USA", href: "https://www.hcu.edu" },
      { label: "Bills' Newsletter", href: "https://www.hcu.edu" },
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
      { label: "Team Arequipa", href: "https://teamarequipa.net" },
      {
        label: "Christian Urban Development Association",
        href: "https://teamarequipa.net",
      },
      { label: "Harding University Latin America", href: "https://www.harding.edu" },
      { label: "Daggetts' Newsletter", href: "https://teamarequipa.net" },
    ],
  },
];
