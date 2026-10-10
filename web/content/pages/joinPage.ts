// Converted once from the approved prototype (reference/site) by scripts/convert_content.mjs on 2026-10-10.
// This file is now the source of truth for this copy: edit it by hand. Bracketed [PLACEHOLDERS] stay until the
// founders replace them (CLAUDE.md rule 1). Run `pnpm check:content` after editing.
import type { JoinPage } from "../types";

export const joinPage = {
  hero: {
    title: "Senior only\nmeans something.",
    eyebrow: "Join · for engineers",
    sub: "We put engineers inside clients' teams in the UK, US and EU, or build for them end to end. The bar is higher than most shops, the work is in production from day ten, and nobody is on a bench.",
    buttons: [
      {
        label: "Send us the system you are proudest of",
        href: "/brief",
        variant: "lime",
      },
    ],
    facts: [
      {
        value: "Senior only",
        label: "years shipping to production, not years in the industry",
      },
      {
        value: "09:00–13:00 GMT",
        label: "the overlap, every working day; the rest is yours",
      },
      {
        value: "One account",
        label: "at a time; no bench, no two clients",
      },
      {
        value: "Lahore",
        label: "remote within Pakistan; [OFFICE DAYS]",
      },
    ],
  },
  work: {
    head: {
      eyebrow: "The work",
      title: "What the work is like.",
    },
    items: [
      {
        title: "In a client's standup",
        text: "From day ten you are in their standup, on their repo and their board. We manage you; they direct the work. You are never the junior in the room.",
      },
      {
        title: "One account at a time",
        text: "No context-switching between three clients. When an engagement ends there is a planned gap, not a bench.",
      },
      {
        title: "Agentic delivery",
        text: "Every build runs on our Claude Code pipeline: you plan with an agent, review what it writes, and decide. You will write less boilerplate and more judgement.",
      },
      {
        title: "Reviewed by a senior",
        text: "Every change is reviewed by a second senior before it lands, yours included. That is the quality bar, not a hierarchy.",
      },
      {
        title: "Four hours, then your day",
        text: "The overlap with GMT is 09:00 to 13:00 Lahore time, the same four hours every day. Afternoons are deep work, not meetings.",
      },
    ],
  },
  vetting: {
    head: {
      eyebrow: "Vetting",
      title: "How we vet.",
      sub: "Five steps, two weeks, no whiteboard puzzles.",
    },
    items: [
      {
        title: "The system",
        text: "Send us something you shipped and owned in production: what it did, what broke, what you would do differently.",
      },
      {
        title: "The conversation",
        text: "An hour on that system with one of us. We go deep on one thing rather than wide on everything.",
      },
      {
        title: "A paid day",
        text: "A real problem from a real engagement, paid at the day rate, with the pipeline. We look at the judgement, not the speed.",
      },
      {
        title: "References",
        text: "Two people who have shipped with you. We call them.",
      },
      {
        title: "The offer",
        text: "Written, with the band, the overlap and the first engagement if there is one lined up.",
      },
    ],
  },
  roles: {
    head: {
      title: "Roles we hire for.",
      aside: "[OPEN / PIPELINE] · set per role",
    },
    statusPlaceholder: "[STATUS]",
    payLine: "Pay: [PAY BANDS BY LEVEL] · paid monthly in [PKR / USD] · equipment provided · [LEAVE POLICY]",
  },
  faq: {
    title: "Questions engineers ask.",
    items: [
      {
        question: "Do I have to be in Lahore?",
        answer: "Remote within Pakistan is fine; the overlap hours are what matter. [OFFICE DAYS, IF ANY].",
      },
      {
        question: "What happens between engagements?",
        answer:
          "A planned gap: paid, with a date for the next start. We staff for engagements, so gaps are short and known in advance; we do not run a bench.",
      },
      {
        question: "Will I be a contractor or an employee?",
        answer: "[EMPLOYMENT MODEL]. Written in the offer, with the band and the notice period.",
      },
      {
        question: "Can I say no to a client?",
        answer: "Yes, before you start. You meet the client before day one, and so do they; either side can say no.",
      },
    ],
  },
  closing: {
    title: "Send us the system you are proudest of.",
    showEmail: true,
    eyebrow: "Join · the first step",
    sub: "What it did, what broke, what you would do differently. A link and three paragraphs is enough.",
    buttons: [
      {
        label: "Send it",
        href: "/brief",
        variant: "lime",
      },
      {
        label: "See our work",
        href: "/work",
        variant: "outline",
      },
    ],
  },
} satisfies JoinPage;
