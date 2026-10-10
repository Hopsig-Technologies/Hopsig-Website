// Phase 3 seed: content/*.json + content/pages/*.json -> Sanity documents (NDJSON).
//
//   node scripts/seed.mjs                 # writes audit/seed.ndjson and verifies it
//   pnpm --filter studio exec sanity dataset import ../audit/seed.ndjson development --replace
//
// Deterministic: same input, same _ids and _keys, so re-running and re-importing is safe (--replace).
// The verify step fails if any string in content/ did not make it into a document (see verify()).
import {createHash} from 'node:crypto'
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs'
import {resolve} from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const load = (p) => JSON.parse(readFileSync(resolve(ROOT, 'content', p), 'utf8'))

const caseStudies = load('case-studies.json')
const posts = load('posts.json')
const services = load('services.json')
const industries = load('industries.json')
const domains = load('domains.json')
const flowStages = load('flow-stages.json')
const workFilters = load('work-filters.json')
const navigation = load('navigation.json')
const page = (name) => load(`pages/${name}.json`)
const templates = load('pages/templates.json')
const settings = load('pages/siteSettings.json')
const panel = load('pages/engagementPanel.json')

// ---------------------------------------------------------------- keys, references, routes

let keyDoc = ''
let keyN = 0
const key = () => createHash('sha1').update(`${keyDoc}:${keyN++}`).digest('hex').slice(0, 12)
const withKey = (o) => ({_key: key(), ...o})
const ref = (id) => ({_type: 'reference', _ref: id})
const refItem = (id) => withKey(ref(id))

const caseBySource = Object.fromEntries(caseStudies.map((c) => [c.source, c]))
const ROUTE_TO_ID = {
  '/': 'homePage',
  '/services': 'servicesIndexPage',
  '/industries': 'industriesIndexPage',
  '/work': 'workIndexPage',
  '/notes': 'notesIndexPage',
  '/approach': 'approachPage',
  '/rates': 'ratesPage',
  '/book': 'bookPage',
  '/brief': 'briefPage',
  '/why-not-just-hire': 'comparePage',
  '/working-with-us': 'workingWithUsPage',
  '/ai-transformation': 'aiTransformationPage',
  '/agentic-flow': 'agenticFlowPage',
  '/for-agencies': 'agenciesPage',
  '/join': 'joinPage',
  '/privacy': 'privacyPage',
  '/terms': 'termsPage',
}
for (const s of services) ROUTE_TO_ID[s.route] = s._id
for (const i of industries) ROUTE_TO_ID[i.route] = i._id
for (const c of caseStudies) if (c.route) ROUTE_TO_ID[c.route] = c._id
for (const p of posts) if (p.route) ROUTE_TO_ID[p.route] = p._id

function link(route) {
  if (/^(https?:|mailto:)/.test(route)) return {_type: 'link', kind: 'external', href: route}
  const [path, anchor] = route.split('#')
  const out = {_type: 'link', kind: 'internal'}
  if (path) {
    const id = ROUTE_TO_ID[path]
    if (!id) throw new Error(`No document for route ${route}`)
    out.internal = ref(id)
  }
  if (anchor) out.anchor = anchor
  return out
}
const cta = (b) => withKey({_type: 'cta', label: b.label, link: link(b.route), variant: b.variant === 'chip' ? 'chip' : b.variant})
const ctaField = (b) => {
  const {_key, ...rest} = cta(b)
  return rest
}

// ---------------------------------------------------------------- strings and Portable Text

/** Plain fields: <br> -> newline, placeholder spans -> their text, no other markup expected. */
function plain(s) {
  if (s == null) return s
  const out = s.replace(/<br\s*\/?>/g, '\n').replace(/<span class="phx">(.*?)<\/span>/g, '$1')
  if (/<[a-z]/i.test(out)) throw new Error(`Markup left in a plain field: ${out}`)
  return out
}
const plainList = (xs) => xs.map(plain)

