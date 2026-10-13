import type { MetadataRoute } from "next";
import { stegaClean } from "next-sanity";
import { seo } from "@/content";
import { SITE_URL } from "@/lib/seo";
import { cachedSanity, PUBLISHED } from "@/sanity/lib/live";
import { SITEMAP_DOCS_QUERY } from "@/sanity/queries";

/**
 * Every page with a title in web/content/seo.ts, every case note with a page and every published note. Sanity
 * documents carry `lastModified` (search engines use it when it is accurate); the static pages carry none rather
 * than a made-up date.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await cachedSanity({ query: SITEMAP_DOCS_QUERY, ...PUBLISHED });
  const at = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;
  const latest = (...d: (string | null | undefined)[]) =>
    d
      .map((x) => stegaClean(x))
      .filter((x): x is string => !!x)
      .sort()
      .at(-1);
  return [
    ...Object.keys(seo).map((path) => ({ url: at(path) })),
    ...data.cases.filter((c) => c.slug).map((c) => ({ url: at(`/work/${stegaClean(c.slug)}`), lastModified: c._updatedAt })),
    ...data.notes
      .filter((n) => n.slug)
      .map((n) => ({ url: at(`/notes/${stegaClean(n.slug)}`), lastModified: latest(n.updatedAt, n.publishedAt) })),
  ];
}
