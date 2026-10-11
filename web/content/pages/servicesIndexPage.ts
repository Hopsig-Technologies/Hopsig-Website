// Converted once from the approved prototype (reference/site) by scripts/convert_content.mjs on 2026-10-10.
// This file is now the source of truth for this copy: edit it by hand. Bracketed [PLACEHOLDERS] stay until the
// founders replace them (CLAUDE.md rule 1). Run `pnpm check:content` after editing.
import type { ServicesIndexPage } from "../types";

export const servicesIndexPage = {
  hero: {
    title: "Three ways we work.\nOne way we behave.",
    eyebrow: "Software development services",
    sub: "Whichever you pick, you get the same people, the same scope-first habit and the same fortnightly review. The detail below is the detail we would put in the SOW.",
    buttons: [
      {
        label: "Embedded",
        href: "/services#embedded",
        variant: "chip",
      },
      {
        label: "Built",
        href: "/services#built",
        variant: "chip",
      },
      {
        label: "Data & AI",
        href: "/services#data",
        variant: "chip",
      },
    ],
  },
  modes: [
    {
      anchor: "embedded",
      head: {
        eyebrow: "01 — Embedded",
        title: "Engineers inside your team",
        sub: "Your standups, your board, your repo, your definition of done. We manage the person; you direct the work.",
      },
      getsTitle: "What you get",
      gets: [
        "A named senior engineer, in your standup from day one",
        "Your tooling, your repo, your board — nothing of ours to adopt",
        "We manage performance, holidays and cover; you manage the work",
        "If it is not working, a replacement inside ten working days",
      ],
      goodForTitle: "Good for",
      goodFor: [
        "Scaling a team without a six-month hiring round",
        "A nine-month push with a hard date",
        "Covering a leaver while you hire properly",
      ],
      priceLabel: "Engagement",
      priceTitle: "Monthly, per engineer",
      priceDetail: "3-month minimum · 30 days’ notice",
      link: {
        label: "Book a consult →",
        href: "/book",
        variant: "link",
      },
    },
    {
      anchor: "built",
      head: {
        eyebrow: "02 — Built",
        title: "A product, scoped and shipped",
        sub: "A written scope, a fixed first increment, working software inside six weeks. Then we keep going or we hand it over.",
      },
      getsTitle: "What you get",
      gets: [
        "A two-page SOW three days after the call: in, out, cost",
        "A fixed first increment, six weeks, in your cloud account",
        "A fortnightly review: shipped, slipped, cost against plan",
        "A handover pack: runbook, tests, a recorded walkthrough",
      ],
      goodForTitle: "Good for",
      goodFor: [
        "A new product or module with a deadline",
        "A rebuild the in-house team cannot fit in",
        "An MVP that has to survive its first customers",
      ],
      priceLabel: "Engagement",
      priceTitle: "Fixed scope, per increment",
      priceDetail: "Quoted after the call · NET 14 · IP yours on payment",
      link: {
        label: "Book a consult →",
        href: "/book",
        variant: "link",
      },
    },
    {
      anchor: "data",
      head: {
        eyebrow: "03 — Data & AI",
        title: "Systems that stay correct",
        sub: "Pipelines, warehouses, retrieval and evaluation harnesses. We measure the thing before we claim it improved.",
      },
      getsTitle: "What you get",
      gets: [
        "Ingest and warehouse work that the in-house team can run after",
        "Retrieval and LLM features with an evaluation harness, not a demo",
        "Dashboards people stop arguing with",
        "A before-and-after measurement on every increment",
      ],
      goodForTitle: "Good for",
      goodFor: [
        "Reporting nobody trusts",
        "A nightly batch that is now a daily problem",
        "An AI feature that has to be right, not impressive",
      ],
      priceLabel: "Engagement",
      priceTitle: "Project or retained",
      priceDetail: "Scoped on the call · NET 14",
      link: {
        label: "Book a consult →",
        href: "/book",
        variant: "link",
      },
    },
  ],
  detail: {
    head: {
      title: "Eight things we do, in detail.",
      aside: "One page each",
    },
  },
  inside: {
    head: {
      title: "Inside every engagement.",
      aside: "Not extras. Not line items.",
    },
    items: [
      {
        title: "Code review",
        text: "Every change reviewed by a second senior before it lands.",
      },
      {
        title: "CI from day one",
        text: "Tests and a pipeline before the first feature, not after the first incident.",
      },
      {
        title: "Runbooks",
        text: "On-call steps and rollback written as we go, in your wiki.",
      },
      {
        title: "Documentation",
        text: "Decisions recorded where your team will find them.",
      },
      {
        title: "Security basics",
        text: "Secrets, access, dependencies: handled, and listed in the handover.",
      },
      {
        title: "Handover",
        text: "A recorded walkthrough and a week of questions answered, included.",
      },
    ],
  },
  howItRuns: {
    head: {
      title: "How an engagement runs.",
    },
    link: {
      label: "See it play out →",
      href: "/",
      variant: "link",
    },
    steps: [
      {
        when: "Day 0",
        title: "The call",
        text: "You describe the problem. We say on the call whether we are right for it, and what it would cost.",
      },
      {
        when: "Day 3",
        title: "The scope",
        text: "A two-page SOW: what is in, what is out, what it costs. Before you pay anything.",
      },
      {
        when: "Day 10",
        title: "People in",
        text: "Access, first commit. You meet the engineers before they start, and they are in your standup from day one.",
      },
      {
        when: "Week 6",
        title: "First increment live",
        text: "Working software in your environment, measured before we claim it improved.",
      },
      {
        when: "Fortnightly",
        title: "The review",
        text: "Shipped, slipped, cost against plan. Continue, or hand over. Your call, every fortnight.",
      },
    ],
  },
  closing: {
    title: "Tell us the problem. We will tell you which of the three it is.",
    showEmail: true,
    eyebrow: "Services · the call",
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
} satisfies ServicesIndexPage;