/** Inline HTML (<b>, <i>, <a href>, placeholder spans) -> one Portable Text block. */
function block(html, style = 'normal', extra = {}) {
  html = html.replace(/<span class="phx">(.*?)<\/span>/g, '$1').replace(/<br\s*\/?>/g, '\n')
  const children = []
  const markDefs = []
  const marks = []
  const re = /<(\/?)(b|i|a)([^>]*)>/g
  let last = 0
  let m
  const push = (text) => {
    if (text) children.push({_type: 'span', _key: key(), text, marks: [...marks]})
  }
  while ((m = re.exec(html))) {
    push(html.slice(last, m.index))
    last = re.lastIndex
    const [, close, tag, attrs] = m
    if (close) {
      marks.pop()
    } else if (tag === 'a') {
      const href = /href="([^"]*)"/.exec(attrs)[1]
      const def = {_type: 'link', _key: key(), ...link(href)}
      markDefs.push(def)
      marks.push(def._key)
    } else {
      marks.push(tag === 'b' ? 'strong' : 'em')
    }
  }
  push(html.slice(last))
  if (/<[a-z]/i.test(children.map((c) => c.text).join(''))) throw new Error(`Unconverted markup: ${html}`)
  return {_type: 'block', _key: key(), style, markDefs, children: children.length ? children : [{_type: 'span', _key: key(), text: '', marks: []}], ...extra}
}
const richInline = (html) => [block(html)]

function richBodyFromPost(body) {
  const out = []
  for (const b of body) {
    if (b.type === 'p') out.push(block(b.text))
    else if (b.type === 'h2') out.push(block(b.text, 'h2'))
    else if (b.type === 'pq') out.push(block(b.text, 'blockquote'))
    else if (b.type === 'ol') for (const item of b.items) out.push(block(item, 'normal', {listItem: 'number', level: 1}))
    else throw new Error(`Unknown body block ${b.type}`)
  }
  return out
}

function richBodyFromLegal(body) {
  const out = []
  for (const b of body) {
    if (b.p !== undefined) out.push(block(b.p))
    else if (b.ul) for (const item of b.ul) out.push(block(item, 'normal', {listItem: 'bullet', level: 1}))
    else if (b.ol) for (const item of b.ol) out.push(block(item, 'normal', {listItem: 'number', level: 1}))
    else throw new Error(`Unknown legal block ${JSON.stringify(b)}`)
  }
  return out
}

// ---------------------------------------------------------------- shared objects from page blocks

const head = (b, {aside = true} = {}) => {
  const h = {_type: 'sectionHead'}
  if (b.eyebrow) h.eyebrow = plain(b.eyebrow)
  if (b.title) h.title = plain(b.title)
  if (b.sub) h.sub = plain(b.sub)
  if (aside && b.aside?.length) {
    if (b.aside.length !== 1) throw new Error(`Section "${b.title}" has ${b.aside.length} aside lines; map them explicitly`)
    h.aside = plain(b.aside[0])
  }
  return h
}
const pageHero = (b) => {
  const h = {_type: 'pageHero', title: plain(b.title)}
  if (b.eyebrow) h.eyebrow = plain(b.eyebrow)
  if (b.sub) h.sub = plain(b.sub)
  if (b.buttons?.length) h.buttons = b.buttons.map(cta)
  if (b.facts?.length) h.facts = b.facts.map((f) => withKey({_type: 'fact', value: plain(f.value), label: plain(f.label)}))
  return h
}
const closing = (b) => {
  const c = {_type: 'closing', title: plain(b.title), showEmail: Boolean(b.emailLine)}
  if (b.eyebrow) c.eyebrow = plain(b.eyebrow)
  if (b.sub && b.sub !== settings.defaultClosing.sub) c.sub = plain(b.sub)
  if (b.buttons?.length) c.buttons = b.buttons.map(cta)
  if (b.emailLine && b.emailLine !== settings.defaultClosing.emailLine) throw new Error(`Non-default email line: ${b.emailLine}`)
  return c
}
const titleText = ([title, text]) => withKey({_type: 'titleText', title: plain(title), ...(text !== undefined ? {text: plain(text)} : {})})
const titleTextSection = (b) => {
  const rows = b.rows.filter(Array.isArray)
  if (!rows.every((r) => r.length === 2)) throw new Error(`Section "${b.title}" is not title/text rows`)
  return {_type: 'titleTextSection', head: head(b), items: rows.map(titleText)}
}
const stepsSection = (b) => ({
  _type: 'stepsSection',
  head: head(b),
  steps: b.rows.map(([when, title, text]) => withKey({_type: 'step', when: plain(when), title: plain(title), text: plain(text)})),
})
const faq = (b) => ({
  _type: 'faqSection',
  title: plain(b.title),
  items: b.items.map((i) => withKey({_type: 'faqItem', question: plain(i.q), answer: plain(i.a)})),
})
const dash = (s) => plain(s).replace(/^— /, '')
const caseRefs = (sources) => sources.map((s) => refItem(caseBySource[s]._id))

