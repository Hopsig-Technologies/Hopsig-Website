import { termsPage as page, seo } from "@/content";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = seo["/terms"].title;

export default function Image() {
  return ogImage({
    eyebrow: page.hero.eyebrow,
    title: page.hero.title.replace(/\n/g, " "),
  });
}
