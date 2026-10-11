import type { Metadata } from "next";
import { seo, seoTemplates } from "@/content";

/** The site's public origin: hopsig.com once the domain is live (set NEXT_PUBLIC_SITE_URL), the Vercel URL until then. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://hopsig-website.vercel.app").replace(/\/$/, "");

export type SeoPath = keyof typeof seo;

/** Title, description, canonical URL, Open Graph and Twitter tags for one page. Relative URLs resolve against
 *  `metadataBase` (app/layout.tsx); the og:image comes from the nearest opengraph-image file. */
export function meta(path: string, title: string, description: string, type: "website" | "article" = "website"): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: seoTemplates.siteName, type, locale: "en_GB" },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** Metadata for a static page from web/content/seo.ts. */
export const pageMeta = (path: SeoPath): Metadata => meta(path, seo[path].title, seo[path].description);