/** Blocks by kind/title so mappers read like the page. */
function blocksOf(name) {
  const blocks = page(name).blocks
  return {
    all: blocks,
    hero: () => blocks.find((b) => b.kind === 'hero'),
    closing: () => blocks.find((b) => b.kind === 'closing'),
    faq: () => blocks.find((b) => b.kind === 'faq'),
    title: (t) => {
      const b = blocks.find((x) => x.title === t)
      if (!b) throw new Error(`${name}: no block titled ${t}`)
      return b
    },
    id: (id) => blocks.find((x) => x.id === id),
    at: (i) => blocks[i],
  }
}

// ---------------------------------------------------------------- collections

const docs = []
const add = (doc) => {
  docs.push(doc)
  return doc
}
const begin = (id) => {
  keyDoc = id
  keyN = 0
}

for (const c of caseStudies) {
  begin(c._id)
  const d = {
    _id: c._id,
    _type: 'caseStudy',
    title: plain(c.title),
    slug: {_type: 'slug', current: c.slug.current},
    source: c.source,
    domain: plain(c.domain),
    problem: plain(c.problem),
    whatWeDid: plain(c.whatWeDid),
    measured: richInline(c.measured),
    stack: plainList(c.stack ?? []),
    shape: plain(c.shape),
    featured: Boolean(c.featured),
    order: c.order,
    hasPage: Boolean(c.hasPage),
  }
  if (c.filterDomain) d.filterDomain = c.filterDomain
  if (c.metric) d.metric = {...c.metric, value: plain(c.metric.value), label: plain(c.metric.label)}
  add(d)
}

for (const p of posts) {
  begin(p._id)
  const d = {
    _id: p._id,
    _type: 'post',
    title: plain(p.title),
    slug: {_type: 'slug', current: p.slug.current},
    category: p.category,
    excerpt: plain(p.excerpt),
  }
  if (p.publishedAt) d.publishedAt = p.publishedAt
  if (p.body) d.body = richBodyFromPost(p.body)
  if (p.offer) d.offer = {title: plain(p.offer.title), text: plain(p.offer.text), link: link(p.offer.route), cta: plain(p.offer.cta)}
  if (p.closing) d.closing = plain(p.closing)
  add(d)
}

for (const s of services) {
  begin(s._id)
  add({
    _id: s._id,
    _type: 'service',
    n: s.n,
    name: plain(s.name),
    slug: {_type: 'slug', current: s._id},
    oneLiner: plain(s.oneLiner),
    description: plain(s.description),
    tiles: s.tiles.map((t) => withKey({_type: 'tile', title: plain(t.k), text: plain(t.v)})),
    goodFor: plainList(s.goodFor),
    stack: plainList(s.stack),
    shape: plain(s.shape),
    pageTitle: plain(s.pageTitle),
    gets: plainList(s.gets),
    sayNoWhen: plainList(s.sayNoWhen),
    steps: s.steps.map((st) => withKey({_type: 'step', when: plain(st.when), title: plain(st.what), text: plain(st.text)})),
    record: caseRefs(s.record),
    faq: s.faq.map((f) => withKey({_type: 'faqItem', question: plain(f.q), answer: plain(f.a)})),
    closing: plain(s.closing),
  })
}

for (const i of industries) {
  begin(i._id)
  add({
    _id: i._id,
    _type: 'industry',
    n: i.n,
    name: plain(i.name),
    slug: {_type: 'slug', current: i._id},
    short: plain(i.short),
    title: plain(i.title),
    sub: plain(i.sub),
    facts: i.facts.map((f) => withKey({_type: 'fact', value: plain(f.value), label: plain(f.label)})),
    record: caseRefs(i.record),
    fullCards: i.lead,
    asks: i.asks.map(([title, text]) => titleText([title, text])),
    services: i.services.map(([n, text]) => withKey({_type: 'serviceFit', service: ref(services[n]._id), text: plain(text)})),
    close: plain(i.close),
  })
}

