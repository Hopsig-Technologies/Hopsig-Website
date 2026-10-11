import { validateApiPerspective, type ClientPerspective } from "@sanity/client";
import { cacheTag } from "next/cache";
import { cookies, draftMode } from "next/headers";
import type { LivePerspective, StrictDefinedFetchType } from "next-sanity/live";
import { client } from "./client";

/**
 * Content fetching for every page. Deliberately free of `next-sanity/live`: that module imports the live
 * client component, and anything importing it puts the visual-editing kit (~570 KB) into every page's scripts
 * (PageSpeed, 2026-10-11). The live and click-to-edit tools are draft-mode only (sanity/lib/live-tools.ts,
 * loaded lazily by components/DraftTools.tsx); visitors get published content, refreshed by the publish webhook.
 * The fetch mirrors next-sanity's `sanityFetch` (published from the CDN, the viewer token for drafts and stega).
 */

const token = process.env.SANITY_API_READ_TOKEN;

/** Every fetch carries this tag; the publish webhook (app/api/revalidate) invalidates it, i.e. the whole site. */
export const SITE_TAG = "sanity";

/** The app's single 'use cache' boundary for content. Perspective and stega are arguments, never read inside. */
export const cachedSanity: StrictDefinedFetchType = async ({ query, params = {}, perspective, variant, stega, tags = [] }) => {
  "use cache";
  const cacheTags = [SITE_TAG, ...tags];
  cacheTag(...cacheTags);
  const published = perspective === "published";
  const { result, resultSourceMap } = await client.fetch(query, await params, {
    filterResponse: false,
    perspective: perspective as ClientPerspective,
    ...(variant ? { variant } : {}),
    stega,
    useCdn: published,
    token: !published || stega ? token : undefined,
    next: { revalidate: false, tags: cacheTags },
    tag: "next-loader.fetch",
  });
  return { data: result, sourceMap: resultSourceMap || null, tags: cacheTags };
};

export interface FetchMode {
  perspective: LivePerspective;
  variant?: string;
  stega: boolean;
}

export const PUBLISHED: FetchMode = { perspective: "published", stega: false };

// The Presentation tool's cookies (@sanity/preview-url-secret), read the way next-sanity reads them.
const PERSPECTIVE_COOKIE = "sanity-preview-perspective";
const VARIANT_COOKIE = "sanity-preview-variant";

function perspectiveFrom(raw: string | undefined): LivePerspective {
  const value = raw?.includes(",") ? raw.split(",") : raw;
  if (!value) return "drafts";
  try {
    validateApiPerspective(value);
    return value === "raw" ? "drafts" : (value as LivePerspective);
  } catch {
    return "drafts";
  }
}

/** Published + no stega normally; drafts + stega (click-to-edit) when draft mode is on. Reads cookies, so call it
 *  only inside a <Suspense> boundary. */
export async function getFetchMode(): Promise<FetchMode> {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return PUBLISHED;
  const jar = await cookies();
  const variant = jar.get(VARIANT_COOKIE)?.value;
  return {
    perspective: perspectiveFrom(jar.get(PERSPECTIVE_COOKIE)?.value),
    variant: variant && /^[A-Za-z0-9_-]+$/.test(variant) ? variant : undefined,
    stega: true,
  };
}
