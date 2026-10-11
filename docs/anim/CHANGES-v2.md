# Hopsig website — v2 changes (delta on the v1 build)

This bundle is the difference between the v1 prototype you built from (`hopsig-handover.zip`, 37 pages) and the current design. Three things changed. Everything not listed here is unchanged — do not re-derive the v1 pages from this bundle.

## 1. Header: the two AI links stand out (every page)

In the nav, **AI transformation** and **Agentic flow** now sit together inside a hairline capsule and are coloured Lime; the other links stay dim. No new nav item, no dot, no pulse.

Markup (between the Industries dropdown and the Company dropdown):

```html
<span class="ai" aria-label="AI delivery">
  <a class="nl" href="/ai-transformation">AI transformation</a>
  <a class="nl" href="/agentic-flow">Agentic flow</a>
</span>
```

CSS (dark-tone variables as everywhere in the header):

```css
.hdr nav .ai{display:flex;align-items:center;gap:18px;height:34px;padding:0 14px;border:1px solid var(--line);border-radius:999px;transition:border-color .2s}
.hdr nav .ai:hover,.hdr nav .ai:focus-within{border-color:rgba(198,242,78,.5)}
.hdr nav .ai a.nl{color:var(--acc);padding:9px 0 7px}      /* Lime */
.hdr nav .ai a.nl:hover{color:var(--text)}
.hdr nav .ai a.nl.on:after{bottom:-1px}                    /* the active underline still applies */
```

The responsive rules from v1 (tighten at 1300, drop "Technologies" at 1180) are unchanged. `reference/site/` is the full v1 set re-exported with this header, so a before/after diff of any page is header-only.

## 2. Seventeen pages gain an animation (the "v2" pages)

`reference/site-v2/` holds the 17 affected pages at the same routes as v1. Compare each with its `reference/site/` twin: the only differences are the figure(s) and, on two pages, the structural edits in §3.

| Route | Scene(s) | Where |
|---|---|---|
| `/` | `home-agentic` | new band after the hero |
| `/services/*` (8) | one `svc-*` scene + `agentic-strip` | scene under the hero facts; strip before the FAQ |
| `/industries/*` (6) | one `ind-*` scene | under the hero facts |
| `/agentic-flow` | `agentic-flow-sim`, `agentic-never-wall` | simulator under the hero; wall in its own section |
| `/ai-transformation` | `ai-transformation` | scroll-scrubbed section after the hero |

`content/animations.json` is the manifest: per route, the scene ids, artboard size, mode, loop, the reduced-motion frame time, the figcaption, and the exact placement text. Captions carry no figures by design (see §4).

### The engine

`anim/engine.js` (~230 lines, no dependencies) is the whole runtime: one `requestAnimationFrame` clock for every figure on the page, `mulberry32` seeded randomness, the easing set (`outQuart`, `inOutCubic`, `linear`, `snap` = spring 380/30/1), SVG primitives (node, pill, connector, flow, tick, counter, sheet, particle, cursor, ripple, gate, padlock, log, grid), IntersectionObserver playback at threshold .35, pause on `visibilitychange`, a pause button on loops over 5 s, `prefers-reduced-motion` → seek to the scene's `resolved` frame and freeze, `HA.seek(t)` as the test hook, a `?anim-debug=1` grid overlay, `HA.button` for HTML controls positioned in artboard units, and `HA.canvasUnder` for the one scene with more than 150 moving shapes (IoT estate).

A scene is `HA.scenes[id] = { loop, seed, resolved, w, h, mode, build(c) }` where `build` draws the layers once and returns `update(t)`, a **pure function of t**. `anim/BRIEF.md` (the brief the scenes were built to) explains the contract and the patterns; `anim/scenes/home-agentic.js` is the reference implementation; `anim/spec/*.md` are the original per-scene specs; `anim/DEVIATIONS.md` lists where a scene departs from its spec and why — keep those, they are fixes, not bugs.

### Porting it into the Next.js build

Do not rewrite the scenes. Wrap them:

1. Put `engine.js` and `scenes/*.js` in `components/anim/` as ES modules (export the `HA` object from the engine; each scene file registers itself on import).
2. `<HeroAnim id="svc-qa" caption="…" />` is a client component that renders the `<figure class="anim">` markup from `content/animations.json`, then in `useEffect` imports the engine + that scene (`next/dynamic`, `rootMargin: 200px`) and calls `HA.mount(figureEl)`. One `HA.boot()`-equivalent per page is fine; `HA.mount` is idempotent.
3. No layout shift: the `.frame` carries `aspect-ratio: W / H` and the background colour from the manifest before anything loads.
4. Server-rendered reduced-motion frame: add a build script that opens each scene in Playwright, calls `HA.seek(resolved)`, and writes the resulting `<svg>` markup to `public/anim/<id>.static.svg`; the component inlines that file as the placeholder (and as the whole thing under reduced motion). That satisfies the spec's "static frame on the server" without a second implementation.
5. The scroll-scrub wiring for `/ai-transformation` is in `anim/page-wiring.js`; it reads `.scrub` / `.scrub .stick` and calls `HA.scrub(inst, p)`; week-tick buttons call `inst.goto(t)`.
6. The interactive scenes (`mode: 'state'`) create real `<button>`s via `HA.button`; the CSS for `.ha-btns` is in `anim/figure.css` along with the figure, frame, figcaption, strip and scrub styles. Put that CSS in `globals.css` as is.
7. `test_scene.py` is the harness used to verify every scene (frames at chosen t, loop seam, errors); port it to a Playwright test so the seam check runs in CI.

Budget per the spec: 60 fps on a 2020 MacBook Air, ≤ 25 KB gzipped per scene excluding the engine. The scenes are 40–120 lines each; the engine gzips to ~9 KB.

## 3. Structural edits on two pages (v2 only)

- **`/agentic-flow`**: hero sub-copy ends "Run a story; the detail is below." The static SVG diagram under "The flow." is removed (the table stays). The "What they never do." list column is removed from the dark section — "What the agents do." becomes a single column, max-width 760 — because the never wall now carries that content as pressable guardrails.
- **`/ai-transformation`**: nothing removed; the scroll-scrubbed section is inserted after the hero.

## 4. Rules that came with the animations (add to CLAUDE.md — see `CLAUDE-additions.md`)

- Two animation-only tokens: amber `#D9A441` (queued / pending) and red `#E06A55` (a failure, on screen ≤ 1,200 ms). They never appear in page chrome.
- Lime inside an artboard means "done and correct" and nothing else.
- Numbers inside an artboard are a fictional product's UI. Figcaptions describe the mechanism and never state a number. Scenes whose numbers could read as a Hopsig outcome carry a micro `EXAMPLE FIGURES` label on the artboard (data engineering, AI & ML, cloud, QA, mobile, retail, fintech, SaaS, AI transformation). Figures from the record (200+ buildings, 60 % analysis time, four hours' overlap, ten working days) carry no label.
- The healthcare scene reads `BAA / DPA [TO CONFIRM]` until the founders confirm it — a placeholder like any other.
- No drop shadows in artboards either; the Sheet primitive has a 1 px edge.
- Desktop artboards only in this prototype. The spec's mobile layouts (360 × 640 per scene) are not built; below 768 px either hide the figure or build the mobile artboards from `anim/spec/*.md` as a later phase.

## 5. Not changed

Content JSON (except the new `animations.json`), the Sanity schema, routes, the other 20 pages, footer, tokens, type, the file stack, the work index, notes. The second note (`/notes/the-sow-is-the-pitch`) was already in the v1 bundle.