// ---------------------------------------------------------------- site singletons

begin('siteSettings')
{
  const d = {_id: 'siteSettings', _type: 'siteSettings'}
  for (const [name, v] of Object.entries(settings.values)) {
    if (v.value !== null) throw new Error(`siteSettings.${name} has a value; the seed only carries placeholders`)
  }
  d.footer = {tagline: settings.footer.tagline, legalLeft: settings.footer.legalLeft, legalRight: settings.footer.legalRight}
  d.defaultClosing = {...settings.defaultClosing}
  const cap = blocksOf('homePage').title('What we work in.')
  const half = (row) => row.slice(0, row.length / 2) // the marquee rows are doubled for the loop
  d.capabilities = {
    title: plain(cap.title),
    aside: plain(cap.aside[0]),
    rowOne: plainList(half(cap.rows[0])),
    rowTwo: plainList(half(cap.rows[1])),
    note: plain(cap.rows[2][0]),
  }
  add(d)
}

begin('navigation')
{
  const navLink = (l) => withKey({_type: 'navLink', label: plain(l.label), ...(l.desc ? {desc: plain(l.desc)} : {}), link: link(l.route)})
  add({
    _id: 'navigation',
    _type: 'navigation',
    primary: navigation.primary.map((p) =>
      withKey({
        _type: 'navItem',
        label: plain(p.label),
        link: link(p.route),
        ...(p.children ? {children: p.children.map(navLink)} : {}),
        ...(p.menuFooter ? {menuFooter: p.menuFooter.map((m) => cta({...m, variant: 'link'}))} : {}),
      }),
    ),
    cta: ctaField({...navigation.cta, variant: 'lime'}),
    footer: Object.entries(navigation.footer).map(([title, links]) => withKey({_type: 'footerColumn', title, links: links.map(navLink)})),
  })
}

begin('detailTemplates')
{
  const d = {_id: 'detailTemplates', _type: 'detailTemplates'}
  for (const [group, values] of Object.entries(templates)) {
    if (group.startsWith('_') || group === 'buildNotes') continue
    d[group] = {...values}
  }
  add(d)
}

begin('engagementPanel')
add({_id: 'engagementPanel', _type: 'engagementPanel', lines: panel.rows.map((cells) => withKey({_type: 'panelLine', cells: plainList(cells)}))})

// ---------------------------------------------------------------- page singletons

const singleton = (type, fields) => {
  begin(type)
  return add({_id: type, _type: type, ...fields()})
}

singleton('homePage', () => {
  const B = blocksOf('homePage')
  const hero = B.id('hero').rows
  const [eyebrow, title, sub] = hero[0]
  const beats = hero.filter((r) => Array.isArray(r) && r.length === 3).slice(1)
  const svc = B.id('svc')
  const t = svc.templateText
  const cidx = B.id('cidx')
  const mid = B.at(3)
  const rec = B.id('record')
  const notes = B.id('notes')
  return {
    hero: {
      eyebrow: plain(eyebrow),
      title: plain(title),
      sub: plain(sub),
      buttons: [cta(hero[1].button), cta({label: hero[2][0], route: '/work', variant: 'outline'})],
      facts: plainList(hero[3]),
      beats: beats.map(([when, t2, text]) => withKey({_type: 'step', when, title: t2, text})),
      scrollHint: plain(hero[hero.length - 1][0]),
    },
    domains: domains.map((d) => withKey({_type: 'domain', name: plain(d.name), text: plain(d.text), lead: ref(caseBySource[d.lead]._id)})),
    services: {
      head: head(svc),
      scrollHint: t[0],
      detailsLabel: t[1],
      goodForLabel: t[2],
      stackLabel: t[3],
      engagementLabel: t[4],
      fromLabel: t[5],
      closingLabel: t[6],
      closingLinks: [cta({label: t[7], route: '/services', variant: 'link'}), cta({label: t[8], route: '/rates', variant: 'link'})],
    },
    caseIndex: {
      head: head(cidx),
      cases: caseRefs(cidx.rows[0].refs),
      filters: workFilters.map((f) => withKey({_type: 'filterChip', key: f.key, label: plain(f.label)})),
      problemLabel: cidx.templateText[0],
      whatWeDidLabel: cidx.templateText[1],
      measuredLabel: cidx.templateText[2],
      pageLink: cidx.templateText[3],
      askLink: cidx.templateText[4],
      allLink: ctaField({label: cidx.templateText[5], route: '/work', variant: 'link'}),
    },
    midCta: {text: plain(mid.rows[0][0]), button: ctaField(mid.rows[1].button)},
    why: titleTextSection(B.title('Why Hopsig.')),
    record: {
      head: head(rec, {aside: false}),
      link: ctaField({label: rec.aside[0], route: '/work', variant: 'link'}),
      stats: rec.rows.slice(0, 4).map(([value, label]) => withKey({_type: 'fact', value: plain(value), label: plain(label)})),
      strip: plainList(rec.rows[4]),
    },
    notes: {
      head: head(notes),
      countLine: notes.templateText[0],
      latestLabel: notes.templateText[1],
      readLabel: notes.templateText[2],
      moreTitle: notes.templateText[3],
      allLink: ctaField({label: notes.templateText[4], route: '/notes', variant: 'link'}),
    },
    closing: closing(B.closing()),
  }
})

