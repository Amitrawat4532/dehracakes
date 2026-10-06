import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root (a stray lockfile exists higher up the tree).
  turbopack: { root: process.cwd() },
  images: {
    // AVIF first, WebP fallback — next/image negotiates per browser.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
