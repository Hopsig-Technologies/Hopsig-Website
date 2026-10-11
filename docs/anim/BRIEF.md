# Scene-builder brief

You are building one or two animated scenes for the Hopsig website prototype. Each scene is a JavaScript file that registers itself on the shared engine: `HA.scenes['<id>'] = { loop, seed, resolved, w, h, mode?, nopause?, build(c) }`. The engine (`anim/engine.js`) owns the clock, playback, pause button, reduced motion and the test hook. Your `build(c)` draws the layers into `c.svg` once and returns `update(t)`, a **pure function of t** (ms) that sets every element's state for that instant. Never keep per-frame state that would make `update(5000)` differ depending on whether `update(4990)` ran first — the test harness seeks to arbitrary t.

Read, in this order:
1. `anim/spec/_shared.md` — the shared motion system (tokens, primitives, easing, loop structure, engine rules).
2. `anim/spec/<id>.md` — the section for your scene. Coordinates are SVG user units on the artboard; (0,0) top-left.
3. `anim/engine.js` — the helper API you must use (primitives, text styles, `seg`, `mix`, `log`, `gate`, `cursor`, `ripple`, `padlock`, `button`, `canvasUnder`, …). Add nothing to the engine; if a primitive is missing, build it locally in your scene with `HA.el`.
4. `anim/scenes/home-agentic.js` — the reference scene. Copy its patterns: constant tables for timings, `k` reset multiplier, `HA.seg` for every transition, `HA.mix` for colour, `HA.tf`/`HA.op` for transform and opacity.

## Corrections that override the spec (the spec was written before the site's tokens were known)

- **Colours come from `HA.T` only**: `bg raised log line hair ink dim faint lime amber red paper pink(paper-ink) sheetline`. Never type a hex value. The spec's sampled values (#0E1013, #D4F25A, …) are wrong; the names map 1:1 (`--bg-raised` → `T.raised`, `--ink-faint` → `T.faint`, `--paper-ink` → `T.pink`, `#0A0C0F` panes → `T.log`, `--lime-halo` → `T.lime` at opacity .18).
- **No drop shadows anywhere.** The Sheet primitive has a 1px edge instead. Where the spec says a card "lifts" with a shadow, use scale 1.02 and a `T.lime` stroke.
- **Text is real `<text>`** via `HA.text(parent, x, y, str, style, fill, extra)`. Styles: `num` (56 Space Grotesk 600), `title` (22/500), `label` (15/500, the spec's node-label), `micro` (11 mono 500 uppercase, +0.12em; the helper uppercases for you), `terminal` (13 mono), `mono12`, `mono11`, `sans12`, `sans13`. Right-align with `{ 'text-anchor': 'end' }`, centre with `'middle'`.
- **Figures.** Numbers inside the artboard are a fictional product's UI and may stay as specified. But if your scene's numbers read as an outcome Hopsig achieved (a bill cut, a suite time, a crash-free rate, an eval score, a revenue lift), add a micro label `Example figures` in `T.faint`, right-aligned at the top-right inside the panel that carries them. Do not add it to scenes whose numbers come from the site's record (200+ buildings, 60% analysis time, four hours' overlap, ten working days).
- **Desktop artboard only.** Skip the mobile layout entirely. Skip figcaptions (the page generator writes them).
- **Pause button** is added by the engine for loops over 5 s; do not draw one.
- **Reduced motion**: for `loop` and `scrub` scenes the engine seeks to `resolved` and freezes, so set `resolved` to a t inside the resolved hold where everything is lit and still. For `state` scenes read `c.reduced` and skip travel/pulse animations (jump instead).
- **Loop seam**: the frame at `t = loop − 1` must equal the frame at `t = 0`. Use the reference's pattern: `k = t >= RESET ? 1 − seg(t, RESET, LOOP, inOutCubic) : 1` and multiply every lit/progress quantity by `k`; things that move return to their start under the fade. The harness measures this; it must report 0 differing pixels (a handful from anti-aliasing is acceptable, dozens is a bug).
- **Colour mixing**: `HA.mix(a, b, p)` accepts hex or `rgb()` strings, so nested mixes are fine. Use it for every colour transition instead of switching at a threshold, so reset fades are smooth.
- **Continuous motion** (flow dashes, idle drift, background trucks, lane particles, the "now" hand) is computed from `t` with modulo, not accumulated.
- **Particles > 150** go on `HA.canvasUnder(c)` (the IoT estate). Call `cv.clear()` at the top of `update`, then draw with `cv.ctx` in artboard units.
- **Interactive scenes** (`mode: 'state'`): `update(t, dt)` receives the absolute elapsed ms. Keep a state object `{ name, since }` and compute everything from `t − since`. Buttons are `HA.button(c, x, y, w, h, label, cls, onClick)` — real HTML, positioned by artboard coordinates; `cls` is `'lime'`, `'outline'` or `'pillb'`. Show/hide with `.show(bool)`, rename with `.label(str)`. On click, change state and set `since = currentT` (keep the latest t in a closure variable). A seek in the harness calls `update(t, 0)`; auto-advancing states must advance from elapsed time, not from a timer.
- **Scroll-scrubbed scene** (`mode: 'scrub'`): `update(t)` with t in 0…loop set from scroll progress by the page; just render for t. Week-tick buttons call `HA.scrub(c.inst, p)` is **not** available to you — expose `c.inst.goto = function(t){…}` and the page wires it.

## How to work

1. Write `anim/scenes/<id>.js`. Keep it under ~250 lines; constants at the top; comments only where the spec is ambiguous and you made a call.
2. Test: `cd anim && python3 test_scene.py <id> 0,<t2>,<t3>,<t4>,<t5>,<t6> '{"w":1200,"h":560,"mode":"loop"}'` (pass the real w/h/mode). It writes `anim/out/<id>_sheet.png` (six frames), prints `errors: []` and the loop-seam pixel count. Pick t values that show before / first work / mid work / resolved / hold / reset.
3. **Read the sheet PNG and compare with the spec, frame by frame.** Check positions against the stated coordinates (the debug grid helps: add `?anim-debug=1` is not available in the harness, so compare by eye against the numbers). Fix and re-run until every frame matches, `errors: []`, and the seam is clean. Do not stop at "it runs".
4. For `state` scenes, also test clicks: in the harness page the buttons are real; you can extend `test_scene.py` locally with Playwright clicks if you need to, but do not commit changes to the harness or the engine.
5. Report back in under 15 lines: the file path, the t values you verified, the seam count, and any spec line you could not follow literally and what you did instead. No code in the report.

Do not edit `engine.js`, `test_scene.py`, `home-agentic.js`, `agentic-strip.js` or any file outside `anim/scenes/` and `anim/out/`.