singleton('servicesIndexPage', () => {
  const B = blocksOf('servicesIndexPage')
  const modes = B.all.filter((b) => ['embedded', 'built', 'data'].includes(b.id))
  return {
    hero: pageHero(B.hero()),
    modes: modes.map((b) => {
      const a = b.aside
      const g = a.indexOf('Good for')
      const priced = b.rows.find((r) => Array.isArray(r) && r[0] === 'Priced')
      const btn = b.rows.find((r) => r.button).button
      return withKey({
        _type: 'engagementMode',
        anchor: b.id,
        head: head(b, {aside: false}),
        getsTitle: a[0],
        gets: plainList(a.slice(1, g)),
        goodForTitle: a[g],
        goodFor: a.slice(g + 1).map(dash),
        priceLabel: priced[0],
        priceTitle: plain(priced[1]),
        priceDetail: plain(priced[2]),
        link: ctaField(btn),
      })
    }),
    detail: {head: head(B.title('Eight things we do, in detail.'))},
    inside: titleTextSection(B.title('Inside every engagement.')),
    howItRuns: (() => {
      const b = B.title('How an engagement runs.')
      const {head: h, steps} = stepsSection({...b, aside: []})
      // The aside is a link to the home scroll sequence (reference: services/index.html -> index.html).
      return {head: h, link: ctaField({label: b.aside[0], route: '/', variant: 'link'}), steps}
    })(),
    closing: closing(B.closing()),
  }
})

singleton('industriesIndexPage', () => {
  const B = blocksOf('industriesIndexPage')
  return {hero: pageHero(B.hero()), list: {head: head(B.title('Where we have done this before.'))}, closing: closing(B.closing())}
})

singleton('workIndexPage', () => {
  const B = blocksOf('workIndexPage')
  const sel = B.title('Selected.')
  const rep = B.title('Measured before we claim it improved.')
  return {
    hero: pageHero(B.hero()),
    selected: {
      head: head(sel),
      cases: caseRefs(sel.rows[0].refs.slice(0, 12)),
      restTitle: sel.templateText[7],
      restAside: sel.templateText[8],
    },
    reporting: {head: head(rep, {aside: false}), points: plainList(rep.aside)},
    closing: closing(B.closing()),
  }
})

singleton('notesIndexPage', () => {
  const B = blocksOf('notesIndexPage')
  const list = B.title('All notes.')
  // The aside is the category chips, derived from the posts; only the title is page copy.
  return {
    hero: pageHero(B.hero()),
    list: {head: head(list, {aside: false}), readLabel: list.templateText[0], draftLabel: list.templateText[2]},
    closing: closing(B.closing()),
  }
})

