// Converted once from the approved prototype (reference/site) by scripts/convert_content.mjs on 2026-10-10.
// This file is now the source of truth for this copy: edit it by hand. Bracketed [PLACEHOLDERS] stay until the
// founders replace them (CLAUDE.md rule 1). Run `pnpm check:content` after editing.
import type { Navigation } from "./types";

export const navigation = {
  // v2: AI transformation and Agentic flow sit together in a Lime capsule with this accessible name.
  aiGroupLabel: "AI delivery",
  primary: [
    {
      label: "Services",
      href: "/services",
      children: [
        {
          label: "Custom software",
          desc: "Products built end to end",
          href: "/services/custom-software",
        },
        {
          label: "Team augmentation",
          desc: "Senior engineers inside your team",
          href: "/services/team-augmentation",
        },
        {
          label: "Data engineering & analytics",
          desc: "Pipelines and reporting people stop arguing with",
          href: "/services/data-engineering",
        },
        {
          label: "AI & machine learning",
          desc: "Features that have to be right, not impressive",
          href: "/services/ai-machine-learning",
        },
        {
          label: "Cloud & DevOps",
          desc: "Deploys that are boring",
          href: "/services/cloud-devops",
        },
        {
          label: "Legacy modernisation",
          desc: "Rebuilds the in-house team can run",
          href: "/services/legacy-modernisation",
        },
        {
          label: "Mobile",
          desc: "iOS and Android without two teams",
          href: "/services/mobile",
        },
        {
          label: "QA & test automation",
          desc: "Suites that make deploys boring",
          href: "/services/qa-test-automation",
        },
      ],
      menuFooter: [
        {
          label: "All eight, and the three ways we work →",
          href: "/services",
          variant: "link",
        },
      ],
    },
    {
      label: "Industries",
      href: "/industries",
      children: [
        {
          label: "Fintech & payments",
          desc: "150+ · merchants, four months after launch",
          href: "/industries/fintech-payments",
        },
        {
          label: "Retail & e-commerce",
          desc: "5× · repeat transactions, enterprise loyalty",
          href: "/industries/retail-ecommerce",
        },
        {
          label: "Healthcare & life sciences",
          desc: "60% · less analysis time on preclinical data",
          href: "/industries/healthcare-life-sciences",
        },
        {
          label: "Logistics, travel & marketplaces",
          desc: "Real-time · load status and assignments over WebSockets",
          href: "/industries/logistics-travel-marketplaces",
        },
        {
          label: "IoT, signage & the built environment",
          desc: "200+ · buildings on one telemetry platform",
          href: "/industries/iot-signage-built-environment",
        },
        {
          label: "SaaS, platforms & AI products",
          desc: "10 · engineers on the agentic delivery path",
          href: "/industries/saas-platforms-ai-products",
        },
      ],
      menuFooter: [
        {
          label: "All six →",
          href: "/industries",
          variant: "link",
        },
      ],
    },
    {
      label: "AI transformation",
      href: "/ai-transformation",
      group: "ai",
    },
    {
      label: "Agentic flow",
      href: "/agentic-flow",
      group: "ai",
    },
    {
      label: "Company",
      href: "/approach",
      // A menu, not a page: the trigger is a button (design & SEO review, 2026-10-11).
      toggle: true,
      children: [
        {
          label: "Work",
          desc: "32 case notes, client names withheld",
          href: "/work",
        },
        {
          label: "Approach",
          desc: "How we staff, run and measure an account",
          href: "/approach",
        },
        {
          label: "Notes",
          desc: "Things we would say on the call anyway",
          href: "/notes",
        },
        {
          label: "Working with us",
          desc: "Contracts, IP, data, security, invoicing",
          href: "/working-with-us",
        },
        {
          label: "For agencies",
          desc: "White-label delivery under your brand",
          href: "/for-agencies",
        },
        {
          label: "Join",
          desc: "Senior only, and what that means",
          href: "/join",
        },
        {
          label: "Why not just hire?",
          desc: "The honest table",
          href: "/why-not-just-hire",
        },
      ],
    },
  ],
  cta: {
    label: "Book a consult",
    href: "/book",
    variant: "lime",
  },
  footer: [
    {
      title: "Services",
      links: [
        {
          label: "Custom software",
          href: "/services/custom-software",
        },
        {
          label: "Team augmentation",
          href: "/services/team-augmentation",
        },
        {
          label: "Data engineering & analytics",
          href: "/services/data-engineering",
        },
        {
          label: "AI & machine learning",
          href: "/services/ai-machine-learning",
        },
        {
          label: "Cloud & DevOps",
          href: "/services/cloud-devops",
        },
        {
          label: "Legacy modernisation",
          href: "/services/legacy-modernisation",
        },
        {
          label: "Mobile",
          href: "/services/mobile",
        },
        {
          label: "QA & test automation",
          href: "/services/qa-test-automation",
        },
      ],
    },
    {
      title: "Industries",
      links: [
        {
          label: "Fintech & payments",
          href: "/industries/fintech-payments",
        },
        {
          label: "Retail & e-commerce",
          href: "/industries/retail-ecommerce",
        },
        {
          label: "Healthcare & life sciences",
          href: "/industries/healthcare-life-sciences",
        },
        {
          label: "Logistics, travel & marketplaces",
          href: "/industries/logistics-travel-marketplaces",
        },
        {
          label: "IoT, signage & the built environment",
          href: "/industries/iot-signage-built-environment",
        },
        {
          label: "SaaS, platforms & AI products",
          href: "/industries/saas-platforms-ai-products",
        },
      ],
    },
    {
      title: "Company",
      links: [
        {
          label: "Approach",
          href: "/approach",
        },
        {
          label: "Work",
          href: "/work",
        },
        {
          label: "Notes",
          href: "/notes",
        },
        {
          label: "AI transformation",
          href: "/ai-transformation",
        },
        {
          label: "Agentic flow",
          href: "/agentic-flow",
        },
        {
          label: "For agencies",
          href: "/for-agencies",
        },
        {
          label: "Join",
          href: "/join",
        },
        {
          label: "Working with us",
          href: "/working-with-us",
        },
      ],
    },
    {
      title: "Start",
      links: [
        {
          label: "Book a consult",
          href: "/book",
        },
        {
          label: "Send a brief",
          href: "/brief",
        },
        {
          label: "Why not just hire?",
          href: "/why-not-just-hire",
        },
        {
          label: "Privacy",
          href: "/privacy",
        },
        {
          label: "Terms",
          href: "/terms",
        },
      ],
    },
  ],
} satisfies Navigation;
