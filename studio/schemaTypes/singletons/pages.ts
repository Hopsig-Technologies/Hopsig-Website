import {defineArrayMember, defineField, defineType, type FieldDefinition} from 'sanity'
import {list, obj, str, strList, txt} from '../fields'
import {PAGE_SINGLETONS} from '../registry'

/** Page singletons. Fields follow the sections of each reference page, in order. Editors change words and list
 *  items; they cannot add, remove or reorder sections (CLAUDE.md: no new components). */

const head = (title?: string) => defineField({name: 'head', type: 'sectionHead', title})
const ref = (name: string, to: string, o: {title?: string; description?: string; max?: number} = {}) =>
  defineField({
    name,
    title: o.title,
    description: o.description,
    type: 'array',
    of: [defineArrayMember({type: 'reference', to: [{type: to}]})],
    validation: (r) => (o.max ? r.unique().max(o.max) : r.unique()),
  })
const section = (name: string, title: string, fields: FieldDefinition[]) =>
  defineField({name, title, type: 'object', options: {collapsible: true, collapsed: true}, fields})
const rich = (name: string, description?: string) => defineField({name, type: 'richInline', description})

function page(type: string, fields: FieldDefinition[]) {
  const meta = PAGE_SINGLETONS.find((p) => p.type === type)!
  return defineType({
    name: type,
    title: meta.title,
    type: 'document',
    fields: [...fields, obj('seo', 'seo')],
    preview: {prepare: () => ({title: meta.title, subtitle: meta.route ?? ''})},
  })
}

// ---------------------------------------------------------------- page-specific objects

export const flowStage = defineType({
  name: 'flowStage',
  title: 'Stage',
  type: 'object',
  fields: [
    str('stage', {required: true}),
    str('agent'),
    str('input'),
    str('output'),
    str('guardrail'),
    defineField({name: 'humanGate', title: 'A person signs', type: 'boolean', initialValue: false}),
    str('humanNote', {description: 'What the person decides (gates only).'}),
  ],
  preview: {
    select: {title: 'stage', subtitle: 'agent', gate: 'humanGate'},
    prepare: ({title, subtitle, gate}) => ({title: `${title}${gate ? ' · a person signs' : ''}`, subtitle}),
  },
})

export const rateCard = defineType({
  name: 'rateCard',
  title: 'Rate card',
  type: 'object',
  fields: [
    str('name', {required: true}),
    str('price', {description: 'Usually a token: [YOUR RATE] or [QUOTE].'}),
    str('unit', {description: 'e.g. "/ day, per engineer"'}),
    str('meta', {description: 'e.g. "Billed monthly · 21 days a month"'}),
    strList('items'),
    defineField({name: 'button', type: 'cta'}),
    defineField({name: 'highlight', type: 'boolean', initialValue: false, description: 'The emphasised card.'}),
  ],
  preview: {select: {title: 'name', subtitle: 'price'}},
})

export const estimator = defineType({
  name: 'estimator',
  title: 'Estimator',
  type: 'object',
  description: 'Engineers × months × 21 working days × day rate (Site settings). Outputs are computed, not stored.',
  fields: [
    str('title'),
    txt('sub'),
    str('engineersLabel'),
    str('monthsLabel'),
    rich('note', 'Line under the sliders; may carry a link.'),
    str('daysLabel'),
    str('totalLabel'),
    strList('footnotes'),
  ],
})

export const role = defineType({
  name: 'role',
  title: 'Role',
  type: 'object',
  fields: [str('title', {required: true}), txt('text'), str('status', {description: '[STATUS] until decided: open / pipeline.'})],
  preview: {select: {title: 'title', subtitle: 'status'}},
})

export const legalSection = defineType({
  name: 'legalSection',
  title: 'Section',
  type: 'object',
  fields: [str('heading', {required: true}), defineField({name: 'body', type: 'richBody'})],
  preview: {select: {title: 'heading'}},
})

export const engagementMode = defineType({
  name: 'engagementMode',
  title: 'Way we work',
  type: 'object',
  fields: [
    str('anchor', {description: 'In-page id, e.g. "embedded" (hero chips link to it).'}),
    head(),
    str('getsTitle'),
    strList('gets'),
    str('goodForTitle'),
    strList('goodFor'),
    str('priceLabel'),
    str('priceTitle'),
    str('priceDetail'),
    defineField({name: 'link', type: 'cta'}),
  ],
  preview: {select: {title: 'head.title', subtitle: 'head.eyebrow'}},
})

const compareRow = defineArrayMember({
  type: 'object',
  name: 'compareRow',
  fields: [str('label', {required: true}), strList('cells')],
  preview: {select: {title: 'label'}},
})

