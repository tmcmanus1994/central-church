import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