singleton('approachPage', () => {
  const B = blocksOf('approachPage')
  const hours = B.title('Where we are, when we are.')
  return {
    hero: pageHero(B.hero()),
    staffing: titleTextSection(B.title('How we staff an account.')),
    agentic: (() => {
      const b = B.all[2]
      const links = b.aside.filter((x) => x.endsWith(' →'))
      const routes = {'The flow →': '/agentic-flow', 'The six-week offer →': '/ai-transformation'}
      return {
        head: head(b, {aside: false}),
        tags: plainList(b.aside.filter((x) => !x.endsWith(' →'))),
        links: links.map((label) => cta({label, route: routes[label], variant: 'link'})),
        items: b.rows.map(titleText),
      }
    })(),
    hours: {
      head: head(hours),
      zones: hours.rows.slice(0, 3).map((r) => plain(r[0])),
      paragraphs: plainList(hours.rows[3]),
    },
    closing: closing(B.closing()),
  }
})

const estimator = (b) => {
  const r = b.rows
  const [days, , total, , foot] = r[4]
  return {
    _type: 'estimator',
    title: plain(r[0][0]),
    sub: plain(r[0][1]),
    engineersLabel: plain(r[1][0]),
    monthsLabel: plain(r[2][0]),
    note: richInline(r[3][0]),
    daysLabel: plain(days),
    totalLabel: plain(total),
    footnotes: plainList(foot.split('\n')),
  }
}

singleton('ratesPage', () => {
  const B = blocksOf('ratesPage')
  const rows = B.all[1].rows
  const cards = []
  for (const r of rows) {
    if (Array.isArray(r) && r.length === 3) {
      const [price, unit] = r[1].split('\n')
      cards.push({_type: 'rateCard', name: plain(r[0]), price: plain(price), unit: plain(unit), meta: plain(r[2]), items: []})
    } else if (Array.isArray(r) && r[0] === 'Book a consult') {
      cards.at(-1).button = ctaField({label: r[0], route: '/book', variant: 'outline'})
    } else if (r.button) {
      cards.at(-1).button = ctaField(r.button)
      cards.at(-1).highlight = true
    } else {
      cards.at(-1).items.push(plain(r[0]))
    }
  }
  const terms = B.title('Terms.')
  return {
    hero: pageHero(B.hero()),
    cards: cards.map(withKey),
    estimator: estimator(B.id('est')),
    terms: {_type: 'labelValueSection', head: head(terms), rows: terms.rows.map(([label, value]) => withKey({_type: 'labelValue', label, value}))},
    faq: faq(B.faq()),
    closing: closing(B.closing()),
  }
})

const callPage = (name, form) => {
  const B = blocksOf(name)
  const h = B.hero()
  const rest = h.rest
  const steps = [0, 2, 4].map((i) => titleText([rest[i], rest[i + 1]]))
  return {
    hero: {eyebrow: plain(h.eyebrow), title: plain(h.title), sub: plain(h.sub)},
    steps,
    note: richInline(rest[6]),
    ...form(rest.slice(7), h.fieldPlaceholders),
    strip: plainList(B.all[1].rows[0]),
  }
}

singleton('bookPage', () =>
  callPage('bookPage', (r, ph) => ({
    calendar: {
      title: r[0],
      timezone: r[1],
      prompt: r[2],
      fieldPlaceholders: ph,
      submit: r[3],
      bookedLabel: r[4],
      bookedTitle: r[5],
      bookedText: r[6],
      checklist: r.slice(7),
    },
  })),
)

singleton('briefPage', () =>
  callPage('briefPage', (r, ph) => ({
    form: {
      title: r[0],
      duration: r[1],
      fieldPlaceholders: ph,
      problemLabel: r[2],
      whenLabel: r[3],
      whenOptions: r.slice(4, 7),
      budgetLabel: r[7],
      submit: r[8],
      receivedLabel: r[9],
      receivedTitle: r[10],
      receivedText: r[11],
      checklist: r.slice(12),
    },
  })),
)

singleton('comparePage', () => {
  const B = blocksOf('comparePage')
  const tableHead = B.title('Four ways to get the work done.')
  const table = B.all[2].rows
  return {
    hero: pageHero(B.hero()),
    table: {
      head: head(tableHead),
      columns: plainList(table[0]),
      rows: table.slice(1).map(([label, ...cells]) => withKey({_type: 'compareRow', label: plain(label), cells: plainList(cells)})),
    },
    estimator: estimator(B.id('est')),
    faq: faq(B.faq()),
    closing: closing(B.closing()),
  }
})

