// One-time conversion (P0 pivot): content/pages/*.json + the static collections -> typed TS modules in web/content.
//
//   node scripts/convert_content.mjs
//
// Also rewrites content/case-studies.json with the two orderings the site needs (`order` = position on /work,
// `featured` + `featuredOrder` = the home case index) and writes content/job-listings.json from the join roles.
// After it has run and the gate passes, the generated modules are the source of truth: edit them by hand.
// The verify step fails if any string in the converted files did not make it into a module.
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs'
import {resolve} from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const OUT = resolve(ROOT, 'web', 'content')
const load = (p) => JSON.parse(readFileSync(resolve(ROOT, 'content', p), 'utf8'))

const caseStudies = load('case-studies.json')
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

// ---------------------------------------------------------------- links and strings

const caseBySource = Object.fromEntries(caseStudies.map((c) => [c.source, c]))
let currentRoute = '/'

/** Reference route -> href string. Bare anchors become page-relative (`/services#embedded`). */
function link(route) {
  if (/^(https?:|mailto:)/.test(route)) return route
  if (route.startsWith('#')) return currentRoute + route
  return route
}
const cta = (b) => ({label: b.label, href: link(b.route), variant: b.variant === 'chip' ? 'chip' : b.variant})

/** Plain fields: <br> -> newline, placeholder spans -> their text, no other markup expected. */
function plain(s) {
  if (s == null) return s
  const out = s.replace(/<br\s*\/?>/g, '\n').replace(/<span class="phx">(.*?)<\/span>/g, '$1')
  if (/<[a-z]/i.test(out)) throw new Error(`Markup left in a plain field: ${out}`)
  return out
}
const plainList = (xs) => xs.map(plain)
/** Rich strings keep <b>, <i> and <a href>; placeholder spans and <br> are normalised. */
function rich(s) {
  const out = s.replace(/<span class="phx">(.*?)<\/span>/g, '$1').replace(/<br\s*\/?>/g, '\n')
  const left = out.replace(/<\/?(b|i)>|<a href="[^"]*">|<\/a>/g, '')
  if (/<[a-z]/i.test(left)) throw new Error(`Unexpected markup in a rich field: ${out}`)
  return out.replace(/<a href="(#[^"]*)"/g, (_, a) => `<a href="${link(a)}"`)
}
const legalBody = (body) =>
  body.map((b) => {
    if (b.p !== undefined) return {p: rich(b.p)}
    if (b.ul) return {ul: b.ul.map(rich)}
    if (b.ol) return {ol: b.ol.map(rich)}
    throw new Error(`Unknown legal block ${JSON.stringify(b)}`)
  })
const caseKeys = (sources) =>
  sources.map((s) => {
    if (!caseBySource[s]) throw new Error(`Unknown case-study key ${s}`)
    return s
  })

// ---------------------------------------------------------------- shared objects from page blocks

const head = (b, {aside = true} = {}) => {
  const h = {}
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
  const h = {title: plain(b.title)}
  if (b.eyebrow) h.eyebrow = plain(b.eyebrow)
  if (b.sub) h.sub = plain(b.sub)
  if (b.buttons?.length) h.buttons = b.buttons.map(cta)
  if (b.facts?.length) h.facts = b.facts.map((f) => ({value: plain(f.value), label: plain(f.label)}))
  return h
}
const closing = (b) => {
  const c = {title: plain(b.title), showEmail: Boolean(b.emailLine)}
  if (b.eyebrow) c.eyebrow = plain(b.eyebrow)
  if (b.sub && b.sub !== settings.defaultClosing.sub) c.sub = plain(b.sub)
  if (b.buttons?.length) c.buttons = b.buttons.map(cta)
  if (b.emailLine && b.emailLine !== settings.defaultClosing.emailLine) throw new Error(`Non-default email line: ${b.emailLine}`)
  return c
}
const titleText = ([title, text]) => ({title: plain(title), ...(text !== undefined ? {text: plain(text)} : {})})
const titleTextSection = (b) => {
  const rows = b.rows.filter(Array.isArray)
  if (!rows.every((r) => r.length === 2)) throw new Error(`Section "${b.title}" is not title/text rows`)
  return {head: head(b), items: rows.map(titleText)}
}
const stepsSection = (b) => ({head: head(b), steps: b.rows.map(([when, title, text]) => ({when: plain(when), title: plain(title), text: plain(text)}))})
const faq = (b) => ({title: plain(b.title), items: b.items.map((i) => ({question: plain(i.q), answer: plain(i.a)}))})
const dash = (s) => plain(s).replace(/^— /, '')

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

