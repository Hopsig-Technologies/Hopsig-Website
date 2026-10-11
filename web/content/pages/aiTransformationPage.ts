// Converted once from the approved prototype (reference/site) by scripts/convert_content.mjs on 2026-10-10.
// This file is now the source of truth for this copy: edit it by hand. Bracketed [PLACEHOLDERS] stay until the
// founders replace them (CLAUDE.md rule 1). Run `pnpm check:content` after editing.
import type { AiTransformationPage } from "../types";

export const aiTransformationPage = {
  hero: {
    title: "Your team, shipping with agents.\nMeasured by Friday.",
    eyebrow: "AI transformation for engineering teams · six weeks",
    sub: "Not a transformation programme. One repository, a baseline taken in week one, our delivery pipeline installed inside your conventions, your team running it, and the same numbers measured after.",
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
        value: "10",
        label: "engineers on the agentic path at a practice we built it for",
      },
      {
        value: "5 → 1",
        label: "developers needed for two Android apps, same timeline",
      },
      {
        value: "6 weeks",
        label: "one repo, a baseline, the pipeline, the numbers after",
      },
      {
        value: "Claude Code",
        label: "MCP servers, guardrails, generated tests, living docs",
      },
    ],
  },
  // v2: the scroll-scrubbed "six weeks" figure after the hero (caption in animations.ts).
  scrub: {
    eyebrow: "Six weeks in your repo · scroll",
    hint: "Click a week to jump",
  },
  offer: {
    head: {
      title: "What you get.",
    },
    gets: [
      "The pipeline on your repo: planning agent, story population, autonomous implementation inside your guardrails, automated review, generated tests, living documentation, human-in-the-loop escalation",
      "A baseline before anything changes: lead time, pull-request cycle time, review turnaround, incidents, test coverage on new code",
      "Your conventions as the guardrails: linting, CI, branch rules, review policy, enforced on every change",
      "Your engineers running it from week three, with us watching; a recorded walkthrough and a week of questions answered",
      "The same numbers after, in a review you sign; then widen it or stop",
    ],
    priced: 'Engagement: Fixed scope, six weeks · NET 14 · <a href="/book">Book a consult →</a>',
    goodForTitle: "Good for",
    goodFor: [
      "A team of five to forty engineers with a roadmap longer than the year",
      "A CTO who has been asked about AI by the board and wants a number, not a slide",
      "A codebase with CI and review already in place, however imperfect",
    ],
    sayNoTitle: "We will say no when",
    sayNo: [
      "The brief is to replace engineers rather than to ship more with the ones you have",
      "There is no CI and nobody wants to write the first test",
      "Nobody on your side can own the decision to widen it or stop",
    ],
  },
  pipeline: {
    head: {
      eyebrow: "The pipeline",
      title: "Six stages. A person signs every increment.",
      sub: "The same pipeline that runs every Hopsig build, installed on yours.",
    },
    items: [
      {
        title: "Plan",
        text: "The build is planned with a solutions-architect agent before code is written. The plan is a document you can object to.",
      },
      {
        title: "Stories",
        text: "Epics and stories populated and tracked automatically, in your Jira or ours.",
      },
      {
        title: "Build",
        text: "Stories implemented autonomously inside your guardrails, every change checked against them.",
      },
      {
        title: "Review",
        text: "Automated review and generated tests before a senior looks. A senior always looks.",
      },
      {
        title: "Document",
        text: "Documentation written as the code changes, never a week behind.",
      },
      {
        title: "Escalate",
        text: "When a decision needs a person, it is pushed to a phone with the context, and the pipeline waits.",
      },
    ],
  },
  weeks: {
    head: {
      title: "How the six weeks run.",
      aside: "Fixed scope, fixed price",
    },
    steps: [
      {
        when: "Week 0",
        title: "Read the repo, take the baseline",
        text: "Conventions, CI, review policy, and the five numbers as they are today. Written down before anything changes.",
      },
      {
        when: "Week 1",
        title: "Pipeline on one service",
        text: "Planning, stories, implementation inside your guardrails; the first agent-authored pull request reviewed by your senior.",
      },
      {
        when: "Week 3",
        title: "Your team runs it",
        text: "We watch, answer and adjust the guardrails. Escalations go to your phone, not ours.",
      },
      {
        when: "Week 6",
        title: "The same numbers, after",
        text: "Lead time, cycle time, review turnaround, incidents, coverage. In a review you sign. Widen it or stop.",
      },
      {
        when: "Then",
        title: "Widen, or not",
        text: "The next repo at a fixed price, or a handover with the pipeline staying as it is.",
      },
    ],
  },
  measures: {
    head: {
      title: "What we measure.",
      aside: "Before, in week one; after, in week six",
    },
    items: [
      {
        title: "Lead time",
        text: "Idea to production, per story.",
      },
      {
        title: "PR cycle time",
        text: "Opened to merged.",
      },
      {
        title: "Review turnaround",
        text: "Opened to first senior review.",
      },
      {
        title: "Incidents",
        text: "Caused by changes shipped through the pipeline.",
      },
      {
        title: "Coverage on new code",
        text: "Tests generated and kept.",
      },
    ],
  },
  record: {
    head: {
      title: "From the record.",
    },
    cases: ["F5", "F19", "C6", "F18"],
    allLink: {
      label: "All case notes →",
      href: "/work",
      variant: "link",
    },
  },
  faq: {
    title: "Questions we get about this.",
    items: [
      {
        question: "Does this replace engineers?",
        answer:
          "No. It changes what they spend the day on. The practice we built it for kept its ten engineers and shipped more; the two-apps-by-one-developer result freed four people for other work, it did not remove them.",
      },
      {
        question: "Which models and tools?",
        answer:
          "Claude Code with MCP servers for the pipeline, your existing CI and review tooling as the guardrails. Model choice is whatever passes your eval at a cost you accept; the pipeline does not care about the logo.",
      },
      {
        question: "Does our code leave the building?",
        answer:
          "It runs in your repo and your accounts. Model calls go through a provider with no training on your data, or through your own cloud account if you prefer; we write down which, in the SOW.",
      },
      {
        question: "What if the numbers do not move?",
        answer:
          "Then you stop at week six, the pipeline stays if you want it, and you have a measured answer instead of an opinion. That outcome is in the SOW too.",
      },
    ],
  },
  closing: {
    title: "Bring one repo. We will show you the Friday after.",
    showEmail: true,
    eyebrow: "AI transformation · the call",
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
} satisfies AiTransformationPage;
