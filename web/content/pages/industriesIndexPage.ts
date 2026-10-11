// Converted once from the approved prototype (reference/site) by scripts/convert_content.mjs on 2026-10-10.
// This file is now the source of truth for this copy: edit it by hand. Bracketed [PLACEHOLDERS] stay until the
// founders replace them (CLAUDE.md rule 1). Run `pnpm check:content` after editing.
import type { IndustriesIndexPage } from "../types";

export const industriesIndexPage = {
  hero: {
    title: "Six industries.\nThirty-two case notes.",
    eyebrow: "Industries we build software for",
    sub: "Client names are withheld; the numbers are not. Pick the industry closest to yours and read what we shipped there, what it measured, and which of the eight services it took.",
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
  list: {
    head: {
      title: "Where we have done this before.",
    },
  },
  closing: {
    title: "If yours is not on the list, the call is still thirty minutes.",
    showEmail: true,
    eyebrow: "Industries · the call",
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
} satisfies IndustriesIndexPage;
