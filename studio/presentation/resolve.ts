import {defineDocuments, defineLocations, type PresentationPluginOptions} from 'sanity/presentation'
import {PAGE_SINGLETONS} from '../schemaTypes/registry'

const routed = PAGE_SINGLETONS.filter((p) => p.route !== null) as unknown as {type: string; title: string; route: string}[]

/** Which document a preview URL shows (mainDocuments), and where each document appears (locations). */
export const resolve: PresentationPluginOptions['resolve'] = {
  mainDocuments: defineDocuments([
    ...routed.map((p) => ({route: p.route, type: p.type})),
    {route: '/services/:slug', filter: `_type == "service" && slug.current == $slug`},
    {route: '/industries/:slug', filter: `_type == "industry" && slug.current == $slug`},
    {route: '/work/:slug', filter: `_type == "caseStudy" && slug.current == $slug`},
    {route: '/notes/:slug', filter: `_type == "post" && slug.current == $slug`},
  ]),
  locations: {
    ...Object.fromEntries(routed.map((p) => [p.type, defineLocations({locations: [{title: p.title, href: p.route}]})])),
    service: defineLocations({
      select: {title: 'name', slug: 'slug.current'},
      resolve: (doc) => ({
        locations: [
          {title: doc?.title || 'Service', href: `/services/${doc?.slug}`},
          {title: 'Services', href: '/services'},
          {title: 'Home (file stack)', href: '/'},
        ],
      }),
    }),
    industry: defineLocations({
      select: {title: 'name', slug: 'slug.current'},
      resolve: (doc) => ({
        locations: [
          {title: doc?.title || 'Industry', href: `/industries/${doc?.slug}`},
          {title: 'Industries', href: '/industries'},
        ],
      }),
    }),
    caseStudy: defineLocations({
      select: {title: 'title', slug: 'slug.current', hasPage: 'hasPage'},
      resolve: (doc) => ({
        locations: [
          ...(doc?.hasPage ? [{title: doc.title || 'Case note', href: `/work/${doc.slug}`}] : []),
          {title: 'Work', href: '/work'},
          {title: 'Home (case index)', href: '/'},
        ],
      }),
    }),
    post: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (doc) => ({
        locations: [
          {title: doc?.title || 'Note', href: `/notes/${doc?.slug}`},
          {title: 'Notes', href: '/notes'},
        ],
      }),
    }),
    siteSettings: defineLocations({message: 'Used on every page (footer, closing, site-wide values).', tone: 'positive'}),
    navigation: defineLocations({message: 'Header and footer on every page.', tone: 'positive'}),
  },
}
