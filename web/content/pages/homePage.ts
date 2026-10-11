// Converted once from the approved prototype (reference/site) by scripts/convert_content.mjs on 2026-10-10.
// This file is now the source of truth for this copy: edit it by hand. Bracketed [PLACEHOLDERS] stay until the
// founders replace them (CLAUDE.md rule 1). Run `pnpm check:content` after editing.
import type { HomePage } from "../types";

export const homePage = {
  hero: {
    eyebrow: "Fractional engineering, data & AI teams",
    title: "You think it.\nWe finish it.",
    sub: "We integrate directly with your team to deliver high-stakes software and AI products from architecture to production launch.",
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
      { value: "Principal-level", label: "talent" },
      { value: "10 days", label: "to deployment" },
      { value: "Flexible", label: "terms" },
    ],
    beats: [
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
    // The reference spaces the arrow with a no-break space.
    scrollHint: "Scroll ↓ \u00a0 the engagement, in five beats",
  },
  // v2: the band after the hero that carries the home-agentic figure (caption in animations.ts).
  agenticBand: {
    head: {
      eyebrow: "Agentic delivery",
      title: "Six agents. A person at every gate.",
      sub: "Our delivery pipeline runs on Claude Code. Agents plan, build, review and document. People sign off. Agents never merge to main.",
    },
    buttons: [
      {
        label: "Get it in six weeks",
        href: "/ai-transformation",
        variant: "lime",
      },
      {
        label: "See the pipeline",
        href: "/agentic-flow",
        variant: "outline",
      },
    ],
  },
  services: {
    head: {
      eyebrow: "Core services",
      title: "Eight things we do. All of them end in something running.",
    },
    detailsLabel: "Details →",
    goodForLabel: "Good for",
    stackLabel: "Stack · only what we have shipped to production",
    engagementLabel: "Engagement:",
    closingLabel: "08 of 08 · the file closes here",
    closingLinks: [
      {
        label: "All services →",
        href: "/services",
        variant: "link",
      },
    ],
  },
  caseIndex: {
    head: {
      eyebrow: "Some of our work",
      title: "Where we have done this before.",
    },
    filters: [
      {
        key: "all",
        label: "All",
      },
      {
        key: "payments",
        label: "Payments",
      },
      {
        key: "retail",
        label: "Retail & e-commerce",
      },
      {
        key: "health",
        label: "Healthcare & data",
      },
      {
        key: "ai",
        label: "AI & delivery",
      },
      {
        key: "iot",
        label: "IoT & platforms",
      },
    ],
    problemLabel: "Problem",
    whatWeDidLabel: "What we did",
    measuredLabel: "Measured",
    pageLink: "Read the case note →",
    askLink: "Ask about this →",
    allLink: {
      label: "All {count} case notes →",
      href: "/work",
      variant: "link",
    },
  },
  midCta: {
    text: "Start a new build, or put senior people on one that is already running.",
    button: {
      label: "Book a consult",
      href: "/book",
      variant: "lime",
    },
  },
  why: {
    head: {
      title: "Why Hopsig.",
    },
    items: [
      {
        title: "Senior only",
        text: "Shipped to production for years, not months. No juniors on your account, ever.",
      },
      {
        title: "Scope before money",
        text: "A written SOW three days after the call, before you pay.",
      },
      {
        title: "Agentic delivery",
        text: "Our own SDLC on Claude Code: planning, review, tests and docs automated, a person in the loop when it matters.",
      },
      {
        title: "Easy to leave",
        text: "Thirty days’ notice, either side, no argument.",
      },
      {
        title: "Measured",
        text: "We measure it before we claim it improved.",
      },
    ],
  },
  record: {
    head: {
      eyebrow: "The record",
      title: "Shipping to production since 2019.",
      sub: "Payments, regulated healthcare, retail at scale, agentic delivery. Every system on the Work page was built, run or measured by us. Client names are withheld until the call; the numbers are not.",
    },
    link: {
      label: "See the record →",
      href: "/work",
      variant: "link",
    },
    stats: [
      {
        value: "150+",
        label: "merchants and 100K+ transactions, four months after an embedded payments platform launched",
      },
      {
        value: "5×",
        label: "repeat transactions from a loyalty engine built for enterprise retail",
      },
      {
        value: "98%",
        label: "detection accuracy from a computer-vision product working on field photographs",
      },
      {
        value: "60%",
        label: "less analysis time on preclinical data harmonised across global labs",
      },
    ],
    strip: [
      "Hopsig Technologies LLC · Wyoming, USA",
      "Delivery Centre: Lahore, Pakistan",
      "In production since 2019",
      "Built for teams in the UK, US and EU",
    ],
  },
  notes: {
    head: {
      eyebrow: "Notes",
      title: "Things we would say on the call anyway.",
      aside: "Short and opinionated, written by the people doing the work.",
    },
    countLine: "{count} notes · no newsletter, no pop-up",
    latestLabel: "Latest",
    readLabel: "Read the note →",
    moreTitle: "Everything else we have written",
    allLink: {
      label: "All notes →",
      href: "/notes",
      variant: "link",
    },
  },
  closing: {
    title: "Thirty minutes, and you will know whether we can help.",
    showEmail: true,
    eyebrow: "Fortnightly · your call",
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
} satisfies HomePage;