// ---------------------------------------------------------------- modules

const modules = [] // {file, exportName, typeName, value}
const emit = (file, exportName, typeName, value) => modules.push({file, exportName, typeName, value})

emit('services.ts', 'services', 'Service[]', services.map((s) => ({
  id: s._id,
  n: s.n,
  name: plain(s.name),
  oneLiner: plain(s.oneLiner),
  description: plain(s.description),
  tiles: s.tiles.map((t) => ({title: plain(t.k), text: plain(t.v)})),
  goodFor: plainList(s.goodFor),
  stack: plainList(s.stack),
  shape: plain(s.shape),
  pageTitle: plain(s.pageTitle),
  gets: plainList(s.gets),
  sayNoWhen: plainList(s.sayNoWhen),
  steps: s.steps.map((st) => ({when: plain(st.when), title: plain(st.what), text: plain(st.text)})),
  record: caseKeys(s.record),
  faq: s.faq.map((f) => ({question: plain(f.q), answer: plain(f.a)})),
  closing: plain(s.closing),
})))

emit('industries.ts', 'industries', 'Industry[]', industries.map((i) => ({
  id: i._id,
  n: i.n,
  name: plain(i.name),
  short: plain(i.short),
  title: plain(i.title),
  sub: plain(i.sub),
  facts: i.facts.map((f) => ({value: plain(f.value), label: plain(f.label)})),
  record: caseKeys(i.record),
  fullCards: i.lead,
  asks: i.asks.map(titleText),
  services: i.services.map(([n, text]) => ({service: services[n]._id, text: plain(text)})),
  close: plain(i.close),
})))

{
  const cap = blocksOf('homePage').title('What we work in.')
  const half = (row) => row.slice(0, row.length / 2) // the marquee rows are doubled for the loop
  emit('site.ts', 'site', 'Site', {
    footer: {...settings.footer},
    defaultClosing: {...settings.defaultClosing},
    capabilities: {
      title: plain(cap.title),
      aside: plain(cap.aside[0]),
      rowOne: plainList(half(cap.rows[0])),
      rowTwo: plainList(half(cap.rows[1])),
      note: plain(cap.rows[2][0]),
    },
  })
}

{
  const navLink = (l) => ({label: plain(l.label), ...(l.desc ? {desc: plain(l.desc)} : {}), href: link(l.route)})
  emit('navigation.ts', 'navigation', 'Navigation', {
    primary: navigation.primary.map((p) => ({
      label: plain(p.label),
      href: link(p.route),
      ...(p.children ? {children: p.children.map(navLink)} : {}),
      ...(p.menuFooter ? {menuFooter: p.menuFooter.map((m) => cta({...m, variant: 'link'}))} : {}),
    })),
    cta: cta({...navigation.cta, variant: 'lime'}),
    footer: Object.entries(navigation.footer).map(([title, links]) => ({title, links: links.map(navLink)})),
  })
}

emit('templates.ts', 'templates', 'Templates', Object.fromEntries(Object.entries(templates).filter(([g]) => !g.startsWith('_') && g !== 'buildNotes')))
emit('engagementPanel.ts', 'engagementPanel', 'EngagementPanel', {lines: panel.rows.map(plainList)})

// ---------------------------------------------------------------- pages

const pageModule = (name, typeName, fields) => {
  currentRoute = page(name).route
  emit(`pages/${name}.ts`, name, typeName, fields())
}

