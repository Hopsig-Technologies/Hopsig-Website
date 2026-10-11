// Converted once from the approved prototype (reference/site) by scripts/convert_content.mjs on 2026-10-10.
// This file is now the source of truth for this copy: edit it by hand. Bracketed [PLACEHOLDERS] stay until the
// founders replace them (CLAUDE.md rule 1). Run `pnpm check:content` after editing.
import type { Industry } from "./types";

export const industries = [
  {
    id: "fintech-payments",
    // The plain search phrase for this page: shown as the hero eyebrow, inside the H1 (design & SEO review, 2026-10-11).
    keyword: "Fintech & payments software development",
    n: 1,
    name: "Fintech & payments",
    short: "Fintech",
    title: "Payments that clear.\nBooks that balance.",
    sub: "Embedded payments, wallets, KYC and the reporting finance teams trust: built under PCI-DSS, measured by conversion and settlement rather than by features.",
    facts: [
      {
        value: "150+",
        label: "merchants, four months after launch",
      },
      {
        value: "100K+",
        label: "transactions in the same four months",
      },
      {
        value: "PCI-DSS",
        label: "compliance built in from day one",
      },
      {
        value: "KYC",
        label: "document verification, automated",
      },
    ],
    record: ["F0", "C5", "F1"],
    fullCards: 2,
    asks: [
      {
        title: "PCI-DSS and KYC",
        text: "Scope the cardholder-data boundary first and keep it small. Automate the document checks so onboarding never waits on a review queue.",
      },
      {
        title: "Fraud and reconciliation",
        text: "Anomaly detection across payments and balances, and a ledger that reconciles to the processor every day rather than at month end.",
      },
      {
        title: "Conversion as the metric",
        text: "Checkout and onboarding conversion measured from week one. Payment-method mix decides what gets built next.",
      },
    ],
    services: [
      {
        service: "custom-software",
        text: "The platform itself: onboarding, wallets, billing, in your cloud account.",
      },
      {
        service: "ai-machine-learning",
        text: "Fraud and anomaly detection with an evaluation gate, not a rule that nobody dares change.",
      },
      {
        service: "data-engineering",
        text: "Reconciliation and finance reporting that matches the processor.",
      },
      {
        service: "qa-test-automation",
        text: "Load tested before the campaign, not during it.",
      },
    ],
    close: "Tell us what has to clear. We will say how we would build it.",
  },
  {
    id: "retail-ecommerce",
    // The plain search phrase for this page: shown as the hero eyebrow, inside the H1 (design & SEO review, 2026-10-11).
    keyword: "Retail & e-commerce software development",
    n: 2,
    name: "Retail & e-commerce",
    short: "Retail",
    title: "Checkouts that convert.\nStock that is where it says.",
    sub: "Storefronts, loyalty, personalisation, inventory and POS: for retailers from one store to a hundred, measured by repeat purchase and conversion.",
    facts: [
      {
        value: "5×",
        label: "repeat transactions, enterprise loyalty",
      },
      {
        value: "261×",
        label: "client ROI from personalisation, upper bound",
      },
      {
        value: "100+",
        label: "cloud POS locations",
      },
      {
        value: "75%",
        label: "more repeat customers in two months",
      },
    ],
    record: ["F1", "F3", "F4", "F2", "C4", "C9", "C10", "F15"],
    fullCards: 2,
    asks: [
      {
        title: "Peak load",
        text: "Loyalty and checkout on microservices with caching for the Friday night that matters, load-tested before the campaign.",
      },
      {
        title: "Inventory truth",
        text: "One stock position across stores, warehouses and the app, with the reconciliation jobs that keep it true.",
      },
      {
        title: "Repeat purchase",
        text: "Loyalty rules with fraud risk designed in, personalisation with evaluation gates, and a funnel instrumented so every change is proven rather than asserted.",
      },
    ],
    services: [
      {
        service: "custom-software",
        text: "Storefront, loyalty engine, POS: built to a scope, in your cloud.",
      },
      {
        service: "data-engineering",
        text: "Funnel instrumentation and the warehouse behind the dashboards.",
      },
      {
        service: "ai-machine-learning",
        text: "Recommendation and image search with evaluation before release.",
      },
      {
        service: "mobile",
        text: "The quick-commerce app, store-ready, with offline tolerance.",
      },
    ],
    close: "Bring the funnel. We will say where it leaks.",
  },
  {
    id: "healthcare-life-sciences",
    // The plain search phrase for this page: shown as the hero eyebrow, inside the H1 (design & SEO review, 2026-10-11).
    keyword: "Healthcare & life sciences software development",
    n: 3,
    name: "Healthcare & life sciences",
    short: "Healthcare",
    title: "Software a regulator\nwill sign off.",
    sub: "Insurance platforms, telemedicine, surgical imaging, preclinical research data and care-home IoT: built to be supervised, audited and still used.",
    facts: [
      {
        value: "60%",
        label: "less analysis time on preclinical data",
      },
      {
        value: "HIPAA-grade",
        label: "handling of patient data and imaging",
      },
      {
        value: "Supervised",
        label: "insurance platform launched under regulation",
      },
      {
        value: "Validated",
        label: "IoT alerting proven in real care settings before scaling",
      },
    ],
    record: ["F8", "C0", "F9", "F10", "C1"],
    fullCards: 2,
    asks: [
      {
        title: "Regulatory sign-off",
        text: "Map the underwriting, claims or clinical workflow before designing against it. Keep a document a supervisor can read beside the product a member can use.",
      },
      {
        title: "Patient data",
        text: "Role-based access, HIPAA-grade handling, imaging on object storage with audit trails. Nothing leaves the account it lives in.",
      },
      {
        title: "Trust in the alert",
        text: "Validate in real care settings before scaling. A model's output has to earn a clinician's trust, so precision is measured before rollout.",
      },
    ],
    services: [
      {
        service: "custom-software",
        text: "The member, patient or clinician journey, from discovery to launch.",
      },
      {
        service: "ai-machine-learning",
        text: "Imaging analysis and alerting with the evaluation to defend it.",
      },
      {
        service: "data-engineering",
        text: "Harmonised research data and the dashboards over it.",
      },
      {
        service: "qa-test-automation",
        text: "Test coverage a regulator can read.",
      },
    ],
    close: "Tell us who has to sign it off. We will design for them.",
  },
  {
    id: "logistics-travel-marketplaces",
    // The plain search phrase for this page: shown as the hero eyebrow, inside the H1 (design & SEO review, 2026-10-11).
    keyword: "Logistics & marketplace software development",
    n: 4,
    name: "Logistics, travel & marketplaces",
    short: "Logistics",
    title: "Real-time, on the road,\non a bad connection.",
    sub: "Dispatch boards, driver apps, vehicle marketplaces and travel products: three kinds of user sharing one system, and the data that keeps them honest.",
    facts: [
      {
        value: "Real-time",
        label: "load status and assignments over WebSockets",
      },
      {
        value: "3 roles",
        label: "transporter, driver and customer in one app",
      },
      {
        value: "500%",
        label: "growth in qualified inbound leads, six months, audited",
      },
      {
        value: "3 modules",
        label: "rental, flights and community in one product",
      },
    ],
    record: ["C2", "C3", "C11", "C8"],
    fullCards: 2,
    asks: [
      {
        title: "Live state",
        text: "WebSockets for status and assignment, live tracking on the map, and revenue and broker analytics from the same stream.",
      },
      {
        title: "Drivers in motion",
        text: "Large targets, quick actions, offline tolerance. The interface is designed for a hand on the wheel, not a desk.",
      },
      {
        title: "Demand",
        text: "Intent-based landing pages and listing schema so the marketplace fills without buying every lead.",
      },
    ],
    services: [
      {
        service: "custom-software",
        text: "The dispatch board and the admin behind it.",
      },
      {
        service: "mobile",
        text: "The driver and customer app, offline-tolerant, store-ready.",
      },
      {
        service: "data-engineering",
        text: "Route, revenue and broker analytics from live data.",
      },
      {
        service: "cloud-devops",
        text: "The infrastructure that keeps real-time real at peak.",
      },
    ],
    close: "Tell us what moves. We will keep the screen honest about where it is.",
  },
  {
    id: "iot-signage-built-environment",
    // The plain search phrase for this page: shown as the hero eyebrow, inside the H1 (design & SEO review, 2026-10-11).
    keyword: "IoT, digital signage & smart building software",
    n: 5,
    name: "IoT, signage & the built environment",
    short: "IoT & signage",
    title: "Devices that keep working\nwhen the network does not.",
    sub: "Digital signage platforms, device telemetry and building intelligence: offline-first players, fleet sync, public APIs and dashboards for the people who run the estate.",
    facts: [
      {
        value: "200+",
        label: "buildings on one telemetry platform",
      },
      {
        value: "4 continents",
        label: "signage platform in production",
      },
      {
        value: "Offline-first",
        label: "device sync over MQTT",
      },
      {
        value: "Public APIs",
        label: "device telemetry open to partners",
      },
    ],
    record: ["F6", "F7", "F17", "F13", "F10"],
    fullCards: 2,
    asks: [
      {
        title: "Offline-first",
        text: "Players and sensors that lose the network for a week keep working and reconcile when they return. Sync over MQTT, not polling.",
      },
      {
        title: "Fleet at scale",
        text: "Multi-tenant backends, partner integrations with the display makers, and infrastructure that stays up under sustained memory pressure.",
      },
      {
        title: "Telemetry people act on",
        text: "Real-time operational data rather than last month's report, and APIs partners can build on, with versioning and documentation.",
      },
    ],
    services: [
      {
        service: "custom-software",
        text: "The platform: tenants, CMS, players, partner integrations.",
      },
      {
        service: "cloud-devops",
        text: "The fleet's infrastructure, stabilised and observable.",
      },
      {
        service: "mobile",
        text: "Custom Android players and the apps that control them.",
      },
      {
        service: "data-engineering",
        text: "Telemetry pipelines and the dashboards the estate team opens.",
      },
    ],
    close: "Tell us what the devices must do when the network is down.",
  },
  {
    id: "saas-platforms-ai-products",
    // The plain search phrase for this page: shown as the hero eyebrow, inside the H1 (design & SEO review, 2026-10-11).
    keyword: "SaaS & AI product development",
    n: 6,
    name: "SaaS, platforms & AI products",
    short: "SaaS & AI",
    title: "Products that ship\nand keep shipping.",
    sub: "Multi-tenant SaaS, enterprise platforms, developer APIs and AI products: built with an agentic pipeline and the evaluation discipline to keep them right.",
    facts: [
      {
        value: "10",
        label: "engineers on the agentic delivery path",
      },
      {
        value: "98%",
        label: "detection accuracy, computer-vision product",
      },
      {
        value: "Multi-tenant",
        label: "SaaS with a white-label reseller tier",
      },
      {
        value: "On the date",
        label: "critical milestone shipped on deadline",
      },
    ],
    record: ["F5", "F12", "F14", "F19", "C6", "F18", "F16"],
    fullCards: 2,
    asks: [
      {
        title: "Multi-tenancy",
        text: "Tenants, white-label tiers and credit-based monetisation designed in from the schema up, not bolted on when the second customer arrives.",
      },
      {
        title: "Integrations",
        text: "Dynamics, Dataverse, SharePoint, Power BI, Xero: the plumbing is most of the product, so it is reviewed like the product.",
      },
      {
        title: "AI that stays right",
        text: "Evaluation gates before release, monitoring after, small models where a large one is too expensive. The harness decides.",
      },
    ],
    services: [
      {
        service: "custom-software",
        text: "The product, scoped and shipped in six-week increments.",
      },
      {
        service: "ai-machine-learning",
        text: "Model features, agents and retrieval with a number to defend.",
      },
      {
        service: "team-augmentation",
        text: "Senior engineers inside your team when the roadmap outgrows it.",
      },
      {
        service: "qa-test-automation",
        text: "Generated tests and guardrails on every change.",
      },
    ],
    close: "Tell us what the product must do next quarter. We will say how we would ship it.",
  },
] satisfies Industry[];
