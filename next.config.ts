import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // This project sits beside another Next.js app under the same parent dir.
  // Pin the workspace root so Turbopack doesn't pick the parent by lockfile.
  turbopack: { root: path.resolve(".") },

  // Cache Components: enables the `"use cache"` directive + Partial
  // Prerendering. Caching is opt-in; everything else renders at request time.
  cacheComponents: true,

  // Reusable cacheLife profile used by the blog's cached reads. Short windows
  // so revalidation is observable in the demo.
  cacheLife: {
    blog: {
      stale: 30,
      revalidate: 60,
      expire: 300,
    },
  },

  // Cover images come from picsum.photos.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "picsum.photos" }],
  },
};

export default nextConfig;
