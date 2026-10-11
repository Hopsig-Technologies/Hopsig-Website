/**
 * Shapes of the static copy in web/content. Every content module ends with `satisfies <Type>` so a missing field,
 * a wrong variant or a link to a route that does not exist fails `pnpm typecheck`.
 *
 * `Rich` strings may carry <b>, <i> and <a href="…"> and are rendered through web/lib/portable.ts; everything else
 * is plain text where "\n" is a line break. Bracketed [PLACEHOLDERS] stay until the founders replace them (rule 1).
 */
import type { Href, IndustrySlug, ServiceSlug } from "./routes";

export type Rich = string;
/** A case study's record key (F0…F19, C0…C11): `caseStudy.source` in Sanity. */
export type CaseKey = `F${number}` | `C${number}`;

export type Cta = { label: string; href: Href; variant: "lime" | "outline" | "link" | "chip" };
export type Fact = { value: string; label: string };
export type TitleText = { title: string; text?: string };
export type LabelValue = { label: string; value: string };
export type Step = { when: string; title: string; text: string };
export type FaqItem = { question: string; answer: string };

export type SectionHead = { eyebrow?: string; title?: string; sub?: string; aside?: string };
export type TitleTextSection = { head: SectionHead; items: TitleText[] };
export type ListSection = { head: SectionHead; items: string[] };
export type StepsSection = { head: SectionHead; steps: Step[] };
export type LabelValueSection = { head: SectionHead; rows: LabelValue[] };
export type FaqSection = { title: string; items: FaqItem[] };

export type PageHero = { eyebrow?: string; title: string; sub?: string; buttons?: Cta[]; facts?: Fact[] };
/** `sub` empty = the default closing intro from site.ts. */
export type Closing = { eyebrow?: string; title: string; sub?: string; buttons?: Cta[]; showEmail: boolean };

export type LegalBlock = { p: Rich } | { ul: Rich[] } | { ol: Rich[] };
export type LegalSection = { heading: string; body: LegalBlock[] };

// ---------------------------------------------------------------- site-wide

export type Site = {
  footer: { tagline: string; legalLeft: string; legalRight: string };
  consent: { text: string; accept: string; decline: string; privacy: string; settings: string };
  defaultClosing: { title: string; sub: string; emailLine: string };
  /** The two scrolling rows on Home and Services. */
  capabilities: { title: string; aside: string; rowOne: string[]; rowTwo: string[]; note: string };
};

export type NavLink = { label: string; desc?: string; href: Href };
export type NavItem = { label: string; href: Href; children?: NavLink[]; menuFooter?: Cta[]; /** v2: sits in the Lime capsule. */ group?: "ai" };
export type FooterColumn = { title: string; links: NavLink[] };
export type Navigation = { primary: NavItem[]; cta: Cta; footer: FooterColumn[]; /** Accessible name of the AI capsule. */ aiGroupLabel: string };

/** Words the detail templates put around collection data; {tokens} are filled from the document. */
export type Templates = {
  caseCard: {
    eyebrow: string;
    problemLabel: string;
    whatWeDidLabel: string;
    measuredLabel: string;
    clientLine: string;
    pageLink: string;
    askLink: string;
  };
  servicePage: {
    industriesLabel: string;
    crumb: string;
    stripLabel: string;
    heroEyebrow: string;
      stepsAside: string;
    othersTitle: string;
    othersAside: string;
    closingEyebrow: string;
    pricedLabel: string;
    pricedPrefix: string;
    ratesLink: Cta;
    getsTitle: string;
    goodForLabel: string;
    sayNoLabel: string;
    stackLabel: string;
    recordTitle: string;
    recordLink: Cta;
    stepsTitle: string;
    faqTitle: string;
    hereLabel: string;
    buttons: Cta[];
  };
  industryPage: {
    crumb: string;
    heroEyebrow: string;
    recordTitle: string;
    recordAside: string;
    asksTitle: string;
    asksSub: string;
    servicesTitle: string;
    servicesLink: string;
    othersTitle: string;
    closingEyebrow: string;
    recordLink: Cta;
    servicesHref: Href;
    othersLink: Cta;
    hereLabel: string;
    buttons: Cta[];
  };
  industriesIndexRow: { count: string };
  casePage: {
    crumb: string;
    heroEyebrow: string;
    heroButtons: Cta[];
    shapeTitle: string;
    domainNote: string;
    clientWithheld: string;
    clientNote: string;
    missingMetricValue: string;
    missingMetricLabel: string;
    problemTitle: string;
    whatWeDidTitle: string;
    measuredTitle: string;
    stackLabel: string;
    shapeLabel: string;
    domainLabel: string;
    clientLabel: string;
    clientValue: string;
    askButton: Cta;
    noMetricNote: string;
    moreTitle: string;
    moreLink: Cta;
    closingEyebrow: string;
    closingTitle: string;
  };
  notePage: {
    crumb: string;
    heroEyebrow: string;
    byline: string;
    updated: string;
    rowMeta: string;
    allLink: Cta;
    tocTitle: string;
    offerTitle: string;
    bookButton: Cta;
    nextTitle: string;
    closingEyebrow: string;
    buttons: Cta[];
  };
  legalPage: { contentsTitle: string };
};

