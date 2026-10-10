import {defineField, defineType} from 'sanity'
import {obj, str, strList, txt} from '../fields'
import {hrefRule} from '../objects/basics'

const FILTER_DOMAINS = [
  {title: 'Payments', value: 'payments'},
  {title: 'Retail & e-commerce', value: 'retail'},
  {title: 'Healthcare & data', value: 'health'},
  {title: 'AI & delivery', value: 'ai'},
  {title: 'IoT & platforms', value: 'iot'},
]

const slugField = (source: string, description: string) =>
  defineField({name: 'slug', type: 'slug', options: {source}, description, validation: (rule) => rule.required()})

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case study',
  type: 'document',
  groups: [
    {name: 'note', title: 'Case note', default: true},
    {name: 'card', title: 'Lists & card'},
    {name: 'meta', title: 'Settings'},
  ],
  fields: [
    str('title', {required: true, group: 'note'}),
    str('domain', {group: 'note', description: 'Eyebrow, e.g. "Fintech · payments".'}),
    txt('problem', {rows: 3, group: 'note'}),
    txt('whatWeDid', {title: 'What we did', rows: 6, group: 'note'}),
    defineField({
      name: 'measured',
      type: 'richInline',
      group: 'note',
      description: 'The outcome sentence, bold where the number is. Keep [ADD …] placeholders until the number is real.',
    }),
    strList('stack', {group: 'note'}),
    str('shape', {group: 'note', description: 'Engagement shape, e.g. "Built · product-led", "Embedded · 2 engineers".'}),
    defineField({
      name: 'order',
      type: 'number',
      group: 'card',
      description: 'Position on /work (lowest first). The first 12 render as full cards, the rest as "the rest of the record".',
      validation: (r) => r.required().integer().min(0),
    }),
    defineField({name: 'featured', type: 'boolean', initialValue: false, group: 'card', description: 'In the home case index (8 at present).'}),
    defineField({
      name: 'featuredOrder',
      type: 'number',
      group: 'card',
      description: 'Position in the home case index (lowest first).',
      hidden: ({document}) => !document?.featured,
      validation: (r) => r.integer().min(0),
    }),
    defineField({
      name: 'filterDomain',
      type: 'string',
      group: 'card',
      options: {list: FILTER_DOMAINS},
      description: 'Home case-index filter chip.',
    }),
    defineField({
      name: 'metric',
      type: 'object',
      group: 'card',
      description: 'Drives the cursor "Measured" card on the home case index.',
      fields: [
        str('value', {description: 'e.g. "150+"'}),
        str('label'),
        defineField({name: 'before', type: 'number'}),
        defineField({name: 'after', type: 'number'}),
        str('beforeLabel'),
        str('afterLabel'),
        txt('evidence', {
          rows: 2,
          description: 'Where this number comes from (report, dashboard, invoice). Never shown on the site. Required once the value is a real number.',
        }),
      ],
    }),
    defineField({
      name: 'hasPage',
      type: 'boolean',
      initialValue: false,
      group: 'meta',
      description: 'Render /work/<slug>. Only when problem, what we did and measured are all written.',
    }),
    slugField('title', 'The URL: /work/<slug>. Short, e.g. "payments-platform".'),
    defineField({
      name: 'source',
      title: 'Record key',
      type: 'string',
      group: 'meta',
      description: "Key the site's service and industry pages use to pick this case study (F0, C2, …). Unique; leave as is unless a developer asks.",
      validation: (r) =>
        r.custom(async (value, context) => {
          if (!value) return true
          const id = context.document?._id?.replace(/^drafts\./, '')
          const client = context.getClient({apiVersion: '2025-02-19'})
          const n = await client.fetch<number>('count(*[_type == "caseStudy" && source == $v && !(_id in [$id, "drafts." + $id])])', {v: value, id})
          return n === 0 || `Another case study already uses the key ${value}`
        }),
    }),
    defineField({
      name: 'clientName',
      type: 'string',
      group: 'meta',
      description: 'Internal only. Never queried by the site: client names are withheld (rule 2).',
    }),
    obj('seo', 'seo', {group: 'meta'}),
  ],
  orderings: [
    {title: 'Order (/work)', name: 'order', by: [{field: 'order', direction: 'asc'}]},
    {title: 'Home order', name: 'featuredOrder', by: [{field: 'featuredOrder', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'title', domain: 'domain', source: 'source', featured: 'featured', hasPage: 'hasPage'},
    prepare: ({title, domain, source, featured, hasPage}) => ({
      title,
      subtitle: [source, domain, featured && 'featured', hasPage && 'has page'].filter(Boolean).join(' · '),
    }),
  },
})

export const post = defineType({
  name: 'post',
  title: 'Note',
  type: 'document',
  fields: [
    str('title', {required: true}),
    slugField('title', 'The URL: /notes/<slug>.'),
    defineField({
      name: 'category',
      type: 'string',
      options: {list: ['Delivery', 'Scope', 'AI', 'Working together', 'Measurement']},
    }),
    txt('excerpt', {rows: 3, required: true}),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      description: 'Empty = draft: listed as an inert row marked [DRAFT]. Only orders the list; no date is shown (rule 7).',
    }),
    defineField({
      name: 'order',
      type: 'number',
      description: 'Position among the notes not yet published (they follow the published ones). Published notes are ordered by date.',
    }),
    defineField({name: 'body', type: 'richBody'}),
    defineField({
      name: 'offer',
      type: 'object',
      description: 'The sticky aside: the service or offer this note describes.',
      fields: [
        str('title'),
        str('text'),
        defineField({name: 'href', title: 'Path or URL', type: 'url', description: 'e.g. /services/custom-software', validation: hrefRule}),
        str('cta', {initialValue: 'Read the offer'}),
      ],
    }),
    str('closing', {description: 'Headline of the closing section for this note.'}),
    obj('seo', 'seo'),
  ],
  orderings: [{title: 'Published', name: 'published', by: [{field: 'publishedAt', direction: 'desc'}]}],
  preview: {
    select: {title: 'title', category: 'category', publishedAt: 'publishedAt'},
    prepare: ({title, category, publishedAt}) => ({title, subtitle: [category, publishedAt ? 'published' : '[DRAFT]'].join(' · ')}),
  },
})

export const jobListing = defineType({
  name: 'jobListing',
  title: 'Role',
  type: 'document',
  fields: [
    str('title', {required: true}),
    str('text', {description: 'One line under the title: the stack and what matters.'}),
    defineField({
      name: 'status',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          {title: 'Open', value: 'open'},
          {title: 'Pipeline', value: 'pipeline'},
          {title: 'Closed (not listed)', value: 'closed'},
        ],
      },
      description: 'Empty = the site shows [STATUS]. Never guess (rule 1).',
    }),
    defineField({name: 'order', type: 'number', description: 'Position on /join (lowest first).', validation: (r) => r.required().integer().min(0)}),
  ],
  orderings: [{title: 'Order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'title', status: 'status'},
    prepare: ({title, status}) => ({title, subtitle: status ?? '[STATUS]'}),
  },
})

export const collections = [caseStudy, post, jobListing]
