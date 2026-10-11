import { INDUSTRY_SLUGS, industries } from "@/content";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Hopsig industry";

export function generateStaticParams() {
  return INDUSTRY_SLUGS.map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = industries.find((x) => x.id === slug) ?? industries[0];
  return ogImage({ eyebrow: d.keyword, title: d.title.replace(/\n/g, " "), metric: d.facts[0] });
}
