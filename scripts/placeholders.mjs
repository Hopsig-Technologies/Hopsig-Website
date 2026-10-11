// Pre-deploy placeholder check (CLAUDE.md rule 1): the bracketed tokens still on the site.
//
//   node scripts/placeholders.mjs [dataset]      # default: development; run content_corpus.mjs first
//
// Site = static copy (audit/content-corpus.json) + the dataset's published documents. A site-wide token counts as
// resolved only when its Site settings field is filled. Fails if a token that content/placeholders.json expects
// has disappeared any other way (i.e. someone "filled it in" from a guess). New tokens are reported, not failed.
import {readdirSync, readFileSync} from 'node:fs'
import {resolve} from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const PROJECT = 'e1ib49ry'
const API = '2025-02-19'
const PLACEHOLDER = /\[[A-Z][^\]\n<>"]{0,60}\]/g
// Mirrors SITE_TOKENS in studio/schemaTypes/singletons/site.ts and web/lib/tokens.ts.
const SITE_TOKENS = {
  companyRegNo: '[COMPANY REG NO.]',
  year: '[YEAR]',
  email: '[HELLO@HOPSIG.COM]',
  legalForm: '[LEGAL FORM]',
  address: '[ADDRESS]',
  vatStatus: '[VAT / TAX STATUS]',
  bankCountry: '[BANK COUNTRY]',
  dayRate: '[YOUR RATE]',
  monthlyRetainer: '[MONTHLY]',
  agencyDiscount: '[AGENCY DISCOUNT]',
  insurance: '[INSURER · COVER AMOUNT]',
}
// Tokens that only ever lived in the prototype's build notes, which never render.
const BUILD_NOTE_ONLY = new Set(['[FORM ENDPOINT]', '[INBOX]'])
const NOT_COPY = new Set(['clientName', 'source', 'evidence'])

const dataset = process.argv[2] || 'development'
const corpus = JSON.parse(readFileSync(resolve(ROOT, 'audit', 'content-corpus.json'), 'utf8'))
const deviationsFile = JSON.parse(readFileSync(resolve(ROOT, 'content', 'deviations.json'), 'utf8'))
// Placeholders whose copy the owner removed (e.g. every rate token when rates came off the site): not expected.
const RETIRED = new Set(deviationsFile.retired_placeholders ?? [])
const expected = [
  ...Object.keys(JSON.parse(readFileSync(resolve(ROOT, 'content', 'placeholders.json'), 'utf8'))),
  // Placeholders the owner chose instead of invented reference content (content/deviations.json).
  ...JSON.parse(readFileSync(resolve(ROOT, 'content', 'deviations.json'), 'utf8')).added_placeholders,
  // v2 animation artboards: text drawn by the scene files themselves (healthcare: "BAA / DPA [TO CONFIRM]").
  '[TO CONFIRM]',
]

const q = (groq) => fetch(`https://${PROJECT}.apicdn.sanity.io/v${API}/data/query/${dataset}?query=${encodeURIComponent(groq)}`).then((r) => r.json()).then((r) => r.result)
const docs = await q('*[_type in ["caseStudy", "post", "jobListing"]]')
const settings = (await q('*[_id == "siteSettings"][0]')) ?? {}

const counts = new Map()
const count = (s, where) => {
  for (const t of s.match(PLACEHOLDER) ?? []) counts.set(t, [...(counts.get(t) ?? []), where])
}
for (const [file, {strings}] of Object.entries(corpus)) for (const s of strings) count(s, file)
const walk = (o, where) => {
  if (typeof o === 'string') count(o, where)
  else if (Array.isArray(o)) o.forEach((v) => walk(v, where))
  else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) if (!k.startsWith('_') && !NOT_COPY.has(k)) walk(v, where)
}
for (const d of docs) walk(d, `${d._type}:${d._id}`)
// Scene files draw their own artboard text (fictional product UI); a bracketed token there is a placeholder too.
const SCENES = resolve(ROOT, 'web', 'components', 'anim', 'scenes')
for (const f of readdirSync(SCENES).filter((f) => f.endsWith('.js'))) {
  for (const lit of readFileSync(resolve(SCENES, f), 'utf8').match(/'(?:[^'\\\n]|\\.)*'/g) ?? []) count(lit.slice(1, -1), `scene:${f}`)
}
// The join page renders [STATUS] for every role without a status.
const unsetRoles = docs.filter((d) => d._type === 'jobListing' && !d.status)
if (unsetRoles.length) counts.set('[STATUS]', [...(counts.get('[STATUS]') ?? []), ...unsetRoles.map((d) => `jobListing:${d._id}`)])

const resolved = new Set(Object.entries(SITE_TOKENS).filter(([k]) => settings[k] !== undefined && settings[k] !== null && settings[k] !== '').map(([, t]) => t))
for (const t of resolved) counts.delete(t)

const present = new Set(counts.keys())
const missing = expected.filter((t) => !present.has(t) && !resolved.has(t) && !BUILD_NOTE_ONLY.has(t) && !RETIRED.has(t))
const extra = [...present].filter((t) => !expected.includes(t))

console.log(`${present.size} placeholder tokens still on the site (${dataset}); ${resolved.size} resolved in Site settings`)
for (const [t, where] of [...counts].sort((a, b) => b[1].length - a[1].length)) console.log(`  ${t}  ×${where.length}  ${[...new Set(where)].slice(0, 3).join(', ')}${where.length > 3 ? ', …' : ''}`)
if (extra.length) console.log(`new tokens (fine if intended): ${extra.join(', ')}`)
if (missing.length) {
  console.error(`\nFAIL: expected tokens no longer present and not resolved in Site settings — were they filled from a guess? ${missing.join(', ')}`)
  process.exit(1)
}
console.log('\nok: no expected placeholder has disappeared')
