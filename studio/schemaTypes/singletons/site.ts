import {defineField, defineType} from 'sanity'

/** Site-wide values that are bracketed placeholders in the copy today. The site replaces each token wherever it
 *  appears once the field here is filled; an empty field leaves the placeholder visible (rule 1).
 *  Mirrored in web/lib/tokens.ts. */
export const SITE_TOKENS: {name: string; token: string; title: string; type?: 'number'}[] = [
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
    defineField({
      name: 'bookingUrl',
      title: 'Booking link',
      type: 'url',
      description: 'The real booking tool (/book). Empty = the visual calendar only.',
    }),
    defineField({
      name: 'briefRecipient',
      title: 'Brief form recipient',
      type: 'string',
      description: 'Where /brief submissions are emailed. Not shown on the site.',
      validation: (r) => r.email(),
    }),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})

export const siteSingletons = [siteSettings]
