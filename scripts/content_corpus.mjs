// Every string and link in web/content, as JSON, for the Python checks (check_pages.py, check_links.py,
// placeholders.mjs). Node 24 runs the TypeScript modules directly (type stripping); the modules import nothing
// at runtime but their types, so no bundler is needed.
//
//   node scripts/content_corpus.mjs      # -> audit/content-corpus.json
import {mkdirSync, readdirSync, writeFileSync} from 'node:fs'
import {resolve, relative} from 'node:path'
import {pathToFileURL} from 'node:url'

const ROOT = resolve(import.meta.dirname, '..')
const DIR = resolve(ROOT, 'web', 'content')
const SKIP_FILES = new Set(['index.ts', 'types.ts', 'routes.ts'])

function* files(dir) {
  for (const e of readdirSync(dir, {withFileTypes: true})) {
    const p = resolve(dir, e.name)
    if (e.isDirectory()) yield* files(p)
    else if (e.name.endsWith('.ts') && !SKIP_FILES.has(e.name)) yield p
  }
}

/** Walk a value: collect every string, every {label, href} object, and every <a href> inside a rich string. */
function collect(value, out, parentKey = '') {
  if (typeof value === 'string') {
    out.strings.push(value)
    for (const m of value.matchAll(/<a href="([^"]*)">(.*?)<\/a>/g)) out.links.push({label: m[2], href: m[1], inline: true})
    return
  }
  if (Array.isArray(value)) {
    for (const v of value) collect(v, out, parentKey)
    return
  }
  if (value && typeof value === 'object') {
    if (typeof value.label === 'string' && typeof value.href === 'string') out.links.push({label: value.label, href: value.href})
    for (const [k, v] of Object.entries(value)) collect(v, out, k)
  }
}

const corpus = {}
for (const file of files(DIR)) {
  const mod = await import(pathToFileURL(file).href)
  const out = {strings: [], links: []}
  for (const v of Object.values(mod)) collect(v, out)
  corpus[relative(ROOT, file).replace(/\\/g, '/')] = out
}

mkdirSync(resolve(ROOT, 'audit'), {recursive: true})
writeFileSync(resolve(ROOT, 'audit', 'content-corpus.json'), JSON.stringify(corpus, null, 1) + '\n')
const n = Object.values(corpus).reduce((a, c) => a + c.strings.length, 0)
console.log(`${Object.keys(corpus).length} modules, ${n} strings -> audit/content-corpus.json`)
