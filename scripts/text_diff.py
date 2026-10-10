"""Text diff: the visible text of a built route against its reference page.

    python scripts/text_diff.py http://localhost:3100 /approach [/working-with-us …]
    python scripts/text_diff.py http://localhost:3100 --ref 404.html /does-not-exist

Both sides go through check_pages.visible (same normalisation: entities, whitespace, case, decoration, prototype
build notes and computed estimator outputs skipped). Reports strings the reference shows that the build does not
("missing") and strings the build shows that the reference does not ("extra"), as a multiset, so a duplicated or
dropped line is caught too. Exit 1 if anything is missing; extras are listed for review (site values filled from
Site settings legitimately differ).
"""
import collections
import os
import re
import sys
import tempfile
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import check_pages  # noqa: E402
from extract_pages import ROUTES, SITE  # noqa: E402

REF_BY_ROUTE = {route: ref for ref, route in ROUTES.items()}


def texts(path):
    return collections.Counter(re.sub(r' →$', '', re.sub(r'^— ', '', check_pages.norm(s))) for s in check_pages.visible(path))


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
        built = texts(f.name)
    finally:
        os.unlink(f.name)
    want = texts(os.path.join(SITE, ref))
    missing = want - built
    extra = built - want
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
