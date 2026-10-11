// Converted once from the approved prototype (reference/site) by scripts/convert_content.mjs on 2026-10-10.
// This file is now the source of truth for this copy: edit it by hand. Bracketed [PLACEHOLDERS] stay until the
// founders replace them (CLAUDE.md rule 1). Run `pnpm check:content` after editing.
import type { WorkingWithUsPage } from "../types";

export const workingWithUsPage = {
  hero: {
    title: "The paperwork,\nin one page.",
    eyebrow: "Working with us",
    sub: "What procurement asks before the first invoice: contracts, IP, data, security, insurance, invoicing. Placeholders are marked; we would rather show a gap than a badge.",
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
  checks: {
    head: {
      eyebrow: "The list",
      title: "Everything a buyer checks.",
      sub: "Nine items. If yours is not here, ask on the call and we will add it to this page.",
    },
    items: [
      {
        title: "Contracts",
        text: "A master services agreement once, a two-page SOW per engagement. Thirty days’ notice either side, no minimum beyond the first three months on embedded work, no automatic renewal. Your paper or ours. [MSA TEMPLATE LINK]",
      },
      {
        title: "Intellectual property",
        text: "Yours on payment of each invoice. Code lives in your repository from day one; we keep nothing except what we have learned. Open-source licences used are listed in the handover pack.",
      },
      {
        title: "Your data",
        text: "We work in your cloud account under least-privilege access that you grant and revoke. No production data on laptops; no copies outside your estate; access removed at handover and confirmed in writing. For UK and EU clients we sign your DPA or supply ours. [DPA LINK]",
      },
      {
        title: "Security practices",
        text: "Two-factor authentication on every account, secrets in a manager and never in a repo, dependency scanning in CI, every change reviewed by a second senior, no shared accounts. Certifications: [NONE YET / LIST]; we will say so plainly rather than imply otherwise.",
      },
      {
        title: "Where the work happens",
        text: "Delivery Centre: Lahore, Pakistan. Model and AI tooling runs through providers that do not train on your data, or inside your own cloud account; the SOW states which.",
      },
      {
        title: "Insurance",
        text: "Professional indemnity: [INSURER · COVER AMOUNT]. Certificate available on request.",
      },
      {
        title: "Invoicing",
        text: "Monthly in arrears for embedded work, per increment for built work. NET 14. GBP, USD or EUR by bank transfer. [VAT / TAX STATUS] · [BANK COUNTRY].",
      },
      {
        title: "Subcontracting",
        text: "None without your written consent. The engineers on your SOW are the engineers on your account.",
      },
      {
        title: "The company",
        text: "Hopsig Technologies LLC, a Wyoming limited liability company. Registered office: 30 N Gould St Ste R, Sheridan, WY 82801, USA. Delivery Centre: Lahore, Pakistan. Contracts are with the US company.",
      },
    ],
  },
  asks: {
    head: {
      title: "What we ask of you.",
      aside: "Three things, all in week one",
    },
    items: [
      {
        title: "A named decision-maker",
        text: "One person who can say yes to a scope and no to a change. Not a committee.",
      },
      {
        title: "Access in week one",
        text: "Repo, cloud account, board, and whoever owns the thing we are touching. Day ten is only possible if day one happens.",
      },
      {
        title: "Fifteen minutes a fortnight",
        text: "The review. Shipped, slipped, cost against plan. It is the whole governance model.",
      },
    ],
  },
  closing: {
    title: "Send this page to procurement. Then book the call.",
    showEmail: true,
    eyebrow: "Working with us · the call",
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
} satisfies WorkingWithUsPage;
