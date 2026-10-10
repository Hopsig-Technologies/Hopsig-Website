import { defineQuery } from "next-sanity";

/** Phase 4 check page: one singleton, the site settings and an ordered reference list. */
export const PHASE4_QUERY = defineQuery(`{
  "approach": *[_type == "approachPage" && _id == "approachPage"][0]{ hero{ eyebrow, title, sub }, closing{ eyebrow, title, sub } },
  "settings": *[_type == "siteSettings" && _id == "siteSettings"][0]{ companyRegNo, year, email, dayRate, footer, defaultClosing },
  "cases": *[_type == "homePage" && _id == "homePage"][0].caseIndex.cases[]->{ _id, title, source }
}`);
