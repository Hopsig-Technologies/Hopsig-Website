// The engagement panel on /services (×3) and /work: a card walking through one engagement in five scenes
// (call → scope → people → measured → review); each page shows one scene, as the reference does.
//
// Deliberate change from the reference (decided 2026-10-10): the prototype filled it with invented specifics —
// initials and years of experience ("A.K. · Backend · 11 yrs"), results ("Nightly batch 5 h 10 m → 18 m",
// "Failed runs / week 7 → 0", "Shipped 14 / 14", "Slipped 0", "Cost on plan"). Rules 1 (never invent proof) and 3
// (no people) apply, so those are bracketed placeholders until there is a real engagement to show. The replaced
// strings are listed in content/deviations.json. The terms strip is real policy and stays.
import type { EngagementPanel } from "./types";

export const engagementPanel = {
  client: "Engagement · [Client]",
  phases: ["Day 0 · The call", "Day 3 · The scope", "Day 10 · People in", "Week 6 · Measured", "Fortnightly · The review"],
  call: {
    meta: "09:14 GMT · 30 min · you and the people who would do the work",
    quote: "“Rebuild the ingest pipeline. Our team runs it after.”",
    options: ["Engineers embedded in your team", "A product, scoped and built", "Data & AI system, measured"],
    chosen: 1,
  },
  scope: {
    title: "Scope v1",
    badge: "Signed · day 3",
    rows: [
      { label: "In", value: "Ingest service · DLQ + replay · runbook", strong: true },
      { label: "Out", value: "Warehouse schema · dashboards", strong: false },
      { label: "Terms", value: "6 weeks, fixed · [YOUR RATE] · NET 14", strong: true },
    ],
    note: "Two pages. Before you pay anything.",
  },
  people: {
    engineers: [
      { initials: "[ENGINEER]", role: "Backend · [YEARS]", note: "in your standup 09:30 GMT" },
      { initials: "[ENGINEER]", role: "Data · [YEARS]", note: "in your standup 09:30 GMT" },
    ],
    commits: [
      { hash: "a41f2c", message: "ingest: replace cron with queue consumer", when: "day 10 · 14:02" },
      { hash: "9be0d7", message: "dlq: replay endpoint + tests", when: "day 11 · 10:47" },
      { hash: "c07a11", message: "runbook: on-call steps, rollback", when: "day 12 · 16:15" },
    ],
  },
  measured: {
    title: "First increment, live.",
    sub: "Measured before we claim it improved",
    metrics: [
      { label: "Nightly batch", before: "[BEFORE]", after: "[AFTER]" },
      { label: "Failed runs / week", before: "[BEFORE]", after: "[AFTER]" },
    ],
  },
  review: {
    title: "Increment 1 · shipped",
    stats: [
      { label: "Shipped", value: "[SHIPPED / PLANNED]" },
      { label: "Slipped", value: "[SLIPPED]" },
      { label: "Cost", value: "[COST VS PLAN]" },
    ],
    actions: ["Continue", "Hand over"],
    note: "Your call, every fortnight.",
  },
  terms: [
    { label: "First engineer in", value: "10 working days" },
    { label: "Overlap with GMT", value: "4 h, daily" },
    { label: "Notice", value: "30 days, either side" },
    { label: "Delivered from", value: "Lahore · GMT+5" },
    { label: "Minimum term", value: "3 months rolling" },
    { label: "Day rate from", value: "[YOUR RATE]" },
  ],
} satisfies EngagementPanel;
