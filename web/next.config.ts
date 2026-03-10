import type { NextConfig } from "next";

const basePath = process.env.NODE_ENV === "production" ? "/DSA" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