/** The engagement panel on /services (×3) and /work: one engagement in five scenes; each page shows one. */
export type EngagementPanel = {
  client: string;
  phases: string[];
  call: { meta: string; quote: string; options: string[]; chosen: number };
  scope: { title: string; badge: string; rows: { label: string; value: string; strong: boolean }[]; note: string };
  people: { engineers: { initials: string; role: string; note: string }[]; commits: { hash: string; message: string; when: string }[] };
  measured: { title: string; sub: string; metrics: { label: string; before: string; after: string }[] };
  review: { title: string; stats: LabelValue[]; actions: string[]; note: string };
  terms: LabelValue[];
};

// ---------------------------------------------------------------- collections kept in code

export type Service = {
  id: ServiceSlug;
  keyword: string;
  n: number;
  name: string;
  oneLiner: string;
  description: string;
  tiles: { title: string; text: string }[];
  goodFor: string[];
  stack: string[];
  shape: string;
  pageTitle: string;
  gets: string[];
  sayNoWhen: string[];
  steps: Step[];
  /** "From the record" on the service page, by case-study key. */
  record: CaseKey[];
  faq: FaqItem[];
  closing: string;
};

export type Industry = {
  id: IndustrySlug;
  keyword: string;
  n: number;
  name: string;
  short: string;
  title: string;
  sub: string;
  facts: Fact[];
  record: CaseKey[];
  /** How many of `record` show as full cards; the rest are compact rows. */
  fullCards: number;
  asks: TitleText[];
  services: { service: ServiceSlug; text: string }[];
  close: string;
};

// ---------------------------------------------------------------- pages

export type HomePage = {
  agenticBand: { head: SectionHead; buttons: Cta[] };
  hero: {
    eyebrow: string;
    title: string;
    sub: string;
    buttons: Cta[];
    /** The mono line under the buttons: `value` in the text colour, then `label`. */
    facts: Fact[];
    beats: Step[];
    scrollHint: string;
  };
  services: {
    head: SectionHead;
    detailsLabel: string;
    goodForLabel: string;
    stackLabel: string;
    engagementLabel: string;
    closingLabel: string;
    closingLinks: Cta[];
  };
  /** The rows are the featured case studies from Sanity, in `featuredOrder`. */
  caseIndex: {
    head: SectionHead;
    filters: { key: "all" | "payments" | "retail" | "health" | "ai" | "iot"; label: string }[];
    problemLabel: string;
    whatWeDidLabel: string;
    measuredLabel: string;
    pageLink: string;
    askLink: string;
    allLink: Cta;
  };
  midCta: { text: string; button: Cta };
  why: TitleTextSection;
  record: { head: SectionHead; link: Cta; stats: Fact[]; strip: string[] };
  notes: {
    head: SectionHead;
    /** `{count}`: every note, drafts included. */
    countLine: string;
    latestLabel: string;
    readLabel: string;
    moreTitle: string;
    allLink: Cta;
  };
  closing: Closing;
};

export type EngagementMode = {
  anchor: string;
  head: SectionHead;
  getsTitle: string;
  gets: string[];
  goodForTitle: string;
  goodFor: string[];
  priceLabel: string;
  priceTitle: string;
  priceDetail: string;
  link: Cta;
};

export type ServicesIndexPage = {
  hero: PageHero;
  modes: EngagementMode[];
  detail: { head: SectionHead };
  inside: TitleTextSection;
  howItRuns: { head: SectionHead; link: Cta; steps: Step[] };
  closing: Closing;
};

export type IndustriesIndexPage = { hero: PageHero; list: { head: SectionHead }; closing: Closing };

/** The cards are every case study from Sanity by `order`; the first 12 render in full. */
export type WorkIndexPage = {
  hero: PageHero;
  selected: { head: SectionHead; fullCards: number; restTitle: string; restAside: string };
  reporting: { head: SectionHead; points: string[] };
  closing: Closing;
};

