import { SERVICE_SLUGS, services } from "@/content";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Hopsig service";

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = services.find((x) => x.id === slug) ?? services[0];
  return ogImage({ eyebrow: s.keyword, title: s.pageTitle.replace(/\n/g, " ") });
}
