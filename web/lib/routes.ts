/** The only place URLs are built from documents (IMPLEMENTATION_PLAN.md). Mirrors studio/schemaTypes/registry.ts. */

export const SINGLETON_ROUTES: Record<string, string> = {
  homePage: "/",
  servicesIndexPage: "/services",
  industriesIndexPage: "/industries",
  workIndexPage: "/work",
  notesIndexPage: "/notes",
  approachPage: "/approach",
  ratesPage: "/rates",
  bookPage: "/book",
  briefPage: "/brief",
  comparePage: "/why-not-just-hire",
  workingWithUsPage: "/working-with-us",
  aiTransformationPage: "/ai-transformation",
  agenticFlowPage: "/agentic-flow",
  agenciesPage: "/for-agencies",
  joinPage: "/join",
  privacyPage: "/privacy",
  termsPage: "/terms",
};

const COLLECTION_BASE: Record<string, string> = {
  service: "/services/",
  industry: "/industries/",
  caseStudy: "/work/",
  post: "/notes/",
};

/** A document as projected by queries for linking: `{_type, "slug": slug.current}`. */
export type Routable = { _type: string; slug?: string | null };

export function resolvePath(doc: Routable | null | undefined): string | null {
  if (!doc) return null;
  if (doc._type in SINGLETON_ROUTES) return SINGLETON_ROUTES[doc._type];
  const base = COLLECTION_BASE[doc._type];
  return base && doc.slug ? base + doc.slug : null;
}

/** A `link` object as projected by LINK_PROJECTION in sanity/queries.ts. */
export type ResolvedLink = {
  kind?: "internal" | "external" | null;
  href?: string | null;
  anchor?: string | null;
  internal?: Routable | null;
};

/** Link -> href. Internal links without a page target the current page's anchor. */
export function linkHref(link: ResolvedLink | null | undefined): string {
  if (!link) return "#";
  if (link.kind === "external") return link.href ?? "#";
  const path = resolvePath(link.internal) ?? "";
  return path + (link.anchor ? `#${link.anchor}` : "") || "#";
}
