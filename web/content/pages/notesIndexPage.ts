// Converted once from the approved prototype (reference/site) by scripts/convert_content.mjs on 2026-10-10.
// This file is now the source of truth for this copy: edit it by hand. Bracketed [PLACEHOLDERS] stay until the
// founders replace them (CLAUDE.md rule 1). Run `pnpm check:content` after editing.
import type { NotesIndexPage } from "../types";

export const notesIndexPage = {
  hero: {
    title: "Things we would say\non the call anyway.",
    eyebrow: "Notes on software delivery and AI",
    sub: "Short and opinionated, written by the people doing the work. No newsletter, no pop-up, no reading time invented.",
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
      title: "All notes.",
    },
    readLabel: "Read",
    draftLabel: "[DRAFT]",
  },
  closing: {
    title: "Disagree with one? Thirty minutes, and bring the counter-argument.",
    showEmail: true,
    eyebrow: "Notes · the call",
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
} satisfies NotesIndexPage;
