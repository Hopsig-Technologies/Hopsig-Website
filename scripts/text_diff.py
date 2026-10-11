"""Text diff: the visible text of a built route against its reference page.

    python scripts/text_diff.py http://localhost:3100 /approach [/working-with-us …]
    python scripts/text_diff.py http://localhost:3100 --ref 404.html /does-not-exist

Both sides go through check_pages.visible (same normalisation: entities, whitespace, case, decoration, prototype
build notes and computed estimator outputs skipped). Reports strings the reference shows that the build does not
("missing") and strings the build shows that the reference does not ("extra"), as a multiset, so a duplicated or
dropped line is caught too. Replacements recorded in content/deviations.json are
accepted on both sides. Exit 1 if anything is missing; extras are listed for review (site values filled from
Site settings legitimately differ).
"""
import collections
import json
import os
import re
import sys
import tempfile
import urllib.parse
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import check_pages  # noqa: E402
from extract_pages import ROUTES, SITE  # noqa: E402

REF_BY_ROUTE = {route: ref for ref, route in ROUTES.items()}
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_FILLED = None


def site_values():
    """[TOKEN] -> value for every Site settings field that is filled in the dataset (as the site substitutes them)."""
    global _FILLED
    if _FILLED is None:
        tokens = dict(re.findall(r'(\w+): "(\[[^\]]+\])"', open(os.path.join(ROOT, 'web', 'lib', 'tokens.ts'), encoding='utf-8').read()))
        q = urllib.parse.quote('*[_id == "siteSettings"][0]')
        try:
            doc = json.load(urllib.request.urlopen(f'https://e1ib49ry.apicdn.sanity.io/v2025-02-19/data/query/development?query={q}', timeout=30))['result'] or {}
        except Exception:
            doc = {}
        _FILLED = {check_pages.norm(t): str(doc[k]) for k, t in tokens.items() if doc.get(k) not in (None, '')}
    return _FILLED


def ordered(path):
    return [re.sub(r' →$', '', re.sub(r'^— ', '', check_pages.norm(s))) for s in check_pages.visible(path)]


def texts(path):
    return collections.Counter(ordered(path))


def diff(base, route, ref=None):
    ref = ref or REF_BY_ROUTE[route]
    req = urllib.request.Request(base + route, headers={'User-Agent': 'text-diff'})
    try:
        body = urllib.request.urlopen(req, timeout=60).read()
    except urllib.error.HTTPError as e:  # the 404 page is served with status 404
        body = e.read()
    with tempfile.NamedTemporaryFile('wb', suffix='.html', delete=False) as f:
        f.write(body)
    try:
        built_seq = ordered(f.name)
        built = collections.Counter(built_seq)
    finally:
        os.unlink(f.name)
    want = texts(os.path.join(SITE, ref))
    dev = check_pages.deviations()  # owner-approved replacements (content/deviations.json)
    # A reference line counts as present if the page shows it split differently (a link now breaks it up) or with
    # Site settings values filled in where the reference shows the token.
    # Lines lose a leading "— " in texts(), and a "· " that starts an element (a phone-only hint span) is dropped.
    loose = lambda x: re.sub(r'\s+([;,.:])', r'\1', re.sub(r'\s+', ' ', x.replace('—', ' ').replace('·', ' '))).strip()
    joined = loose(' '.join(built_seq))
    def shown(k):
        for token, value in site_values().items():
            k = k.replace(token, check_pages.norm(value))
        return loose(k) in joined
    missing = collections.Counter({k: v for k, v in (want - built).items() if not check_pages.removed(k) and not shown(k)})
    extra = collections.Counter({k: v for k, v in (built - want).items() if k not in dev['now']})
    print(f'{route}  vs  {ref}:  {sum(want.values())} reference strings, {len(missing)} missing, {len(extra)} extra')
    for s, n in sorted(missing.items()):
        print(f'   - {s[:120]}' + (f'  (×{n})' if n > 1 else ''))
    for s, n in sorted(extra.items()):
        print(f'   + {s[:120]}' + (f'  (×{n})' if n > 1 else ''))
    return len(missing)


def main():
    args = sys.argv[1:]
    if len(args) < 2:
        sys.exit(__doc__)
    base, rest = args[0].rstrip('/'), args[1:]
    failures = 0
    ref = None
    for a in rest:
        if a == '--ref':
            ref = '__next__'
            continue
        if ref == '__next__':
            ref = a
            continue
        failures += diff(base, a, ref)
        ref = None
    return 1 if failures else 0


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.exit(main())
