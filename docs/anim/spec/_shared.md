## Shared motion system

Every animation draws from these tokens and primitives; nothing is styled ad hoc. The fonts are confirmed from the live site's stylesheet (Space Grotesk and IBM Plex Mono). The colour values were sampled from screenshots because the site's stylesheet defines none on `:root`: before building, replace them with the exact values the site uses, keeping the names.

### Colour tokens

| Token | Value (verify) | Use |
| --- | --- | --- |
| `--bg` | #0E1013 | Artboard background, same as the site's dark hero |
| `--bg-raised` | #15181D | Node and card fill on dark |
| `--grid-dot` | #FFFFFF at 7% opacity | Background dot grid |
| `--line` | #2A2F37 | Hairlines, connectors, node borders (idle) |
| `--ink` | #F2F3EE | Primary text on dark |
| `--ink-dim` | #8A9099 | Secondary text, captions |
| `--ink-faint` | #4A5059 | The grey "before" state of anything |
| `--lime` | #D4F25A | Resolved, correct, done. Nothing else |
| `--lime-halo` | `--lime` at 18% opacity | Glow circle behind lit elements |
| `--amber` | #F2B84B | Queued or pending (offline, waiting for a person) |
| `--red` | #F26D5B | A failure. On screen for at most 1,200 ms, then resolved |
| `--paper` | #F5F5F0 | Light "sheet" documents (SOW, invoice, runbook) |
| `--paper-ink` | #15171A | Text on paper |

### Type tokens

| Token | Font | Size / line | Weight | Case and tracking |
| --- | --- | --- | --- | --- |
| `display-num` | Space Grotesk | 56 / 56 | 600 | Tabular numerals (`font-variant-numeric: tabular-nums`) |
| `title` | Space Grotesk | 22 / 28 | 500 | Sentence case |
| `node-label` | Space Grotesk | 15 / 20 | 500 | Sentence case |
| `micro` | IBM Plex Mono | 11 / 14 | 500 | Uppercase, +0.12em |
| `terminal` | IBM Plex Mono | 13 / 20 | 400 | As written |

### Artboard and grid

- Desktop artboard 1200 × 560; content safe area x 48–1152, y 40–520. Nothing important outside it.
- Mobile artboard 360 × 640; safe area x 20–340, y 24–616.
- Background: a `<rect>` filling the artboard with `--bg`, then a dot grid: circles of r = 1.2 every 24 units on both axes, starting at (12, 12), fill `--grid-dot`. Draw it once as an SVG `<pattern>`; it never animates.
- Container on the page: max-width 1200 px, border 1 px `--line`, border-radius 16 px, `overflow: hidden`, `aspect-ratio: 1200 / 560` (mobile `360 / 640`). Placed directly under the hero CTAs, 56 px below them.
- Caption: `<figcaption>` 16 px below the container, `micro` style, `--ink-dim`, left-aligned to the container.

### Primitives (reuse these everywhere)

| Primitive | Geometry | Idle state | Lit state |
| --- | --- | --- | --- |
| Particle | circle r = 2.5 | fill `--ink-faint` | r = 3, fill `--lime`, plus a halo circle r = 8 in `--lime-halo` behind it |
| Node | rect, height 56, rx 10, width per spec | fill `--bg-raised`, stroke `--line` 1 px | stroke `--lime` 1.5 px, label `--ink` |
| Pill | rect, height 32, rx 16, padding 14 left and right, `micro` label | stroke `--line`, label `--ink-dim` | fill `--lime`, label `--bg` |
| Connector | path, stroke-width 1.5, no fill, round caps | stroke `--line` | stroke `--lime` |
| Flow | the same path with `stroke-dasharray: 4 8` | — | stroke-dashoffset animates 0 → −12 every 400 ms, linear, forever while visible |
| Tick | path `M0 6 L5 11 L14 1` scaled to 14 × 12 | hidden (`pathLength` 1, dashoffset 1) | draws dashoffset 1 → 0 in 280 ms, `ease-out-quart`, stroke `--lime` 2 px |
| Counter | `<text>` in `display-num` | starts at the "before" value, `--ink-faint` | counts to the "after" value with `ease-out-quart`, rounded to the stated precision, colour fades to `--lime` over the last 200 ms |
| Sheet | rect rx 6, fill `--paper`, drop shadow 0 8 24 rgba(0,0,0,.35) | lines are rects of height 4, rx 2, fill #D9D9D2 | — |

### Easing and durations

| Name | Value | Use |
| --- | --- | --- |
| `ease-out-quart` | cubic-bezier(0.25, 1, 0.5, 1) | Anything arriving or counting |
| `ease-in-out-cubic` | cubic-bezier(0.65, 0, 0.35, 1) | Anything travelling from A to B |
| `snap` | spring, stiffness 380, damping 30, mass 1 | Things clicking into place |
| `linear` | linear | Flow dashes, clocks, progress |
| `micro` / `short` / `medium` / `long` | 160 / 280 / 480 / 900 ms | Default durations |

### Loop structure (all autoplay animations)

Every loop has four phases. The specs give exact times; this is the pattern.

1. **Before** (about 0–1,500 ms): the grey, broken or slow state is on screen and readable.
2. **Work** (about 1,500–6,000 ms): the thing Hopsig does happens.
3. **Resolved hold** (about 6,000–8,500 ms): everything lime, held still long enough to read.
4. **Reset** (the last 700 ms): the resolved layer fades to 0 while the before layer fades to 1, both `ease-in-out-cubic`, so the last frame equals the first.

### Engine rules

- **One clock.** A single `useLoopClock(loopMs)` hook drives everything from one `requestAnimationFrame`; every element computes its state as a pure function of `t`. This makes loops seamless and lets a scroll position set `t` directly.
- **Seeded randomness.** Any scatter or jitter uses `mulberry32(seed)` with the seed given per animation, so the same particles appear on every load.
- **Transform and opacity only.** Never animate `filter`, `width`, `height` or path `d` per frame unless a spec says so. Halos are static blurred circles whose opacity animates.
- **Particle budget.** Up to 150 moving particles in SVG. More than 150 → draw particles on a `<canvas>` layer under the SVG, same coordinates.
- **Playback.** Starts at t = 0 when 35% of the container enters the viewport (IntersectionObserver, threshold 0.35). Pauses when it leaves or when the tab is hidden (`visibilitychange`); resumes from the same t.
- **Pause control.** Required for anything that loops longer than 5 seconds. A 32 × 32 button at x 1120, y 512 (mobile x 316, y 596): circle r = 16, stroke `--line`, pause icon two 3 × 10 bars in `--ink-dim`; `aria-label` "Pause animation" / "Play animation".
- **Reduced motion.** With `prefers-reduced-motion: reduce`, render the end-of-Resolved frame as a still image: all counters at final values, all lit states on, no flow dashes moving, no loop.
- **Loading.** Render the reduced-motion frame on the server as the placeholder; hydrate the animated version with `next/dynamic` when it scrolls near (`rootMargin: 200px`). No layout shift.
- **Weight.** Each animation at most 25 KB gzipped, excluding the shared engine.
- **Accessibility.** The `<svg>` has `role="img"` and `aria-labelledby` pointing at the figcaption. No element flashes more than 3 times a second. Text contrast at least 4.5 : 1 against `--bg`.
