// Page titles and meta descriptions (design & SEO review, @Arslan, 2026-10-11, section 15). Every number here is
// from the record: 150+ merchants (F0), up to 5× repeat transactions (F1), 60% less analysis time (C1), 200+ buildings
// (F17), 500% growth in qualified inbound leads (C11), 32 case studies. Changed from the review's drafts where they
// disagreed with the site: Cloud's runbook is "written before you need it", not "already written"; Work says
// "repeat transactions", not "repeat purchase"; no "measured" claim for all 32 (not every case has a number yet).
import type { PageSeo, SeoTemplates } from "./types";

export const seo = {
  "/": {
    title: "Custom Software & AI Development Partner | Hopsig",
    description:
      "We scope, build and run software and AI products end to end, or embed engineers in your team. A two-page scope in 3 days; first release by week 6. US company, Lahore Delivery Centre.",
  },
  "/services": {
    title: "Software Development Services: 3 Engagement Models | Hopsig",
    description:
      "Embedded engineers, fixed-scope builds, or data & AI systems. Same senior-led team, same scope-first habit, and a fortnightly review either way.",
  },
  "/services/custom-software": {
    title: "Custom Software Development Services | Hopsig",
    description:
      "Products built end to end: a two-page scope in 3 days, working software in your cloud in 6 weeks, then a runbook and handover. Code is yours on payment.",
  },
  "/services/team-augmentation": {
    title: "Staff Augmentation: Engineers in Your Team, Senior-Led | Hopsig",
    description:
      "Named engineers in your standup from day 10, led by a senior, on your repo and board. We manage the person, you direct the work; replacement in 10 working days.",
  },
  "/services/data-engineering": {
    title: "Data Engineering & Analytics Services | Hopsig",
    description:
      "Pipelines, warehouses and dashboards people stop arguing about. Batch to incremental, one source of truth, measured before and after every increment.",
  },
  "/services/ai-machine-learning": {
    title: "AI & Machine Learning Development Services | Hopsig",
    description:
      "RAG, LLM features, classification and forecasting, each with an evaluation harness first, so you know when it got better. Cost and latency budgeted.",
  },
  "/services/cloud-devops": {
    title: "Cloud & DevOps Consulting: CI/CD, IaC, AWS | Hopsig",
    description:
      "CI/CD, infrastructure as code, observability and cloud cost control your team owns afterwards, with the on-call runbook written before you need it. AWS and Azure.",
  },
  "/services/legacy-modernisation": {
    title: "Legacy Application Modernization Services | Hopsig",
    description:
      "Strangler-pattern migrations off the system nobody wants to touch: one seam at a time, old and new side by side until parity is measured.",
  },
  "/services/mobile": {
    title: "Mobile App Development: iOS & Android | Hopsig",
    description:
      "Cross-platform where it fits, native where it does not. Release pipeline, store submission and crash reporting set up before launch; offline-first by design.",
  },
  "/services/qa-test-automation": {
    title: "QA & Test Automation Services | Hopsig",
    description:
      "Unit, integration and end-to-end suites that run in CI in minutes, flaky tests fixed not retried, and load testing before launch day. Playwright, pytest, k6.",
  },
  "/industries": {
    title: "Industries: Fintech, Retail, Healthcare & More | Hopsig",
    description:
      "Software and AI delivery across fintech, retail, healthcare, logistics, IoT and SaaS. 32 case studies; client names withheld, numbers not.",
  },
  "/industries/fintech-payments": {
    title: "Fintech & Payments Software Development | Hopsig",
    description:
      "Embedded payments, wallets, KYC and finance reporting built under PCI-DSS. One platform went from 0 to 150+ merchants in four months after launch.",
  },
  "/industries/retail-ecommerce": {
    title: "Retail & E-commerce Software Development | Hopsig",
    description:
      "Storefronts, loyalty, personalisation, inventory and POS measured by repeat purchase and conversion. Up to 5× repeat transactions on one loyalty engine.",
  },
  "/industries/healthcare-life-sciences": {
    title: "Healthcare & Life Sciences Software Development | Hopsig",
    description:
      "Software built to be supervised, audited and still used: regulated platforms, imaging and research data. 60% less analysis time on preclinical data.",
  },
  "/industries/logistics-travel-marketplaces": {
    title: "Logistics & Marketplace Software Development | Hopsig",
    description:
      "Dispatch boards, driver apps and marketplaces that stay real-time on a bad connection. One marketplace saw 500% growth in qualified inbound leads.",
  },
  "/industries/iot-signage-built-environment": {
    title: "IoT, Digital Signage & Smart Building Software | Hopsig",
    description:
      "Signage platforms, device telemetry and building intelligence that keep working offline. One telemetry platform runs across 200+ buildings.",
  },
  "/industries/saas-platforms-ai-products": {
    title: "SaaS & AI Product Development | Hopsig",
    description:
      "Multi-tenant SaaS, developer APIs and AI products that ship on the date and keep shipping, with evaluation gates before every AI release.",
  },
  "/ai-transformation": {
    title: "AI Transformation for Engineering Teams | Hopsig",
    description:
      "Your team shipping with AI agents in six weeks: one repo, a week-one baseline, and the same five delivery metrics measured after. A person signs every increment.",
  },
  "/agentic-flow": {
    title: "Agentic Software Development on Claude Code | Hopsig",
    description:
      "Six agents, one pipeline, a person at every gate. How we plan, build, review and document with AI agents that never merge to main or touch production.",
  },
  "/work": {
    title: "Software Case Studies: 32 Projects | Hopsig",
    description:
      "Payments, retail, healthcare, IoT and AI projects with the numbers on them: 150+ merchants, 5× repeat transactions, 60% less analysis time.",
  },
  "/notes": {
    title: "Notes on Software Delivery, AI & Scope | Hopsig",
    description:
      "Short, opinionated notes from the engineers doing the work: scoping, evaluation harnesses, agentic delivery and measuring what improved.",
  },
  "/approach": {
    title: "How We Work: Senior-Led Engineering | Hopsig",
    description:
      "Senior-led teams, no bench, replacement in 10 working days, and an SDLC on Claude Code where a person signs every increment.",
  },
  "/working-with-us": {
    title: "Contracts, IP, Data & Security | Working with Hopsig",
    description:
      "One MSA, a two-page SOW, IP yours on payment, work in your cloud account, a DPA for UK/EU clients. Everything procurement checks, on one page.",
  },
  "/for-agencies": {
    title: "White-Label Software Development for Agencies | Hopsig",
    description:
      "Your brand on the SOW, our engineers behind it. NDA by default, first commit in 10 days, 12-month non-solicit, no margin share.",
  },
  "/join": {
    title: "Software Engineering Jobs in Lahore | Hopsig",
    description:
      "Backend, frontend, data, AI and mobile engineers on senior-led client teams. No whiteboard puzzles: send us a system you shipped.",
  },
  "/why-not-just-hire": {
    title: "Staff Augmentation vs Hiring vs Outsourcing | Hopsig",
    description:
      "In-house, big outsourcer, freelancer or Hopsig: an honest table of time to first commit, notice, management and IP, including when you should just hire.",
  },
  "/book": {
    title: "Book a 30-Minute Consult | Hopsig",
    description:
      "Thirty minutes with the engineers who would do the work. You get a yes or no on the call, and a two-page scope three days later, before you pay.",
  },
  "/brief": {
    title: "Send a Project Brief | Hopsig",
    description:
      "Prefer writing? Describe the problem and rough timing. We read it the same day and reply within one working day with a yes, a no, or three questions.",
  },
  "/privacy": {
    title: "Privacy | Hopsig",
    description: "What Hopsig Technologies LLC collects when you ask to talk, and the usual logs. Nothing is sold or shared for advertising.",
  },
  "/terms": {
    title: "Terms of Use | Hopsig",
    description: "The terms for using hopsig.com. Signed agreements with clients take precedence.",
  },
} satisfies Record<string, PageSeo>;

/** Case notes and notes from Sanity, when their own SEO fields are empty. `{title}` etc. come from the document. */
export const seoTemplates = {
  caseNote: { title: "{title} — Case Study | Hopsig", description: "{problem}" },
  note: { title: "{title} | Hopsig Notes", description: "{excerpt}" },
  notFound: { title: "Page not found | Hopsig" },
  siteName: "Hopsig",
} satisfies SeoTemplates;

/** Structured data about the company (schema.org Organization), from the owner's decisions of 2026-10-11. The
 *  Wyoming address is a registered-agent address: no Google Business Profile for it. foundingDate, logo and sameAs
 *  (LinkedIn, GitHub, Clutch) are added when the founders supply them. */
export const organization = {
  name: "Hopsig Technologies",
  legalName: "Hopsig Technologies LLC",
  email: "info@hopsig.com",
  address: { streetAddress: "30 N Gould St Ste R", addressLocality: "Sheridan", addressRegion: "WY", postalCode: "82801", addressCountry: "US" },
  location: { name: "Delivery Centre", addressLocality: "Lahore", addressCountry: "PK" },
  areaServed: "Worldwide",
};
