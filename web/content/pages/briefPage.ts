// Converted once from the approved prototype (reference/site) by scripts/convert_content.mjs on 2026-10-10.
// This file is now the source of truth for this copy: edit it by hand. Bracketed [PLACEHOLDERS] stay until the
// founders replace them (CLAUDE.md rule 1). Run `pnpm check:content` after editing.
import type { BriefPage } from "../types";

export const briefPage = {
  hero: {
    eyebrow: "Send a brief",
    title: "Prefer writing\nto talking?",
    sub: "Four paragraphs at eleven at night is a fine way to start. Tell us the problem the way you would tell a colleague; we will come back with a yes, a no, or three questions.",
  },
  steps: [
    {
      title: "We read it the same day",
      text: "By the people who would do the work. Not a sales queue.",
    },
    {
      title: "A reply inside one working day",
      text: "Yes, no, or three questions. If no, we say who to call instead.",
    },
    {
      title: "A scope in three days, if yes",
      text: "Two pages: in, out, cost. Before you pay anything.",
    },
  ],
  note: 'Prefer talking? <a href="/book">Book a consult →</a>',
  form: {
    title: "The brief",
    duration: "5 minutes",
    fieldPlaceholders: [
      "Your name",
      "Work email",
      "Company · team size",
      "What is not working, who it hurts, what you have tried",
      "Optional · a range is fine",
      "A link, if there is a doc",
    ],
    problemLabel: "The problem",
    whenLabel: "When it needs to exist",
    whenOptions: ["This quarter", "Next quarter", "No date yet"],
    budgetLabel: "Rough budget, if you have one",
    submit: "Send the brief",
    emailFallback: "[your email]",
    // Shown instead of the confirmation while no email provider is connected (not in the reference; decided
    // 2026-10-10: build now, connect later).
    notConnected: "The brief form is not connected yet. Email it to [HELLO@HOPSIG.COM] and we will reply within one working day.",
    receivedLabel: "Received",
    receivedTitle: "We will read it today.",
    receivedText: "A reply goes to {email} inside one working day.\nIf we are not the right people, we will say who is.",
    checklist: [
      "Read by the people who would do the work",
      "No sales call unless you ask for one",
      "Scope in three days if it is a yes",
    ],
  },
  strip: ["No salespeople", "Read the same day", "Reply in one working day", "Scope in 3 days", "Delivery Centre: Lahore, Pakistan"],
} satisfies BriefPage;
