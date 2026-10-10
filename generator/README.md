# Prototype generator (reference only)

`site.py` built the 37 pages in `reference/site/` (as Design-canvas artboards; `handover/build_ref.py` turned them into standalone HTML). It is here so the mechanics can be read in their commented form — the file stack (`core_services()`), the work index (`case_index()`), the header (`header()`), the tone system (`varify()`, `surface()`, `TONE_CSS`), the hero ring (`hero_anim.py`), the lockup (`lockup.py`).

Do not run it as part of the build. If you want to regenerate: `python3 site.py` writes to `./out/` and needs no dependencies beyond the standard library.
