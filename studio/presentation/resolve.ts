import {defineDocuments, defineLocations, type PresentationPluginOptions} from 'sanity/presentation'

/** Which document a preview URL shows (mainDocuments), and where each document appears (locations). */
export const resolve: PresentationPluginOptions['resolve'] = {
  mainDocuments: defineDocuments([
    {route: '/work/:slug', filter: `_type == "caseStudy" && slug.current == $slug`},
    {route: '/notes/:slug', filter: `_type == "post" && slug.current == $slug`},
  ]),
  locations: {
    caseStudy: defineLocations({
      select: {title: 'title', slug: 'slug.current', hasPage: 'hasPage', featured: 'featured'},
      resolve: (doc) => ({
        locations: [
          ...(doc?.hasPage ? [{title: doc.title || 'Case note', href: `/work/${doc.slug}`}] : []),
          {title: 'Work', href: '/work'},
          ...(doc?.featured ? [{title: 'Home (case index)', href: '/'}] : []),
        ],
      }),
    }),
    post: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (doc) => ({
        locations: [
          {title: doc?.title || 'Note', href: `/notes/${doc?.slug}`},
          {title: 'Notes', href: '/notes'},
          {title: 'Home (notes journal)', href: '/'},
        ],
      }),
    }),
    jobListing: defineLocations({locations: [{title: 'Join', href: '/join'}]}),
    siteSettings: defineLocations({message: 'Used on every page (footer, closing, rates and the company details).', tone: 'positive'}),
  },
}
