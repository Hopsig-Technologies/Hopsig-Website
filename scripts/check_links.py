"""Every link on every reference page must exist in the seed with the same label and destination.

    python scripts/check_links.py      # after node scripts/seed.mjs

Page-body links are compared against that page's singleton (buttons, CTAs, rich-text link annotations); header and
footer links against the navigation document. Detail pages (services, industries, case notes, notes) are skipped:
their links are generated from document references, not stored as links.
"""
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from extract_pages import ROOT, SITE, ROUTES, PAGES, Tree, inline_html, route_of  # noqa: E402

docs = [json.loads(l) for l in open(os.path.join(ROOT, 'audit', 'seed.ndjson'), encoding='utf-8')]
by_id = {d['_id']: d for d in docs}
SINGLETON_ROUTE = {'homePage': '/', 'servicesIndexPage': '/services', 'industriesIndexPage': '/industries',
                   'workIndexPage': '/work', 'notesIndexPage': '/notes', 'approachPage': '/approach', 'ratesPage': '/rates',
                   'bookPage': '/book', 'briefPage': '/brief', 'comparePage': '/why-not-just-hire',
                   'workingWithUsPage': '/working-with-us', 'aiTransformationPage': '/ai-transformation',
                   'agenticFlowPage': '/agentic-flow', 'agenciesPage': '/for-agencies', 'joinPage': '/join',
                   'privacyPage': '/privacy', 'termsPage': '/terms'}


def doc_route(doc_id):
    if doc_id in SINGLETON_ROUTE:
        return SINGLETON_ROUTE[doc_id]
    d = by_id[doc_id]
    base = {'service': '/services/', 'industry': '/industries/', 'caseStudy': '/work/', 'post': '/notes/'}[d['_type']]
    return base + d['slug']['current']


def resolve(link, page_route):
    if link.get('kind') == 'external':
        return link['href']
    path = doc_route(link['internal']['_ref']) if 'internal' in link else page_route
    return path + ('#' + link['anchor'] if link.get('anchor') else '')


def norm(label):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', label)).replace('→', '').strip().casefold()


def seeded_links(doc, page_route):
    """(label, route) for every cta / navLink / rich-text link in a document."""
    out = set()

    def walk(o):
        if isinstance(o, dict):
            if o.get('_type') in ('cta', 'navLink') and 'link' in o:
                out.add((norm(o['label']), resolve(o['link'], page_route)))
            if o.get('_type') == 'block':
                defs = {m['_key']: m for m in o.get('markDefs', [])}
                for span in o.get('children', []):
                    for mk in span.get('marks', []):
                        if mk in defs:
                            out.add((norm(span['text']), resolve(defs[mk], page_route)))
            for k, v in o.items():
                if k == 'cta' and isinstance(v, dict) and 'link' in v:  # navigation.cta, plain object
                    out.add((norm(v['label']), resolve(v['link'], page_route)))
                walk(v)
            if 'offer' in o and isinstance(o['offer'], dict):
                pass
        elif isinstance(o, list):
            for x in o:
                walk(x)

    walk(doc)
    # Object-valued ctas without _type (seeded via ctaField) still have label + link.
    def walk_plain(o):
        if isinstance(o, dict):
            if 'label' in o and isinstance(o.get('link'), dict) and 'kind' in o['link']:
                out.add((norm(o['label']), resolve(o['link'], page_route)))
            for v in o.values():
                walk_plain(v)
        elif isinstance(o, list):
            for x in o:
                walk_plain(x)

    walk_plain(doc)
    return out


def page_links(ref):
    t = Tree()
    t.feed(open(os.path.join(SITE, ref), encoding='utf-8').read())
    body, chrome = set(), set()

    def walk(n, area):
        if n.tag in ('script', 'style'):
            return
        cls = n.attrs.get('class', '').split()
        if n.tag == 'footer' or 'hdr' in cls:
            area = 'chrome'
        if n.tag == 'a':
            href = n.attrs.get('href', '')
            label = norm(inline_html(n, ref))
            if label and href and href != '#':
                r = route_of(href, ref)
                if r.startswith('#'):
                    r = ROUTES[ref] + r  # in-page anchor
                (chrome if area == 'chrome' else body).add((label, r))
            return
        for c in n.children:
            if not isinstance(c, str):
                walk(c, area)

    walk(t.root, 'body')
    return body, chrome


def main():
    nav = seeded_links(by_id['navigation'], '/')
    failures = 0
    for name, ref in PAGES.items():
        route = ROUTES[ref]
        body, chrome = page_links(ref)
        have = seeded_links(by_id[name], route or '/')
        # Links that come from collection data (case rows, service sheets, note rows) are generated, not stored.
        generated = {'read the case note', 'ask about this', 'details', 'read the note', 'read', 'read the offer', 'read the service'}
        missing = sorted(l for l in body - have
                         if l[0] not in generated
                         and not re.match(r'^\d{2}', l[0])  # numbered rows render from collections
                         and not l[1].startswith(('/work/', '/notes/', '/services/', '/industries/')))
        # Header/footer: menu labels are composed (number + label + description), so compare destinations only.
        missing_nav = sorted({r for l, r in chrome if l != 'hopsigtechnologies'} - {r for _, r in nav})  # wordmark -> / is code
        if missing or missing_nav:
            failures += len(missing) + len(missing_nav)
            print(f'{route} ({name})')
            for l in missing:
                print('   body:', l)
            for l in missing_nav:
                print('   header/footer:', l)
    print(f'\n{failures} link(s) in the reference with no matching label + destination in the seed')
    return 1 if failures else 0


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.exit(main())
