"""Content gate: the seed input is consistent, the reference's placeholders are known, and every visible string
and link on the 37 reference pages exists in the site's content (web/content + the Sanity seed).

    pnpm check:content        # = content_corpus.mjs + seed.mjs + this script
"""
import collections
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import check_links  # noqa: E402
import check_pages  # noqa: E402
from extract_pages import ROOT, ROUTES, SITE  # noqa: E402

PLACEHOLDER = re.compile(r'\[[A-Z][^\]\n<>"]{0,60}\]')
failures = []


def load(name):
    return json.load(open(os.path.join(ROOT, 'content', name), encoding='utf-8'))


def expect(cond, msg):
    print(('ok    ' if cond else 'FAIL  ') + msg)
    if not cond:
        failures.append(msg)


def main():
    cs = load('case-studies.json')
    expect(len(cs) == 32, '32 case studies')
    expect(sum(bool(c['featured']) for c in cs) == 8, '8 featured case studies')
    paged = [c for c in cs if c.get('hasPage')]
    expect(len(paged) == 3, '3 case studies with a page')
    expect(all(c['slug']['current'] == c['route'].rsplit('/', 1)[1] for c in paged), 'case-study slugs equal route slugs')
    expect(len({c['source'] for c in cs}) == 32, 'case-study record keys unique')
    expect(sorted(c['order'] for c in cs) == list(range(32)), 'case-study order is 0..31')
    expect(sorted(c['featuredOrder'] for c in cs if c['featured']) == list(range(8)), 'featured order is 0..7')

    posts = load('posts.json')
    expect(sum(p['publishedAt'] is not None for p in posts) == 2, '2 posts with publishedAt')
    expect(all((p['publishedAt'] is not None) == (p['status'] == 'published') for p in posts), 'publishedAt agrees with status')
    expect(all(p['offer']['route'].startswith('/') for p in posts if p.get('offer')), 'note offers link by path')

    jobs = load('job-listings.json')
    expect(len(jobs) == 5 and sorted(j['order'] for j in jobs) == list(range(5)), '5 roles, ordered 0..4')

    found = collections.defaultdict(set)
    for ref, route in ROUTES.items():
        for s in check_pages.visible(os.path.join(SITE, ref)):
            for m in PLACEHOLDER.findall(s):
                found[m].add(route)
    ph = load('placeholders.json')
    expect({k: sorted(v) for k, v in found.items()} == ph, f'placeholders.json matches the reference ({len(ph)} tokens)')

    print()
    expect(check_pages.main() == 0, 'coverage: every visible reference string is in the content')
    print()
    expect(check_links.main() == 0, 'links: every reference link has a matching label + destination')
    print(f'\n{len(failures)} failure(s)')
    return 1 if failures else 0


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.exit(main())
