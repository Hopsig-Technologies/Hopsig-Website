import type { MetadataRoute } from "next";
import { seo } from "@/content";
import { SITE_URL } from "@/lib/seo";
import { cachedSanity, PUBLISHED } from "@/sanity/lib/live";
import { CASE_SLUGS_QUERY, POST_SLUGS_QUERY } from "@/sanity/queries";

/** Every page with a title in web/content/seo.ts, every case note with a page and every published note. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ data: cases }, { data: notes }] = await Promise.all([
    cachedSanity({ query: CASE_SLUGS_QUERY, ...PUBLISHED }),
    cachedSanity({ query: POST_SLUGS_QUERY, ...PUBLISHED }),
  ]);
  const paths = [...Object.keys(seo), ...cases.map((s) => `/work/${s}`), ...notes.filter(Boolean).map((s) => `/notes/${s}`)];
  return paths.map((path) => ({ url: `${SITE_URL}${path === "/" ? "" : path}` }));
}
