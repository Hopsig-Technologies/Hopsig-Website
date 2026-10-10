import { defineQuery } from "next-sanity";

// Run `pnpm --filter studio typegen` after editing: the result types in sanity/types.ts come from these strings.
// Singleton queries filter on _type AND _id so the generated type is not a union of every document.

export const SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings" && _id == "siteSettings"][0]{
  companyRegNo, year, email, legalForm, address, vatStatus, bankCountry, dayRate, monthlyRetainer, agencyDiscount, insurance, bookingUrl
}`);

/** Case studies the static pages name by record key (services, industries, AI transformation). Order is restored in code. */
export const CASES_BY_KEY_QUERY = defineQuery(`*[_type == "caseStudy" && source in $keys]{
  _id, title, "slug": slug.current, source, domain, problem, whatWeDid, measured, stack, shape, order, hasPage, metric
}`);

/** The home case index. */
export const CASES_FEATURED_QUERY = defineQuery(`*[_type == "caseStudy" && featured == true] | order(featuredOrder asc){
  _id, title, "slug": slug.current, source, domain, problem, whatWeDid, measured, stack, shape, order, hasPage, metric, filterDomain
}`);

/** Home "All {count} case notes": how many case studies there are. */
export const CASE_COUNT_QUERY = defineQuery(`count(*[_type == "caseStudy"])`);

/** /work: every case study by order; the page renders the first N as full cards. */
export const CASES_ALL_QUERY = defineQuery(`*[_type == "caseStudy"] | order(order asc){
  _id, title, "slug": slug.current, source, domain, problem, whatWeDid, measured, stack, shape, order, hasPage, metric
}`);

export const CASE_BY_SLUG_QUERY = defineQuery(`*[_type == "caseStudy" && hasPage == true && slug.current == $slug][0]{
  _id, title, "slug": slug.current, source, domain, problem, whatWeDid, measured, stack, shape, order, hasPage, metric, seo
}`);

export const CASE_SLUGS_QUERY = defineQuery(`*[_type == "caseStudy" && hasPage == true].slug.current`);

/** Notes index and home journal: published first (newest first), then drafts as inert [DRAFT] rows. */
export const POSTS_QUERY = defineQuery(`*[_type == "post"] | order(defined(publishedAt) desc, publishedAt desc, order asc){
  _id, title, "slug": slug.current, category, excerpt, "published": defined(publishedAt)
}`);

export const POST_BY_SLUG_QUERY = defineQuery(`*[_type == "post" && defined(publishedAt) && slug.current == $slug][0]{
  _id, title, "slug": slug.current, category, excerpt, publishedAt, body, offer, closing, seo
}`);

export const POST_SLUGS_QUERY = defineQuery(`*[_type == "post" && defined(publishedAt)].slug.current`);

/** /join: roles that are not closed, in order. An empty status renders the [STATUS] placeholder. */
export const JOBS_QUERY = defineQuery(`*[_type == "jobListing" && status != "closed"] | order(order asc){
  _id, title, text, status
}`);