const filterChip = defineArrayMember({
  type: 'object',
  name: 'filterChip',
  fields: [
    defineField({
      name: 'key',
      type: 'string',
      options: {list: ['all', 'payments', 'retail', 'health', 'ai', 'iot']},
      validation: (r) => r.required(),
      description: 'Matches a case study\'s filter domain; "all" shows every row.',
    }),
    str('label', {required: true}),
  ],
  preview: {select: {title: 'label', subtitle: 'key'}},
})

const domain = defineArrayMember({
  type: 'object',
  name: 'domain',
  fields: [str('name', {required: true}), txt('text', {rows: 3}), defineField({name: 'lead', type: 'reference', to: [{type: 'caseStudy'}]})],
  preview: {select: {title: 'name', subtitle: 'text'}},
})

// ---------------------------------------------------------------- pages

const hero = obj('hero', 'pageHero')
const closing = obj('closing', 'closing')
const faq = obj('faq', 'faqSection', {title: 'FAQ'})

export const homePage = page('homePage', [
  section('hero', 'Hero (scroll sequence)', [
    str('eyebrow'),
    txt('title', {required: true}),
    txt('sub', {rows: 3}),
    list('buttons', 'cta'),
    strList('facts', {description: 'The mono line under the buttons.'}),
    list('beats', 'step', {description: 'The five beats of the scroll sequence.'}),
    str('scrollHint'),
  ]),
  defineField({
    name: 'domains',
    title: 'Domains strip',
    type: 'array',
    of: [domain],
  }),
  section('services', 'Services file stack', [
    head(),
    str('scrollHint'),
    str('detailsLabel'),
    str('goodForLabel'),
    str('stackLabel'),
    str('engagementLabel'),
    str('fromLabel', {description: 'e.g. "From [YOUR RATE] / day"'}),
    str('closingLabel', {description: 'The closing sheet, e.g. "08 of 08 · the file closes here"'}),
    list('closingLinks', 'cta'),
  ]),
  section('caseIndex', 'Case index', [
    head(),
    ref('cases', 'caseStudy', {description: 'The rows, in this order. Normally the 8 featured case studies.', max: 12}),
    defineField({name: 'filters', type: 'array', of: [filterChip]}),
    str('problemLabel'),
    str('whatWeDidLabel'),
    str('measuredLabel'),
    str('pageLink'),
    str('askLink'),
    defineField({name: 'allLink', type: 'cta'}),
  ]),
  section('midCta', 'Call to action band', [txt('text'), defineField({name: 'button', type: 'cta'})]),
  obj('why', 'titleTextSection', {title: 'Why Hopsig'}),
  section('record', 'The record', [head(), defineField({name: 'link', type: 'cta'}), list('stats', 'fact', {max: 4}), strList('strip')]),
  section('notes', 'Notes journal', [
    head(),
    str('countLine'),
    str('latestLabel'),
    str('readLabel'),
    str('moreTitle'),
    defineField({name: 'allLink', type: 'cta'}),
  ]),
  closing,
])

export const servicesIndexPage = page('servicesIndexPage', [
  hero,
  defineField({name: 'modes', title: 'Three ways we work', type: 'array', of: [defineArrayMember({type: 'engagementMode'})], validation: (r) => r.max(3)}),
  section('detail', 'Eight services', [head()]),
  obj('inside', 'titleTextSection', {title: 'Inside every engagement'}),
  section('howItRuns', 'How an engagement runs', [head(), defineField({name: 'link', type: 'cta'}), list('steps', 'step')]),
  closing,
])

export const industriesIndexPage = page('industriesIndexPage', [hero, section('list', 'Industries list', [head()]), closing])

export const workIndexPage = page('workIndexPage', [
  hero,
  section('selected', 'Selected', [
    head(),
    ref('cases', 'caseStudy', {description: 'The full cards, in this order (12 in the reference). Every other case study follows as "the rest of the record", by order.'}),
    str('restTitle'),
    str('restAside'),
  ]),
  section('reporting', 'How we report', [head(), strList('points')]),
  closing,
])

export const notesIndexPage = page('notesIndexPage', [
  hero,
  section('list', 'All notes', [head(), str('readLabel'), str('draftLabel', {description: 'Marks unpublished notes, e.g. [DRAFT].'})]),
  closing,
])

export const approachPage = page('approachPage', [
  hero,
  obj('staffing', 'titleTextSection', {title: 'How we staff an account'}),
  section('agentic', 'Agentic delivery', [head(), strList('tags'), list('links', 'cta'), list('items', 'titleText')]),
  section('hours', 'Where we are, when we are', [head(), strList('zones'), defineField({name: 'paragraphs', type: 'array', of: [defineArrayMember({type: 'text', rows: 4})]})]),
  closing,
])

export const ratesPage = page('ratesPage', [
  hero,
  defineField({name: 'cards', title: 'Rate cards', type: 'array', of: [defineArrayMember({type: 'rateCard'})], validation: (r) => r.max(3)}),
  obj('estimator', 'estimator'),
  obj('terms', 'labelValueSection', {title: 'Terms'}),
  faq,
  closing,
])

