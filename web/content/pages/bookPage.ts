// Converted once from the approved prototype (reference/site) by scripts/convert_content.mjs on 2026-10-10.
// This file is now the source of truth for this copy: edit it by hand. Bracketed [PLACEHOLDERS] stay until the
// founders replace them (CLAUDE.md rule 1). Run `pnpm check:content` after editing.
import type { BookPage } from "../types";

export const bookPage = {
  hero: {
    eyebrow: "Book a call",
    title: "Thirty minutes.\nBring the problem,\nnot a brief.",
    sub: "The people who would do the work are on the call, not a salesperson. You will leave knowing whether we can help, and roughly what it would cost.",
  },
  steps: [
    {
      title: "We listen",
      text: "Tell us the problem the way you would tell a colleague. No deck needed.",
    },
    {
      title: "We say yes or no",
      text: "On the call. If it is outside what we do well, we say which of our contacts to call.",
    },
    {
      title: "You get a scope",
      text: "If yes, a two-page SOW three days later: in, out, cost. Before you pay anything.",
    },
  ],
  note: 'Prefer writing? <a href="/brief">Send a brief →</a> — or email [HELLO@HOPSIG.COM]; reply within one working day.',
  calendar: {
    title: "Next week · 30 minutes",
    timezone: "GMT",
    prompt: "Pick a day and a time (GMT).",
    fieldPlaceholders: ["Your name", "Work email", "Company · team size", "The problem, in a sentence or two"],
    submit: "Confirm the call",
    bookedLabel: "Booked",
    bookedTitle: "See you then.",
    bookedText:
      "Invite sent to .\nThe people who would do the work will be on it. If anything changes, reply to the invite.",
    checklist: [
      "Bring the problem, not a brief",
      "Someone who can say yes to a scope",
      "Access to nothing — we will ask after",
    ],
  },
  strip: [
    "No salespeople",
    "Engineers on the call",
    "Scope in 3 days",
    "Nothing to pay before the scope",
    "Lahore · GMT+5",
  ],
} satisfies BookPage;
