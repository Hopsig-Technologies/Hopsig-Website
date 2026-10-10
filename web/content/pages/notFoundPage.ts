// Converted once from the approved prototype (reference/site) by scripts/convert_content.mjs on 2026-10-10.
// This file is now the source of truth for this copy: edit it by hand. Bracketed [PLACEHOLDERS] stay until the
// founders replace them (CLAUDE.md rule 1). Run `pnpm check:content` after editing.
import type { NotFoundPage } from "../types";

export const notFoundPage = {
  closing: {
    title: "That page moved,\nor never shipped.",
    showEmail: false,
    eyebrow: "404 · not here",
    sub: "Try the services, the industries or the case notes. Or skip all of that: the call is still thirty minutes.",
    buttons: [
      {
        label: "Home",
        href: "/",
        variant: "lime",
      },
      {
        label: "Book a consult",
        href: "/book",
        variant: "outline",
      },
      {
        label: "See our work",
        href: "/work",
        variant: "outline",
      },
    ],
  },
} satisfies NotFoundPage;
