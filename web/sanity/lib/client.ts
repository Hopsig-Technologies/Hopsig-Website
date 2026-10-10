import { createClient } from "next-sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "e1ib49ry";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "development";
export const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "https://hopsig.sanity.studio";

/** Published content from the CDN. Draft mode and stega are switched on per fetch (sanity/lib/live.ts). */
export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-02-01",
  useCdn: true,
  perspective: "published",
  stega: { studioUrl },
});