let homeOrder = []
pageModule('homePage', 'HomePage', () => {
  const B = blocksOf('homePage')
  const hero = B.id('hero').rows
  const [eyebrow, title, sub] = hero[0]
  const beats = hero.filter((r) => Array.isArray(r) && r.length === 3).slice(1)
  const svc = B.id('svc')
  const t = svc.templateText
  const cidx = B.id('cidx')
  homeOrder = cidx.rows[0].refs
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
      beats: beats.map(([when, t2, text]) => ({when, title: t2, text})),
      scrollHint: plain(hero[hero.length - 1][0]),
    },
    domains: domains.map((d) => ({name: plain(d.name), text: plain(d.text), lead: caseKeys([d.lead])[0]})),
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
      filters: workFilters.map((f) => ({key: f.key, label: plain(f.label)})),
      problemLabel: cidx.templateText[0],
      whatWeDidLabel: cidx.templateText[1],
      measuredLabel: cidx.templateText[2],
      pageLink: cidx.templateText[3],
      askLink: cidx.templateText[4],
      allLink: cta({label: cidx.templateText[5], route: '/work', variant: 'link'}),
    },
    midCta: {text: plain(mid.rows[0][0]), button: cta(mid.rows[1].button)},
    why: titleTextSection(B.title('Why Hopsig.')),
    record: {
      head: head(rec, {aside: false}),
      link: cta({label: rec.aside[0], route: '/work', variant: 'link'}),
      stats: rec.rows.slice(0, 4).map(([value, label]) => ({value: plain(value), label: plain(label)})),
      strip: plainList(rec.rows[4]),
    },
    notes: {
      head: head(notes),
      countLine: notes.templateText[0],
      latestLabel: notes.templateText[1],
      readLabel: notes.templateText[2],
      moreTitle: notes.templateText[3],
      allLink: cta({label: notes.templateText[4], route: '/notes', variant: 'link'}),
    },
    closing: closing(B.closing()),
  }
})

pageModule('servicesIndexPage', 'ServicesIndexPage', () => {
  const B = blocksOf('servicesIndexPage')
  const modes = B.all.filter((b) => ['embedded', 'built', 'data'].includes(b.id))
  return {
    hero: pageHero(B.hero()),
    modes: modes.map((b) => {
      const a = b.aside
      const g = a.indexOf('Good for')
      const priced = b.rows.find((r) => Array.isArray(r) && r[0] === 'Priced')
      const btn = b.rows.find((r) => r.button).button
      return {
        anchor: b.id,
        head: head(b, {aside: false}),
        getsTitle: a[0],
        gets: plainList(a.slice(1, g)),
        goodForTitle: a[g],
        goodFor: a.slice(g + 1).map(dash),
        priceLabel: priced[0],
        priceTitle: plain(priced[1]),
        priceDetail: plain(priced[2]),
        link: cta(btn),
      }
    }),
    detail: {head: head(B.title('Eight things we do, in detail.'))},
    inside: titleTextSection(B.title('Inside every engagement.')),
    howItRuns: (() => {
      const b = B.title('How an engagement runs.')
      const {head: h, steps} = stepsSection({...b, aside: []})
      // The aside is a link to the home scroll sequence (reference: services/index.html -> index.html).
      return {head: h, link: cta({label: b.aside[0], route: '/', variant: 'link'}), steps}
    })(),
    closing: closing(B.closing()),
  }
})

pageModule('industriesIndexPage', 'IndustriesIndexPage', () => {
  const B = blocksOf('industriesIndexPage')
  return {hero: pageHero(B.hero()), list: {head: head(B.title('Where we have done this before.'))}, closing: closing(B.closing())}
})

let workOrder = []
pageModule('workIndexPage', 'WorkIndexPage', () => {
  const B = blocksOf('workIndexPage')
  const sel = B.title('Selected.')
  const rep = B.title('Measured before we claim it improved.')
  workOrder = sel.rows[0].refs
  return {
    hero: pageHero(B.hero()),
    selected: {head: head(sel), fullCards: 12, restTitle: sel.templateText[7], restAside: sel.templateText[8]},
    reporting: {head: head(rep, {aside: false}), points: plainList(rep.aside)},
    closing: closing(B.closing()),
  }
})

