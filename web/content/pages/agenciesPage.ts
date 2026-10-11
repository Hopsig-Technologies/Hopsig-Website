// Converted once from the approved prototype (reference/site) by scripts/convert_content.mjs on 2026-10-10.
// This file is now the source of truth for this copy: edit it by hand. Bracketed [PLACEHOLDERS] stay until the
// founders replace them (CLAUDE.md rule 1). Run `pnpm check:content` after editing.
import type { AgenciesPage } from "../types";

export const agenciesPage = {
  hero: {
    title: "Your brand on the SOW.\nOur engineers behind it.",
    eyebrow: "White-label software development for agencies",
    sub: "Design and product agencies sell the work and own the client. We scope it with you, build it under your name, and hand it over the way you would have.",
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
    facts: [
      {
        value: "White-label",
        label: "your brand on the SOW, our engineers behind it",
      },
      {
        value: "NDA",
        label: "by default, before the first conversation",
      },
      {
        value: "Your client",
        label: "your relationship; we never contact them without you",
      },
      {
        value: "10 days",
        label: "to first commit, the same as a direct engagement",
      },
    ],
  },
  how: {
    head: {
      title: "How it works.",
    },
    items: [
      {
        title: "You sell, you own the client",
        text: "The pitch, the relationship and the invoice to the end client are yours. We are a line item you control.",
      },
      {
        title: "We scope it with you",
        text: "A two-page SOW in your template, three days after the call, with our engineering estimate inside your price.",
      },
      {
        title: "We deliver under your name",
        text: "Your repo or theirs, your standup, your Slack. Our engineers appear as your team; the handover pack carries your logo.",
      },
    ],
  },
  gets: {
    head: {
      eyebrow: "Terms",
      title: "What you get.",
    },
    items: [
      "Named engineers, senior-led, you can put in front of your client as yours",
      "Our estimate inside your SOW, in your template, with our name nowhere on it unless you want it there",
      "Mutual non-solicitation for twelve months, in writing",
      "A fortnightly review with you, not with your client, unless you invite us",
      "Capacity notice: four weeks ahead for a new engagement, ten working days for one more engineer on a running one",
    ],
  },
  sayNo: {
    head: {
      title: "We will say no when",
    },
    items: [
      "You want us to present as your in-house team to a client who asks directly; we will stay quiet, we will not lie",
      "The scope is already sold at a price that cannot carry a senior lead",
      "Your client needs us more than you do, and nobody has said so",
    ],
  },
  faq: {
    title: "Questions agencies ask.",
    items: [
      {
        question: "Will you ever go around us?",
        answer:
          "No. Mutual non-solicitation is in the agreement, and if your client contacts us directly we tell you the same day and point them back to you.",
      },
      {
        question: "Can our designers work with your engineers directly?",
        answer:
          "Yes, and it is better when they do. Figma to production is a conversation, not a handover; we have shipped design systems with product teams this way.",
      },
      {
        question: "What if the client's scope changes under us?",
        answer:
          "It goes through you. We re-estimate inside your template, you re-price to your client, and the fortnightly review shows both of us the cost against plan.",
      },
      {
        question: "Do you take a share of the margin?",
        answer: "No. What you charge your client is yours.",
      },
    ],
  },
  closing: {
    title: "Bring the pitch you are about to lose on capacity.",
    showEmail: true,
    eyebrow: "Agencies · the call",
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
} satisfies AgenciesPage;
