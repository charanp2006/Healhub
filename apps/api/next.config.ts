import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    rules: {
      // Turbopack compiles TS natively; only add loaders here for 
      // things like '*.svg' or '*.mdx' if needed.
    },
  },
};

export default nextConfig;
