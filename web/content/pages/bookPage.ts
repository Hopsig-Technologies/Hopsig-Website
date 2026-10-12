// Converted once from the approved prototype (reference/site) by scripts/convert_content.mjs on 2026-10-10.
// This file is now the source of truth for this copy: edit it by hand. Bracketed [PLACEHOLDERS] stay until the
// founders replace them (CLAUDE.md rule 1). Run `pnpm check:content` after editing.
import type { BookPage } from "../types";

export const bookPage = {
  hero: {
    eyebrow: "Book a consult",
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
    // The form first, then optional slots (owner decision 2026-10-12): the next five working days from tomorrow,
    // any number of slots on any number of days, in the visitor's own time. New copy, for owner review.
    title: "A 30-minute call",
    slotsTitle: "When suits you?",
    slotsOptional: "Optional · pick any",
    slotsHint: "Times are in your own time zone. Pick as many as suit; we send the invite for one of them.",
    // Start times offered on each day (30-minute calls).
    times: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
    slotsPicked: "{n} picked:",
    slotsNone: "None picked: we will propose a time.",
    dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    emailFallback: "[your email]",
    // Shown instead of the confirmation when the request could not be emailed (not in the reference).
    notConnected: "That did not go through. Email [HELLO@HOPSIG.COM] and we will reply within one working day.",
    fieldPlaceholders: ["Your name", "Work email", "Company · team size", "The problem, in a sentence or two"],
    // "Ask about this →" on a case card carries the case title; shown above the problem field and sent as its own line.
    aboutNote: "About the case note “{title}”",
    // No booking tool (owner decision 2026-10-11): the request is emailed and the invite is sent by hand, so the
    // button and the confirmation say "request", not "booked" (deviations.json).
    // Google requires this line when its reCAPTCHA badge is hidden (it is: app/contact.css).
    captchaNote:
      'Protected by reCAPTCHA; Google’s <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply.',
    submit: "Request the call",
    bookedLabel: "Requested",
    bookedTitle: "We will confirm the time.",
    bookedText:
      "A calendar invite goes to {email} within one working day.\nThe people who would do the work will be on it. If the time does not suit, reply to the invite.",
    checklist: [
      "Bring the problem, not a brief",
      "Someone who can say yes to a scope",
      "We ask for no access before the call",
    ],
  },
  strip: [
    "No salespeople",
    "Engineers on the call",
    "Scope in 3 days",
    "Nothing to pay before the scope",
    "Delivery Centre: Lahore, Pakistan",
  ],
} satisfies BookPage;
