// The animated figures (v2 design): which scenes each route shows, their artboard size and mode, and the
// figcaptions. Converted once from `v2 handover/content/animations.json` on 2026-10-11; this module is now the
// source of truth for the captions (CLAUDE.md: captions never state a number). Timings live in the scene files
// (web/components/anim/scenes/<id>.js).
import type { AnimPage } from "./types";

export const animations = [
  {
    route: "/",
    scenes: [
      {
        id: "home-agentic",
        w: 1200,
        h: 560,
        mode: "loop",
        caption: "A story moves through six agents. A person signs at every gate. Agents never merge to main.",
      },
    ],
  },
  {
    route: "/services/custom-software",
    scenes: [
      {
        id: "svc-custom-software",
        w: 1200,
        h: 560,
        mode: "loop",
        caption: "Scope signed on day 3. Working software in six weeks. Handed over with a runbook.",
      },
      {
        id: "agentic-strip",
        w: 1200,
        h: 120,
        mode: "loop",
        nopause: true,
        caption: "",
      },
    ],
  },
  {
    route: "/services/team-augmentation",
    scenes: [
      {
        id: "svc-team-augmentation",
        w: 1200,
        h: 560,
        mode: "loop",
        caption: "An engineer in your standup within ten working days, on your repo and your board.",
      },
      {
        id: "agentic-strip",
        w: 1200,
        h: 120,
        mode: "loop",
        nopause: true,
        caption: "",
      },
    ],
  },
  {
    route: "/services/data-engineering",
    scenes: [
      {
        id: "svc-data-engineering",
        w: 1200,
        h: 560,
        mode: "loop",
        caption: "Three teams, three revenue numbers. One warehouse and one definition later, the same number everywhere. Example figures.",
      },
      {
        id: "agentic-strip",
        w: 1200,
        h: 120,
        mode: "loop",
        nopause: true,
        caption: "",
      },
    ],
  },
  {
    route: "/services/ai-machine-learning",
    scenes: [
      {
        id: "svc-ai-ml",
        w: 1200,
        h: 560,
        mode: "loop",
        caption: "Every version is scored on the same questions. It ships when the numbers clear the rule, not when the demo looks good. Example figures.",
      },
      {
        id: "agentic-strip",
        w: 1200,
        h: 120,
        mode: "loop",
        nopause: true,
        caption: "",
      },
    ],
  },
  {
    route: "/services/cloud-devops",
    scenes: [
      {
        id: "svc-cloud-devops",
        w: 1200,
        h: 560,
        mode: "loop",
        caption: "A flaky test fixed, not retried. Infrastructure reviewed as a plan. A cloud bill explained line by line. Example figures.",
      },
      {
        id: "agentic-strip",
        w: 1200,
        h: 120,
        mode: "loop",
        nopause: true,
        caption: "",
      },
    ],
  },
  {
    route: "/services/legacy-modernisation",
    scenes: [
      {
        id: "svc-legacy",
        w: 1200,
        h: 560,
        mode: "loop",
        caption: "Each piece moves only when old and new give the same answers. You can stop after any seam and still have a working system.",
      },
      {
        id: "agentic-strip",
        w: 1200,
        h: 120,
        mode: "loop",
        nopause: true,
        caption: "",
      },
    ],
  },
  {
    route: "/services/mobile",
    scenes: [
      {
        id: "svc-mobile",
        w: 1200,
        h: 560,
        mode: "loop",
        caption: "One codebase on iOS and Android. Works offline, syncs when back. Crash reporting live before the first store release. Example figures.",
      },
      {
        id: "agentic-strip",
        w: 1200,
        h: 120,
        mode: "loop",
        nopause: true,
        caption: "",
      },
    ],
  },
  {
    route: "/services/qa-test-automation",
    scenes: [
      {
        id: "svc-qa",
        w: 1200,
        h: 560,
        mode: "loop",
        caption: "Flaky tests fixed at the cause. A suite that runs in minutes. Load tested before launch day. Example figures.",
      },
      {
        id: "agentic-strip",
        w: 1200,
        h: 120,
        mode: "loop",
        nopause: true,
        caption: "",
      },
    ],
  },
  {
    route: "/industries/fintech-payments",
    scenes: [
      {
        id: "ind-fintech",
        w: 1200,
        h: 560,
        mode: "loop",
        caption: "Every payment posts as balanced double entries and reconciles to the bank. Tokenisation keeps card data in the payment provider's vault. Example figures.",
      },
    ],
  },
  {
    route: "/industries/retail-ecommerce",
    scenes: [
      {
        id: "ind-retail",
        w: 1200,
        h: 560,
        mode: "loop",
        caption: "Find where the funnel leaks and fix it. Keep store, warehouse and app on one stock number. Example figures.",
      },
    ],
  },
  {
    route: "/industries/healthcare-life-sciences",
    scenes: [
      {
        id: "ind-healthcare",
        w: 1200,
        h: 560,
        mode: "loop",
        caption: "Every step leaves an audit row a reviewer can trace. Patient data stays in your cloud; engineer access is requested, time-boxed and logged.",
      },
    ],
  },
  {
    route: "/industries/logistics-travel-marketplaces",
    scenes: [
      {
        id: "ind-logistics",
        w: 1200,
        h: 560,
        mode: "loop",
        caption: "Assign a load and the driver has it instantly. In a dead zone the app queues events and syncs when signal returns.",
      },
    ],
  },
  {
    route: "/industries/iot-signage-built-environment",
    scenes: [
      {
        id: "ind-iot",
        w: 1200,
        h: 560,
        mode: "loop",
        caption: "Telemetry from 200+ buildings on one platform. Screens keep playing when the network drops and sync when it returns.",
      },
    ],
  },
  {
    route: "/industries/saas-platforms-ai-products",
    scenes: [
      {
        id: "ind-saas",
        w: 1200,
        h: 560,
        mode: "loop",
        caption: "Every tenant's data walled off. Every release has to pass its evals, then a canary, before it reaches everyone.",
      },
    ],
  },
  {
    route: "/agentic-flow",
    scenes: [
      {
        id: "agentic-flow-sim",
        w: 1200,
        h: 600,
        mode: "state",
        caption: "Run a story through the pipeline. Agents do the work; a person signs every gate.",
      },
      {
        id: "agentic-never-wall",
        w: 1200,
        h: 320,
        mode: "state",
        caption: "Every rule is a guardrail in the pipeline, not a promise. Press one.",
        captionHint: "Press one.",
      },
    ],
  },
  {
    route: "/ai-transformation",
    scenes: [
      {
        id: "ai-transformation",
        w: 1200,
        h: 560,
        mode: "scrub",
        caption: "Six weeks: the pipeline goes into your repo, your team runs it, and it is measured against your own week 0. The figures shown are an example, not a result.",
      },
    ],
  },
] satisfies AnimPage[];

/** The scenes on a route, in page order (empty for routes without figures). */
export const scenesFor = (route: string) => animations.find((p) => p.route === route)?.scenes ?? [];
