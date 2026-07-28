/**
 * One flexible ministry template drives every ministry page — each entry here
 * is a content object rendered by src/components/MinistryPage.tsx.
 * Iglesia renders fully in Spanish (lang="es") at /iglesia.
 */

export interface MinistryContact {
  name: string;
  role: string;
  ctaLabel: string;
}

export interface Ministry {
  slug: string;
  name: string;
  /** Short name for tiles and nav */
  shortName: string;
  eyebrow: string;
  lang?: "es";
  metaTitle: string;
  metaDescription: string;
  tileBlurb: string;
  intro: string;
  intro2?: string;
  weeklyHeading?: string;
  weekly?: { eyebrow: string; title: string; blurb: string }[];
  annualHeading?: string;
  annual?: { eyebrow: string; title: string; blurb: string }[];
  listHeading?: string;
  list?: string[];
  groupsHeading?: string;
  groups?: {
    name: string;
    where?: string;
    contact: string;
    email?: string;
    phone?: string;
  }[];
  contact?: MinistryContact;
  /** Vimeo embed shown in place of the photo gallery. */
  video?: { embedUrl: string; url: string; caption: string };
  related?: { label: string; href: string }[];
  utilities?: { label: string; href: string }[];
  cta: { title: string; body: string; label: string; href: string };
}

