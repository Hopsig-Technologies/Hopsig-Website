// Sanity v3 schema for the two document types the site reads.
// Shapes match content/case-studies.json and content/posts.json one to one,
// so the seed script is a straight map (body blocks -> Portable Text).
import { defineField, defineType } from 'sanity'

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case study',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: r => r.required() }),
    defineField({ name: 'domain', type: 'string', description: 'e.g. "Fintech · payments". Shown as the eyebrow.' }),
    defineField({ name: 'filterDomain', type: 'string', options: { list: ['payments', 'retail', 'health', 'ai', 'iot'] }, description: 'Work index filter key. See content/work-filters.json.' }),
    defineField({ name: 'problem', type: 'text', rows: 3 }),
    defineField({ name: 'whatWeDid', type: 'text', rows: 6 }),
    defineField({ name: 'measured', type: 'text', rows: 3, description: 'The outcome sentence. Keep bracketed placeholders until the number is real.' }),
    defineField({ name: 'stack', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'shape', type: 'string', description: 'Engagement shape, e.g. "Built · product-led", "Embedded · 2 engineers".' }),
    defineField({ name: 'featured', type: 'boolean', initialValue: false, description: 'Shown on the Work index and the home strip (8 at present).' }),
    defineField({ name: 'order', type: 'number' }),
    defineField({
      name: 'metric', type: 'object', description: 'Drives the cursor "Measured" card on the Work index.',
      fields: [
        defineField({ name: 'value', type: 'string' }),
        defineField({ name: 'label', type: 'string' }),
        defineField({ name: 'before', type: 'number' }),
        defineField({ name: 'after', type: 'number' }),
        defineField({ name: 'beforeLabel', type: 'string' }),
        defineField({ name: 'afterLabel', type: 'string' }),
      ],
    }),
    defineField({ name: 'hasPage', type: 'boolean', initialValue: false, description: 'Render /work/[slug]. Only when problem, whatWeDid and measured are all written.' }),
    defineField({ name: 'clientName', type: 'string', hidden: true, description: 'Never rendered. Client names are withheld on the site.' }),
  ],
  preview: { select: { title: 'title', subtitle: 'domain' } },
})

export const post = defineType({
  name: 'post',
  title: 'Note',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: r => r.required() }),
    defineField({ name: 'category', type: 'string', options: { list: ['Delivery', 'Scope', 'AI', 'Working together', 'Measurement'] } }),
    defineField({ name: 'excerpt', type: 'text', rows: 3, validation: r => r.required() }),
    defineField({ name: 'publishedAt', type: 'datetime', description: 'Unset = draft. Drafts show as inert rows marked [DRAFT]. No read time is ever shown.' }),
    defineField({
      name: 'body', type: 'array',
      of: [
        { type: 'block', styles: [{ title: 'Normal', value: 'normal' }, { title: 'H2', value: 'h2' }, { title: 'Pull quote', value: 'blockquote' }], lists: [{ title: 'Numbered', value: 'number' }], marks: { decorators: [{ title: 'Strong', value: 'strong' }, { title: 'Emphasis', value: 'em' }], annotations: [] } },
      ],
    }),
    defineField({
      name: 'offer', type: 'object', description: 'The sticky aside: which service or offer this note describes.',
      fields: [
        defineField({ name: 'title', type: 'string' }),
        defineField({ name: 'text', type: 'string' }),
        defineField({ name: 'route', type: 'string' }),
        defineField({ name: 'cta', type: 'string', initialValue: 'Read the offer' }),
      ],
    }),
    defineField({ name: 'closing', type: 'string', description: 'The closing section headline for this note.' }),
  ],
  preview: { select: { title: 'title', subtitle: 'category' } },
})

export const schemaTypes = [caseStudy, post]