export type NotesIndexPage = {
  hero: PageHero;
  list: { head: SectionHead; readLabel: string; draftLabel: string };
  closing: Closing;
};

export type ApproachPage = {
  hero: PageHero;
  staffing: TitleTextSection;
  agentic: { head: SectionHead; tags: string[]; links: Cta[]; items: TitleText[] };
  where: { head: SectionHead; paragraphs: string[] };
  closing: Closing;
};

export type BookPage = {
  hero: { eyebrow: string; title: string; sub: string };
  steps: TitleText[];
  note: Rich;
  calendar: {
    title: string;
    timezone: string;
    prompt: string;
    pickFirst: string;
    /** `{day} {date} {month} · {time}`. */
    summary: string;
    dayNames: string[];
    monthNames: string[];
    times: string[];
    emailFallback: string;
    notConnected: string;
    fieldPlaceholders: string[];
    submit: string;
    bookedLabel: string;
    bookedTitle: string;
    bookedText: string;
    checklist: string[];
  };
  strip: string[];
};

export type BriefPage = {
  hero: { eyebrow: string; title: string; sub: string };
  steps: TitleText[];
  note: Rich;
  form: {
    title: string;
    duration: string;
    fieldPlaceholders: string[];
    problemLabel: string;
    whenLabel: string;
    whenOptions: string[];
    budgetLabel: string;
    submit: string;
    emailFallback: string;
    notConnected: string;
    receivedLabel: string;
    receivedTitle: string;
    receivedText: string;
    checklist: string[];
  };
  strip: string[];
};

export type ComparePage = {
  hero: PageHero;
  table: { head: SectionHead; columns: string[]; rows: { label: string; cells: string[] }[] };
  faq: FaqSection;
  closing: Closing;
};

export type WorkingWithUsPage = { hero: PageHero; checks: TitleTextSection; asks: TitleTextSection; closing: Closing };

export type AiTransformationPage = {
  hero: PageHero;
  scrub: { eyebrow: string; hint: string };
  offer: {
    head: SectionHead;
    gets: string[];
    priced: Rich;
    goodForTitle: string;
    goodFor: string[];
    sayNoTitle: string;
    sayNo: string[];
  };
  pipeline: TitleTextSection;
  weeks: StepsSection;
  measures: TitleTextSection;
  record: { head: SectionHead; cases: CaseKey[]; allLink: Cta };
  faq: FaqSection;
  closing: Closing;
};

export type FlowStage = {
  stage: string;
  agent: string;
  input: string;
  output: string;
  guardrail: string;
  humanGate: boolean;
  humanNote?: string;
};
export type AgenticFlowPage = {
  hero: PageHero;
  flow: {
    head: SectionHead;
    stages: FlowStage[];
    labels: {
      stage: string;
      input: string;
      output: string;
      guardrail: string;
      whoDecides: string;
      personSigns: string;
      noGate: string;
      runsAlone: string;
    };
  };
  agents: { head: SectionHead; does: string[]; neverTitle: string; neverAside: string };
  tooling: { head: SectionHead; tools: string[]; whereLabel: string; where: string[]; links: Cta[] };
  closing: Closing;
};

export type AgenciesPage = {
  hero: PageHero;
  how: TitleTextSection;
  gets: ListSection;
  sayNo: ListSection;
  faq: FaqSection;
  closing: Closing;
};

/** The roles themselves come from Sanity (jobListing); a role with no status renders `statusPlaceholder`. */
export type JoinPage = {
  hero: PageHero;
  work: TitleTextSection;
  vetting: TitleTextSection;
  roles: { head: SectionHead; statusPlaceholder: string; statusLabels: { open: string; pipeline: string }; payLine: string };
  faq: FaqSection;
  closing: Closing;
};

export type LegalPage = { hero: PageHero; sections: LegalSection[]; footnote: string };

export type NotFoundPage = { closing: Closing };

// ---------------------------------------------------------------- animations (v2)

/** One animated figure. `mode`: loop (plays while visible), state (interactive), scrub (scroll sets t). */
export type AnimScene = {
  id: string;
  w: number;
  h: number;
  mode: "loop" | "state" | "scrub";
  /** No pause button (the service strip). */
  nopause?: boolean;
  /** Describes the mechanism; never states a number. Empty = no figcaption. */
  caption: string;
};
export type AnimPage = { route: string; scenes: AnimScene[] };

// ---------------------------------------------------------------- SEO

export type PageSeo = { title: string; description: string };
export type SeoTemplates = {
  caseNote: { title: string; description: string };
  note: { title: string; description: string };
  notFound: { title: string };
  siteName: string;
};
