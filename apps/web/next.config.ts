import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Keeps Next.js from failing production builds on TS errors
    ignoreBuildErrors: true, 
  },
  // If you don't have other custom loaders (like SVGR or MDX), 
  // you can completely remove the 'turbopack' object block entirely!
  turbopack: {
    rules: {
      // Turbopack compiles TS natively; only add loaders here for 
      // things like '*.svg' or '*.mdx' if needed.
    },
  },
};

export default nextConfig;


// import type { NextConfig } from "next";

  // const nextConfig: NextConfig = {
  //   typescript: {
  //     ignoreBuildErrors: true,
  //   },

  // export default nextConfig;
