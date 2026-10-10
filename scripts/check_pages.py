"""Coverage check: every visible string on every reference page must exist somewhere in content/.

    python scripts/check_pages.py          # summary + uncovered strings per page; exit 1 if any
    python scripts/check_pages.py -v       # also list which pages were fully covered

Visible strings = text nodes outside <script>/<style>, form placeholders, SVG <text>. Comparison is
case-insensitive (the CSS uppercases some labels) and ignores markup, entities and whitespace.
Strings that are pure decoration (arrows, "+", index numbers) are skipped.
"""
import glob
import html
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from extract_pages import ROOT, SITE, ROUTES, SKIP, Tree  # noqa: E402

TEMPLATES = []
DECOR = re.compile(r'^[\W\d_]{0,3}$|^\d{1,2}$|^0\d$')


def norm(s):
    s = html.unescape(re.sub(r'<[^>]+>', ' ', s)).replace(' ', ' ')
    return re.sub(r'\s+', ' ', s).strip().casefold()


def strings(o):
    if isinstance(o, str):
        yield o
    elif isinstance(o, list):
        for x in o:
            yield from strings(x)
    elif isinstance(o, dict):
        for x in o.values():
            yield from strings(x)


def corpus():
    parts = []
    for f in glob.glob(os.path.join(ROOT, 'content', '**', '*.json'), recursive=True):
        if os.path.basename(f) in ('placeholders.json', 'routes.json'):
            continue
        parts += [norm(s) for s in strings(json.load(open(f, encoding='utf-8')))]
    return '\u0001'.join(parts)


def visible(path):
    t = Tree()
    t.feed(open(path, encoding='utf-8').read())
    out = []

    def walk(n, skip):
        if n.tag in SKIP and n.tag != 'textarea':
            skip = True
        if n.tag == 'title':
            skip = True  # <title> is checked against docTitle separately
        if not skip and n.attrs.get('placeholder'):
            out.append(n.attrs['placeholder'])
        for c in n.children:
            if isinstance(c, str):
                if not skip and c.strip():
                    out.append(c)
            else:
                walk(c, skip)

    walk(t.root, False)
    clean = (re.sub(r'\s+', ' ', html.unescape(x).replace(' ', ' ')).strip() for x in out)
    return [x for x in clean if x and not DECOR.match(x)]


def covered(s, big):
    s = re.sub(r'^— ', '', s)  # list items are rendered with a leading em dash
    s = re.sub(r' →$', '', s)  # links carry a trailing arrow the data does not
    return s in big or any(p.fullmatch(s) for p in TEMPLATES)


def template_patterns():
    """content/pages/templates.json holds strings with {tokens}; each becomes a regex for derived strings."""
    path = os.path.join(ROOT, 'content', 'pages', 'templates.json')
    if not os.path.exists(path):
        return []
    pats = []
    for s in strings(json.load(open(path, encoding='utf-8'))):
        if '{' in s:
            out = ''
            for i, part in enumerate(re.split(r'\{([a-zA-Z]+)\}', s)):
                if i % 2 == 0:
                    out += re.escape(re.sub(r'\s+', ' ', part).casefold())
                else:
                    out += {'nn': r'\d{2}', 'count': r'\d+'}.get(part, r'[^\[\]]+?')
            pats.append(re.compile(out))
    return pats


def main():
    verbose = '-v' in sys.argv
    global TEMPLATES
    TEMPLATES = template_patterns()
    big = corpus()
    missing_total = 0
    for ref, route in ROUTES.items():
        miss = []
        for s in visible(os.path.join(SITE, ref)):
            if not covered(norm(s), big) and s not in miss:
                miss.append(s)
        missing_total += len(miss)
        if miss:
            print(f'{route}  ({ref}): {len(miss)} uncovered')
            for m in miss:
                print('   ', m[:140])
        elif verbose:
            print(f'{route}: ok')
    print(f'\n{missing_total} uncovered strings across {len(ROUTES)} pages')
    return 1 if missing_total else 0


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.exit(main())
