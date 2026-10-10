import { cookies, draftMode } from "next/headers";
import {
  defineLive,
  resolvePerspectiveFromCookies,
  resolveVariantFromCookies,
  type LivePerspective,
  type StrictDefinedFetchType,
} from "next-sanity/live";
import { client } from "./client";

const token = process.env.SANITY_API_READ_TOKEN;

/** Viewer token: the server uses it for drafts; the browser uses it for live draft updates in Presentation. */
export const { sanityFetch, SanityLive } = defineLive({ client, serverToken: token, browserToken: token, strict: true });

/** Every fetch carries this tag; the publish webhook (app/api/revalidate) invalidates it, i.e. the whole site. */
export const SITE_TAG = "sanity";

/** The app's single 'use cache' boundary for content. Perspective and stega are arguments, never read inside. */
export const cachedSanity: StrictDefinedFetchType = async (options) => {
  "use cache";
  return sanityFetch({ ...options, tags: [SITE_TAG, ...(options.tags ?? [])] });
};

export interface FetchMode {
  perspective: LivePerspective;
  variant?: string;
  stega: boolean;
}

export const PUBLISHED: FetchMode = { perspective: "published", stega: false };

/** Published + no stega normally; drafts + stega (click-to-edit) when draft mode is on. Reads cookies, so call it
 *  only inside a <Suspense> boundary. */
export async function getFetchMode(): Promise<FetchMode> {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return PUBLISHED;
  const jar = await cookies();
  return {
    perspective: (await resolvePerspectiveFromCookies({ cookies: jar })) ?? "drafts",
    variant: await resolveVariantFromCookies({ cookies: jar }),
    stega: true,
  };
}
