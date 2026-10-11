### 1. Custom software — "Scope on day 3, live in week 6"

A two-page scope gets signed, then grey particles assemble into a working app screen one increment at a time, and it goes live with a handover pack.

**Artboard:** 1200 × 560. Loop 10,000 ms. Seed 11. Particles: 120 (SVG).

**Layers, back to front**

1. Background and dot grid.
2. **Scope sheet** (Sheet primitive): x 70, y 72, 260 × 380.
   - Micro "SCOPE · 2 PAGES" at (90, 104), `--paper-ink`.
   - Column heads: micro "IN" at (90, 144) and "OUT" at (210, 144), `--paper-ink` at 60% opacity.
   - IN list: four line-rects at x 104, y = 164, 188, 212, 236, widths 84, 70, 92, 64, height 4. Each has a 10 × 8 tick slot at x 90 (hidden).
   - OUT list: three line-rects at x 210, y = 164, 188, 212, widths 80, 66, 88. Each has a strike line (1.5 px, `--paper-ink`) over it, hidden (drawn from 0 width).
   - Lower half: eight more line-rects at x 90, y = 276 + k × 20, widths alternating 200 / 168 / 184 (body text of the SOW).
   - Micro "SIGNED · DAY 3" at (90, 436), `--paper-ink`, hidden; a 12 × 12 lime square at (232, 427) beside it, hidden.
3. **Week strip**: six cells, 120 × 28, rx 6, at x = 370 + i × 128, y 72, fill `--bg-raised`, stroke `--line`; micro "W1"…"W6" at (x + 10, y + 19) in `--ink-dim`. A fill rect inside each grows 0 → 120 wide in `--lime` at 25% opacity; the label turns `--ink` when full.
4. **Browser frame**: x 370, y 120, 760 × 340, rx 12, fill #0A0C0F, stroke `--line`. Bar 32 tall with three r = 4 circles at (390, 136), (404, 136), (418, 136). URL pill 220 × 20, rx 10, at (440, 126), fill `--bg-raised`, mono 11 "app.yourproduct.com" in `--ink-dim`. Status pill 96 × 20, rx 10, at (1018, 126): micro "STAGING" in `--amber`, stroke `--amber`.
5. **App blocks** (all fill `--bg-raised`, stroke `--line`, rx 6, opacity 0 at start):
   - Sidebar 140 × 276 at (386, 168), with five 92 × 6 line-rects at x 402, y = 192 + k × 28.
   - Header bar 572 × 40 at (542, 168).
   - KPI card A 276 × 96 at (542, 224): micro "ORDERS" at (+16, +26); counter at (+16, +72) in Space Grotesk 600, 32 px.
   - KPI card B 276 × 96 at (838, 224): micro "CONVERSION"; counter.
   - Table 572 × 108 at (542, 336): four row rules at y +24, +48, +72, +96, stroke `--line`, drawn from 0 width.
6. **Particles**: 120, seeded scatter in x 386–1114, y 168–444, fill `--ink-faint`. Idle drift: each moves on a circle of radius 6 with period 3,000 ms and a seeded phase.
7. **Tests label**: micro "212 TESTS PASSING" with its baseline at (562, 454), inside the frame's bottom padding, hidden; its Tick sits at (542, 444).
8. **Handover sheets**: three Sheet rects 112 × 52 stacked behind the frame's bottom-right corner at (1000, 420); labels in mono 11 `--paper-ink`: "runbook.md", "tests/", "walkthrough.mp4".

**Particle assignment:** particles 0–29 → header, 30–69 → sidebar, 70–89 → KPI A, 90–109 → KPI B, 110–119 → table. Each target block has evenly spaced points along its outline (perimeter ÷ count); particle k flies to its point.

**Timeline (10,000 ms)**

| t (ms) | What happens | Duration, easing |
| --- | --- | --- |
| 0–1,200 | Before: particles drifting; sheet visible, all lines grey; week cells empty; pill "STAGING" | — |
| 1,200–1,680 | IN ticks pop in (scale 0 → 1, `snap`), 120 ms stagger; each tick is a lime Tick primitive | 160 each |
| 1,400–2,000 | OUT strike lines draw, 120 ms stagger | 200 each, `ease-out-quart` |
| 1,800 | "SIGNED · DAY 3" and its lime square fade in | 280 |
| 1,800–2,800 | W1 and W2 cells fill (500 ms each, `linear`). Particles 0–69 fly to header and sidebar outlines | 900, `ease-in-out-cubic` |
| 2,700–2,900 | Header and sidebar blocks fade in (opacity 0 → 1); their particles turn `--lime` then fade to 0 | 200 |
| 2,800–3,800 | W3, W4 fill. Particles 70–109 fly to the KPI cards; cards fade in at 3,700. Counters count: ORDERS 0 → 1,284 (integer, thousands comma), CONVERSION 0.0% → 3.4% | counters 900, `ease-out-quart` |
| 3,800–4,800 | W5 fills. Particles 110–119 fly to the table; table fades in at 4,500; row rules draw left to right, 100 ms stagger | 300 each |
| 4,800–5,600 | W6 fills. "212 TESTS PASSING" fades in, preceded by a lime Tick | 280 |
| 5,400 | Status pill crossfades to "LIVE": stroke and text `--lime`, with a halo ring r 0 → 40 at its centre, opacity 0.5 → 0 | 160 / ring 500 |
| 5,600–6,200 | Handover sheets fan out: their top-left corners move to (900, 462), (960, 470), (1020, 462) and rotate −6°, 0°, +6° about their centres; 100 ms stagger | 480, `snap` |
| 6,200–9,300 | Resolved hold | — |
| 9,300–10,000 | Reset crossfade; particles return to scatter positions | 700, `ease-in-out-cubic` |

**Mobile (360 × 640):** scope sheet x 20, y 24, 320 × 150 with IN and OUT side by side and no body lines. Week strip at y 190: six cells 48 × 20, gap 6, from x 20. Browser frame x 20, y 226, 320 × 380; blocks stacked: header 288 × 32, KPI A and B each 140 × 72 side by side, table 288 × 120; no sidebar (its particles join the table). 70 particles. Handover sheets hidden; "LIVE" pill only.

**Reduced motion:** the end-of-hold frame: ticks and strikes shown, all weeks full, all blocks visible with final counters, "LIVE", sheets fanned.

**Figcaption:** "Scope signed on day 3. Working software in six weeks. Handed over with a runbook."
