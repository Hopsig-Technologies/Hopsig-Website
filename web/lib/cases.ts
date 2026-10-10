import { stegaClean } from "next-sanity";
import type { CaseKey } from "@/content/types";
import { cachedSanity, type FetchMode } from "@/sanity/lib/live";
import { CASES_BY_KEY_QUERY } from "@/sanity/queries";

/**
 * Case studies for a static page's "From the record" list, by record key, in the order the page names them.
 * GROQ `in` returns them in document order, so the order is restored here. A key with no document is skipped
 * (and reported in development) rather than breaking the page.
 */
export async function casesByKey(keys: readonly CaseKey[], mode: FetchMode) {
  const { data } = await cachedSanity({ query: CASES_BY_KEY_QUERY, params: { keys: [...keys] }, ...mode });
  const byKey = new Map(data.map((c) => [stegaClean(c.source), c]));
  return keys.flatMap((k) => {
    const c = byKey.get(k);
    if (!c && process.env.NODE_ENV !== "production") console.warn(`casesByKey: no case study with record key ${k}`);
    return c ? [c] : [];
  });
}
