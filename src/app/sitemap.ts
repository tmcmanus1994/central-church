import type { MetadataRoute } from "next";
import { allEvents } from "@/content/events";
import { ministries } from "@/content/ministries";
import { blogPosts } from "@/content/media";
import { site } from "@/lib/site";

/** Every indexable route. `/give` is a redirect and is deliberately excluded. */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${site.url}${path}`;

  const staticPages: [string, number, MetadataRoute.Sitemap[0]["changeFrequency"]][] = [
    ["/", 1, "weekly"],
    ["/plan-a-visit", 0.9, "monthly"],
    ["/events", 0.9, "daily"],
    ["/ministries", 0.7, "monthly"],
    ["/iglesia", 0.7, "monthly"],
    ["/about", 0.6, "yearly"],
    ["/about/leadership", 0.6, "yearly"],
    ["/about/missionaries", 0.5, "yearly"],
    ["/bulletin", 0.7, "weekly"],
    ["/media", 0.6, "weekly"],
    ["/media/podcast", 0.6, "weekly"],
    ["/media/live", 0.5, "weekly"],
    ["/blog", 0.6, "weekly"],
  ];

  return [
    ...staticPages.map(([path, priority, changeFrequency]) => ({
      url: url(path),
      lastModified: new Date(),
      changeFrequency,
      priority,
    })),
    ...ministries
      .filter((m) => m.slug !== "iglesia")
      .map((m) => ({
        url: url(`/ministries/${m.slug}`),
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ...allEvents.map((e) => ({
      url: url(`/events/${e.slug}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...blogPosts.map((p) => ({
      url: url(`/blog/${p.slug}`),
      lastModified: new Date(p.date),
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
  ];
}
