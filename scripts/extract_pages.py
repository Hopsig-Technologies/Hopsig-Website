"""Reference-page parser used by the checks (check_pages.py, check_links.py, check_bundle.py): the HTML tree,
the route map and the page list.

Its extraction entrypoint (reference HTML -> content/pages/*.json) ran once on 2026-10-10; those JSON files were
then converted into the typed modules in web/content (scripts/convert_content.mjs, see git history) and deleted.
Running `python scripts/extract_pages.py` again would recreate the intermediate JSON; there is no reason to.
"""
import json
import os
import re
import sys
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, 'reference', 'site')
OUT = os.path.join(ROOT, 'content', 'pages')

VOID = {'br', 'img', 'input', 'meta', 'link', 'hr', 'source', 'col', 'wbr'}
INLINE = {'b', 'i', 'em', 'strong', 'br', 'span', 'a', 'small', 'code', 'sup', 'sub'}
SKIP = {'script', 'style', 'canvas', 'head', 'textarea'}

ROUTES = {r['reference'].replace('reference/site/', ''): r['route']
          for r in json.load(open(os.path.join(ROOT, 'content', 'routes.json'), encoding='utf-8'))}


class Node:
    def __init__(self, tag, attrs, parent=None):
        self.tag, self.attrs, self.parent, self.children = tag, attrs, parent, []

    @property
    def cls(self):
        return self.attrs.get('class', '').split()

    def has(self, c):
        return c in self.cls

    def els(self):
        return [c for c in self.children if isinstance(c, Node)]

    def walk(self):
        yield self
        for c in self.els():
            yield from c.walk()

    def find(self, pred):
        return next((n for n in self.walk() if pred(n)), None)

    def direct_text(self):
        return ''.join(c for c in self.children if isinstance(c, str)).strip()

    def text(self):
        return ''.join(c if isinstance(c, str) else c.text() for c in self.children)


