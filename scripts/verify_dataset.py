"""Phase 3 gate: the seeded dataset has what the site expects.

    python scripts/verify_dataset.py [dataset]      # default: development

Reads published documents through the public API (the datasets are public; drafts are not visible, which is
the point: this is what the site will see).
"""
import json
import os
import re
import sys
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT = 'e1ib49ry'
API = '2025-02-19'
PLACEHOLDER = re.compile(r'\[[A-Z][^\]\n<>"]{0,60}\]')
SINGLETONS = ['siteSettings', 'navigation', 'detailTemplates', 'engagementPanel', 'homePage', 'servicesIndexPage',
              'industriesIndexPage', 'workIndexPage', 'notesIndexPage', 'approachPage', 'ratesPage', 'bookPage',
              'briefPage', 'comparePage', 'workingWithUsPage', 'aiTransformationPage', 'agenticFlowPage',
              'agenciesPage', 'joinPage', 'privacyPage', 'termsPage', 'notFoundPage']
# Tokens that only ever lived in prototype build notes, which are not seeded.
BUILD_NOTE_ONLY = {'[FORM ENDPOINT]', '[INBOX]'}
NOT_COPY = {'clientName', 'source', 'evidence', '_id', '_type', '_key', '_ref', '_rev', '_createdAt', '_updatedAt'}


def query(dataset, groq):
    url = f'https://{PROJECT}.apicdn.sanity.io/v{API}/data/query/{dataset}?' + urllib.parse.urlencode({'query': groq})
    with urllib.request.urlopen(url, timeout=60) as r:
        return json.load(r)['result']


failures = []


def expect(cond, msg):
    print(('ok    ' if cond else 'FAIL  ') + msg)
    if not cond:
        failures.append(msg)


def strings(o, out, path=''):
    if isinstance(o, str):
        out.append((path, o))
    elif isinstance(o, list):
        for x in o:
            strings(x, out, path)
    elif isinstance(o, dict):
        for k, v in o.items():
            if k not in NOT_COPY:
                strings(v, out, k)


def main():
    dataset = sys.argv[1] if len(sys.argv) > 1 else 'development'
    print(f'dataset: {dataset}')
    counts = query(dataset, '''{
      "cases": count(*[_type == "caseStudy"]),
      "featured": count(*[_type == "caseStudy" && featured]),
      "pages": count(*[_type == "caseStudy" && hasPage]),
      "published": count(*[_type == "post" && defined(publishedAt)]),
      "posts": count(*[_type == "post"]),
      "services": count(*[_type == "service"]),
      "industries": count(*[_type == "industry"])
    }''')
    expect(counts['cases'] == 32, f"32 case studies ({counts['cases']})")
    expect(counts['featured'] == 8, f"8 featured ({counts['featured']})")
    expect(counts['pages'] == 3, f"3 with a page ({counts['pages']})")
    expect(counts['posts'] == 6 and counts['published'] == 2, f"6 notes, 2 published ({counts['posts']}, {counts['published']})")
    expect(counts['services'] == 8, f"8 services ({counts['services']})")
    expect(counts['industries'] == 6, f"6 industries ({counts['industries']})")

    # The two queries the site will run (CLAUDE.md), against the ordered lists from Phase 2.
    home = query(dataset, '*[_id == "homePage"][0].caseIndex.cases[]->source')
    expect(home == ['F0', 'F1', 'F3', 'F5', 'F4', 'C1', 'F17', 'C10'], f'home case index in reference order {home}')
    work = query(dataset, '*[_id == "workIndexPage"][0].selected.cases[]->source')
    expect(len(work) == 12, f'/work selected: 12 cards ({len(work)})')
    notes = query(dataset, '*[_type == "post" && defined(publishedAt)] | order(publishedAt desc).slug.current')
    expect(notes == ['superintelligence-is-not-on-your-roadmap', 'the-sow-is-the-pitch'], f'published notes, newest first {notes}')

    docs = query(dataset, '*[!(_id in path("drafts.**")) && !(_type match "sanity.*") && !(_type match "system.*")]')
    ids = {d['_id'] for d in docs}
    expect(all(s in ids for s in SINGLETONS), f'all {len(SINGLETONS)} singletons exist')
    refs = set()

    def collect(o):
        if isinstance(o, dict):
            if '_ref' in o:
                refs.add(o['_ref'])
            for v in o.values():
                collect(v)
        elif isinstance(o, list):
            for v in o:
                collect(v)

    collect(docs)
    dangling = sorted(refs - ids)
    expect(not dangling, f'no dangling references ({len(refs)} targets checked){" " + str(dangling) if dangling else ""}')

    found = set()
    for d in docs:
        out = []
        strings(d, out)
        for _, s in out:
            found.update(PLACEHOLDER.findall(s))
    expected = set(json.load(open(os.path.join(ROOT, 'content', 'placeholders.json'), encoding='utf-8'))) - BUILD_NOTE_ONLY
    expect(found == expected, f'placeholders in the dataset match placeholders.json minus build-note tokens ({len(found)})'
           + (f' missing {sorted(expected - found)} extra {sorted(found - expected)}' if found != expected else ''))

    print(f'\n{len(failures)} failure(s)')
    return 1 if failures else 0


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.exit(main())
