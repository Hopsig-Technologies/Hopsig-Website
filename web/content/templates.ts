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
  },
  industriesIndexRow: {
    count: "{count} notes",
  },
  casePage: {
    heroEyebrow: "Case note · {domain}",
    shapeTitle: "Engagement shape",
    clientNote: "Client name; details on the call",
    shapeLabel: "Shape —",
    domainLabel: "Domain —",
    clientLabel: "Client —",
    clientValue: "Withheld; named on the call",
    askLine: "Ask about this on the call",
    missingMetricValue: "Number to be added from the record.",
    missingMetricLabel: "the measured outcome, once the record has it",
    moreTitle: "More from the record.",
    moreLink: "All 32 →",
    closingEyebrow: "This case · the call",
    closingTitle: "Ask about this one. We will say what we would do differently.",
  },
  notePage: {
    heroEyebrow: "Note · {category} · [DATE]",
    byline: "Written by the people who would do the work ·",
    tocTitle: "In this note",
    offerTitle: "The offer this note describes",
    nextTitle: "Next notes.",
  },
  legalPage: {
    contentsTitle: "Contents",
  },
} satisfies Templates;
