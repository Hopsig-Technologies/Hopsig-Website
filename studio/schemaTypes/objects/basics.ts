import {defineArrayMember, defineField, defineType} from 'sanity'
import {list, str, strList, txt} from '../fields'
import {ROUTABLE_TYPES} from '../registry'
import {placeholderWarning} from '../validation'

/** Where a button or link goes. Internal links are references, so a linked page cannot be deleted and a dead
 *  internal link cannot exist. `anchor` covers in-page targets such as /services#embedded. */
export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'kind',
      type: 'string',
      options: {list: ['internal', 'external'], layout: 'radio', direction: 'horizontal'},
      initialValue: 'internal',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'internal',
      type: 'reference',
      to: ROUTABLE_TYPES.map((type) => ({type})),
      hidden: ({parent}) => parent?.kind === 'external',
    }),
    defineField({
      name: 'anchor',
      type: 'string',
      description: 'Optional in-page target without the #, e.g. "embedded". With no page selected it targets the current page.',
      hidden: ({parent}) => parent?.kind === 'external',
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https', 'mailto']}),
      hidden: ({parent}) => parent?.kind !== 'external',
    }),
  ],
  preview: {
    select: {kind: 'kind', title: 'internal.title', name: 'internal.name', type: 'internal._type', href: 'href', anchor: 'anchor'},
    prepare: ({kind, title, name, type, href, anchor}) => ({
      title: kind === 'external' ? href : `${title || name || type || 'this page'}${anchor ? `#${anchor}` : ''}`,
    }),
  },
})

/** A button or text link: label + destination + style. */
export const cta = defineType({
  name: 'cta',
  title: 'Button',
  type: 'object',
  fields: [
    str('label', {required: true}),
    defineField({name: 'link', type: 'link', validation: (rule) => rule.required()}),
    defineField({
      name: 'variant',
      type: 'string',
      description: 'lime = filled (Lime on dark, Ink on light); outline; link = mono text link; chip = hero chip.',
      options: {list: ['lime', 'outline', 'link', 'chip'], layout: 'radio', direction: 'horizontal'},
      initialValue: 'lime',
    }),
  ],
  preview: {select: {title: 'label', subtitle: 'variant'}},
})

/** A figure with its label (facts rows, record stats). */
export const fact = defineType({
  name: 'fact',
  title: 'Fact',
  type: 'object',
  fields: [str('value', {required: true}), str('label')],
  preview: {select: {title: 'value', subtitle: 'label'}},
})

/** Title + text: ledger rows, cards, "what we ask of you", "how we vet", … */
export const titleText = defineType({
  name: 'titleText',
  title: 'Item',
  type: 'object',
  fields: [str('title', {required: true}), txt('text', {rows: 3})],
  preview: {select: {title: 'title', subtitle: 'text'}},
})

/** A label and its value (terms tables, key facts). */
export const labelValue = defineType({
  name: 'labelValue',
  title: 'Row',
  type: 'object',
  fields: [str('label', {required: true}), str('value')],
  preview: {select: {title: 'label', subtitle: 'value'}},
})

/** An engagement beat: Day 0 / Day 3 / Day 10 / Week 6 / Fortnightly. */
export const step = defineType({
  name: 'step',
  title: 'Step',
  type: 'object',
  fields: [str('when', {required: true, description: 'e.g. "Day 3", "Week 6", "Then"'}), str('title'), txt('text', {rows: 2})],
  preview: {select: {title: 'when', subtitle: 'title'}},
})

export const faqItem = defineType({
  name: 'faqItem',
  title: 'Question',
  type: 'object',
  fields: [str('question', {required: true}), txt('answer', {rows: 4, required: true})],
  preview: {select: {title: 'question'}},
})

/** Section heading block used above most sections. Every part is optional; the layout decides which show. */
export const sectionHead = defineType({
  name: 'sectionHead',
  title: 'Section heading',
  type: 'object',
  options: {collapsible: true, collapsed: false},
  fields: [
    str('eyebrow', {description: 'Mono label above the title.'}),
    txt('title', {rows: 2}),
    txt('sub', {title: 'Intro', rows: 3}),
    str('aside', {description: 'Mono note at the right of the title row, e.g. "All times GMT".'}),
  ],
  preview: {select: {title: 'title', subtitle: 'eyebrow'}},
})