export const ministries: Ministry[] = [
  {
    slug: "children",
    name: "Central Kids — Children's Ministry",
    shortName: "Central Kids",
    eyebrow: "Ministries · Children",
    metaTitle: "Children's Ministry | Central Church of Christ – Little Rock",
    metaDescription:
      "Central Kids serves children from birth through 5th grade in downtown Little Rock — Sunday classes, Children's Church, Story Time, and family events all year.",
    tileBlurb: "Birth through 5th grade",
    intro:
      "Central Kids is for children from birth through 5th grade and their families. Our goal is to help families teach their children about God our Creator, His plan to save the world through Jesus, and the gift of the Holy Spirit who lives in us — all within a community of faith.",
    intro2:
      "We come alongside parents to raise kids who know they are loved by God more than they can imagine.",
    weeklyHeading: "Weekly Activities",
    weekly: [
      {
        eyebrow: "Fridays",
        title: "Story Time",
        blurb: "Preschoolers and their parents, 10–11:30 AM.",
      },
      {
        eyebrow: "Sun & Wed",
        title: "Bible Classes",
        blurb: "All ages, Sunday mornings and Wednesday nights.",
      },
      {
        eyebrow: "Sundays",
        title: "Children's Church",
        blurb: "Ages 3–5, following communion.",
      },
    ],
    annualHeading: "Every Year at Central Kids",
    annual: [
      {
        eyebrow: "Easter weekend",
        title: "Easter Egg Hunt",
        blurb:
          "Games, crafts, and colorful eggs filled with treats as we celebrate the joy of Easter together. Kids of all ages welcome.",
      },
      {
        eyebrow: "First week of summer",
        title: "Kids Week",
        blurb:
          "An unforgettable day camp filled with games, crafts, music, and faith lessons designed to help kids grow and thrive.",
      },
      {
        eyebrow: "Sunday before Halloween",
        title: "Trunk or Treat",
        blurb:
          "A safe, exciting evening of creatively decorated cars, candy, and community fun for Little Rock families.",
      },
    ],
    contact: {
      name: "Tammy Beck",
      role: "Children's Minister",
      ctaLabel: "Contact Tammy",
    },
    related: [
      { label: "Visit our Kids Closet", href: "/ministries/kids-closet" },
      {
        label:
          "Resources for parents of children with additional needs and/or disabilities",
        href: "/plan-a-visit",
      },
    ],
    cta: {
      title: "Bring your kids this Sunday",
      body: "Check-in opens at 9:00 AM in the Central Kids wing. Tell us you're coming and we'll meet you at the door.",
      label: "Plan a Visit",
      href: "/plan-a-visit",
    },
  },
  {
    slug: "teens",
    name: "Central Teens",
    shortName: "Central Teens",
    eyebrow: "Ministries · Students",
    metaTitle:
      "Central Teens | Youth Ministry – Central Church of Christ, Little Rock",
    metaDescription:
      "Central Teens is the youth ministry of Central Church of Christ in Little Rock — weekly gatherings, retreats, camps, and mission trips for middle and high schoolers.",
    tileBlurb: "Middle & high school",
    intro:
      "Central Teens is a community where middle and high school students in Little Rock grow in faith, build lifelong friendships, and learn they are loved by God and have a place in His Kingdom.",
    annualHeading: "Every Year with Central Teens",
    annual: [
      {
        eyebrow: "Week of July 4th",
        title: "Camp Caudle",
        blurb:
          "Every summer our teens head to Camp Caudle in Hector, Arkansas for a full week of spiritual growth and lifelong friendship.",
      },
      {
        eyebrow: "Mid-February",
        title: "Winterfest",
        blurb:
          "A weekend retreat in Gatlinburg, Tennessee, where thousands of teens, youth ministers, and sponsors worship, learn, and fellowship together.",
      },
      {
        eyebrow: "Beginning of summer",
        title: "Uplift",
        blurb:
          "A five-day summer camp at Harding University with classes, speakers, and plenty of recreation — all designed to encourage spiritual growth.",
      },
    ],
    utilities: [
      { label: "Update Info", href: "/plan-a-visit#contact" },
      { label: "Sign Up for Alerts", href: "/plan-a-visit#contact" },
    ],
    contact: {
      name: "James Mosley",
      role: "Student Minister",
      ctaLabel: "Contact James",
    },
    cta: {
      title: "Bring a friend Wednesday night",
      body: "Classes meet Wednesdays at 6:30 PM. First time? James and the crew will be looking for you.",
      label: "Plan a Visit",
      href: "/plan-a-visit",
    },
  },
  {
    slug: "life-groups",
    name: "Life Groups at Central",
    shortName: "Life Groups",
    eyebrow: "Ministries · Life Groups",
    metaTitle:
      "Life Groups & Small Groups | Central Church of Christ – Little Rock",
    metaDescription:
      "Find your people at Central Church of Christ. Life Groups meet across Little Rock by age and stage — real discipleship in smaller, closer settings.",
    tileBlurb: "By age and stage",
    intro:
      "We love worshiping together as a whole congregation on Sunday mornings — but true discipleship happens in smaller, more intimate settings. Life Groups gather regularly to learn, challenge, and encourage one another in faith, each tailored to an age and stage of life so you can grow alongside your peers.",
    groupsHeading: "Find Your Life Group",
    groups: [
      {
        name: "20's",
        where: "Upstairs in the Spiritual Growth Center",
        contact: "Cody Rozell",
        email: "crozell97@gmail.com",
        phone: "903-504-9455",
      },
      {
        name: "30's",
        where: "Fellowship East, Spiritual Growth Center",
        contact: "Brad Wolhuter",
        email: "bwolhute@harding.edu",
        phone: "501-207-3994",
      },
      {
        name: "40's",
        contact: "Chad Tappe",
        email: "CTappe@cacmustangs.org",
      },
      {
        name: "50's / NEXT",
        contact: "Brian Beck",
        email: "brianb@capitolblue.com",
        phone: "501-352-2446",
      },
      {
        name: "60's & Up",
        where: "Fellowship West, Spiritual Growth Center",
        contact: "Dennis Mitchell",
        email: "jayhawkden@att.net",
        phone: "501-515-7479",
      },
    ],
    cta: {
      title: "Not sure where you fit?",
      body: "Come to the Small Group Fair or just ask on a Sunday — we'll walk you to the right room.",
      label: "See upcoming events",
      href: "/events",
    },
  },
  {
    slug: "kids-closet",
    name: "Kids Closet — Free Children's Clothing for Little Rock Families",
    shortName: "Kids Closet",
    eyebrow: "Ministries · Community",
    metaTitle:
      "Kids Closet | Free Children's Clothing & Baby Items – Little Rock",
    metaDescription:
      "Central's Kids Closet provides free gently-used children's clothing, baby items, and toys to Little Rock families in need. Open Wednesdays & Fridays 9–11 AM.",
    tileBlurb: "Free children's clothing and baby items. Wed & Fri, 9–11 AM.",
    intro:
      "Central's Kids Closet provides gently used children's clothing, toys, and baby items free of charge to church and community members in need across Little Rock. Open Wednesday and Friday mornings, 9–11 AM — always free.",
    listHeading: "What You'll Find at the Kids Closet",
    list: [
      "Children's clothing (preemie–YXL)",
      "Teen/adult clothing (sizes 0–16)",
      "Seasonal clothing like coats and swimsuits",
      "Children's shoes in all sizes",
      "Socks, hats, and accessories",
      "Baby essentials: diapers, bottles, burp cloths, bibs, swaddles, blankets, bedding",
      "Baby toys and play mats",
      "Children's toys and books",
      "Baby walkers, strollers, and car seats",
    ],
    utilities: [
      {
        label: "Schedule a Time to Shop (always free)",
        href: "/plan-a-visit#contact",
      },
      { label: "Need Diapers?", href: "/plan-a-visit#contact" },
    ],
    contact: {
      name: "Tammy Beck",
      role: "Children's Minister",
      ctaLabel: "Contact Tammy",
    },
    cta: {
      title: "Come shop — it's always free",
      body: "Wednesday and Friday mornings, 9–11 AM at 823 W 6th St. No paperwork, no requirements.",
      label: "Schedule a time",
      href: "/plan-a-visit#contact",
    },
  },
  {
    slug: "freedom-prayer",
    name: "Freedom Prayer",
    shortName: "Freedom Prayer",
    eyebrow: "Ministries · Prayer",
    metaTitle: "Freedom Prayer Ministry | Central Church of Christ – Little Rock",
    metaDescription:
      "Freedom Prayer at Central Church of Christ equips people with tools for a mature, abiding prayer life. Learn more or sign up for a session in Little Rock.",
    tileBlurb: "Tools for a mature, abiding prayer life.",
    intro:
      "Freedom Prayer is a personal prayer ministry committed to equipping the local church with tools for prayer. With a lens toward recognizing and resolving anything that hinders a mature, abiding prayer life, Freedom Prayer trains congregations to meet the spiritual and emotional needs of their community.",
    utilities: [
      { label: "Learn More", href: "/plan-a-visit#contact" },
      { label: "Sign Up", href: "/plan-a-visit#contact" },
    ],
    video: {
      embedUrl: "https://player.vimeo.com/video/811893313",
      url: "https://vimeo.com/811893313",
      caption: "What Freedom Prayer looks like at Central",
    },
    cta: {
      title: "Ready to go deeper in prayer?",
      body: "Sign up for a Freedom Prayer session or ask any Sunday — we'd love to pray with you.",
      label: "Sign up",
      href: "/plan-a-visit#contact",
    },
  },
  {
    slug: "iglesia",
    name: "Iglesia de Cristo Central — Servicio en Español",
    shortName: "Iglesia",
    eyebrow: "Ministerios · En Español",
    lang: "es",
    metaTitle: "Iglesia de Cristo Central | Servicio en Español – Little Rock, AR",
    metaDescription:
      "Adoración en español todos los domingos a la 1:30 PM en Central Church of Christ, en el centro de Little Rock. Todos son bienvenidos.",
    tileBlurb: "Adoración en español, domingos a la 1:30 PM.",
    intro:
      "Sabemos que conocer a alguien por primera vez puede dar miedo, y asistir a una iglesia nueva puede poner nervioso a cualquiera. ¡Queremos ayudarte a que tu primera experiencia en Central, en el centro de Little Rock, sea excelente!",
    listHeading: "Qué esperar",
    list: [
      "Un servicio en español que comienza a la 1:30 PM y dura aproximadamente una hora.",
      "Cantamos canciones significativas, oramos por necesidades específicas, aprendemos de la Palabra de Dios y participamos en la Santa Cena.",
      "Nos cuidamos unos a otros y atendemos necesidades durante la semana. Se recoge una ofrenda para apoyar este esfuerzo — dar es voluntario.",
      "Nos integramos con nuestros hermanos de habla inglesa en Central Church para adorar juntos como una familia unida de Dios.",
      "Participamos en otros momentos de celebración, estudio y recreación.",
    ],
    cta: {
      title: "¡Déjanos saber que vienes!",
      body: "Si sientes curiosidad por esta familia de creyentes, ven y comprueba por ti mismo que el Señor es bueno y que Su pueblo es bendecido. 823 W 6th St, Little Rock, AR 72201 · (501) 374-2039",
      label: "Planea tu visita",
      href: "/plan-a-visit",
    },
  },
];

