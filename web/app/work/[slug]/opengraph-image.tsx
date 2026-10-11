import { stegaClean } from "next-sanity";
import { templates } from "@/content";
import { ogContentType, ogImage, ogSize } from "@/lib/og";
import { tpl } from "@/lib/tpl";
import { cachedSanity, PUBLISHED } from "@/sanity/lib/live";
import { CASE_BY_SLUG_QUERY, CASE_SLUGS_QUERY } from "@/sanity/queries";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Hopsig case study";

export async function generateStaticParams() {
  const { data } = await cachedSanity({ query: CASE_SLUGS_QUERY, ...PUBLISHED });
  return data.map((slug) => ({ slug }));
}

/** The case note's title, and its number when the record has one (a placeholder is never put on an image). */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: c } = await cachedSanity({ query: CASE_BY_SLUG_QUERY, params: { slug }, ...PUBLISHED });
  const value = stegaClean(c?.metric?.value);
  return ogImage({
    eyebrow: tpl(templates.casePage.heroEyebrow, { domain: stegaClean(c?.domain) ?? "" }),
    title: stegaClean(c?.title) ?? "",
    metric: value && !value.includes("[") ? { value, label: stegaClean(c?.metric?.label) ?? "" } : undefined,
  });
}
