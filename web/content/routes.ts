/**
 * The site's routes, declared once. `Href` is derived from these, so a content file with a mistyped internal
 * link fails `tsc`. (Next's `typedRoutes` would do the same against the real app routes; switch to it once
 * every page exists — until then it would reject every href to a page not yet built.)
 */
export const PAGE_ROUTES = [
  "/",
  "/services",
  "/industries",
  "/work",
  "/notes",
  "/approach",
  "/rates",
  "/book",
  "/brief",
  "/why-not-just-hire",
  "/working-with-us",
  "/ai-transformation",
  "/agentic-flow",
  "/for-agencies",
  "/join",
  "/privacy",
  "/terms",
] as const;

export const SERVICE_SLUGS = [
  "custom-software",
  "team-augmentation",
  "data-engineering",
  "ai-machine-learning",
  "cloud-devops",
  "legacy-modernisation",
  "mobile",
  "qa-test-automation",
] as const;

export const INDUSTRY_SLUGS = [
  "fintech-payments",
  "retail-ecommerce",
  "healthcare-life-sciences",
  "logistics-travel-marketplaces",
  "iot-signage-built-environment",
  "saas-platforms-ai-products",
] as const;

export type PageRoute = (typeof PAGE_ROUTES)[number];
export type ServiceSlug = (typeof SERVICE_SLUGS)[number];
export type IndustrySlug = (typeof INDUSTRY_SLUGS)[number];

/** Anything a link in content may point at. Case notes and notes are checked at render (they live in Sanity). */
export type Href =
  | PageRoute
  | `${PageRoute}#${string}`
  | `/services/${ServiceSlug}`
  | `/industries/${IndustrySlug}`
  | `/work/${string}`
  | `/notes/${string}`
  | `http://${string}`
  | `https://${string}`
  | `mailto:${string}`;

export const serviceHref = (slug: ServiceSlug): Href => `/services/${slug}`;
export const industryHref = (slug: IndustrySlug): Href => `/industries/${slug}`;
export const caseHref = (slug: string): Href => `/work/${slug}`;
export const noteHref = (slug: string): Href => `/notes/${slug}`;
