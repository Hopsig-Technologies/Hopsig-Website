import type {StructureResolver} from 'sanity/structure'

/** Sidebar: the three collections, then Site settings. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Hopsig')
    .items([
      S.listItem()
        .id('work')
        .title('Case studies')
        .schemaType('caseStudy')
        .child(
          S.list()
            .title('Case studies')
            .items([
              S.listItem()
                .id('caseStudy-all')
                .title('All, in /work order')
                .child(S.documentTypeList('caseStudy').title('All case studies').defaultOrdering([{field: 'order', direction: 'asc'}])),
              S.listItem()
                .id('caseStudy-featured')
                .title('On the home page')
                .child(
                  S.documentList()
                    .title('Home case index')
                    .schemaType('caseStudy')
                    .filter('_type == "caseStudy" && featured == true')
                    .defaultOrdering([{field: 'featuredOrder', direction: 'asc'}]),
                ),
              S.listItem()
                .id('caseStudy-pages')
                .title('With their own page')
                .child(S.documentList().title('With a page').schemaType('caseStudy').filter('_type == "caseStudy" && hasPage == true')),
            ]),
        ),
      S.listItem()
        .id('notes')
        .title('Notes')
        .schemaType('post')
        .child(
          S.list()
            .title('Notes')
            .items([
              S.listItem()
                .id('post-published')
                .title('Published')
                .child(
                  S.documentList()
                    .title('Published')
                    .schemaType('post')
                    .filter('_type == "post" && defined(publishedAt)')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}]),
                ),
              S.listItem()
                .id('post-drafts')
                .title('Not yet published ([DRAFT])')
                .child(S.documentList().title('[DRAFT]').schemaType('post').filter('_type == "post" && !defined(publishedAt)')),
            ]),
        ),
      S.documentTypeListItem('jobListing')
        .title('Careers')
        .child(S.documentTypeList('jobListing').title('Roles').defaultOrdering([{field: 'order', direction: 'asc'}])),
      S.divider(),
      S.listItem()
        .id('siteSettings')
        .title('Site settings')
        .schemaType('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Site settings')),
    ])
