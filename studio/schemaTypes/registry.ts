/** One document each. The _id equals the type name, so the seed and the web queries can address them directly. */
export const PAGE_SINGLETONS = [
  {type: 'homePage', title: 'Home', route: '/'},
  {type: 'servicesIndexPage', title: 'Services', route: '/services'},
  {type: 'industriesIndexPage', title: 'Industries', route: '/industries'},
  {type: 'workIndexPage', title: 'Work', route: '/work'},
  {type: 'notesIndexPage', title: 'Notes', route: '/notes'},
  {type: 'approachPage', title: 'Approach', route: '/approach'},
  {type: 'ratesPage', title: 'Rates', route: '/rates'},
  {type: 'bookPage', title: 'Book a consult', route: '/book'},
  {type: 'briefPage', title: 'Send a brief', route: '/brief'},
  {type: 'comparePage', title: 'Why not just hire?', route: '/why-not-just-hire'},
  {type: 'workingWithUsPage', title: 'Working with us', route: '/working-with-us'},
  {type: 'aiTransformationPage', title: 'AI transformation', route: '/ai-transformation'},
  {type: 'agenticFlowPage', title: 'Agentic flow', route: '/agentic-flow'},
  {type: 'agenciesPage', title: 'For agencies', route: '/for-agencies'},
  {type: 'joinPage', title: 'Join', route: '/join'},
  {type: 'privacyPage', title: 'Privacy', route: '/privacy'},
  {type: 'termsPage', title: 'Terms', route: '/terms'},
  {type: 'notFoundPage', title: 'Not found (404)', route: null},
] as const

export const SITE_SINGLETONS = [
  {type: 'siteSettings', title: 'Site settings'},
  {type: 'navigation', title: 'Navigation'},
  {type: 'detailTemplates', title: 'Detail page wording'},
  {type: 'engagementPanel', title: 'Engagement panel'},
] as const

export const SINGLETON_TYPES = new Set<string>([
  ...PAGE_SINGLETONS.map((s) => s.type),
  ...SITE_SINGLETONS.map((s) => s.type),
])

/** Everything a link can point at: pages with a route, plus the routable collections. */
export const ROUTABLE_TYPES = [
  ...PAGE_SINGLETONS.filter((s) => s.route !== null).map((s) => s.type),
  'service',
  'industry',
  'caseStudy',
  'post',
]
