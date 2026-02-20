import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

module.exports = {
  ...nextConfig,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: new URL(process.env.S3_ENDPOINT || "").hostname,
        port: "",
        pathname: `/${process.env.S3_BUCKET}/**`,
      },
    ],
  },
};

export default nextConfig;
