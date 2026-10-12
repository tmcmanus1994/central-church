import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // /rive is a private scratch page for trying Rive animations.
    rules: { userAgent: "*", allow: "/", disallow: "/rive" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
