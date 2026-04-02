import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        hostname: "ac.goit.global",
      },
    ],
  },
};

export default nextConfig;
