import {Badge, Box, Card, Flex, Heading, Spinner, Stack, Text, TextInput} from '@sanity/ui'
import {useEffect, useMemo, useState} from 'react'
import {useClient} from 'sanity'
import {IntentLink} from 'sanity/router'
import {SITE_TOKENS} from '../../schemaTypes/singletons/site'
import {PLACEHOLDER} from '../../schemaTypes/validation'

type Doc = {_id: string; _type: string; [key: string]: unknown}
type Hit = {token: string; docId: string; docType: string; title: string; path: string; draft: boolean}

/** Keys that never render on the site, so their tokens do not count. */
const SKIP_KEYS = new Set(['clientName', 'source', 'evidence', 'slug'])

function walk(value: unknown, path: string, out: {path: string; text: string}[]) {
  if (typeof value === 'string') {
    out.push({path, text: value})
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => walk(v, `${path}[${i}]`, out))
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith('_') || SKIP_KEYS.has(k)) continue // _id, _type, _key, _ref…: system values, never copy
      walk(v, path ? `${path}.${k}` : k, out)
    }
  }
}

function docTitle(d: Doc): string {
  for (const k of ['title', 'name', 'label']) if (typeof d[k] === 'string') return d[k] as string
  return d._type
}

/** Strip array indices and Portable Text internals so the path reads like the form: "faq.items.answer". */
const prettyPath = (p: string) => p.replace(/\[\d+\]/g, '').replace(/\.(children|text|markDefs)\b/g, '')

export function PlaceholdersTool() {
  const client = useClient({apiVersion: '2025-02-19'})
  const [docs, setDocs] = useState<Doc[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    let live = true
    client
      .withConfig({perspective: 'raw'})
      .fetch<Doc[]>('*[!(_id in path("_.**")) && !(_type match "sanity.*") && !(_type match "system.*")]')
      .then((d) => live && setDocs(d))
      .catch((e: Error) => live && setError(e.message))
    return () => {
      live = false
    }
  }, [client])

  const {hits, resolved} = useMemo(() => {
    if (!docs) return {hits: [] as Hit[], resolved: [] as string[]}
    // Prefer the draft over the published version when both exist: that is what an editor will publish next.
    const byId = new Map<string, Doc>()
    for (const d of docs) {
      const base = d._id.replace(/^drafts\./, '')
      if (d._id.startsWith('drafts.') || !byId.has(base)) byId.set(base, d)
    }
    const settings = byId.get('siteSettings')
    const done = SITE_TOKENS.filter((t) => settings && settings[t.name] !== undefined && settings[t.name] !== '').map((t) => t.token)
    const out: Hit[] = []
    for (const [base, d] of byId) {
      const strings: {path: string; text: string}[] = []
      walk(d, '', strings)
      for (const s of strings) {
        for (const token of new Set(s.text.match(PLACEHOLDER) ?? [])) {
          if (done.includes(token)) continue
          out.push({token, docId: base, docType: d._type, title: docTitle(d), path: prettyPath(s.path), draft: d._id.startsWith('drafts.')})
        }
      }
    }
    return {hits: out, resolved: done}
  }, [docs])

  const groups = useMemo(() => {
    const m = new Map<string, Hit[]>()
    for (const h of hits) {
      if (filter && !h.token.toLowerCase().includes(filter.toLowerCase())) continue
      m.set(h.token, [...(m.get(h.token) ?? []), h])
    }
    return [...m.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
  }, [hits, filter])

  if (error) return <Card padding={4} tone="critical"><Text>{error}</Text></Card>
  if (!docs) return <Flex padding={5} justify="center"><Spinner /></Flex>

  return (
    <Box padding={4} style={{maxWidth: 1100, margin: '0 auto'}}>
      <Stack gap={4}>
        <Heading size={2}>Placeholders</Heading>
        <Text muted size={1}>
          {groups.length} tokens, {hits.length} occurrences still on the site. Replace a token only with the real value — never a guess (rule 1).
          Site-wide values ({SITE_TOKENS.map((t) => t.token).join(', ')}) are filled once in Site settings.
          {resolved.length ? ` Resolved there: ${resolved.join(', ')}.` : ''}
        </Text>
        <TextInput placeholder="Filter tokens" value={filter} onChange={(e) => setFilter(e.currentTarget.value)} />
        {groups.map(([token, list]) => (
          <Card key={token} padding={3} radius={2} border>
            <Stack gap={3}>
              <Flex gap={2} align="center">
                <Text weight="semibold" style={{fontFamily: 'monospace'}}>{token}</Text>
                <Badge>{list.length}</Badge>
                {SITE_TOKENS.some((t) => t.token === token) ? <Badge tone="primary">Site settings</Badge> : null}
              </Flex>
              <Stack gap={2}>
                {list.map((h) => (
                  <Text key={`${h.docId}-${h.path}`} size={1}>
                    <IntentLink intent="edit" params={{id: h.docId, type: h.docType}}>{h.title}</IntentLink>
                    <span style={{opacity: 0.6}}> · {h.path}{h.draft ? ' · draft' : ''}</span>
                  </Text>
                ))}
              </Stack>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Box>
  )
}
