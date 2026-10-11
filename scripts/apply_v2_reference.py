"""Bring the v2 design into reference/site (run once; kept for the record).

1. `v2 handover/reference/site/*` (the 37 v1 pages re-exported with the v2 header) replaces reference/site.
2. The 17 animated pages in `v2 handover/reference/site-v2/` overlay their twins. Their links point back into the
   sibling `site/` folder (`../site/x.html`, `../../site/y/z.html`); those prefixes are rewritten so the pages read
   as if they had always lived in reference/site.

The animated pages' <script src> paths are left as they are: reference/site is compared as text and screenshots of
static markup; to watch the animations run, open the pages in `v2 handover/reference/site-v2/` instead.
"""
import os
import shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'v2 handover', 'reference')
DST = os.path.join(ROOT, 'reference', 'site')


def main():
    copied = overlaid = 0
    for base, _, files in os.walk(os.path.join(SRC, 'site')):
        for f in files:
            rel = os.path.relpath(os.path.join(base, f), os.path.join(SRC, 'site'))
            os.makedirs(os.path.dirname(os.path.join(DST, rel)), exist_ok=True)
            shutil.copyfile(os.path.join(base, f), os.path.join(DST, rel))
            copied += 1
    for base, _, files in os.walk(os.path.join(SRC, 'site-v2')):
        for f in files:
            if not f.endswith('.html'):
                continue
            rel = os.path.relpath(os.path.join(base, f), os.path.join(SRC, 'site-v2'))
            depth = rel.replace('\\', '/').count('/')
            html = open(os.path.join(base, f), encoding='utf-8').read()
            # ../site/ (top level) -> '' ; ../../site/ (one folder down) -> ../
            html = html.replace('../' * (depth + 1) + 'site/', '../' * depth)
            assert '/site/' not in html.replace('site-v2', ''), f'unrewritten link in {rel}'
            with open(os.path.join(DST, rel), 'w', encoding='utf-8', newline='') as out:
                out.write(html)
            overlaid += 1
    print(f'{copied} pages copied, {overlaid} animated pages overlaid into reference/site')


if __name__ == '__main__':
    main()