pageModule('notesIndexPage', 'NotesIndexPage', () => {
  const B = blocksOf('notesIndexPage')
  const list = B.title('All notes.')
  // The aside is the category chips, derived from the posts; only the title is page copy.
  return {
    hero: pageHero(B.hero()),
    list: {head: head(list, {aside: false}), readLabel: list.templateText[0], draftLabel: list.templateText[2]},
    closing: closing(B.closing()),
  }
})

pageModule('approachPage', 'ApproachPage', () => {
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
    hours: {head: head(hours), zones: hours.rows.slice(0, 3).map((r) => plain(r[0])), paragraphs: plainList(hours.rows[3])},
    closing: closing(B.closing()),
  }
})

const estimator = (b) => {
  const r = b.rows
  const [days, , total, , foot] = r[4]
  return {
    title: plain(r[0][0]),
    sub: plain(r[0][1]),
    engineersLabel: plain(r[1][0]),
    monthsLabel: plain(r[2][0]),
    note: rich(r[3][0]),
    daysLabel: plain(days),
    totalLabel: plain(total),
    footnotes: plainList(foot.split('\n')),
  }
}

pageModule('ratesPage', 'RatesPage', () => {
  const B = blocksOf('ratesPage')
  const rows = B.all[1].rows
  const cards = []
  for (const r of rows) {
    if (Array.isArray(r) && r.length === 3) {
      const [price, unit] = r[1].split('\n')
      cards.push({name: plain(r[0]), price: plain(price), unit: plain(unit), meta: plain(r[2]), items: []})
    } else if (Array.isArray(r) && r[0] === 'Book a consult') {
      cards.at(-1).button = cta({label: r[0], route: '/book', variant: 'outline'})
    } else if (r.button) {
      cards.at(-1).button = cta(r.button)
      cards.at(-1).highlight = true
    } else {
      cards.at(-1).items.push(plain(r[0]))
    }
  }
  const terms = B.title('Terms.')
  return {
    hero: pageHero(B.hero()),
    cards,
    estimator: estimator(B.id('est')),
    terms: {head: head(terms), rows: terms.rows.map(([label, value]) => ({label, value}))},
    faq: faq(B.faq()),
    closing: closing(B.closing()),
  }
})

const callPage = (name, form) => {
  const B = blocksOf(name)
  const h = B.hero()
  const rest = h.rest
  return {
    hero: {eyebrow: plain(h.eyebrow), title: plain(h.title), sub: plain(h.sub)},
    steps: [0, 2, 4].map((i) => titleText([rest[i], rest[i + 1]])),
    note: rich(rest[6]),
    ...form(rest.slice(7), h.fieldPlaceholders),
    strip: plainList(B.all[1].rows[0]),
  }
}

pageModule('bookPage', 'BookPage', () =>
  callPage('bookPage', (r, ph) => ({
    calendar: {title: r[0], timezone: r[1], prompt: r[2], fieldPlaceholders: ph, submit: r[3], bookedLabel: r[4], bookedTitle: r[5], bookedText: r[6], checklist: r.slice(7)},
  })),
)

