"""Phase 0 gate: the bundle is consistent enough to seed Sanity from.

    python scripts/check_bundle.py

Checks the content JSON invariants the plan relies on, that placeholders.json matches the reference,
and runs check_pages.py (every visible string on every reference page exists in content/).
"""
import collections
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import check_pages  # noqa: E402
from extract_pages import PAGES, ROOT, ROUTES, SITE  # noqa: E402

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
    expect(len({c['source'] for c in cs}) == 32, 'case-study source keys unique')

    posts = load('posts.json')
    expect(sum(p['publishedAt'] is not None for p in posts) == 2, '2 posts with publishedAt')
    expect(all((p['publishedAt'] is not None) == (p['status'] == 'published') for p in posts), 'publishedAt agrees with status')

    for name in ('services.json', 'industries.json'):
        items = load(name)
        expect(all(i['_id'] == i['route'].rsplit('/', 1)[1] for i in items), name + ': _id equals route slug')

    nav = load('navigation.json')
    expect(all(isinstance(i, dict) and set(i) == {'label', 'route'} for col in nav['footer'].values() for i in col),
           'footer columns share one {label, route} shape')
    routes = set(ROUTES.values())
    links = [i['route'] for col in nav['footer'].values() for i in col]
    links += [c['route'] for p in nav['primary'] for c in p.get('children', []) + p.get('menuFooter', [])]
    expect(all(r in routes for r in links), 'every navigation route exists')

    for name in list(PAGES) + ['templates', 'siteSettings', 'engagementPanel']:
        expect(os.path.exists(os.path.join(ROOT, 'content', 'pages', name + '.json')), f'content/pages/{name}.json exists')

    found = collections.defaultdict(set)
    for ref, route in ROUTES.items():
        for s in check_pages.visible(os.path.join(SITE, ref)):
            for m in PLACEHOLDER.findall(s):
                found[m].add(route)
    ph = load('placeholders.json')
    expect({k: sorted(v) for k, v in found.items()} == ph, f'placeholders.json matches the reference ({len(ph)} tokens)')

    print()
    expect(check_pages.main() == 0, 'coverage: every visible reference string is in content/')
    print(f'\n{len(failures)} failure(s)')
    return 1 if failures else 0


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.exit(main())
