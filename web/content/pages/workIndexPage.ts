// Converted once from the approved prototype (reference/site) by scripts/convert_content.mjs on 2026-10-10.
// This file is now the source of truth for this copy: edit it by hand. Bracketed [PLACEHOLDERS] stay until the
// founders replace them (CLAUDE.md rule 1). Run `pnpm check:content` after editing.
import type { WorkIndexPage } from "../types";

export const workIndexPage = {
  hero: {
    title: "What we shipped.\nWhat it measured.",
    eyebrow: "Software case studies",
    sub: "Case notes, not case studies: the problem, what we did, and the number that moved. Client names are withheld throughout. Every system here was built, run or measured by us, and any of them can be walked through on the call.",
    buttons: [
      {
        label: "Book a consult",
        href: "/book",
        variant: "lime",
      },
    ],
  },
  selected: {
    head: {
      title: "Selected.",
      aside: "Twelve with the numbers on them",
    },
    fullCards: 12,
    restTitle: "The rest of the record.",
    restAside: "20 more · ask for any of them on the call",
  },
  reporting: {
    head: {
      eyebrow: "How we report",
      title: "Measured before we claim it improved.",
      sub: "Every case note above uses the same rule as every fortnightly review: a number from before, the same number from after, and the unit. Where the record only has the outcome in words, the number is marked to be added rather than invented.",
    },
    points: [
      "Baseline taken in week one, in your environment",
      "Same metric, same query, after the increment",
      "Written into the review you sign, not a slide",
    ],
  },
  closing: {
    title: "Bring the problem. We may have solved one like it.",
    showEmail: true,
    eyebrow: "Work · the call",
    buttons: [
      {
        label: "Book a consult",
        href: "/book",
        variant: "lime",
      },
      {
        label: "See our work",
        href: "/work",
        variant: "outline",
      },
    ],
  },
} satisfies WorkIndexPage;