pageModule('briefPage', 'BriefPage', () =>
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

pageModule('comparePage', 'ComparePage', () => {
  const B = blocksOf('comparePage')
  const table = B.all[2].rows
  return {
    hero: pageHero(B.hero()),
    table: {
      head: head(B.title('Four ways to get the work done.')),
      columns: plainList(table[0]),
      rows: table.slice(1).map(([label, ...cells]) => ({label: plain(label), cells: plainList(cells)})),
    },
    estimator: estimator(B.id('est')),
    faq: faq(B.faq()),
    closing: closing(B.closing()),
  }
})

pageModule('workingWithUsPage', 'WorkingWithUsPage', () => {
  const B = blocksOf('workingWithUsPage')
  return {
    hero: pageHero(B.hero()),
    checks: titleTextSection(B.title('Everything a buyer checks.')),
    asks: titleTextSection(B.title('What we ask of you.')),
    closing: closing(B.closing()),
  }
})

pageModule('aiTransformationPage', 'AiTransformationPage', () => {
  const B = blocksOf('aiTransformationPage')
  const offer = B.title('What you get.')
  const rec = B.title('From the record.')
  const r = offer.rows
  return {
    hero: pageHero(B.hero()),
    offer: {
      head: head(offer, {aside: false}),
      gets: plainList(offer.aside.slice(0, -1)),
      priced: rich(offer.aside.at(-1)),
      goodForTitle: r[0][0],
      goodFor: r[1].map(dash),
      sayNoTitle: r[2][0],
      sayNo: r[3].map(dash),
    },
    pipeline: titleTextSection(B.title('Six stages. A person signs every increment.')),
    weeks: stepsSection(B.title('How the six weeks run.')),
    measures: titleTextSection(B.title('What we measure.')),
    record: {head: head(rec, {aside: false}), cases: caseKeys(rec.rows[0].refs), allLink: cta({label: rec.aside[0], route: '/work', variant: 'link'})},
    faq: faq(B.faq()),
    closing: closing(B.closing()),
  }
})

pageModule('agenticFlowPage', 'AgenticFlowPage', () => {
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
      stages: flowStages.map((s) => ({
        stage: s.stage,
        agent: s.agent,
        input: s.input,
        output: s.output,
        guardrail: s.guardrail,
        humanGate: s.humanGate,
        ...(s.humanNote ? {humanNote: s.humanNote} : {}),
      })),
      labels: {stage: t[0], input: t[1], output: t[2], guardrail: t[3], whoDecides: t[4], personSigns: t[5], noGate: t[6], runsAlone: t[7], briefIn: t[8], prOut: t[9]},
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

pageModule('agenciesPage', 'AgenciesPage', () => {
  const B = blocksOf('agenciesPage')
  const gets = B.title('What you get.')
  const no = B.title('We will say no when')
  return {
    hero: pageHero(B.hero()),
    how: titleTextSection(B.title('How it works.')),
    gets: {head: head(gets), items: gets.rows.map((x) => plain(x[0]))},
    sayNo: {head: head(no), items: no.rows[0].map(dash)},
    faq: faq(B.faq()),
    closing: closing(B.closing()),
  }
})

let roles = []
pageModule('joinPage', 'JoinPage', () => {
  const B = blocksOf('joinPage')
  const rb = B.title('Roles we hire for.')
  roles = rb.rows.filter((x) => x.length === 3).map(([title, text, status], i) => ({title, text, status: status === '[STATUS]' ? null : status, order: i}))
  return {
    hero: pageHero(B.hero()),
    work: titleTextSection(B.title('What the work is like.')),
    vetting: titleTextSection(B.title('How we vet.')),
    roles: {head: head(rb), statusPlaceholder: '[STATUS]', payLine: plain(rb.rows.at(-1)[0])},
    faq: faq(B.faq()),
    closing: closing(B.closing()),
  }
})

for (const name of ['privacyPage', 'termsPage']) {
  pageModule(name, 'LegalPage', () => {
    const B = blocksOf(name)
    const legal = B.all.find((b) => b.kind === 'legal')
    return {
      hero: pageHero(B.hero()),
      sections: legal.sections.map((s) => ({heading: plain(s.heading), body: legalBody(s.body)})),
      footnote: plain(legal.aside.join('\n')),
    }
  })
}

pageModule('notFoundPage', 'NotFoundPage', () => ({closing: closing(blocksOf('notFoundPage').closing())}))

// ---------------------------------------------------------------- verify

function strings(o, skip = new Set()) {
  if (typeof o === 'string') return [o]
  if (Array.isArray(o)) return o.flatMap((x) => strings(x, skip))
  if (o && typeof o === 'object') return Object.entries(o).flatMap(([k, v]) => (skip.has(k) ? [] : strings(v, skip)))
  return []
}
const norm = (s) => s.replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().replace(/^— /, '').replace(/ →$/, '')

/** Every string of the converted files (minus routing data, prototype build notes and computed estimator outputs)
 *  must be in a module or in job-listings; catches anything a mapper above forgot. */
function verify() {
  const emitted = [...modules.map((m) => m.value), roles].flatMap((v) => strings(v)).map(norm).join('\u0001')
  const SKIP = new Set(['route', 'reference', 'docTitle', 'kind', 'tone', 'id', 'variant', 'from', 'refs', 'component', 'buildNotes', 'svgText', '_note', 'usedOn', 'status', '_type', '_id', 'source', 'key', 'placeholder', 'type'])
  const COMPUTED = /^(\d+ engineers?|\d+ months|\d+ engineer-days|—)$/
  const files = [
    'services.json', 'industries.json', 'domains.json', 'flow-stages.json', 'work-filters.json', 'navigation.json',
    ...['homePage', 'servicesIndexPage', 'industriesIndexPage', 'workIndexPage', 'notesIndexPage', 'approachPage', 'ratesPage', 'bookPage', 'briefPage', 'comparePage', 'workingWithUsPage', 'aiTransformationPage', 'agenticFlowPage', 'agenciesPage', 'joinPage', 'privacyPage', 'termsPage', 'notFoundPage', 'templates', 'siteSettings', 'engagementPanel'].map((n) => `pages/${n}.json`),
  ]
  const missing = []
  for (const f of files) {
    for (const s of strings(load(f), SKIP)) {
      for (const part of s.split('\n')) {
        const n = norm(part)
        if (!n || COMPUTED.test(n) || /^\{.*\}$/.test(n)) continue
        if (!emitted.includes(n)) missing.push(`${f}: ${n.slice(0, 120)}`)
      }
    }
  }
  // Intended omissions: the notes-index category chips derive from posts; "…" is decoration.
  return [...new Set(missing)].filter((m) => !/notesIndexPage\.json: (AI|Delivery|Measurement|Scope|Working together|…)$/.test(m))
}

const missing = verify()
if (missing.length) {
  console.error(`${missing.length} strings from content/ are not in any module:`)
  for (const m of missing) console.error('  ' + m)
  process.exit(1)
}

// ---------------------------------------------------------------- write

const HEADER = `// Converted once from the approved prototype (reference/site) by scripts/convert_content.mjs on 2026-10-10.\n// This file is now the source of truth for this copy: edit it by hand. Bracketed [PLACEHOLDERS] stay until the\n// founders replace them (CLAUDE.md rule 1). Run \`pnpm check:content\` after editing.\n`
for (const m of modules) {
  const depth = m.file.includes('/') ? '../' : './'
  const typeImport = m.typeName.replace(/\[\]$/, '')
  const src = `${HEADER}import type { ${typeImport} } from "${depth}types";\n\nexport const ${m.exportName} = ${JSON.stringify(m.value, null, 2)} satisfies ${m.typeName};\n`
  const path = resolve(OUT, m.file)
  mkdirSync(resolve(path, '..'), {recursive: true})
  writeFileSync(path, src)
}

// Orderings into the seed input, so seed.mjs needs nothing from the deleted page JSON.
const byWork = new Map(workOrder.map((k, i) => [k, i]))
const byHome = new Map(homeOrder.map((k, i) => [k, i]))
if (byWork.size !== caseStudies.length) throw new Error(`/work order lists ${byWork.size} of ${caseStudies.length} case studies`)
for (const c of caseStudies) {
  c.order = byWork.get(c.source)
  c.featured = byHome.has(c.source)
  if (c.featured) c.featuredOrder = byHome.get(c.source)
  else delete c.featuredOrder
}
caseStudies.sort((a, b) => a.order - b.order)
writeFileSync(resolve(ROOT, 'content', 'case-studies.json'), JSON.stringify(caseStudies, null, 1) + '\n')
writeFileSync(resolve(ROOT, 'content', 'job-listings.json'), JSON.stringify(roles, null, 1) + '\n')

console.log(`${modules.length} modules -> web/content; ${roles.length} roles -> content/job-listings.json; case-studies.json re-ordered (work: ${byWork.size}, featured: ${byHome.size})`)
console.log('verify: every content string is in a module')
