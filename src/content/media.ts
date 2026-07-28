/**
 * Media content — latest sermon/podcast episodes and blog posts.
 * Podcast episodes will eventually come from the RSS feed; blog posts
 * (~30 on the current site) migrate in with their existing URLs preserved.
 */

export interface PodcastEpisode {
  slug: string;
  title: string;
  speaker: string;
  date: string;
  duration: string;
  blurb?: string;
}

export const podcastEpisodes: PodcastEpisode[] = [
  {
    slug: "listening-for-gods-voice-together",
    title: "Listening for God's Voice Together",
    speaker: "Steven Hovater",
    date: "2026-07-26",
    duration: "38 min",
    blurb:
      "What it means to discern God's voice as a congregation, not just as individuals.",
  },
  {
    slug: "one-body-many-members",
    title: "One Body, Many Members",
    speaker: "Steven Hovater",
    date: "2026-07-19",
    duration: "35 min",
    blurb: "Romans 12 and the beauty of a congregation that doesn't match.",
  },
  {
    slug: "the-table-in-the-middle",
    title: "The Table in the Middle",
    speaker: "Matt Thomas",
    date: "2026-07-12",
    duration: "33 min",
    blurb: "Why communion sits at the center of everything we do.",
  },
];

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  body: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "what-we-learned-hosting-story-time",
    title: "What We Learned Hosting Story Time for Three Years",
    date: "2026-07-21",
    author: "Tammy Beck",
    excerpt:
      "A Friday morning for preschoolers turned into one of the most consistent ways we meet our neighbors downtown.",
    body: [
      "When we started Friday Story Time, the plan was simple: open the doors, read some books, sing a few songs, and let preschoolers burn off energy while their parents caught their breath.",
      "Three years later, it's become one of the most consistent ways we meet our neighbors in downtown Little Rock. Families who first came for the stories have joined us for Kids Week, Trunk or Treat, and Sunday mornings.",
      "If you have a preschooler, come see us any Friday from 10 to 11:30 AM in the Central Kids wing. No sign-up needed — just come.",
    ],
  },
  {
    slug: "why-we-say-following-jesus-together",
    title: "Why We Say “Following Jesus Together”",
    date: "2026-06-30",
    author: "Steven Hovater",
    excerpt:
      "Three words carry everything we believe about what a church is for.",
    body: [
      "Every church has a tagline. Ours is a sentence we try to live: Following Jesus Together.",
      "Follow, because we're learning to walk the way Jesus walked — at whatever pace each of us is moving. Jesus, because Scripture, communion, and the person of Christ sit at the center of everything we do. Together, because different backgrounds, cultures, ages, and perspectives share one downtown congregation — on purpose.",
    ],
  },
  {
    slug: "kids-closet-by-the-numbers",
    title: "Kids Closet, By the Numbers",
    date: "2026-06-09",
    author: "Lacey Hines",
    excerpt:
      "Wednesday and Friday mornings, our volunteers give away clothing, diapers, and car seats — always free. Here's what a year looks like.",
    body: [
      "Twice a week, every week, the Kids Closet opens its doors at 9 AM. Families from across Little Rock shop for children's clothing, baby essentials, toys, and books — and nobody ever pays a cent.",
      "If you or a family you know could use a hand, come by Wednesday or Friday between 9 and 11 AM, or schedule a time that works for you. And if you'd like to help, we always need sorters, greeters, and diaper-run drivers.",
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
