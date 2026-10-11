// Converted once from the approved prototype (reference/site) by scripts/convert_content.mjs on 2026-10-10.
// This file is now the source of truth for this copy: edit it by hand. Bracketed [PLACEHOLDERS] stay until the
// founders replace them (CLAUDE.md rule 1). Run `pnpm check:content` after editing.
import type { ApproachPage } from "../types";

export const approachPage = {
  hero: {
    title: "How we work.\nThe same way, every account.",
    eyebrow: "Approach",
    sub: "Scope before money. Senior only. Measured before we claim it improved. Easy to leave. Not values on a wall: clauses in the SOW, and habits you can check in the first fortnight.",
  },
  staffing: {
    head: {
      title: "How we staff an account.",
    },
    items: [
      {
        title: "Senior only",
        text: "Everyone we put on your account has shipped to production for years, not months. There is no junior tier, so there is nobody to hide behind one.",
      },
      {
        title: "No bench",
        text: "We staff for your engagement, not ahead of it. You meet the engineer before they start, and you can say no.",
      },
      {
        title: "Replaced, not argued",
        text: "If it is not working inside the first month, a replacement is in your standup within ten working days.",
      },
    ],
  },
  agentic: {
    head: {
      eyebrow: "Agentic delivery",
      title: "Our SDLC runs on Claude Code. A person signs every increment.",
      sub: "We built the pipeline for a ten-engineer practice, where it is now the default path for new work. It is how every Hopsig build runs: the agents do the planning, the tests and the paperwork; the people do the judgement. Two Android apps scoped at five developers shipped with one, on the original timeline.",
    },
    tags: [
      "Claude Code",
      "MCP servers",
      "Guardrails",
      "Automated review",
      "Test generation",
      "Living docs",
      "Human in the loop",
    ],
    links: [
      {
        label: "The flow →",
        href: "/agentic-flow",
        variant: "link",
      },
      {
        label: "The six-week offer →",
        href: "/ai-transformation",
        variant: "link",
      },
    ],
    items: [
      {
        title: "Plan",
        text: "The build is planned with a solutions-architect agent before anyone writes code. The plan is a document you can read and object to.",
      },
      {
        title: "Stories",
        text: "Epics and stories are populated and tracked automatically, in your Jira or ours, so progress is visible without a status meeting.",
      },
      {
        title: "Build",
        text: "Stories are implemented autonomously inside guardrails: your conventions, your boundaries, enforced on every change.",
      },
      {
        title: "Review",
        text: "Automated review and generated tests run before a senior looks. A senior always looks.",
      },
      {
        title: "Document",
        text: "Documentation is written as the code changes, so it is never a week behind and never a handover task.",
      },
      {
        title: "Escalate",
        text: "When a decision needs a person, it is pushed to a phone with the context, and the pipeline waits.",
      },
    ],
  },
  // Owner decision 2026-10-11: no time zones or overlap; the hours chart became one line on where we are.
  where: {
    head: {
      title: "Where we are.",
    },
    paragraphs: [
      "Hopsig Technologies LLC, Wyoming, USA. Delivery Centre: Lahore, Pakistan. Delivery happens there, and the people who scope your work are the people who do it.",
    ],
  },
  closing: {
    title: "The people who scope your work are the people who do it.",
    showEmail: true,
    eyebrow: "Approach · the call",
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
} satisfies ApproachPage;
