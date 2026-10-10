import {defineArrayMember, defineField, defineType} from 'sanity'
import {list, str, strList, txt} from '../fields'

/** Site-wide values that are bracketed placeholders today. The site replaces each token wherever it appears in any
 *  copy (footer, legal pages, rates, …) once the field here is filled. Empty = the placeholder stays visible. */
export const SITE_TOKENS: {name: string; token: string; title: string; type?: 'number' | 'url'}[] = [
  {name: 'companyRegNo', token: '[COMPANY REG NO.]', title: 'Company registration number'},
  {name: 'year', token: '[YEAR]', title: 'Year established'},
  {name: 'email', token: '[HELLO@HOPSIG.COM]', title: 'Contact email'},
  {name: 'legalForm', token: '[LEGAL FORM]', title: 'Legal form'},
  {name: 'address', token: '[ADDRESS]', title: 'Registered office address'},
  {name: 'vatStatus', token: '[VAT / TAX STATUS]', title: 'VAT / tax status'},
  {name: 'bankCountry', token: '[BANK COUNTRY]', title: 'Bank country'},
  {name: 'dayRate', token: '[YOUR RATE]', title: 'Day rate', type: 'number'},
  {name: 'monthlyRetainer', token: '[MONTHLY]', title: 'Monthly retainer (from)'},
  {name: 'agencyDiscount', token: '[AGENCY DISCOUNT]', title: 'Agency discount'},
  {name: 'insurance', token: '[INSURER · COVER AMOUNT]', title: 'Insurer and cover amount'},
]

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    {name: 'values', title: 'Company values', default: true},
    {name: 'chrome', title: 'Footer & closing'},
    {name: 'capabilities', title: 'What we work in'},
  ],
  fields: [
    ...SITE_TOKENS.map((t) =>
      defineField({
        name: t.name,
        title: t.title,
        type: t.type ?? 'string',
        group: 'values',
        description:
          t.type === 'number'
            ? `Per engineer per day, in the invoicing currency. Replaces ${t.token} everywhere and drives the estimator. Leave empty until decided.`
            : `Replaces ${t.token} everywhere it appears. Leave empty until it is real.`,
      }),
    ),
    defineField({name: 'bookingUrl', title: 'Booking link', type: 'url', group: 'values', description: 'The real booking tool (/book). Empty = the visual calendar only.'}),
    defineField({name: 'briefRecipient', title: 'Brief form recipient', type: 'string', group: 'values', description: 'Where /brief submissions are emailed. Not shown on the site.', validation: (r) => r.email()}),
    defineField({
      name: 'footer',
      type: 'object',
      group: 'chrome',
      fields: [txt('tagline', {rows: 2}), str('legalLeft', {title: 'Legal line (left)'}), str('legalRight', {title: 'Legal line (right)'})],
    }),
    defineField({
      name: 'defaultClosing',
      title: 'Default closing',
      type: 'object',
      group: 'chrome',
      description: 'Used where a page leaves the closing intro empty.',
      fields: [str('eyebrow'), txt('title'), txt('sub', {rows: 3}), str('emailLine')],
    }),
    defineField({
      name: 'capabilities',
      title: 'What we work in',
      type: 'object',
      group: 'capabilities',
      description: 'The two scrolling rows on Home and Services.',
      fields: [str('title'), str('aside'), strList('rowOne'), strList('rowTwo'), str('note')],
    }),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})

const navLink = defineArrayMember({
  type: 'object',
  name: 'navLink',
  fields: [str('label', {required: true}), str('desc', {title: 'Description'}), defineField({name: 'link', type: 'link', validation: (r) => r.required()})],
  preview: {select: {title: 'label', subtitle: 'desc'}},
})

