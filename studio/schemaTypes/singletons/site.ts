import {defineField, defineType} from 'sanity'

/** Site-wide values that are bracketed placeholders in the copy today. The site replaces each token wherever it
 *  appears once the field here is filled; an empty field leaves the placeholder visible (rule 1).
 *  Mirrored in web/lib/tokens.ts. */
export const SITE_TOKENS: {name: string; token: string; title: string; type?: 'number'}[] = [
  {name: 'year', token: '[YEAR]', title: 'Copyright year (footer)'},
  {name: 'email', token: '[HELLO@HOPSIG.COM]', title: 'Contact email'},
  {name: 'vatStatus', token: '[VAT / TAX STATUS]', title: 'VAT / tax status'},
  {name: 'bankCountry', token: '[BANK COUNTRY]', title: 'Bank country'},
  {name: 'insurance', token: '[INSURER · COVER AMOUNT]', title: 'Insurer and cover amount'},
]

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    ...SITE_TOKENS.map((t) =>
      defineField({
        name: t.name,
        title: t.title,
        type: t.type ?? 'string',
        description:
          t.type === 'number'
            ? `Per engineer per day, in the invoicing currency. Replaces ${t.token} everywhere and drives the estimator. Leave empty until decided.`
            : `Replaces ${t.token} everywhere it appears. Leave empty until it is real.`,
      }),
    ),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})

export const siteSingletons = [siteSettings]
