// Converted once from the approved prototype (reference/site) by scripts/convert_content.mjs on 2026-10-10.
// This file is now the source of truth for this copy: edit it by hand. Bracketed [PLACEHOLDERS] stay until the
// founders replace them (CLAUDE.md rule 1). Run `pnpm check:content` after editing.
import type { RatesPage } from "../types";

export const ratesPage = {
  hero: {
    title: "Rates. On the page,\nnot after three calls.",
    eyebrow: "Rates",
    sub: "Every number below is the number on the SOW. If your problem does not fit one of the three shapes, the call is still thirty minutes and still free.",
  },
  cards: [
    {
      name: "Embedded",
      price: "[YOUR RATE]",
      unit: "/ day, per engineer",
      meta: "Billed monthly · 21 days a month",
      items: [
        "Named senior engineer in your standup",
        "Your tooling, your repo, your board",
        "Performance, holidays and cover handled",
        "Replacement inside ten working days",
        "3-month minimum · 30 days’ notice",
      ],
      button: {
        label: "Book a consult",
        href: "/book",
        variant: "outline",
      },
    },
    {
      name: "Built",
      price: "[QUOTE]",
      unit: "per increment",
      meta: "Six weeks, fixed scope · NET 14",
      items: [
        "Two-page SOW three days after the call",
        "Working software in your cloud account",
        "Fortnightly review with cost against plan",
        "Runbook, tests, recorded walkthrough",
        "IP yours on payment",
      ],
      button: {
        label: "Book a consult",
        href: "/book",
        variant: "lime",
      },
      highlight: true,
    },
    {
      name: "Data & AI",
      price: "[YOUR RATE]",
      unit: "/ day, or retained",
      meta: "Retained from [MONTHLY] · NET 14",
      items: [
        "Pipelines, warehouse, retrieval, evaluation",
        "Before-and-after measurement, every increment",
        "Runs without us afterwards",
        "Dashboards your team will actually use",
        "Project or rolling monthly",
      ],
      button: {
        label: "Book a consult",
        href: "/book",
        variant: "outline",
      },
    },
  ],
  estimator: {
    title: "Estimate an embedded team",
    sub: "Move the sliders. The number is the number.",
    engineersLabel: "Engineers",
    monthsLabel: "Months",
    note: '21 working days a month. No onboarding fee, no recruiter fee, no notice-period buyout. Set the day rate in Tweaks to see a total. <a href="/why-not-just-hire">Compare it with hiring →</a>',
    daysLabel: "Engineer-days",
    totalLabel: "Total",
    footnotes: ["Invoiced monthly in arrears · GBP, USD or EUR", "NET 14 · 30 days’ notice, either side"],
  },
  terms: {
    head: {
      title: "Terms.",
      aside: "The whole list",
    },
    rows: [
      {
        label: "First engineer in",
        value: "10 working days",
      },
      {
        label: "Overlap with GMT",
        value: "4 hours, daily",
      },
      {
        label: "Minimum term",
        value: "3 months rolling",
      },
      {
        label: "Notice",
        value: "30 days, either side",
      },
      {
        label: "Invoicing",
        value: "Monthly, in arrears",
      },
      {
        label: "Payment",
        value: "NET 14 · GBP / USD / EUR",
      },
      {
        label: "IP",
        value: "Yours, on payment",
      },
      {
        label: "NDA",
        value: "Ours or yours, before the scope",
      },
      {
        label: "Replacement",
        value: "Inside 10 working days",
      },
      {
        label: "Delivered from",
        value: "Lahore · GMT+5",
      },
    ],
  },
  faq: {
    title: "Questions we get on the call.",
    items: [
      {
        question: "What if the engineer is not working out?",
        answer:
          "Say so at the fortnightly review, or before. A replacement is in your standup inside ten working days, and you do not pay for the overlap.",
      },
      {
        question: "Who owns the code?",
        answer: "You do, on payment of each invoice. We keep nothing except what we have learned.",
      },
      {
        question: "Do you work in our timezone?",
        answer:
          "Four hours of overlap with GMT every working day, the same four hours, so it is predictable. US teams: we shift the day and agree the overlap in the SOW.",
      },
      {
        question: "Can we start with one engineer?",
        answer: "Yes. Most do. The minimum is one engineer for three months.",
      },
      {
        question: "What is not included?",
        answer:
          "Your cloud bill, third-party licences, and travel if you ask us to visit. Everything else on this page is included.",
      },
    ],
  },
  closing: {
    title: "If the numbers work, the next step is thirty minutes.",
    showEmail: true,
    eyebrow: "Rates · the call",
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
} satisfies RatesPage;
