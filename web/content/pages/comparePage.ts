// Converted once from the approved prototype (reference/site) by scripts/convert_content.mjs on 2026-10-10.
// This file is now the source of truth for this copy: edit it by hand. Bracketed [PLACEHOLDERS] stay until the
// founders replace them (CLAUDE.md rule 1). Run `pnpm check:content` after editing.
import type { ComparePage } from "../types";

export const comparePage = {
  hero: {
    title: "Fair question.\nHere is the honest table.",
    eyebrow: "Staff augmentation vs hiring vs outsourcing",
    sub: "Sometimes you should hire. Sometimes a freelancer is right. This page says when, including when it is not us.",
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
  table: {
    head: {
      title: "Four ways to get the work done.",
      aside: "The last column is us; the other three are fair",
    },
    columns: ["Hire in-house", "Big outsourcer", "Freelancers", "Hopsig"],
    rows: [
      {
        label: "First commit",
        cells: [
          "After the recruiting cycle",
          "After the statement of work and the bench",
          "Days, if you find the right one",
          "10 working days",
        ],
      },
      {
        label: "Who you get",
        cells: [
          "Whoever applied",
          "Whoever was free",
          "One person, as good as their last job",
          "Named senior engineers you interview first",
        ],
      },
      {
        label: "Who manages them",
        cells: ["You", "An account manager", "You", "We manage the person; you direct the work"],
      },
      {
        label: "Leaving",
        cells: [
          "Notice period, severance, a gap",
          "Contract term, often a year",
          "Whenever, both ways",
          "30 days, either side",
        ],
      },
      {
        label: "IP and code",
        cells: ["Yours", "Check the MSA", "Check the contract", "Yours on payment, in your repo from day one"],
      },
      {
        label: "Cost shape",
        cells: [
          "Salary, taxes, equipment, recruiter fee, ramp-up",
          "Blended rate, minimum team size",
          "Day rate; no cover when they are ill",
          "Day rate; cover and holidays handled; no recruiter fee",
        ],
      },
      {
        label: "Right choice when",
        cells: [
          "The work is permanent and core",
          "You need forty people and a programme office",
          "A fortnight of specialist work",
          "Three to twelve months of senior capacity, measured",
        ],
      },
    ],
  },
  faq: {
    title: "The questions behind the question.",
    items: [
      {
        question: "When should we hire instead?",
        answer:
          "When the work is permanent and core to the product, and you can wait for the right person. We will say so on the call; we would rather lose the engagement than have you rent what you should own.",
      },
      {
        question: "When is a big outsourcer right?",
        answer:
          "When you need forty people, a programme office and someone to blame. We are not that, and we do not pretend to be.",
      },
      {
        question: "When is a freelancer right?",
        answer:
          "A fortnight of specialist work with a clear end. For three months or more, the cover, the review and the handover start to matter, and that is where we come in.",
      },
      {
        question: "Can we convert an engineer to a hire later?",
        answer:
          "Yes. After six months there is no fee; before that, one month of the day rate. We would rather you had the person than a clause.",
      },
    ],
  },
  closing: {
    title: "If the table says hire, we will say so too.",
    showEmail: true,
    eyebrow: "Why not just hire · the call",
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
} satisfies ComparePage;