class Tree(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node('root', {})
        self.cur = self.root

    def handle_starttag(self, tag, attrs):
        n = Node(tag, dict((k, v or '') for k, v in attrs), self.cur)
        self.cur.children.append(n)
        if tag not in VOID:
            self.cur = n

    def handle_startendtag(self, tag, attrs):
        self.cur.children.append(Node(tag, dict((k, v or '') for k, v in attrs), self.cur))

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        n = self.cur
        while n is not self.root and n.tag != tag:
            n = n.parent
        if n is not self.root:
            self.cur = n.parent

    def handle_data(self, data):
        self.cur.children.append(data)


def parse(path):
    t = Tree()
    t.feed(open(path, encoding='utf-8').read())
    return t.root


def route_of(href, page):
    """Relative reference href -> site route; leaves anchors and external links alone."""
    if not href or href.startswith(('http', 'mailto:', 'tel:')):
        return href
    path, _, frag = href.partition('#')
    if not path:
        return '#' + frag if frag else ''
    target = os.path.normpath(os.path.join(os.path.dirname(page), path)).replace(os.sep, '/')
    r = ROUTES.get(target, '?' + target)
    return r + ('#' + frag if frag else '')


def norm(s):
    s = s.replace(' ', ' ')
    s = re.sub(r'[ \t\r\f\v]+', ' ', s)
    s = re.sub(r' *\n *', '\n', s)
    return s.strip()


def inline_html(n, page):
    """Serialise an inline subtree: keep <b>/<i> (and <a href=route>), <br> -> newline, drop the rest."""
    out = []
    for c in n.children:
        if isinstance(c, str):
            out.append(c)
        elif c.tag in SKIP:
            continue
        elif c.tag == 'br':
            out.append('\n')
        elif c.tag in ('b', 'strong'):
            out.append('<b>' + inline_html(c, page) + '</b>')
        elif c.tag in ('i', 'em'):
            out.append('<i>' + inline_html(c, page) + '</i>')
        elif c.tag == 'a':
            out.append('<a href="' + route_of(c.attrs.get('href', ''), page) + '">' + inline_html(c, page) + '</a>')
        elif c.tag == 'small':
            out.append(' ' + inline_html(c, page))
        else:
            out.append(inline_html(c, page))
    return norm(''.join(out))


def is_cell(n):
    """A text leaf: has its own text, or is made only of inline markup with at most one text-bearing child."""
    if n.tag in SKIP:
        return False
    if any(d.tag not in INLINE for d in n.walk() if d is not n):
        return False
    if n.direct_text():
        return True
    kids = [c for c in n.els() if c.text().strip()]
    return len(kids) <= 1 and bool(n.text().strip())


def cells(n, page, acc=None):
    """Document-order list of (html, node) text leaves under n."""
    acc = [] if acc is None else acc
    if n.tag in SKIP or n.tag == 'svg':
        return acc
    kids = [c for c in n.els() if c.text().strip()]
    if not n.direct_text() and len(kids) == 1 and n.tag not in INLINE:
        return cells(kids[0], page, acc)  # a wrapper around one leaf: report the leaf (keeps <a> buttons visible)
    if is_cell(n):
        h = inline_html(n, page)
        if h:
            acc.append((h, n))
        return acc
    for c in n.children:
        if isinstance(c, str):
            if c.strip():
                acc.append((norm(c), n))
        else:
            cells(c, page, acc)
    return acc


def btn(a, page):
    st = a.attrs.get('style', '')
    kind = 'lime' if 'var(--btn)' in st else 'chip' if a.has('chip2') else 'link' if a.has('more') else 'outline'
    return {'label': inline_html(a, page), 'route': route_of(a.attrs.get('href', ''), page), 'variant': kind}


# Pages whose copy has no collection JSON. Name = the Sanity singleton (Phase 2).
PAGES = {
    'homePage': 'index.html',
    'servicesIndexPage': 'services/index.html',
    'industriesIndexPage': 'industries/index.html',
    'workIndexPage': 'work/index.html',
    'notesIndexPage': 'notes/index.html',
    'approachPage': 'approach.html',
    'ratesPage': 'rates.html',
    'bookPage': 'book.html',
    'briefPage': 'brief.html',
    'comparePage': 'why-not-just-hire.html',
    'workingWithUsPage': 'working-with-us.html',
    'aiTransformationPage': 'ai-transformation.html',
    'agenticFlowPage': 'agentic-flow.html',
    'agenciesPage': 'for-agencies.html',
    'joinPage': 'join.html',
    'privacyPage': 'privacy.html',
    'termsPage': 'terms.html',
    'notFoundPage': '404.html',
}


# ---------------------------------------------------------------- generic blocks

def hero(sec, page):
    h1 = sec.find(lambda n: n.tag == 'h1')
    cs = cells(sec, page)
    i = next(k for k, (_, n) in enumerate(cs) if n is h1 or h1 in anc(n))
    out = {'eyebrow': ' '.join(h for h, _ in cs[:i]) or None, 'title': cs[i][0]}
    rest = cs[i + 1:]
    if rest and rest[0][1].tag == 'p':
        out['sub'] = rest[0][0]
        rest = rest[1:]
    out['buttons'] = [btn(n, page) for _, n in rest if n.tag == 'a']
    other = [h for h, n in rest if n.tag != 'a']
    if other and len(other) % 2 == 0 and len(other) <= 8:
        out['facts'] = [{'value': other[k], 'label': other[k + 1]} for k in range(0, len(other), 2)]
    elif other:
        out['rest'] = other
    return out


def anc(n):
    while n.parent is not None:
        n = n.parent
        yield n


def closing(sec, page):
    cs = cells(sec, page)
    h2 = next(k for k, (_, n) in enumerate(cs) if n.tag in ('h1', 'h2'))
    out = {'eyebrow': cs[h2 - 1][0] if h2 else None, 'title': cs[h2][0]}
    rest = cs[h2 + 1:]
    if rest and rest[0][1].tag == 'p':
        out['sub'] = rest[0][0]
        rest = rest[1:]
    out['buttons'] = [btn(n, page) for _, n in rest if n.tag == 'a']
    out['emailLine'] = next((h for h, n in rest if n.tag != 'a'), None)
    return out


def faq(sec, page):
    h2 = sec.find(lambda n: n.tag == 'h2')
    items = []
    for it in (n for n in sec.walk() if n.has('item')):
        q = it.find(lambda n: n.has('t'))
        a = it.find(lambda n: n.has('b'))
        items.append({'q': inline_html(q.els()[0], page), 'a': inline_html(a, page)})
    return {'title': inline_html(h2, page) if h2 else None, 'items': items}


INDEX = re.compile(r'^(\d{1,2}|0\d)$')


def generic(unit, page):
    """Header (eyebrow / title / sub / aside) + rows of cells grouped by their parent element."""
    cs = cells(unit, page)
    out = {}
    h = next((k for k, (_, n) in enumerate(cs) if n.tag in ('h2', 'h3')), None)
    if h is not None:
        head = cs[h][1]
        box = head.parent  # the header block: eyebrow, h2, sub and aside live in it
        before = [x for x, n in cs[:h] if box in anc(n) or n.parent is box]
        if before:
            out['eyebrow'] = ' '.join(before)
        out['title'] = cs[h][0]
        rest = cs[h + 1:]
        head_rest = [(x, n) for x, n in rest if box in anc(n) or n.parent is box]
        aside = []
        for x, n in head_rest:
            if n.tag == 'p' and 'sub' not in out:
                out['sub'] = x
            else:
                aside.append(x)
        if aside:
            out['aside'] = aside
        ids = {id(n) for _, n in head_rest}
        cs = [(x, n) for x, n in rest if id(n) not in ids]
    rows, last = [], None
    for x, n in cs:
        key = n.parent
        if n.tag == 'a' and (n.has('more') or 'var(--btn)' in n.attrs.get('style', '')):
            rows.append({'button': btn(n, page)})
            last = None
            continue
        if key is last and rows and isinstance(rows[-1], list):
            rows[-1].append(x)
        else:
            rows.append([x])
        last = key
    rows = [[c for c in r if not INDEX.match(c)] if isinstance(r, list) else r for r in rows]
    out['rows'] = [r for r in rows if r]
    return out


def units(el):
    """Split a surface into content units: <section>s and the text-bearing blocks between them."""
    if el.tag == 'section':
        return [el]
    if not any(d.tag == 'section' for d in el.walk() if d is not el):
        return [el] if el.text().strip() else []
    out = []
    for c in el.els():
        out += units(c)
    return out


# ---------------------------------------------------------------- post-processing

BUILD_NOTE = re.compile(r'^Build note\b', re.I)


def split_notes(value, notes):
    """Remove 'Build note: ...' lines (designer notes rendered in the prototype) from any string in value."""
    if isinstance(value, str):
        keep = []
        for line in value.split('\n'):
            (notes if BUILD_NOTE.match(plain(line)) else keep).append(line)
        return '\n'.join(keep).strip()
    if isinstance(value, list):
        out = [split_notes(v, notes) for v in value]
        return [v for v in out if v not in ('', [], {})]
    if isinstance(value, dict):
        return {k: split_notes(v, notes) for k, v in value.items()}
    return value


def plain(s):
    import html
    return norm(re.sub(r'<[^>]+>', ' ', html.unescape(s)))


# Blocks whose rows render from a collection. The rows are replaced with {"from": ...}; the words the
# template adds around the data are kept in templateText, verbatim from the reference.
DATA_BLOCKS = {
    'homePage': {
        'svc': ('services', ['Scroll — the sheets stack, the tabs stay', 'Details →', 'Good for',
                             'Stack · only what we have shipped to production', 'Engagement:', 'From [YOUR RATE] / day',
                             '08 of 08 · the file closes here', 'All services →', 'Rates →']),
        'cidx': ('case-studies', ['Problem', 'What we did', 'Measured', 'Read the case note →', 'Ask about this →',
                                  'All 32 case notes →']),
        'notes': ('posts', ['6 notes · no newsletter, no pop-up', 'Latest', 'Read the note →',
                            'Everything else we have written', 'All notes →']),
    },
    'servicesIndexPage': {'Eight things we do, in detail.': ('services', ['→'])},
    'industriesIndexPage': {'Where we have done this before.': ('industries', ['{count} notes', '→'])},
    'workIndexPage': {'Selected.': ('case-studies', ['{nn} · {domain}', 'Problem —', 'What we did —', 'Measured —',
                                                    'Client withheld · details on the call', 'Read the case note →',
                                                    'Ask about this →', 'The rest of the record.',
                                                    '20 more · ask for any of them on the call'])},
    'notesIndexPage': {'All notes.': ('posts', ['Read', '→', '[DRAFT]', '…'])},
    'aiTransformationPage': {'From the record.': ('case-studies', ['{nn} · {domain}', 'Problem —', 'What we did —',
                                                                  'Measured —', 'Client withheld · details on the call',
                                                                  'Ask about this →'])},
    'agenticFlowPage': {'The flow.': ('flow-stages', ['Stage', 'In', 'Out', 'Guardrail', 'Who decides', 'A person signs',
                                                      'No gate', 'Runs on its own inside the guardrail', 'Brief in',
                                                      'Pull request out · docs updated'])},
}

TITLE_KEY = {'case-studies': ('title', 'source'), 'services': ('name', '_id'), 'industries': ('name', '_id'),
             'posts': ('title', '_id'), 'flow-stages': ('stage', 'stage')}


def refs_in(block, src):
    """Collection items whose title appears in the block, in order of appearance (record order for the seed)."""
    t, key = TITLE_KEY[src]
    items = json.load(open(os.path.join(ROOT, 'content', src + '.json'), encoding='utf-8'))
    text = [plain(c) for r in block.get('rows', []) if isinstance(r, list) for c in r]
    text += [plain(c) for c in block.get('svgText', [])]
    found = []
    for c in text:
        for it in items:
            if plain(it[t]) == c and it[key] not in found:
                found.append(it[key])
    if src != 'case-studies' and len(found) == len(items):
        return [it[key] for it in items]  # the whole collection, in its own order (stack tags can match names early)
    return found


def legal(u, page):
    """privacy / terms: article.legal is a run of h2 + paragraphs/lists; the aside holds contents + last updated."""
    art = u.find(lambda n: n.has('legal'))
    sections = []
    for c in art.els():
        if c.tag == 'h2':
            sections.append({'heading': inline_html(c, page), 'body': []})
        elif c.tag == 'p':
            sections[-1]['body'].append({'p': inline_html(c, page)})
        elif c.tag in ('ul', 'ol'):
            sections[-1]['body'].append({c.tag: [inline_html(li, page) for li in c.els()]})
    aside = [x for x, n in cells(u, page) if art not in anc(n) and n is not art]
    contents = [h['heading'] for h in sections]
    return {'sections': sections,
            'aside': [x for x in aside if x.lstrip('— ') not in contents and x != 'Contents']}


def hoist_panel(b, panels):
    """The animated engagement mock (Day 0 -> Fortnightly) is one component shown on /services (x3) and /work.
    Keep one copy in engagementPanel.json and leave {"component": "engagementPanel"} in its place."""
    rows = b.get('rows', [])
    start = next((k for k, r in enumerate(rows) if r == ['Engagement · [Client]']), None)
    if start is None:
        return
    end = next(k for k, r in enumerate(rows) if k > start and r == ['Day rate from', '[YOUR RATE]'])
    panels.append(rows[start:end + 1])
    b['rows'] = rows[:start] + [{'component': 'engagementPanel'}] + rows[end + 1:]


def field_placeholders(u):
    return [n.attrs['placeholder'] for n in u.walk() if n.attrs.get('placeholder')]


def pull_build_notes(root):
    """Detach the smallest elements whose text starts with 'Build note' and return their text."""
    notes = []
    for n in list(root.walk()):
        if n.parent is None or not BUILD_NOTE.match(plain(n.text())):
            continue
        if any(BUILD_NOTE.match(plain(c.text())) for c in n.els()):
            continue
        notes.append(plain(n.text()))
        n.parent.children.remove(n)
    return notes


def blocks(page, name=None):
    root = parse(os.path.join(SITE, page))
    early_notes = pull_build_notes(root)
    pg = root.find(lambda n: n.has('pg'))
    out = []
    for surf in pg.els():
        if surf.tag in ('header', 'footer') or surf.has('hdr'):
            continue
        tone = 'd' if surf.has('tone-d') else 'l' if surf.has('tone-l') else '?'
        for u in units(surf):
            if u.has('seam'):
                continue
            if u.has('ph'):
                b = {'kind': 'hero', **hero(u, page)}
                if 'rest' in b:
                    b['rest'] = [c for c in b['rest'] if not INDEX.match(c)]
            elif u.has('close'):
                b = {'kind': 'closing', **closing(u, page)}
            elif u.has('faq'):
                b = {'kind': 'faq', **faq(u, page)}
            elif u.find(lambda n: n.has('legal')):
                b = {'kind': 'legal', **legal(u, page)}
            else:
                b = {'kind': 'section', **generic(u, page)}
                if not b['rows'] and len(b) == 2:
                    continue  # empty wrapper (e.g. a <style>-only div)
                svg = [s for s in u.walk() if s.tag == 'svg']
                if svg:
                    b['svgText'] = [norm(t.text()) for s in svg for t in s.walk() if t.tag == 'text' and t.text().strip()]
            ph = field_placeholders(u)
            if ph:
                b['fieldPlaceholders'] = ph
            b['tone'] = tone
            if u.attrs.get('id'):
                b['id'] = u.attrs['id']
            out.append(b)
    for key, (src, words) in DATA_BLOCKS.get(name, {}).items():
        b = next(x for x in out if key in (x.get('id'), x.get('title')))
        b['rows'] = [{'from': src, 'refs': refs_in(b, src)}]
        b.pop('svgText', None)
        b['templateText'] = words
    notes = list(early_notes)
    out = split_notes(out, notes)
    title = root.find(lambda n: n.tag == 'title').text().strip()
    data = {'route': ROUTES[page], 'reference': 'reference/site/' + page, 'docTitle': title, 'blocks': out}
    if notes:
        data['buildNotes'] = [plain(n) for n in notes]
    return data


if __name__ == '__main__':
    if len(sys.argv) > 2 and sys.argv[1] == '--raw':
        sys.stdout.reconfigure(encoding='utf-8')
        print(json.dumps(blocks(sys.argv[2]), ensure_ascii=False, indent=1))
    else:
        os.makedirs(OUT, exist_ok=True)
        panels = []
        for name, ref in PAGES.items():
            data = blocks(ref, name)
            for b in data['blocks']:
                hoist_panel(b, panels)
            with open(os.path.join(OUT, name + '.json'), 'w', encoding='utf-8', newline='\n') as f:
                json.dump(data, f, ensure_ascii=False, indent=1)
                f.write('\n')
            print(name, len(data['blocks']), 'blocks', len(data.get('buildNotes', [])), 'build notes')
        assert all(p == panels[0] for p in panels), 'engagement panel differs between pages'
        with open(os.path.join(OUT, 'engagementPanel.json'), 'w', encoding='utf-8', newline='\n') as f:
            json.dump({'usedOn': ['/services', '/work'], 'rows': panels[0]}, f, ensure_ascii=False, indent=1)
            f.write('\n')
        print('engagementPanel', len(panels), 'occurrences, identical')
