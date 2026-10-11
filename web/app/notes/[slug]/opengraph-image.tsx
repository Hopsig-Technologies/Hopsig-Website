import { stegaClean } from "next-sanity";
import { templates } from "@/content";
import { ogContentType, ogImage, ogSize } from "@/lib/og";
import { tpl } from "@/lib/tpl";
import { cachedSanity, PUBLISHED } from "@/sanity/lib/live";
import { POST_BY_SLUG_QUERY, POST_SLUGS_QUERY } from "@/sanity/queries";
import { longDate } from "@/lib/date";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Hopsig note";

export async function generateStaticParams() {
  const { data } = await cachedSanity({ query: POST_SLUGS_QUERY, ...PUBLISHED });
  return data.filter(Boolean).map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: p } = await cachedSanity({ query: POST_BY_SLUG_QUERY, params: { slug }, ...PUBLISHED });
  return ogImage({ eyebrow: tpl(templates.notePage.heroEyebrow, { category: stegaClean(p?.category) ?? "", date: longDate(stegaClean(p?.publishedAt)) }), title: stegaClean(p?.title) ?? "" });
}