const callSteps = list('steps', 'titleText', {title: 'Steps', max: 3})
const strip = strList('strip', {title: 'Strip', description: 'The mono line at the foot of the page.'})

export const bookPage = page('bookPage', [
  section('hero', 'Hero', [str('eyebrow'), txt('title', {required: true}), txt('sub', {rows: 3})]),
  callSteps,
  rich('note', 'Under the steps; links to /brief.'),
  section('calendar', 'Calendar card', [
    str('title'),
    str('timezone'),
    str('prompt'),
    strList('fieldPlaceholders'),
    str('submit'),
    str('bookedLabel'),
    str('bookedTitle'),
    txt('bookedText', {rows: 3}),
    strList('checklist'),
  ]),
  strip,
])

export const briefPage = page('briefPage', [
  section('hero', 'Hero', [str('eyebrow'), txt('title', {required: true}), txt('sub', {rows: 3})]),
  callSteps,
  rich('note', 'Under the steps; links to /book.'),
  section('form', 'Brief form', [
    str('title'),
    str('duration'),
    strList('fieldPlaceholders'),
    str('problemLabel'),
    str('whenLabel'),
    strList('whenOptions'),
    str('budgetLabel'),
    str('submit'),
    str('receivedLabel'),
    str('receivedTitle'),
    txt('receivedText', {rows: 3}),
    strList('checklist'),
  ]),
  strip,
])

export const comparePage = page('comparePage', [
  hero,
  section('table', 'The table', [head(), strList('columns'), defineField({name: 'rows', type: 'array', of: [compareRow]})]),
  obj('estimator', 'estimator'),
  faq,
  closing,
])

export const workingWithUsPage = page('workingWithUsPage', [
  hero,
  obj('checks', 'titleTextSection', {title: 'Everything a buyer checks'}),
  obj('asks', 'titleTextSection', {title: 'What we ask of you'}),
  closing,
])

export const aiTransformationPage = page('aiTransformationPage', [
  hero,
  section('offer', 'What you get', [
    head(),
    strList('gets'),
    rich('priced', 'The price line, with its link to /rates.'),
    str('goodForTitle'),
    strList('goodFor'),
    str('sayNoTitle'),
    strList('sayNo'),
  ]),
  obj('pipeline', 'titleTextSection', {title: 'The pipeline'}),
  obj('weeks', 'stepsSection', {title: 'How the six weeks run'}),
  obj('measures', 'titleTextSection', {title: 'What we measure'}),
  section('record', 'From the record', [head(), ref('cases', 'caseStudy', {max: 6}), defineField({name: 'allLink', type: 'cta'})]),
  faq,
  closing,
])

export const agenticFlowPage = page('agenticFlowPage', [
  hero,
  section('flow', 'The flow', [
    head(),
    list('stages', 'flowStage', {max: 6}),
    section('labels', 'Diagram and table labels', [
      str('stage'),
      str('input'),
      str('output'),
      str('guardrail'),
      str('whoDecides'),
      str('personSigns'),
      str('noGate'),
      str('runsAlone'),
      str('briefIn'),
      str('prOut'),
    ]),
  ]),
  section('agents', 'What the agents do / never do', [head(), strList('does'), str('neverTitle'), str('neverAside'), strList('never')]),
  section('tooling', 'Built on Claude Code', [head(), strList('tools'), str('whereLabel'), strList('where'), list('links', 'cta')]),
  closing,
])

export const agenciesPage = page('agenciesPage', [
  hero,
  obj('how', 'titleTextSection', {title: 'How it works'}),
  obj('gets', 'listSection', {title: 'What you get'}),
  obj('sayNo', 'listSection', {title: 'We will say no when'}),
  faq,
  closing,
])

export const joinPage = page('joinPage', [
  hero,
  obj('work', 'titleTextSection', {title: 'What the work is like'}),
  obj('vetting', 'titleTextSection', {title: 'How we vet'}),
  section('roles', 'Roles we hire for', [head(), list('roles', 'role'), str('payLine')]),
  faq,
  closing,
])

const legal = [
  hero,
  list('sections', 'legalSection'),
  txt('footnote', {rows: 2, description: 'The "Last updated … / Questions …" lines.'}),
]
export const privacyPage = page('privacyPage', legal)
export const termsPage = page('termsPage', legal)

export const notFoundPage = page('notFoundPage', [closing])

export const pageObjects = [flowStage, rateCard, estimator, role, legalSection, engagementMode]

export const pages = [
  homePage,
  servicesIndexPage,
  industriesIndexPage,
  workIndexPage,
  notesIndexPage,
  approachPage,
  ratesPage,
  bookPage,
  briefPage,
  comparePage,
  workingWithUsPage,
  aiTransformationPage,
  agenticFlowPage,
  agenciesPage,
  joinPage,
  privacyPage,
  termsPage,
  notFoundPage,
]
