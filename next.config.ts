import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Blog images still live on Framer's CDN. Migrate them into public/blog/
    // before the Framer site is decommissioned, then drop this entry.
    remotePatterns: [
      { protocol: "https", hostname: "framerusercontent.com" },
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
