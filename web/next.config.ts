import type { NextConfig } from "next";
import { sanity } from "next-sanity/live/cache-life";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Content is cached until Sanity says it changed (publish webhook / live events), not on a timer.
  cacheLife: { default: sanity },
  partialPrefetching: true,
  // The Rates page is gone (CLAUDE.md rule 13); shared and indexed links land on the consult page.
  async redirects() {
    return [{ source: "/rates", destination: "/book", permanent: true }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
