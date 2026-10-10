"""Dataset gate: the seeded dataset has what the site expects.

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
KEPT = ['caseStudy', 'post', 'jobListing', 'siteSettings']
NOT_COPY = {'clientName', 'source', 'evidence', '_id', '_type', '_key', '_ref', '_rev', '_createdAt', '_updatedAt'}


def query(dataset, groq, params=None):
    qs = {'query': groq}
    for k, v in (params or {}).items():
        qs['$' + k] = json.dumps(v)
    url = f'https://{PROJECT}.apicdn.sanity.io/v{API}/data/query/{dataset}?' + urllib.parse.urlencode(qs)
    with urllib.request.urlopen(url, timeout=60) as r:
        return json.load(r)['result']


failures = []


def expect(cond, msg):
    print(('ok    ' if cond else 'FAIL  ') + msg)
    if not cond:
        failures.append(msg)


def strings(o, out):
    if isinstance(o, str):
        out.append(o)
    elif isinstance(o, list):
        for x in o:
            strings(x, out)
    elif isinstance(o, dict):
        for k, v in o.items():
            if k not in NOT_COPY:
                strings(v, out)


def main():
    dataset = sys.argv[1] if len(sys.argv) > 1 else 'development'
    print(f'dataset: {dataset}')
    counts = query(dataset, '''{
      "cases": count(*[_type == "caseStudy"]),
      "featured": count(*[_type == "caseStudy" && featured == true]),
      "pages": count(*[_type == "caseStudy" && hasPage == true]),
      "published": count(*[_type == "post" && defined(publishedAt)]),
      "posts": count(*[_type == "post"]),
      "jobs": count(*[_type == "jobListing"]),
      "gone": count(*[!(_type in $kept) && !(_type match "sanity.*") && !(_type match "system.*")]),
      "settings": defined(*[_id == "siteSettings"][0])
    }''', {'kept': KEPT})
    expect(counts['cases'] == 32, f"32 case studies ({counts['cases']})")
    expect(counts['featured'] == 8, f"8 featured ({counts['featured']})")
    expect(counts['pages'] == 3, f"3 with a page ({counts['pages']})")
    expect(counts['posts'] == 6 and counts['published'] == 2, f"6 notes, 2 published ({counts['posts']}, {counts['published']})")
    expect(counts['jobs'] == 5, f"5 roles ({counts['jobs']})")
    expect(counts['gone'] == 0, f"no documents of removed types ({counts['gone']})")
    expect(counts['settings'] is True, 'siteSettings exists')

    # The orders the site renders, as seeded from the reference.
    home = query(dataset, '*[_type == "caseStudy" && featured == true] | order(featuredOrder asc).source')
    expect(home == ['F0', 'F1', 'F3', 'F5', 'F4', 'C1', 'F17', 'C10'], f'home case index in reference order {home}')
    work = query(dataset, '*[_type == "caseStudy"] | order(order asc)[0...12].source')
    expect(work == ['F0', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'C1', 'C0', 'C4', 'C10'], f'/work first 12 in reference order')
    orders = query(dataset, '*[_type == "caseStudy"].order')
    expect(sorted(orders) == list(range(32)), 'case-study order is 0..31 with no gaps')
    notes = query(dataset, '*[_type == "post" && defined(publishedAt)] | order(publishedAt desc).slug.current')
    expect(notes == ['superintelligence-is-not-on-your-roadmap', 'the-sow-is-the-pitch'], f'published notes, newest first {notes}')
    offers = query(dataset, '*[_type == "post" && defined(offer)].offer.href')
    expect(all(isinstance(h, str) and h.startswith('/') for h in offers), f'note offers link by path {offers}')

    docs = query(dataset, '*[_type in $kept]', {'kept': KEPT})
    ids = {d['_id'] for d in docs}
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
    expect(not dangling, f'no dangling references ({len(refs)} targets){" " + str(dangling) if dangling else ""}')

    found = set()
    for d in docs:
        out = []
        strings(d, out)
        for s in out:
            found.update(PLACEHOLDER.findall(s))
    expected = set()
    for f in ('case-studies.json', 'posts.json'):
        out = []
        strings(json.load(open(os.path.join(ROOT, 'content', f), encoding='utf-8')), out)
        for s in out:
            expected.update(PLACEHOLDER.findall(s))
    expect(found == expected, f'dataset placeholders match the seed input ({len(found)})'
           + (f' missing {sorted(expected - found)} extra {sorted(found - expected)}' if found != expected else ''))

    print(f'\n{len(failures)} failure(s)')
    return 1 if failures else 0


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.exit(main())
