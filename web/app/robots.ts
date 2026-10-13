import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Everyone may crawl everything but the API (owner decision 2026-10-13: be as visible as possible, AI assistants
 * included). The AI and search crawlers are also named, so the welcome is explicit rather than implied by `*`.
 */
const NAMED = [
  // Search
  "Googlebot",
  "Bingbot",
  "Applebot",
  "DuckDuckBot",
  // AI search and assistants
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "meta-externalagent",
  "Amazonbot",
  "DuckAssistBot",
  "MistralAI-User",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }, { userAgent: NAMED, allow: "/", disallow: ["/api/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