singleton('workingWithUsPage', () => {
  const B = blocksOf('workingWithUsPage')
  return {
    hero: pageHero(B.hero()),
    checks: titleTextSection(B.title('Everything a buyer checks.')),
    asks: titleTextSection(B.title('What we ask of you.')),
    closing: closing(B.closing()),
  }
})

singleton('aiTransformationPage', () => {
  const B = blocksOf('aiTransformationPage')
  const offer = B.title('What you get.')
  const rec = B.title('From the record.')
  const r = offer.rows
  return {
    hero: pageHero(B.hero()),
    offer: {
      head: head(offer, {aside: false}),
      gets: plainList(offer.aside.slice(0, -1)),
      priced: richInline(offer.aside.at(-1)),
      goodForTitle: r[0][0],
      goodFor: r[1].map(dash),
      sayNoTitle: r[2][0],
      sayNo: r[3].map(dash),
    },
    pipeline: titleTextSection(B.title('Six stages. A person signs every increment.')),
    weeks: stepsSection(B.title('How the six weeks run.')),
    measures: titleTextSection(B.title('What we measure.')),
    record: {
      head: head(rec, {aside: false}),
      cases: caseRefs(rec.rows[0].refs),
      allLink: ctaField({label: rec.aside[0], route: '/work', variant: 'link'}),
    },
    faq: faq(B.faq()),
    closing: closing(B.closing()),
  }
})

singleton('agenticFlowPage', () => {
  const B = blocksOf('agenticFlowPage')
  const flow = B.title('The flow.')
  const t = flow.templateText
  const agents = B.title('What the agents do.')
  const never = agents.rows.findIndex((x) => x[0] === 'What they never do.')
  const tool = B.title('Built on Claude Code. Runs on yours.')
  const where = tool.rows.find((x) => Array.isArray(x))
  return {
    hero: pageHero(B.hero()),
    flow: {
      head: head(flow),
      stages: flowStages.map((s) =>
        withKey({
          _type: 'flowStage',
          stage: s.stage,
          agent: s.agent,
          input: s.input,
          output: s.output,
          guardrail: s.guardrail,
          humanGate: s.humanGate,
          ...(s.humanNote ? {humanNote: s.humanNote} : {}),
        }),
      ),
      labels: {
        stage: t[0],
        input: t[1],
        output: t[2],
        guardrail: t[3],
        whoDecides: t[4],
        personSigns: t[5],
        noGate: t[6],
        runsAlone: t[7],
        briefIn: t[8],
        prOut: t[9],
      },
    },
    agents: {
      head: head(agents),
      does: agents.rows.slice(0, never).map((x) => plain(x[0])),
      neverTitle: agents.rows[never][0],
      neverAside: agents.rows[never][1],
      never: agents.rows.slice(never + 1).map((x) => plain(x[0])),
    },
    tooling: {
      head: head(tool, {aside: false}),
      tools: plainList(tool.aside),
      whereLabel: where[0],
      where: plainList(where.slice(1)),
      links: tool.rows.filter((x) => x.button).map((x) => cta(x.button)),
    },
    closing: closing(B.closing()),
  }
})

singleton('agenciesPage', () => {
  const B = blocksOf('agenciesPage')
  const gets = B.title('What you get.')
  const no = B.title('We will say no when')
  return {
    hero: pageHero(B.hero()),
    how: titleTextSection(B.title('How it works.')),
    gets: {_type: 'listSection', head: head(gets), items: gets.rows.map((x) => plain(x[0]))},
    sayNo: {_type: 'listSection', head: head(no), items: no.rows[0].map(dash)},
    faq: faq(B.faq()),
    closing: closing(B.closing()),
  }
})

singleton('joinPage', () => {
  const B = blocksOf('joinPage')
  const roles = B.title('Roles we hire for.')
  return {
    hero: pageHero(B.hero()),
    work: titleTextSection(B.title('What the work is like.')),
    vetting: titleTextSection(B.title('How we vet.')),
    roles: {
      head: head(roles),
      roles: roles.rows.filter((x) => x.length === 3).map(([title, text, status]) => withKey({_type: 'role', title, text, status})),
      payLine: plain(roles.rows.at(-1)[0]),
    },
    faq: faq(B.faq()),
    closing: closing(B.closing()),
  }
})

