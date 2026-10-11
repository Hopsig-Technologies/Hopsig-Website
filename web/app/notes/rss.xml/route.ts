import { stegaClean } from "next-sanity";
import { notesIndexPage, seo } from "@/content";
import { SITE_URL } from "@/lib/seo";
import { cachedSanity, PUBLISHED } from "@/sanity/lib/live";
import { POSTS_QUERY } from "@/sanity/queries";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** RSS for the published notes ("no newsletter, no pop-up" still leaves a way to follow). Dates are added in R4,
 *  once the notes carry their real publish dates. */
export async function GET() {
  const { data: posts } = await cachedSanity({ query: POSTS_QUERY, ...PUBLISHED });
  const items = posts
    .filter((p) => p.slug)
    .map((p) => {
      const url = `${SITE_URL}/notes/${stegaClean(p.slug)}`;
      return `<item><title>${esc(stegaClean(p.title) ?? "")}</title><link>${url}</link><guid>${url}</guid><description>${esc(stegaClean(p.excerpt) ?? "")}</description><category>${esc(stegaClean(p.category) ?? "")}</category></item>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(seo["/notes"].title)}</title><link>${SITE_URL}/notes</link><description>${esc(notesIndexPage.hero.sub ?? "")}</description><language>en-gb</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
