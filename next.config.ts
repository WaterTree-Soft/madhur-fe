import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin Turbopack's project root to this folder so it doesn't walk up
  // into the parent `madhur code/` directory (which has a stray
  // package-lock.json + Strapi node_modules). Without this, Turbopack's
  // file watcher scans the entire parent tree and blows up the heap.
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
