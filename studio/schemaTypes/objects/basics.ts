import {defineArrayMember, defineField, defineType, type UrlRule} from 'sanity'
import {placeholderWarning} from '../validation'

/** A site path (/services/custom-software, /work) or a full URL. The site's static routes are typed in
 *  web/content/routes.ts; a path that does not exist shows up in the Phase 9 dead-link crawl. */
export const hrefRule = (rule: UrlRule) => rule.uri({allowRelative: true, scheme: ['http', 'https', 'mailto']})

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'href',
      title: 'Path or URL',
      type: 'url',
      description: 'A site path such as /services/custom-software or /work, or a full https:// or mailto: URL.',
      validation: (rule) => hrefRule(rule).required(),
    }),
  ],
  preview: {select: {title: 'href'}},
})

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({name: 'title', type: 'string', description: 'Search and share title. Empty = "<title> — Case Study | Hopsig" (case notes) or "<title> | Hopsig Notes" (notes).'}),
    defineField({name: 'description', type: 'text', rows: 3, description: 'Search and share description, ~150 characters.'}),
    defineField({name: 'ogImage', title: 'Share image', type: 'image'}),
  ],
})

/** A line of copy with bold/italic and links (case-study "measured"). */
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

/** Long copy: note bodies. */
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

export const basics = [link, seo, richInline, richBody]
