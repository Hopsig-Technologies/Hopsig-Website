"""Coverage check: every visible string on every reference page must exist in the site's content.

    node scripts/content_corpus.mjs && node scripts/seed.mjs   # produce the two inputs
    python scripts/check_pages.py [-v]                          # summary + uncovered strings per page; exit 1 if any

Content = the static copy (audit/content-corpus.json, from web/content) + the Sanity seed (audit/seed.ndjson).
Visible strings = text nodes outside <script>/<style>, form placeholders, SVG <text>. Comparison is
case-insensitive (the CSS uppercases some labels) and ignores markup, entities and whitespace.
Strings that are pure decoration (arrows, "+", index numbers) are skipped.
"""
import html
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from extract_pages import ROOT, SITE, ROUTES, SKIP, Tree  # noqa: E402

TEMPLATES = []
DECOR = re.compile(r'^[\W\d_]{0,3}$|^\d{1,2}$|^0\d$')
# Prototype-only text that must not ship (CLAUDE.md rule 9): designer notes and the "Source: Sanity · …" labels.
PROTOTYPE_NOTE = re.compile(r'^(Build note\b|Source: Sanity\b)', re.I)
# The estimator's outputs are computed from the sliders, not copy.
COMPUTED = re.compile(r'^(\d+ engineers?|\d+ months|\d+ engineer-days|—)$')


def norm(s):
    s = html.unescape(re.sub(r'<[^>]+>', ' ', s)).replace(' ', ' ')
    return re.sub(r'\s+', ' ', s).strip().casefold()


def strings(o):
    """Every string in a JSON value; a Portable Text block reads as its spans joined."""
    if isinstance(o, str):
        yield o
    elif isinstance(o, list):
        for x in o:
            yield from strings(x)
    elif isinstance(o, dict):
        if o.get('_type') == 'block' and isinstance(o.get('children'), list):
            yield ''.join(c.get('text', '') for c in o['children'])
            return
        for k, v in o.items():
            if not k.startswith('_'):
                yield from strings(v)


def content_strings():
    corpus_path = os.path.join(ROOT, 'audit', 'content-corpus.json')
    seed_path = os.path.join(ROOT, 'audit', 'seed.ndjson')
    for p in (corpus_path, seed_path):
        if not os.path.exists(p):
            sys.exit(f'{os.path.relpath(p, ROOT)} is missing: run `node scripts/content_corpus.mjs` and `node scripts/seed.mjs` first')
    out = []
    for module in json.load(open(corpus_path, encoding='utf-8')).values():
        out += module['strings']
    for line in open(seed_path, encoding='utf-8'):
        out += list(strings(json.loads(line)))
    return out


def plain_text(n):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', n.text()))).strip()


def visible(path):
    """Visible strings of a reference page, minus prototype notes. A note is either a whole element whose text starts
    with "Build note"/"Source: Sanity", or an inline line after a <br> that starts so (the book/brief hero)."""
    t = Tree()
    t.feed(open(path, encoding='utf-8').read())
    out = []

    def walk(n, skip):
        if n.tag in SKIP and n.tag != 'textarea':
            skip = True
        if n.tag == 'title':
            skip = True  # <title> is page metadata, set in code
        if not skip and n.attrs.get('placeholder'):
            out.append(n.attrs['placeholder'])
        line_start, note_line = True, False
        for c in n.children:
            if isinstance(c, str):
                txt = c.strip()
                if txt and line_start and PROTOTYPE_NOTE.match(txt):
                    note_line = True
                if txt:
                    line_start = False
                if txt and not skip and not note_line:
                    out.append(c)
            elif c.tag == 'br':
                line_start, note_line = True, False
            else:
                # The whole element is a note (the smallest such element; an ancestor whose first text is the note recurses).
                if PROTOTYPE_NOTE.match(plain_text(c)) and not any(PROTOTYPE_NOTE.match(plain_text(d)) for d in c.els()):
                    continue
                if c.text().strip():
                    line_start = False
                walk(c, skip or note_line)

    walk(t.root, False)
    clean = (re.sub(r'\s+', ' ', html.unescape(x).replace(' ', ' ')).strip() for x in out)
    return [x for x in clean if x and not DECOR.match(x) and not COMPUTED.match(x)]


def deviations():
    """content/deviations.json: reference strings deliberately replaced (owner decisions), normalised."""
    path = os.path.join(ROOT, 'content', 'deviations.json')
    if not os.path.exists(path):
        return {'replaced': set(), 'now': set()}
    d = json.load(open(path, encoding='utf-8'))
    return {'replaced': {norm(r['reference']) for r in d['replaced']}, 'now': {norm(r['now']) for r in d['replaced']} | {norm(t) for t in d.get('added_placeholders', [])}}


DEVIATIONS = None


def covered(s, big):
    global DEVIATIONS
    DEVIATIONS = DEVIATIONS or deviations()
    s = re.sub(r'^— ', '', s)  # list items are rendered with a leading em dash
    s = re.sub(r' →$', '', s)  # links carry a trailing arrow the data does not
    return s in big or s in DEVIATIONS['replaced'] or any(p.fullmatch(s) for p in TEMPLATES)


def template_patterns(all_strings):
    """Strings with {tokens} (web/content/templates.ts) become regexes for the derived strings on detail pages."""
    pats = []
    for s in all_strings:
        if '{' in s and '}' in s:
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
    all_strings = content_strings()
    TEMPLATES = template_patterns(all_strings)
    big = '\u0001'.join(norm(s) for s in all_strings)
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
