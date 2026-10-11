// Converted once from the approved prototype (reference/site) by scripts/convert_content.mjs on 2026-10-10.
// This file is now the source of truth for this copy: edit it by hand. Bracketed [PLACEHOLDERS] stay until the
// founders replace them (CLAUDE.md rule 1). Run `pnpm check:content` after editing.
import type { Service } from "./types";

export const services = [
  {
    id: "custom-software",
    n: 1,
    name: "Custom software",
    oneLiner: "Products built end to end",
    description:
      "A written scope, a fixed first increment, working software in your cloud inside six weeks. Then we keep going, or we hand it over with a runbook.",
    tiles: [
      {
        title: "Scope in 3 days",
        text: "Two pages: in, out, cost.",
      },
      {
        title: "Six-week increments",
        text: "Fixed scope, working software.",
      },
      {
        title: "Handover pack",
        text: "Runbook, tests, walkthrough.",
      },
    ],
    goodFor: [
      "A new product or module with a deadline",
      "A rebuild the in-house team cannot fit in",
      "An MVP that has to survive its first customers",
    ],
    stack: [
      ".NET / .NET Core",
      "Node.js",
      "Fastify",
      "Python",
      "FastAPI",
      "Django REST",
      "React",
      "Next.js",
      "Angular",
      "TypeScript",
      "PostgreSQL",
      "SQL Server",
      "MongoDB",
      "Redis",
      "GraphQL",
    ],
    shape: "Built · fixed scope per increment",
    pageTitle: "Products built\nend to end.",
    gets: [
      "A two-page SOW three days after the call: what is in, what is out, what it costs",
      "A fixed first increment: six weeks, working software in your cloud account",
      "A fortnightly review you sign: shipped, slipped, cost against plan",
      "A handover pack: runbook, tests, a recorded walkthrough, a week of questions answered",
    ],
    sayNoWhen: [
      "The deadline, the scope and the budget are all fixed and none of them can move",
      "You want a team that builds whatever the spec says and never pushes back",
    ],
    steps: [
      {
        when: "Day 0",
        title: "The call",
        text: "You describe the product. We say whether we are right for it and roughly what it costs.",
      },
      {
        when: "Day 3",
        title: "The scope",
        text: "Two pages: in, out, cost, acceptance criteria. Before you pay anything.",
      },
      {
        when: "Day 10",
        title: "First commit",
        text: "Repo, CI and environments in your cloud account; the first slice of the product under way.",
      },
      {
        when: "Week 6",
        title: "First increment live",
        text: "Working software your users can touch, measured against the baseline.",
      },
      {
        when: "Fortnightly",
        title: "The review",
        text: "Continue, change course or hand over. Your call, every fortnight.",
      },
    ],
    record: ["F0", "F6", "C2"],
    faq: [
      {
        question: "Who owns the code?",
        answer:
          "You do, on payment of each invoice. It lives in your repo and your cloud account from day one, so there is nothing to transfer.",
      },
      {
        question: "What if the scope changes halfway through?",
        answer:
          "It will. Changes go into the next increment, with the cost written down at the fortnightly review, so the first increment still lands on its date.",
      },
      {
        question: "Can you work with our in-house engineers?",
        answer:
          "Yes, and we prefer it. They review our pull requests and we review theirs; the handover is shorter because nothing is new to them.",
      },
    ],
    closing: "Tell us what you want built. We will tell you what it costs.",
  },
  {
    id: "team-augmentation",
    n: 2,
    name: "Team augmentation",
    oneLiner: "Senior engineers inside your team",
    description:
      "Named engineers in your standup from day one, on your repo and your board. We manage the person; you direct the work. Replacement inside ten working days if it is not working.",
    tiles: [
      {
        title: "Senior only",
        text: "Years in production. No junior tier.",
      },
      {
        title: "Your tooling",
        text: "Nothing of ours to adopt.",
      },
      {
        title: "10-day replacement",
        text: "If it is not working.",
      },
    ],
    goodFor: [
      "Scaling a team without a six-month hiring round",
      "A nine-month push with a hard date",
      "Covering a leaver while you hire properly",
    ],
    stack: [
      "Backend",
      "Frontend",
      "Full-stack",
      "Mobile",
      "Data",
      "Product",
      ".NET",
      "Node.js",
      "Python",
      "React",
      "Angular",
      "Kotlin",
    ],
    shape: "Embedded · monthly, per engineer",
    pageTitle: "Senior engineers\ninside your team.",
    gets: [
      "A named senior engineer, in your standup from day one, on your repo and your board",
      "You meet the engineer before they start, and you can say no",
      "We manage performance, holidays and cover; you direct the work",
      "If it is not working, a replacement inside ten working days, and you do not pay for the overlap",
    ],
    sayNoWhen: [
      "You need a junior to clear the tickets nobody else wants",
      "You want someone to be managed rather than someone who manages themselves",
    ],
    steps: [
      {
        when: "Day 0",
        title: "The call",
        text: "What the team is building, what is slowing it down, and what good looks like in three months.",
      },
      {
        when: "Day 3",
        title: "Profiles, not a bench",
        text: "One or two named engineers, with the systems they have shipped. You interview them; you can say no.",
      },
      {
        when: "Day 10",
        title: "In your standup",
        text: "Access, first commit, first review. Your tooling, your definition of done.",
      },
      {
        when: "Fortnightly",
        title: "The review",
        text: "What landed, what slipped, what to change. A fifteen-minute call.",
      },
      {
        when: "30 days",
        title: "Notice, either side",
        text: "No argument, no buyout, no recruiter fee if you later hire them.",
      },
    ],
    record: ["F7", "F13", "F14"],
    faq: [
      {
        question: "How senior is senior?",
        answer:
          "Years shipping to production, not years in the industry. Every engineer we place has owned a system in production and can show you which one.",
      },
      {
        question: "Can we hire them permanently later?",
        answer:
          "Yes. After six months there is no fee; before that, one month of the day rate. We would rather you had the person than a clause.",
      },
    ],
    closing: "Tell us who is missing. We will show you who we would send.",
  },
  {
    id: "data-engineering",
    n: 3,
    name: "Data engineering & analytics",
    oneLiner: "Pipelines and reporting people stop arguing with",
    description:
      "Ingest, warehouse, models and dashboards that the in-house team can run after we leave. Measured before and after every increment.",
    tiles: [
      {
        title: "Batch → incremental",
        text: "Nightly runs that finish.",
      },
      {
        title: "One source of truth",
        text: "Warehouse and semantic layer.",
      },
      {
        title: "Dashboards used",
        text: "By the people who asked.",
      },
    ],
    goodFor: [
      "Reporting nobody trusts",
      "A nightly batch that is now a daily problem",
      "Numbers that differ by who ran the query",
    ],
    stack: [
      "Custom ETL",
      "AWS Glue",
      "Athena",
      "PostgreSQL",
      "TimescaleDB",
      "Redshift",
      "Power BI",
      "Mixpanel",
      "Amplitude",
      "Funnel analysis",
    ],
    shape: "Data & AI · project or retained",
    pageTitle: "Pipelines and reporting\npeople stop arguing with.",
    gets: [
      "Ingest and warehouse work the in-house team can run after we leave",
      "One source of truth: a warehouse and a semantic layer, documented where your team looks",
      "Dashboards the people who asked for them actually open",
      "A before-and-after measurement on every increment",
    ],
    sayNoWhen: [
      "You want a dashboard before anyone agrees what the numbers mean",
      "The data does not exist yet and nobody owns collecting it",
    ],
    steps: [
      {
        when: "Week 0",
        title: "Read the pipeline",
        text: "Sources, schedules, the queries people run by hand, and the two numbers that disagree.",
      },
      {
        when: "Week 1",
        title: "The baseline",
        text: "How long the nightly run takes, how often it fails, and which report nobody trusts. Written down.",
      },
      {
        when: "Week 3",
        title: "First increment",
        text: "The worst pipeline replaced: incremental, idempotent, with a dead-letter queue and a replay.",
      },
      {
        when: "Week 6",
        title: "Runs without us",
        text: "Runbook, alerts and the on-call steps in your wiki; your team runs it for a week while we watch.",
      },
      {
        when: "Fortnightly",
        title: "The review",
        text: "The same numbers as week one, after. Then the next pipeline, or the handover.",
      },
    ],
    record: ["C1", "F16", "C9", "F17"],
    faq: [
      {
        question: "Which warehouse?",
        answer:
          "The one you have, unless it is the problem. We have shipped on PostgreSQL, Redshift, TimescaleDB and Athena over S3; we will say on the call if yours is the wrong tool.",
      },
      {
        question: "Do you do the dashboards too?",
        answer:
          "Yes, and we start from the question the dashboard answers, not the chart. If nobody can say what decision it changes, we build the pipeline first and the dashboard last.",
      },
      {
        question: "What does measured mean here?",
        answer:
          "A number from before, the same number from after, and the unit: run time, failure rate, freshness, the gap between two reports. It goes in the review you sign.",
      },
    ],
    closing: "Bring the report nobody trusts. We will tell you why.",
  },
  {
    id: "ai-machine-learning",
    n: 4,
    name: "AI & machine learning",
    oneLiner: "Features that have to be right, not impressive",
    description:
      "Retrieval, LLM features, classification and forecasting, each with an evaluation harness so you know when it got better and when it did not.",
    tiles: [
      {
        title: "Eval harness first",
        text: "A number before a demo.",
      },
      {
        title: "Retrieval done properly",
        text: "Chunking, ranking, citations.",
      },
      {
        title: "Cost and latency",
        text: "Budgeted, then measured.",
      },
    ],
    goodFor: [
      "An AI feature that has to be right, not impressive",
      "Search or support that should answer from your data",
      "Forecasts the finance team will actually use",
    ],
    stack: [
      "Claude Code",
      "MCP servers",
      "LangGraph",
      "LangChain",
      "CrewAI",
      "RAG",
      "pgvector",
      "Qdrant",
      "Claude API",
      "OpenAI",
      "Gemini",
      "AWS Bedrock",
      "LangSmith",
      "Langfuse",
      "Promptfoo",
      "TensorFlow",
      "OpenCV",
    ],
    shape: "Data & AI · project or retained",
    pageTitle: "Features that have to be\nright, not impressive.",
    gets: [
      "An evaluation harness before a demo: a number you can defend to your board",
      "Retrieval done properly: chunking, ranking, citations, and the cases where it should say nothing",
      "Cost and latency budgeted up front, then measured in production",
      "Monitoring, retraining and rollout owned end to end, not handed to you as a notebook",
    ],
    sayNoWhen: [
      "The goal is an AI feature rather than a problem the feature solves",
      "There is no data you are allowed to use, and no plan to get some",
    ],
    steps: [
      {
        when: "Week 0",
        title: "The problem, in a sentence",
        text: "What the model must get right, how often, and what happens when it is wrong.",
      },
      {
        when: "Week 1",
        title: "Eval set and baseline",
        text: "A few hundred real cases, labelled with you. The number today, before any model.",
      },
      {
        when: "Week 3",
        title: "First model behind a gate",
        text: "Retrieval or classification in a staging environment, released only when the number moves.",
      },
      {
        when: "Week 6",
        title: "In production, watched",
        text: "Monitoring on quality, cost and latency; a retraining loop; a person in the loop where it matters.",
      },
      {
        when: "Fortnightly",
        title: "The review",
        text: "The eval number, the bill and the latency, before and after. Then the next feature.",
      },
    ],
    record: ["F3", "F11", "F12", "F5", "C6", "F18"],
    faq: [
      {
        question: "Which models do you use?",
        answer:
          "Whichever passes the eval at a cost you can afford. We have shipped on Claude, OpenAI, Gemini and Bedrock, and on small models where a large one was too expensive. The harness decides, not the logo.",
      },
      {
        question: "Will it hallucinate?",
        answer:
          "Sometimes, which is why the harness exists. Retrieval with citations, refusal when the sources are thin, and a measured false-answer rate you can see every fortnight.",
      },
      {
        question: "Can you use our data without it leaving our account?",
        answer:
          "Yes. Models run in your cloud account or through a provider with no training on your data, and the retrieval index lives with you.",
      },
    ],
    closing: "Tell us what it must get right. We will say how to measure it.",
  },
  {
    id: "cloud-devops",
    n: 5,
    name: "Cloud & DevOps",
    oneLiner: "Deploys that are boring",
    description:
      "CI/CD, infrastructure as code, observability and cost control, set up so your team owns it afterwards and the on-call runbook is written before you need it.",
    tiles: [
      {
        title: "CI from day one",
        text: "Tests before features.",
      },
      {
        title: "Infra as code",
        text: "Reviewed like code.",
      },
      {
        title: "Cost control",
        text: "A bill you can explain.",
      },
    ],
    goodFor: [
      "Deploys that need a war room",
      "A cloud bill nobody can explain",
      "No runbook for the thing that pages you",
    ],
    stack: [
      "AWS EKS",
      "ECR",
      "RDS",
      "Lambda",
      "SQS / SNS",
      "S3",
      "CloudWatch",
      "Azure",
      "Docker",
      "CI/CD",
      "Vercel",
      "Railway",
      "Neon",
      "Cloudflare R2",
      "EMQX / MQTT",
    ],
    shape: "Embedded or Built",
    pageTitle: "Deploys that\nare boring.",
    gets: [
      "CI/CD with tests before features, not after the first incident",
      "Infrastructure as code, reviewed like code, with a plan you can read before it applies",
      "Observability you can act on, and a runbook for the thing that pages you",
      "A cloud bill you can explain, line by line, and a smaller one",
    ],
    sayNoWhen: [
      "You want us to hold the pager forever instead of handing it back",
      "Kubernetes is the goal rather than a decision",
    ],
    steps: [
      {
        when: "Week 0",
        title: "Read the estate",
        text: "Accounts, pipelines, what deploys by hand, what nobody dares touch, and last month's bill.",
      },
      {
        when: "Week 1",
        title: "Pipeline and IaC baseline",
        text: "Every service deployable from a pull request; the infrastructure in code, even if it is ugly code.",
      },
      {
        when: "Week 3",
        title: "Observability and runbooks",
        text: "Logs, metrics and traces where they are useful; an on-call runbook for each alert that can fire.",
      },
      {
        when: "Week 6",
        title: "Your team owns it",
        text: "Deploy frequency, lead time and the bill, before and after. Your engineers ran the last week.",
      },
      {
        when: "Fortnightly",
        title: "The review",
        text: "What broke, what did not, what it cost. Then the next piece, or the handover.",
      },
    ],
    record: ["F7", "F14", "F6"],
    faq: [
      {
        question: "AWS, Azure or GCP?",
        answer:
          "Mostly AWS, some Azure. If you are on GCP we will say so on the call rather than learn it on your time.",
      },
      {
        question: "Do we need Kubernetes?",
        answer:
          "Usually not. We have run production on EKS where it earned its keep and on Lambda, Railway and plain containers where it did not. The decision is written down with the reasons.",
      },
      {
        question: "Who is on call?",
        answer:
          "Your team, with our runbook, from week six. Until then we are, and the handover includes a week of us watching them run it.",
      },
    ],
    closing: "Show us the deploy you dread. We will make it boring.",
  },
  {
    id: "legacy-modernisation",
    n: 6,
    name: "Legacy modernisation",
    oneLiner: "Rebuilds the in-house team can run",
    description:
      "Strangler-pattern migrations off the system nobody wants to touch, one bounded piece at a time, with the old and new running side by side until the numbers match.",
    tiles: [
      {
        title: "One seam at a time",
        text: "No big-bang cutover.",
      },
      {
        title: "Parity measured",
        text: "Old vs new, same inputs.",
      },
      {
        title: "Knowledge captured",
        text: "Docs where your team looks.",
      },
    ],
    goodFor: [
      "A system nobody wants to touch",
      "A framework three major versions behind",
      "A migration that has been ‘next quarter’ for two years",
    ],
    stack: [
      "Monolith → microservices",
      ".NET Framework → .NET",
      "IIS / EC2 stabilisation",
      "RDS migrations",
      "Cron → queues",
      "gRPC",
      "GraphQL",
      "WordPress → custom",
    ],
    shape: "Built · fixed scope per increment",
    pageTitle: "Rebuilds the in-house\nteam can run.",
    gets: [
      "Strangler-pattern migration: one bounded piece at a time, never a big-bang cutover",
      "Old and new running side by side until the numbers match",
      "Parity measured: same inputs, same outputs, in your environment, before anything is switched off",
      "Knowledge captured where your team looks, not in our heads",
    ],
    sayNoWhen: [
      "Rewrite it all is the plan, and the only plan",
      "Nobody can say what the system does today, and nobody wants to find out",
    ],
    steps: [
      {
        when: "Week 0",
        title: "Map the seams",
        text: "What the system does, who depends on it, and where it can be cut without anyone noticing.",
      },
      {
        when: "Week 1",
        title: "First seam, parity test",
        text: "The smallest valuable piece chosen; a test that replays real inputs through old and new.",
      },
      {
        when: "Week 6",
        title: "First seam cut over",
        text: "New code taking real traffic for one bounded piece; the old path still there, one flag away.",
      },
      {
        when: "Then",
        title: "One seam per increment",
        text: "The same loop, piece by piece, each one measured, each one reversible.",
      },
      {
        when: "Fortnightly",
        title: "The review",
        text: "What moved, what matched, what the old system still owns. Then the next seam.",
      },
    ],
    record: ["F7", "F15", "F14"],
    faq: [
      {
        question: "How long does a migration take?",
        answer:
          "Longer than a rewrite is promised to take and shorter than a rewrite actually takes. The first seam is live in six weeks; after that you can see the rate and decide the pace.",
      },
      {
        question: "What if the old system has no tests?",
        answer:
          "Then the parity test is the first thing we write: real inputs recorded, replayed through both paths, differences listed. It is the only safe way to learn what the system does.",
      },
      {
        question: "Can we stop halfway?",
        answer:
          "Yes, and the system is better than when we started: the pieces already moved keep running, and the map of the rest is yours.",
      },
    ],
    closing: "Name the system nobody touches. We will say where to cut first.",
  },
  {
    id: "mobile",
    n: 7,
    name: "Mobile",
    oneLiner: "iOS and Android without two teams",
    description:
      "Cross-platform where it makes sense, native where it does not, with the release pipeline and crash reporting set up before the first store submission.",
    tiles: [
      {
        title: "One codebase",
        text: "Where the product allows.",
      },
      {
        title: "Store-ready",
        text: "Signing, review, release.",
      },
      {
        title: "Crash-free",
        text: "Tracked from day one.",
      },
    ],
    goodFor: [
      "A web product that needs to be in the stores",
      "An app with more crashes than reviews",
      "Two native teams doing the same work twice",
    ],
    stack: [
      "Android",
      "Kotlin",
      "AOSP",
      "iOS",
      "Offline-first sync",
      "EMQX / MQTT",
      "Tauri (desktop)",
      "Electron (desktop)",
      "Figma design system",
    ],
    shape: "Built · fixed scope per increment",
    pageTitle: "iOS and Android\nwithout two teams.",
    gets: [
      "One codebase where the product allows; native where it does not, and the decision written down",
      "Store-ready from the start: signing, review guidelines, a release pipeline before the first submission",
      "Crash reporting and analytics from day one, not after the first one-star review",
      "Offline-first where the device will actually be offline",
    ],
    sayNoWhen: [
      "The app is a website in a wrapper and should stay a website",
      "Two native teams are wanted for reasons that are not about the product",
    ],
    steps: [
      {
        when: "Week 0",
        title: "The platform decision",
        text: "What the app must do on a bad network, what it needs from the device, and who installs it.",
      },
      {
        when: "Week 1",
        title: "The release pipeline",
        text: "Signing, TestFlight and Play tracks, crash reporting, analytics. Before the first screen.",
      },
      {
        when: "Week 6",
        title: "First build in testers' hands",
        text: "A real journey end to end, on real devices, measured.",
      },
      {
        when: "Then",
        title: "Store submission",
        text: "Review guidelines handled before review, not after rejection.",
      },
      {
        when: "Fortnightly",
        title: "The review",
        text: "Crash-free rate, adoption, the next journey. Your call.",
      },
    ],
    record: ["F6", "C3", "F4", "F5"],
    faq: [
      {
        question: "Native or cross-platform?",
        answer:
          "Depends on the product, not on us. We have shipped Kotlin, custom Android (AOSP) players, and cross-platform builds; the decision goes in the SOW with the reasons.",
      },
      {
        question: "Do you handle the app stores?",
        answer:
          "Yes: accounts, signing, review guidelines, the release notes. If Apple rejects a build, that is our problem on our time.",
      },
      {
        question: "What about devices that are offline for days?",
        answer:
          "Offline-first sync is something we have built for signage players that lose their connection for a week; the app keeps working and reconciles when it can.",
      },
    ],
    closing: "Tell us what the app must do offline. We will say how.",
  },
  {
    id: "qa-test-automation",
    n: 8,
    name: "QA & test automation",
    oneLiner: "Suites that make deploys boring",
    description:
      "Unit, integration and end-to-end coverage that runs in CI in minutes, plus load testing before the launch rather than after the outage.",
    tiles: [
      {
        title: "Runs in minutes",
        text: "Or it is not run.",
      },
      {
        title: "Flake tracked",
        text: "And fixed, not retried.",
      },
      {
        title: "Load tested",
        text: "Before launch day.",
      },
    ],
    goodFor: [
      "Releases that break something every time",
      "A test suite everyone skips",
      "A launch with no idea what load it takes",
    ],
    stack: [
      "Automated test generation",
      "Eval harnesses",
      "Guardrails",
      "Playwright",
      "pytest",
      "Jest",
      "k6",
      "CI pipelines",
    ],
    shape: "Embedded · monthly, per engineer",
    pageTitle: "Suites that make\ndeploys boring.",
    gets: [
      "Unit, integration and end-to-end coverage that runs in CI in minutes",
      "Flaky tests tracked and fixed, not retried until green",
      "Load testing before the launch, not after the outage",
      "The same discipline for AI features: an evaluation harness that gates release",
    ],
    sayNoWhen: [
      "Coverage is wanted as a number rather than as fewer incidents",
      "Tests are wanted so that nobody has to review",
    ],
    steps: [
      {
        when: "Week 0",
        title: "Read the suite",
        text: "What exists, what is skipped, what is flaky, and how long a green build takes today.",
      },
      {
        when: "Week 1",
        title: "A gate on every pull request",
        text: "The suite runs in CI in minutes; a red build blocks the merge, and everyone can see why.",
      },
      {
        when: "Week 3",
        title: "End to end on the journeys that matter",
        text: "The five flows that would make the phone ring, covered on real browsers and devices.",
      },
      {
        when: "Week 6",
        title: "Load test and handover",
        text: "The launch load, run before the launch; your team owns the suite and the flake board.",
      },
      {
        when: "Fortnightly",
        title: "The review",
        text: "Build time, flake rate, incidents, before and after. Then the next gap.",
      },
    ],
    record: ["F5", "F12", "F3"],
    faq: [
      {
        question: "What tools?",
        answer:
          "Playwright, pytest, Jest and k6 for most stacks, plus generated tests and guardrails from our agentic pipeline where the codebase suits it. The tool follows the stack; we do not make you adopt ours.",
      },
      {
        question: "Will tests slow the team down?",
        answer:
          "A suite that runs in minutes speeds the team up; one that takes an hour gets skipped. The first thing we measure is build time, and it goes down before coverage goes up.",
      },
      {
        question: "Can you test the AI features too?",
        answer:
          "Yes. Evaluation harnesses are tests: a labelled set, a number, a gate in CI. We have shipped them for computer vision, recommendation and retrieval features.",
      },
    ],
    closing: "Show us the suite everyone skips. We will make it trusted.",
  },
] satisfies Service[];
