import {defineArrayMember, defineField, defineType} from 'sanity'
import {list, obj, str, strList, txt} from '../fields'

const FILTER_DOMAINS = [
  {title: 'Payments', value: 'payments'},
  {title: 'Retail & e-commerce', value: 'retail'},
  {title: 'Healthcare & data', value: 'health'},
  {title: 'AI & delivery', value: 'ai'},
  {title: 'IoT & platforms', value: 'iot'},
]

const slugField = (source: string, description: string) =>
  defineField({
    name: 'slug',
    type: 'slug',
    options: {source},
    description,
    validation: (rule) => rule.required(),
  })

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case study',
  type: 'document',
  groups: [
    {name: 'note', title: 'Case note', default: true},
    {name: 'card', title: 'Work index card'},
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
      name: 'filterDomain',
      type: 'string',
      group: 'card',
      options: {list: FILTER_DOMAINS},
      description: 'Home case-index filter chip.',
    }),
    defineField({name: 'featured', type: 'boolean', initialValue: false, group: 'meta', description: 'In the home case index (8 at present).'}),
    defineField({name: 'order', type: 'number', group: 'meta', description: 'Position on /work and in "the rest of the record".'}),
    defineField({
      name: 'hasPage',
      type: 'boolean',
      initialValue: false,
      group: 'meta',
      description: 'Render /work/<slug>. Only when problem, what we did and measured are all written.',
    }),
    slugField('title', 'The URL: /work/<slug>. Short, e.g. "payments-platform".'),
    defineField({name: 'source', type: 'string', readOnly: true, group: 'meta', description: 'Record key from the bundle (F0, C2…).'}),
    defineField({
      name: 'clientName',
      type: 'string',
      group: 'meta',
      description: 'Internal only. Never queried by the site: client names are withheld (rule 2).',
    }),
    obj('seo', 'seo', {group: 'meta'}),
  ],
  orderings: [{title: 'Order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
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
    defineField({name: 'body', type: 'richBody'}),
    defineField({
      name: 'offer',
      type: 'object',
      description: 'The sticky aside: the service or offer this note describes.',
      fields: [str('title'), str('text'), defineField({name: 'link', type: 'link'}), str('cta', {initialValue: 'Read the offer'})],
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

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  groups: [
    {name: 'card', title: 'Card & file stack', default: true},
    {name: 'page', title: 'Service page'},
    {name: 'meta', title: 'Settings'},
  ],
  fields: [
    defineField({name: 'n', title: 'Number', type: 'number', group: 'meta', description: 'Order: 1–8. Shown as "Service 01".', validation: (r) => r.required().min(1)}),
    str('name', {required: true, group: 'card'}),
    slugField('name', 'The URL: /services/<slug>.'),
    str('oneLiner', {group: 'card', description: 'Under the name in menus and the file stack.'}),
    txt('description', {rows: 3, group: 'card'}),
    defineField({
      name: 'tiles',
      type: 'array',
      group: 'card',
      validation: (r) => r.max(3),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'tile',
          fields: [str('title', {required: true}), str('text')],
          preview: {select: {title: 'title', subtitle: 'text'}},
        }),
      ],
    }),
    strList('goodFor', {title: 'Good for', group: 'card'}),
    strList('stack', {group: 'card', description: 'Only what we have shipped to production.'}),
    str('shape', {group: 'card', description: 'Engagement, e.g. "Built · fixed scope per increment".'}),
    txt('pageTitle', {group: 'page', description: 'The hero title on the service page. A new line is a line break.'}),
    strList('gets', {title: 'What you get', group: 'page'}),
    strList('sayNoWhen', {title: 'We will say no when', group: 'page'}),
    list('steps', 'step', {group: 'page'}),
    defineField({
      name: 'record',
      title: 'From the record',
      type: 'array',
      group: 'page',
      of: [defineArrayMember({type: 'reference', to: [{type: 'caseStudy'}]})],
      validation: (r) => r.max(3),
    }),
    list('faq', 'faqItem', {group: 'page'}),
    str('closing', {group: 'page', description: 'Closing headline on the service page.'}),
    obj('seo', 'seo', {group: 'meta'}),
  ],
  orderings: [{title: 'Number', name: 'n', by: [{field: 'n', direction: 'asc'}]}],
  preview: {
    select: {title: 'name', n: 'n', subtitle: 'oneLiner'},
    prepare: ({title, n, subtitle}) => ({title: `${String(n ?? '').padStart(2, '0')} · ${title}`, subtitle}),
  },
})

export const industry = defineType({
  name: 'industry',
  title: 'Industry',
  type: 'document',
  fields: [
    defineField({name: 'n', title: 'Number', type: 'number', validation: (r) => r.required().min(1)}),
    str('name', {required: true}),
    slugField('name', 'The URL: /industries/<slug>.'),
    str('short', {description: 'Short name, e.g. "Fintech" (closing eyebrow).'}),
    txt('title', {description: 'Hero title. A new line is a line break.'}),
    txt('sub', {rows: 3}),
    list('facts', 'fact', {max: 4}),
    defineField({
      name: 'record',
      title: 'From the record',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'caseStudy'}]})],
    }),
    defineField({
      name: 'lead',
      type: 'reference',
      to: [{type: 'caseStudy'}],
      description: 'The case study whose number heads this industry on the industries index.',
    }),
    list('asks', 'titleText', {title: 'What this industry asks for'}),
    defineField({
      name: 'services',
      title: 'Services that fit',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'serviceFit',
          fields: [
            defineField({name: 'service', type: 'reference', to: [{type: 'service'}], validation: (r) => r.required()}),
            str('text'),
          ],
          preview: {select: {title: 'service.name', subtitle: 'text'}},
        }),
      ],
    }),
    str('close', {title: 'Closing headline'}),
    obj('seo', 'seo'),
  ],
  orderings: [{title: 'Number', name: 'n', by: [{field: 'n', direction: 'asc'}]}],
  preview: {select: {title: 'name', subtitle: 'short'}},
})

export const collections = [caseStudy, post, service, industry]