export const titleTextSection = defineType({
  name: 'titleTextSection',
  title: 'Section · items',
  type: 'object',
  fields: [defineField({name: 'head', type: 'sectionHead'}), list('items', 'titleText')],
  preview: {select: {title: 'head.title'}},
})

export const listSection = defineType({
  name: 'listSection',
  title: 'Section · list',
  type: 'object',
  fields: [defineField({name: 'head', type: 'sectionHead'}), strList('items')],
  preview: {select: {title: 'head.title'}},
})

export const stepsSection = defineType({
  name: 'stepsSection',
  title: 'Section · steps',
  type: 'object',
  fields: [defineField({name: 'head', type: 'sectionHead'}), list('steps', 'step')],
  preview: {select: {title: 'head.title'}},
})

export const labelValueSection = defineType({
  name: 'labelValueSection',
  title: 'Section · table',
  type: 'object',
  fields: [defineField({name: 'head', type: 'sectionHead'}), list('rows', 'labelValue')],
  preview: {select: {title: 'head.title'}},
})

export const faqSection = defineType({
  name: 'faqSection',
  title: 'FAQ',
  type: 'object',
  fields: [txt('title', {initialValue: 'Questions we get about this.'}), list('items', 'faqItem')],
  preview: {select: {title: 'title'}},
})

/** The page hero. Facts are the four mono figures under the buttons on service, industry and some company pages. */
export const pageHero = defineType({
  name: 'pageHero',
  title: 'Hero',
  type: 'object',
  fields: [
    str('eyebrow'),
    txt('title', {required: true, description: 'A new line in the text is a line break on the page.'}),
    txt('sub', {title: 'Intro', rows: 3}),
    list('buttons', 'cta'),
    list('facts', 'fact', {max: 4}),
  ],
  preview: {select: {title: 'title', subtitle: 'eyebrow'}},
})

/** The closing section on every page. The email line reads the email from Site settings. */
export const closing = defineType({
  name: 'closing',
  title: 'Closing',
  type: 'object',
  fields: [
    str('eyebrow'),
    txt('title', {required: true}),
    txt('sub', {rows: 3, description: 'Leave empty to use the default from Site settings.'}),
    list('buttons', 'cta'),
    defineField({name: 'showEmail', type: 'boolean', initialValue: true, description: 'Show the "Or email …" line.'}),
  ],
  preview: {select: {title: 'title', subtitle: 'eyebrow'}},
})

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    str('title', {description: 'Browser tab and search title. Defaults to "Hopsig — <page>".'}),
    txt('description', {rows: 3, description: 'Search and share description, ~150 characters.'}),
    defineField({name: 'ogImage', title: 'Share image', type: 'image'}),
  ],
})

/** A line of copy with bold/italic and links (case-study "measured", a few note lines). */
export const richInline = defineType({
  name: 'richInline',
  title: 'Rich line',
  type: 'array',
  validation: (rule) => rule.custom(placeholderWarning).warning(),
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{title: 'Normal', value: 'normal'}],
      lists: [],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
        ],
        annotations: [defineArrayMember({name: 'link', type: 'link', title: 'Link'})],
      },
    }),
  ],
})

/** Long copy: notes and legal pages. */
export const richBody = defineType({
  name: 'richBody',
  title: 'Body',
  type: 'array',
  validation: (rule) => rule.custom(placeholderWarning).warning(),
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H2', value: 'h2'},
        {title: 'Pull quote', value: 'blockquote'},
      ],
      lists: [
        {title: 'Numbered', value: 'number'},
        {title: 'Bullets', value: 'bullet'},
      ],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
        ],
        annotations: [defineArrayMember({name: 'link', type: 'link', title: 'Link'})],
      },
    }),
  ],
})

export const basics = [
  link,
  cta,
  fact,
  titleText,
  labelValue,
  step,
  faqItem,
  sectionHead,
  titleTextSection,
  listSection,
  stepsSection,
  labelValueSection,
  faqSection,
  pageHero,
  closing,
  seo,
  richInline,
  richBody,
]