/**
 * English rendering of the Iglesia page. Same shape as the Spanish entry so
 * the shared template can swap between them.
 */
export const iglesiaEnglish: Ministry = {
  ...getMinistryOrThrow("iglesia"),
  lang: undefined,
  name: "Iglesia de Cristo Central — Spanish Worship",
  eyebrow: "Ministries · En Español",
  intro:
    "We know meeting someone for the first time can be daunting, and visiting a new church can make anyone nervous. We want to help make your first experience at Central, in downtown Little Rock, a great one!",
  listHeading: "What to expect",
  list: [
    "A Spanish-language service that begins at 1:30 PM and runs about an hour.",
    "We sing meaningful songs, pray for specific needs, learn from God's Word, and share communion.",
    "We look after one another and meet needs through the week. An offering supports that work — giving is voluntary.",
    "We join our English-speaking brothers and sisters at Central to worship together as one united family of God.",
    "We share other times of celebration, study, and recreation.",
  ],
  cta: {
    title: "Let us know you're coming!",
    body: "If you're curious about this family of believers, come and see for yourself that the Lord is good and His people are blessed. 823 W 6th St, Little Rock, AR 72201 · (501) 374-2039",
    label: "Plan your visit",
    href: "/plan-a-visit",
  },
};

function getMinistryOrThrow(slug: string): Ministry {
  const found = ministries.find((m) => m.slug === slug);
  if (!found) throw new Error(`Unknown ministry: ${slug}`);
  return found;
}

export function getMinistry(slug: string) {
  return ministries.find((m) => m.slug === slug);
}
