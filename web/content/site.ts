// Converted once from the approved prototype (reference/site) by scripts/convert_content.mjs on 2026-10-10.
// This file is now the source of truth for this copy: edit it by hand. Bracketed [PLACEHOLDERS] stay until the
// founders replace them (CLAUDE.md rule 1). Run `pnpm check:content` after editing.
import type { Site } from "./types";

export const site = {
  footer: {
    tagline: "Senior engineers and data/AI people who join your team, or take the build end to end.",
    legalLeft: "Hopsig Technologies LLC · Sheridan, Wyoming, USA · Delivery Centre: Lahore, Pakistan",
    legalRight: "© [YEAR] · hopsig.com · [HELLO@HOPSIG.COM]",
  },
  defaultClosing: {
    title: "Thirty minutes, and you will know whether we can help.",
    sub: "Bring the problem, not a brief. If it is outside what we do well, we will say which of our contacts to call instead.",
    emailLine: "Or email [HELLO@HOPSIG.COM] — reply within one working day.",
  },
  capabilities: {
    title: "What we work in.",
    aside: "Only what we have shipped to production",
    rowOne: [
      "Backend services",
      "Frontend",
      "Data pipelines",
      "Warehousing",
      "Retrieval",
      "Evaluation harnesses",
      "Platform & CI",
      "Observability",
      "Payments",
      "Auth & SSO",
      "Search",
      "Migrations",
    ],
    rowTwo: [
      "Event streaming",
      "Batch → incremental",
      "API design",
      "Mobile",
      "Reporting",
      "Model serving",
      "Cost control",
      "On-call runbooks",
      "Data quality",
      "Integrations",
      "Access control",
      "Load & scale",
    ],
    note: "Not on the list? We will say so on the call, rather than learn it on your time.",
  },
} satisfies Site;