for (const name of ['privacyPage', 'termsPage']) {
  singleton(name, () => {
    const B = blocksOf(name)
    const legal = B.all.find((b) => b.kind === 'legal')
    return {
      hero: pageHero(B.hero()),
      sections: legal.sections.map((s) => withKey({_type: 'legalSection', heading: plain(s.heading), body: richBodyFromLegal(s.body)})),
      footnote: plain(legal.aside.join('\n')),
    }
  })
}

singleton('notFoundPage', () => ({closing: closing(blocksOf('notFoundPage').closing())}))

// ---------------------------------------------------------------- verify and write

function strings(o, skip = new Set()) {
  if (typeof o === 'string') return [o]
  // A Portable Text block reads as one string: the text of its spans joined.
  if (o && o._type === 'block' && Array.isArray(o.children)) return [o.children.map((c) => c.text).join('')]
  if (Array.isArray(o)) return o.flatMap((x) => strings(x, skip))
  if (o && typeof o === 'object') return Object.entries(o).flatMap(([k, v]) => (skip.has(k) ? [] : strings(v, skip)))
  return []
}
const norm = (s) => s.replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().replace(/^— /, '').replace(/ →$/, '')

/** Every string of content/ (minus routing data, prototype build notes and computed estimator outputs) must be
 *  found in a seeded document. Catches anything a mapper above forgot. */
function verify() {
  const seeded = docs
    .flatMap((d) => strings(d, new Set(['_key', '_type', '_ref', '_id'])))
    .map(norm)
    .join('\u0001')
  const SKIP = new Set(['route', 'reference', 'docTitle', 'kind', 'tone', 'id', 'variant', 'from', 'refs', 'component', 'buildNotes', 'svgText', '_note', 'usedOn', 'status', '_type', '_id', 'source', 'key', 'placeholder', 'type'])
  const COMPUTED = /^(\d+ engineers?|\d+ months|\d+ engineer-days|—)$/
  const missing = []
  const files = [
    'case-studies.json', 'posts.json', 'services.json', 'industries.json', 'domains.json', 'flow-stages.json', 'work-filters.json', 'navigation.json',
    ...['homePage', 'servicesIndexPage', 'industriesIndexPage', 'workIndexPage', 'notesIndexPage', 'approachPage', 'ratesPage', 'bookPage', 'briefPage', 'comparePage', 'workingWithUsPage', 'aiTransformationPage', 'agenticFlowPage', 'agenciesPage', 'joinPage', 'privacyPage', 'termsPage', 'notFoundPage', 'templates', 'siteSettings', 'engagementPanel'].map((n) => `pages/${n}.json`),
  ]
  for (const f of files) {
    for (const s of strings(load(f), SKIP)) {
      for (const part of s.split('\n')) {
        const n = norm(part)
        if (!n || COMPUTED.test(n) || /^\{.*\}$/.test(n)) continue
        if (!seeded.includes(n)) missing.push(`${f}: ${n.slice(0, 120)}`)
      }
    }
  }
  return [...new Set(missing)]
}

const missing = verify()
// Known, intended omissions: the notes-index category chips are derived from posts; the workIndex templateText
// pattern "{nn} · {domain}" lives in detailTemplates.
const allowed = missing.filter((m) => !/notesIndexPage\.json: (AI|Delivery|Measurement|Scope|Working together|…)$/.test(m))
if (allowed.length) {
  console.error(`${allowed.length} strings from content/ are not in any seeded document:`)
  for (const m of allowed) console.error('  ' + m)
  process.exit(1)
}

mkdirSync(resolve(ROOT, 'audit'), {recursive: true})
writeFileSync(resolve(ROOT, 'audit', 'seed.ndjson'), docs.map((d) => JSON.stringify(d)).join('\n') + '\n')
const byType = docs.reduce((a, d) => ({...a, [d._type]: (a[d._type] ?? 0) + 1}), {})
console.log(`${docs.length} documents -> audit/seed.ndjson`, byType)
console.log('verify: every content string is in a seeded document')
