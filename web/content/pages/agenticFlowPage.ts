// Converted once from the approved prototype (reference/site) by scripts/convert_content.mjs on 2026-10-10.
// This file is now the source of truth for this copy: edit it by hand. Bracketed [PLACEHOLDERS] stay until the
// founders replace them (CLAUDE.md rule 1). Run `pnpm check:content` after editing.
import type { AgenticFlowPage } from "../types";

export const agenticFlowPage = {
  hero: {
    title: "Six agents. One pipeline.\nA person at every gate.",
    eyebrow: "Agentic software development on Claude Code",
    sub: "This is the delivery pipeline every Hopsig build runs on. Each stage is an agent with a defined input, output and guardrail; each handoff can be stopped by a person. Run a story; the detail is below.",
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
        value: "6",
        label: "stages, each an agent with a defined input, output and guardrail",
      },
      {
        value: "3",
        label: "points where a person signs: the plan, the pull request, any escalation",
      },
      {
        value: "0",
        label: "merges to main by an agent",
      },
      {
        value: "1",
        label: "pipeline for every Hopsig build, and the one we install on yours",
      },
    ],
  },
  flow: {
    head: {
      title: "The flow.",
      aside: "Agents outlined · a person in Lime",
    },
    stages: [
      {
        stage: "Plan",
        agent: "Solutions-architect agent",
        input: "A brief in plain language, the repo, your conventions",
        output: "A plan: components, risks, the order of work",
        guardrail: "Nothing is built from a plan a person has not read",
        humanGate: true,
        humanNote: "You read the plan and object before any code exists.",
      },
      {
        stage: "Stories",
        agent: "Story agent",
        input: "The approved plan",
        output: "Epics and stories in your Jira or ours, with acceptance criteria",
        guardrail: "Every story traces to a line in the plan",
        humanGate: false,
      },
      {
        stage: "Build",
        agent: "Implementation agent",
        input: "One story, your codebase, your guardrails",
        output: "A branch with the change, inside your conventions",
        guardrail: "Lint, CI, branch rules and review policy, enforced on every change",
        humanGate: false,
      },
      {
        stage: "Review",
        agent: "Review and test agents",
        input: "The branch",
        output: "A reviewed diff with generated tests, and a pull request",
        guardrail: "A senior always looks before it merges",
        humanGate: true,
        humanNote: "A senior engineer reviews the pull request. Agents never merge to main.",
      },
      {
        stage: "Document",
        agent: "Docs agent",
        input: "The merged change",
        output: "Documentation updated as the code changed",
        guardrail: "Docs live with the code, never a handover task",
        humanGate: false,
      },
      {
        stage: "Escalate",
        agent: "Escalation agent",
        input: "Any decision outside the guardrails",
        output: "A question pushed to a phone, with the context, while the pipeline waits",
        guardrail: "No guess where a person should decide",
        humanGate: true,
        humanNote: "A person answers; the pipeline resumes or stops.",
      },
    ],
    labels: {
      stage: "Stage",
      input: "In",
      output: "Out",
      guardrail: "Guardrail",
      whoDecides: "Who decides",
      personSigns: "A person signs",
      noGate: "No gate",
      runsAlone: "Runs on its own inside the guardrail",
    },
  },
  agents: {
    head: {
      title: "What the agents do.",
    },
    does: [
      "Plan from a plain-language brief, and show the plan before anything is built",
      "Populate epics and stories with acceptance criteria, in your tracker",
      "Implement a story inside your conventions, lint rules and branch policy",
      "Generate tests for the change and run them in your CI",
      "Review a diff and write the pull-request description",
      "Update the documentation that the change made stale",
      "Stop and ask a person, with the context, when a decision is outside the guardrails",
    ],
    neverTitle: "What they never do.",
    neverAside: "Written into the guardrails · press one",
  },
  tooling: {
    head: {
      eyebrow: "Tooling",
      title: "Built on Claude Code. Runs on yours.",
      sub: "The agents run on Claude Code with MCP servers for your tracker, your CI and your docs. Model calls go through a provider with no training on your data, or inside your own cloud account; the SOW says which. Nothing of ours to adopt.",
    },
    tools: [
      "Claude Code",
      "MCP servers",
      "Your CI",
      "Your Jira or ours",
      "GitHub / GitLab",
      "Slack or mobile for escalations",
      "LangSmith / Langfuse for evals",
    ],
    whereLabel: "Where it has run",
    where: [
      "A ten-engineer practice, now its default path for new work.",
      "Two Android apps scoped at five developers were shipped by one, on the original timeline. The same pipeline customised a Dynamics 365 environment end to end through three MCP servers.",
    ],
    links: [
      {
        label: "Install it on one repo in six weeks →",
        href: "/ai-transformation",
        variant: "link",
      },
      {
        label: "The case notes →",
        href: "/work",
        variant: "link",
      },
    ],
  },
  closing: {
    title: "See it run on one of your stories.",
    showEmail: true,
    eyebrow: "Agentic flow · the call",
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
} satisfies AgenticFlowPage;