export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'primary',
      title: 'Header',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'navItem',
          fields: [
            str('label', {required: true}),
            defineField({name: 'link', type: 'link'}),
            defineField({name: 'children', title: 'Menu items', type: 'array', of: [navLink]}),
            list('menuFooter', 'cta', {title: 'Menu footer links'}),
          ],
          preview: {select: {title: 'label'}},
        }),
      ],
    }),
    defineField({name: 'cta', title: 'Header button', type: 'cta'}),
    defineField({
      name: 'footer',
      title: 'Footer columns',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'footerColumn',
          fields: [str('title', {required: true}), defineField({name: 'links', type: 'array', of: [navLink]})],
          preview: {select: {title: 'title'}},
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Navigation'})},
})

/** Wording the detail templates put around collection data. {tokens} are filled from the document. */
const templateGroup = (name: string, title: string, keys: [string, string?][]) =>
  defineField({
    name,
    title,
    type: 'object',
    options: {collapsible: true, collapsed: true},
    fields: keys.map(([k, description]) => str(k, {description})),
  })

export const detailTemplates = defineType({
  name: 'detailTemplates',
  title: 'Detail page wording',
  type: 'document',
  description: 'Words around the data on service, industry, case and note pages. {tokens} are filled from each document.',
  fields: [
    templateGroup('caseCard', 'Case card (Work, AI transformation)', [
      ['eyebrow', '{nn} · {domain}'],
      ['problemLabel'],
      ['whatWeDidLabel'],
      ['measuredLabel'],
      ['clientLine'],
      ['pageLink'],
      ['askLink'],
    ]),
    templateGroup('servicePage', 'Service page', [
      ['heroEyebrow', 'Service {nn} · {name}'],
      ['heroMeta', '{shape} · from [YOUR RATE] / day'],
      ['stepsAside'],
      ['othersTitle'],
      ['othersAside'],
      ['closingEyebrow', '{name} · the call'],
    ]),
    templateGroup('industryPage', 'Industry page', [
      ['heroEyebrow', 'Industry · {name}'],
      ['recordTitle'],
      ['recordAside', '{count} case notes · client names withheld'],
      ['asksTitle'],
      ['asksSub'],
      ['servicesTitle'],
      ['servicesLink'],
      ['othersTitle'],
      ['closingEyebrow', '{short} · the call'],
    ]),
    templateGroup('industriesIndexRow', 'Industries index row', [['count', '{count} notes']]),
    templateGroup('casePage', 'Case page', [
      ['heroEyebrow', 'Case note · {domain}'],
      ['shapeTitle'],
      ['clientNote'],
      ['shapeLabel'],
      ['domainLabel'],
      ['clientLabel'],
      ['clientValue'],
      ['askLine'],
      ['missingMetricValue'],
      ['missingMetricLabel'],
      ['moreTitle'],
      ['moreLink'],
      ['closingEyebrow'],
      ['closingTitle'],
    ]),
    templateGroup('notePage', 'Note page', [
      ['heroEyebrow', 'Note · {category} · [DATE] — see Open questions in CLAUDE.md before showing [DATE]'],
      ['byline'],
      ['tocTitle'],
      ['offerTitle'],
      ['nextTitle'],
    ]),
    templateGroup('legalPage', 'Legal page', [['contentsTitle']]),
  ],
  preview: {prepare: () => ({title: 'Detail page wording'})},
})

/** The animated engagement mock (call → scope → people → measured → review) on /services (×3) and /work.
 *  Kept as lines of cells because it is an illustration; see Open questions in CLAUDE.md before building it. */
export const engagementPanel = defineType({
  name: 'engagementPanel',
  title: 'Engagement panel',
  type: 'document',
  fields: [
    defineField({
      name: 'lines',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'panelLine',
          fields: [strList('cells')],
          preview: {
            select: {cells: 'cells'},
            prepare: ({cells}) => ({title: (cells as string[] | undefined)?.join(' · ') ?? ''}),
          },
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Engagement panel'})},
})

export const siteSingletons = [siteSettings, navigation, detailTemplates, engagementPanel]
