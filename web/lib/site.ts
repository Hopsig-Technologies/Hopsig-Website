import { cachedSanity, type FetchMode } from "@/sanity/lib/live";
import { SETTINGS_QUERY } from "@/sanity/queries";
import { makeFill } from "./tokens";

/** The Site settings document (company values, day rate, booking link). One cache entry shared by every page. */
export async function getSettings(mode: FetchMode) {
  const { data } = await cachedSanity({ query: SETTINGS_QUERY, ...mode });
  return data;
}

/** `fill(text)` replaces the site-wide tokens whose Site settings field is filled; the rest stay visible. */
export async function getFill(mode: FetchMode) {
  return makeFill(await getSettings(mode));
}
