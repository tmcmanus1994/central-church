import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Two blog posts (see src/content/blog.ts's header comment for which)
    // still have an image on Framer's CDN — everything else has been
    // migrated into public/blog/. Drop this entry once those two are in too.
    remotePatterns: [
      { protocol: "https", hostname: "framerusercontent.com" },
      // Vimeo poster images for the Central Kids reels (see lib/vimeo.ts).
      { protocol: "https", hostname: "i.vimeocdn.com" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/give",
        destination: "https://pushpay.com/g/arcentralchurch",
        permanent: false,
      },
      {
        source: "/ministries/iglesia",
        destination: "/iglesia",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
