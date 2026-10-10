// Converted once from the approved prototype (reference/site) by scripts/convert_content.mjs on 2026-10-10.
// This file is now the source of truth for this copy: edit it by hand. Bracketed [PLACEHOLDERS] stay until the
// founders replace them (CLAUDE.md rule 1). Run `pnpm check:content` after editing.
import type { Templates } from "./types";

export const templates = {
  caseCard: {
    eyebrow: "{nn} · {domain}",
    problemLabel: "Problem —",
    whatWeDidLabel: "What we did —",
    measuredLabel: "Measured —",
    clientLine: "Client withheld · details on the call",
    pageLink: "Read the case note →",
    askLink: "Ask about this →",
  },
  servicePage: {
    heroEyebrow: "Service {nn} · {name}",
    heroMeta: "{shape} · from [YOUR RATE] / day",
    stepsAside: "The same loop as every engagement",
    othersTitle: "The other seven.",
    othersAside: "All eight end in something running",
    closingEyebrow: "{name} · the call",
    pricedLabel: "Priced",
    pricedPrefix: "Priced:",
    ratesLink: { label: "See rates →", href: "/rates", variant: "link" },
    getsTitle: "What you get.",
    goodForLabel: "Good for",
    sayNoLabel: "We will say no when",
    stackLabel: "Stack · only what we have shipped to production",
    recordTitle: "From the record.",
    recordLink: { label: "All case notes →", href: "/work", variant: "link" },
    stepsTitle: "How it runs.",
    faqTitle: "Questions we get about this.",
    hereLabel: "here",
    /** Hero and closing buttons on every service page. */
    buttons: [
      { label: "Book a consult", href: "/book", variant: "lime" },
      { label: "See our work", href: "/work", variant: "outline" },
    ],
  },
  industryPage: {
    heroEyebrow: "Industry · {name}",
    recordTitle: "What we have shipped here.",
    recordAside: "{count} case notes · client names withheld",
    asksTitle: "What this industry asks for",
    asksSub: "The three questions we get before the first call ends.",
    servicesTitle: "Services that fit.",
    servicesLink: "All eight →",
    othersTitle: "The other industries.",
    closingEyebrow: "{short} · the call",
    recordLink: { label: "All 32 case notes →", href: "/work", variant: "link" },
    servicesHref: "/services",
    othersLink: { label: "All six →", href: "/industries", variant: "link" },
    hereLabel: "here",
    buttons: [
      { label: "Book a consult", href: "/book", variant: "lime" },
      { label: "See our work", href: "/work", variant: "outline" },
    ],
  },
  industriesIndexRow: {
    count: "{count} notes",
  },
  casePage: {
    heroEyebrow: "Case note · {domain}",
    heroButtons: [
      { label: "Ask about this", href: "/book", variant: "lime" },
      { label: "All case notes", href: "/work", variant: "outline" },
    ],
    // Hero facts: [metric], [shape, shapeTitle], [domain, domainNote], [clientWithheld, clientNote].
    shapeTitle: "engagement shape",
    domainNote: "domain",
    clientWithheld: "Withheld",
    clientNote: "client name; details on the call",
    missingMetricValue: "[ADD THE NUMBER]",
    missingMetricLabel: "the measured outcome, once the record has it",
    problemTitle: "Problem",
    whatWeDidTitle: "What we did",
    measuredTitle: "Measured",
    stackLabel: "Stack",
    shapeLabel: "Shape —",
    domainLabel: "Domain —",
    clientLabel: "Client —",
    clientValue: "Withheld; named on the call",
    askButton: { label: "Ask about this on the call", href: "/book", variant: "lime" },
    noMetricNote: "Number to be added from the record.",
    moreTitle: "More from the record.",
    moreLink: { label: "All 32 →", href: "/work", variant: "link" },
    closingEyebrow: "This case · the call",
    closingTitle: "Ask about this one. We will say what we would do differently.",
  },
  notePage: {
    // The reference reads "Note · {category} · [DATE]"; the date is kept out (rule 7: no dates on Notes) until the
    // founders decide — recorded in content/deviations.json.
    heroEyebrow: "Note · {category}",
    byline: "Written by the people who would do the work ·",
    allLink: { label: "All notes →", href: "/notes", variant: "link" },
    tocTitle: "In this note",
    offerTitle: "The offer this note describes",
    bookButton: { label: "Book a consult", href: "/book", variant: "lime" },
    nextTitle: "Next notes.",
    closingEyebrow: "Notes · the call",
    buttons: [
      { label: "Book a consult", href: "/book", variant: "lime" },
      { label: "See our work", href: "/work", variant: "outline" },
    ],
  },
  /** The estimator's computed lines (rates, why-not-just-hire). `{n}` is a number; the total uses the Site settings
   *  day rate, or shows the days × [YOUR RATE] until it is set. */
  estimator: {
    engineer: "{n} engineer",
    engineers: "{n} engineers",
    months: "{n} months",
    days: "{n} engineer-days",
    total: "{total} at {rate} / day",
    totalNoRate: "{days} × [YOUR RATE]",
  },
  legalPage: {
    contentsTitle: "Contents",
  },
} satisfies Templates;
