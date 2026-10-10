// Seed: content/{case-studies,posts,job-listings}.json -> Sanity documents (NDJSON).
//
//   node scripts/seed.mjs [--with-settings]     # writes audit/seed.ndjson and verifies it
//   pnpm --filter studio exec sanity dataset import ../audit/seed.ndjson --dataset development --replace
//
// Deterministic: same input, same _ids and _keys, so re-running and re-importing is safe (--replace) for the
// collections. `--with-settings` also emits an EMPTY siteSettings document: never pass it against a dataset the
// founders have filled in, or their values are wiped. The verify step fails if any string in the input files did
// not make it into a document.
import {createHash} from 'node:crypto'
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs'
import {resolve} from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const load = (p) => JSON.parse(readFileSync(resolve(ROOT, 'content', p), 'utf8'))
const withSettings = process.argv.includes('--with-settings')

const caseStudies = load('case-studies.json')
const posts = load('posts.json')
const jobs = load('job-listings.json')

// ---------------------------------------------------------------- keys and strings

let keyDoc = ''
let keyN = 0
const key = () => createHash('sha1').update(`${keyDoc}:${keyN++}`).digest('hex').slice(0, 12)
const begin = (id) => {
  keyDoc = id
  keyN = 0
}

/** Plain fields: <br> -> newline, placeholder spans -> their text, no other markup expected. */
function plain(s) {
  if (s == null) return s
  const out = s.replace(/<br\s*\/?>/g, '\n').replace(/<span class="phx">(.*?)<\/span>/g, '$1')
  if (/<[a-z]/i.test(out)) throw new Error(`Markup left in a plain field: ${out}`)
  return out
}

/** Inline HTML (<b>, <i>, <a href>, placeholder spans) -> one Portable Text block. Links are {_type:'link', href}. */
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
      const def = {_type: 'link', _key: key(), href: /href="([^"]*)"/.exec(attrs)[1]}
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

function richBody(body) {
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

// ---------------------------------------------------------------- documents

const docs = []

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
    measured: [block(c.measured)],
    stack: (c.stack ?? []).map(plain),
    shape: plain(c.shape),
    order: c.order,
    featured: Boolean(c.featured),
    hasPage: Boolean(c.hasPage),
  }
  if (c.featured) d.featuredOrder = c.featuredOrder
  if (c.filterDomain) d.filterDomain = c.filterDomain
  if (c.metric) d.metric = {...c.metric, value: plain(c.metric.value), label: plain(c.metric.label)}
  docs.push(d)
}

for (const [i, p] of posts.entries()) {
  begin(p._id)
  const d = {
    _id: p._id,
    _type: 'post',
    title: plain(p.title),
    slug: {_type: 'slug', current: p.slug.current},
    category: p.category,
    excerpt: plain(p.excerpt),
    order: i,
  }
  if (p.publishedAt) d.publishedAt = p.publishedAt
  if (p.body) d.body = richBody(p.body)
  if (p.offer) d.offer = {title: plain(p.offer.title), text: plain(p.offer.text), href: p.offer.route, cta: plain(p.offer.cta)}
  if (p.closing) d.closing = plain(p.closing)
  docs.push(d)
}

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
for (const j of jobs) {
  const d = {_id: `job-${slugify(j.title)}`, _type: 'jobListing', title: plain(j.title), text: plain(j.text), order: j.order}
  if (j.status) d.status = j.status // empty = the site renders [STATUS]
  docs.push(d)
}

if (withSettings) docs.push({_id: 'siteSettings', _type: 'siteSettings'})

// ---------------------------------------------------------------- verify and write

function strings(o, skip = new Set()) {
  if (typeof o === 'string') return [o]
  if (o && o._type === 'block' && Array.isArray(o.children)) return [o.children.map((c) => c.text).join('')]
  if (Array.isArray(o)) return o.flatMap((x) => strings(x, skip))
  if (o && typeof o === 'object') return Object.entries(o).flatMap(([k, v]) => (skip.has(k) ? [] : strings(v, skip)))
  return []
}
const norm = (s) => s.replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()

const seeded = docs.flatMap((d) => strings(d, new Set(['_key', '_type', '_ref', '_id']))).map(norm).join('\u0001')
const SKIP = new Set(['route', 'status', '_type', '_id', 'type', 'source', 'filterDomain'])
const missing = []
for (const f of ['case-studies.json', 'posts.json', 'job-listings.json']) {
  for (const s of strings(load(f), SKIP)) {
    for (const part of s.split('\n')) {
      const n = norm(part)
      if (n && !seeded.includes(n)) missing.push(`${f}: ${n.slice(0, 120)}`)
    }
  }
}
if (missing.length) {
  console.error(`${missing.length} strings from content/ are not in any seeded document:`)
  for (const m of [...new Set(missing)]) console.error('  ' + m)
  process.exit(1)
}

mkdirSync(resolve(ROOT, 'audit'), {recursive: true})
writeFileSync(resolve(ROOT, 'audit', 'seed.ndjson'), docs.map((d) => JSON.stringify(d)).join('\n') + '\n')
const byType = docs.reduce((a, d) => ({...a, [d._type]: (a[d._type] ?? 0) + 1}), {})
console.log(`${docs.length} documents -> audit/seed.ndjson`, byType)
console.log('verify: every content string is in a seeded document')
