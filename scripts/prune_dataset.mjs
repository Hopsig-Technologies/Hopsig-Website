// Delete every document whose type is no longer in the schema (the P0 pivot), drafts included.
//
//   node scripts/prune_dataset.mjs [dataset]        # default: development; prints what it deletes
//
// Run AFTER importing the new seed with --replace: the kept documents' references to the removed types are
// rewritten by that import first, so nothing blocks the delete. Needs a token with write access: SANITY_AUTH_TOKEN,
// or the Sanity CLI's own login (~/.config/sanity/config.json). Never commits anything.
import {readFileSync} from 'node:fs'
import {homedir} from 'node:os'
import {resolve} from 'node:path'

const PROJECT = 'e1ib49ry'
const API = '2025-02-19'
const GONE = [
  'service', 'industry', 'navigation', 'detailTemplates', 'engagementPanel',
  'homePage', 'servicesIndexPage', 'industriesIndexPage', 'workIndexPage', 'notesIndexPage', 'approachPage', 'ratesPage',
  'bookPage', 'briefPage', 'comparePage', 'workingWithUsPage', 'aiTransformationPage', 'agenticFlowPage', 'agenciesPage',
  'joinPage', 'privacyPage', 'termsPage', 'notFoundPage',
]

const dataset = process.argv[2] || 'development'
const token = process.env.SANITY_AUTH_TOKEN || JSON.parse(readFileSync(resolve(homedir(), '.config', 'sanity', 'config.json'), 'utf8')).authToken
if (!token) throw new Error('No Sanity token: set SANITY_AUTH_TOKEN or run `sanity login`')
const headers = {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'}
const base = `https://${PROJECT}.api.sanity.io/v${API}/data`

const q = new URLSearchParams({query: '*[_type in $gone]._id', $gone: JSON.stringify(GONE), perspective: 'raw'})
const ids = (await (await fetch(`${base}/query/${dataset}?${q}`, {headers})).json()).result
if (!ids.length) {
  console.log(`${dataset}: nothing to prune`)
  process.exit(0)
}
const res = await fetch(`${base}/mutate/${dataset}?returnIds=true`, {
  method: 'POST',
  headers,
  body: JSON.stringify({mutations: ids.map((id) => ({delete: {id}}))}),
})
const out = await res.json()
if (!res.ok) {
  console.error(out)
  process.exit(1)
}
console.log(`${dataset}: deleted ${ids.length} documents of removed types (${ids.filter((i) => i.startsWith('drafts.')).length} drafts)`)
