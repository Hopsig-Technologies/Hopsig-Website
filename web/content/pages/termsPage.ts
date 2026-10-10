// Converted once from the approved prototype (reference/site) by scripts/convert_content.mjs on 2026-10-10.
// This file is now the source of truth for this copy: edit it by hand. Bracketed [PLACEHOLDERS] stay until the
// founders replace them (CLAUDE.md rule 1). Run `pnpm check:content` after editing.
import type { LegalPage } from "../types";

export const termsPage = {
  hero: {
    title: "Terms of use.\nFor the site, not the work.",
    eyebrow: "Draft for counsel’s review",
    sub: "The engagement terms live in the MSA and the SOW. This page is only about reading hopsig.com.",
  },
  sections: [
    {
      heading: "These terms",
      body: [
        {
          p: "These terms cover your use of hopsig.com. Work we do for you is governed by a master services agreement and a statement of work, not by this page. If anything here conflicts with a signed agreement, the agreement wins.",
        },
      ],
    },
    {
      heading: "Using the site",
      body: [
        {
          p: "You may read, link to and quote the site with attribution. You may not scrape it, mirror it, or use it to train a model without written permission. Do not try to break it; if you find something broken, tell us at [HELLO@HOPSIG.COM] and we will thank you.",
        },
      ],
    },
    {
      heading: "What is ours",
      body: [
        {
          p: "The design, the writing and the code of the site are ours unless marked otherwise. Case notes describe work done for clients whose names are withheld; nothing on the site grants a licence to their systems or data. Third-party names appear only to describe tooling we have used.",
        },
      ],
    },
    {
      heading: "No promises",
      body: [
        {
          p: "The site is a description of how we work, not an offer capable of acceptance. Figures on the site come from our delivery record and are marked where a number is still to be added. We update them when they change; we do not guarantee they are current on the day you read them. Nothing here is advice.",
        },
      ],
    },
    {
      heading: "Liability",
      body: [
        {
          p: "To the extent the law allows, we are not liable for loss arising from your use of the site. Nothing excludes liability that cannot be excluded by law. Our liability for work done for you is set out in the signed agreement for that work.",
        },
      ],
    },
    {
      heading: "Governing law",
      body: [
        {
          p: "These terms are governed by the law of [JURISDICTION], and its courts have exclusive jurisdiction. Signed agreements may choose a different law; the agreement wins.",
        },
      ],
    },
    {
      heading: "Changes",
      body: [
        {
          p: "We may change these terms; the date at the top tells you when. Continued use after a change means you accept it.",
        },
      ],
    },
  ],
  footnote: "Last updated [DATE]\nQuestions: [HELLO@HOPSIG.COM]",
} satisfies LegalPage;
