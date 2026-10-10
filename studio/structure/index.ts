import type {StructureResolver} from 'sanity/structure'
import {PAGE_SINGLETONS, SITE_SINGLETONS} from '../schemaTypes/registry'

const singleton = (S: Parameters<StructureResolver>[0], type: string, title: string) =>
  S.listItem().id(type).title(title).schemaType(type).child(S.document().schemaType(type).documentId(type).title(title))

/** Sidebar: site-wide documents, the page singletons in navigation order, then the collections. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Hopsig')
    .items([
      S.listItem()
        .id('site')
        .title('Site')
        .child(S.list().title('Site').items(SITE_SINGLETONS.map((s) => singleton(S, s.type, s.title)))),
      S.listItem()
        .id('pages')
        .title('Pages')
        .child(S.list().title('Pages').items(PAGE_SINGLETONS.map((s) => singleton(S, s.type, s.title)))),
      S.divider(),
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
                .title('All, by order')
                .child(S.documentTypeList('caseStudy').title('All case studies').defaultOrdering([{field: 'order', direction: 'asc'}])),
              S.listItem()
                .id('caseStudy-featured')
                .title('Featured (home case index)')
                .child(S.documentList().title('Featured').schemaType('caseStudy').filter('_type == "caseStudy" && featured == true').defaultOrdering([{field: 'order', direction: 'asc'}])),
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
                .child(S.documentList().title('Published').schemaType('post').filter('_type == "post" && defined(publishedAt)').defaultOrdering([{field: 'publishedAt', direction: 'desc'}])),
              S.listItem()
                .id('post-drafts')
                .title('Not yet published ([DRAFT])')
                .child(S.documentList().title('[DRAFT]').schemaType('post').filter('_type == "post" && !defined(publishedAt)')),
            ]),
        ),
      S.documentTypeListItem('service').title('Services').child(S.documentTypeList('service').title('Services').defaultOrdering([{field: 'n', direction: 'asc'}])),
      S.documentTypeListItem('industry').title('Industries').child(S.documentTypeList('industry').title('Industries').defaultOrdering([{field: 'n', direction: 'asc'}])),
    ])
