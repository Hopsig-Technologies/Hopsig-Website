## AI Transformation page: "Six weeks in your repo"

Scroll drives a six-week story: the pipeline installs itself into the client's repo, their team takes it over, and five delivery metrics move from a week-0 baseline to week 6. Place it directly under the page hero. The metric values are illustrative and must stay labelled "EXAMPLE FIGURES" until real ones exist.

**Artboard:** 1200 × 560. Timeline 7,000 ms: 1,000 ms per week (W0–W6) plus nothing after; W6 is the end state. Seed 6.

**Playback**

- **Viewport ≥ 1024 px: scroll-scrubbed.** The section is `position: sticky` for 250 vh. Scroll progress p (0 → 1 across those 250 vh) sets t = p × 7,000. No autoplay.
- **Viewport < 1024 px: autoplay loop** of 9,000 ms (the 7,000 ms timeline, a 1,300 ms hold on W6, a 700 ms reset crossfade).
- **Week ticks are buttons:** clicking W3 smooth-scrolls (desktop) or jumps t (mobile) to 3,000.

**Layers, back to front**

1. Background and dot grid.
2. **Repo window** (left): rect x 70, y 64, 620 × 400, rx 12, fill #0A0C0F, stroke `--line`.
   - Title bar: 36 units tall, bottom border `--line`. Three circles r = 4 at (92, 82), (106, 82), (120, 82), fill `--ink-faint`. Micro "YOUR-ORG / PAYMENTS-API" at (140, 86), `--ink-dim`.
   - File tree: `terminal` lines at x 90, baselines from y 132, 24 units apart. Existing at W0, in `--ink-dim`: "src/", "tests/", ".github/workflows/ci.yml", "package.json". Added later with a lime "+ " prefix and `--ink` text: "CLAUDE.md", ".claude/agents/", "hooks/pre-merge" (W1); "docs/runbook.md" (W3); "services/billing/" (W4).
   - A vertical divider at x 300 from y 100 to y 464, `--line`.
   - **Pipeline chips**: six rects 160 × 32, rx 8, x 330, y = 120 + i × 48 (i = 0–5), fill `--bg-raised`, stroke `--line`; label in Space Grotesk 13 at (x + 14, y + 21): Plan, Stories, Build, Review, Document, Escalate. Small gate diamonds (10 × 10, rotated 45°) centred at (410, 160) and (410, 304), stroke `--amber`. A vertical connector at x 410 behind the chips.
   - **"RUN BY YOUR TEAM" pill**: 164 × 28, centred (590, 140), stroke `--lime`, micro label `--lime`. Hidden until W3.
3. **Metrics panel** (right): rect x 730, y 64, 400 × 400, rx 12, fill `--bg-raised`, stroke `--line`.
   - Header: micro "MEASURED ON YOUR REPO" at (754, 96) in `--ink-dim`; micro "EXAMPLE FIGURES" right-aligned at x 1106, y 96, in `--ink-faint`.
   - Five rows, row i at y0 = 124 + i × 64:
     - Label: micro at (754, y0 + 14), `--ink-dim`.
     - Before value: `terminal` at (754, y0 + 40), `--ink-faint`.
     - Arrow "→" at (826, y0 + 40), `--ink-faint`.
     - After value: node-label at (850, y0 + 40), counts from the before value.
     - Delta pill: 64 × 22, rx 11, right edge at x 1106, top at y0 + 24; micro text; hidden until W6.
     - Bar track: (754, y0 + 50), 352 × 4, rx 2, fill `--line`. Value bar on top, width = 352 × (current ÷ before) for "lower is better" rows and 352 × (current ÷ 100) for coverage; fill `--ink-faint`, turning `--lime` at W6.

| Row | Label | Before | After (W6) | Delta pill |
| --- | --- | --- | --- | --- |
| 0 | LEAD TIME | 6.0 days | 2.5 days | −58% |
| 1 | PR CYCLE TIME | 30 h | 9 h | −70% |
| 2 | REVIEW TURNAROUND | 18 h | 4 h | −78% |
| 3 | TEST COVERAGE | 61% | 82% | +21 pts |
| 4 | CHANGE-FAIL RATE | 14% | 7% | −50% |

4. **Week rail**: line from (70, 512) to (1130, 512), stroke `--line` 1.5. Seven ticks at x = 70, 247, 423, 600, 777, 953, 1130: circles r = 5, fill `--bg`, stroke `--ink-faint`; micro labels "W0"…"W6" centred 20 units below each. Passed ticks fill `--lime`. The rail between W0 and the playhead is stroked `--lime`.
5. **Playhead**: circle r = 7, fill `--lime`, halo r = 16 `--lime-halo`, on the rail at x = 70 + (t ÷ 6,000) × 1,060, clamped to 1130.
6. **Week caption**: node-label centred at (600, 488), `--ink`. Crossfades (200 ms) at each week boundary.

**Timeline**

| t (ms) | Week caption | What changes |
| --- | --- | --- |
| 0–1,000 | W0 · "Baseline measured on your repo" | Only the existing files show. Chips are absent. Metrics show before values; after values read "—" in `--ink-faint`. At t = 400 each before value pulses once (opacity 0.4 → 1, 400 ms), as if being measured |
| 1,000–2,000 | W1 · "Pipeline installed on one service" | The three W1 files fade in (opacity 0 → 1, x −8 → 0, 280 ms each, 120 ms stagger, `ease-out-quart`). The six chips fly in from x + 40, opacity 0 → 1, 480 ms each, 100 ms stagger. Gate diamonds appear last (160 ms) |
| 2,000–3,000 | W2 · "First stories shipped through the gates" | A lime particle travels the connector from Plan (y 136) to Escalate (y 376) in 900 ms `ease-in-out-cubic`, pausing 120 ms at each gate while the diamond flashes lime. Each chip strokes `--lime` as the particle passes, then returns to `--line` after 300 ms. Metrics start moving (see below) |
| 3,000–4,000 | W3 · "Your engineers run it; we review" | "docs/runbook.md" appears. The "RUN BY YOUR TEAM" pill fades in and scales 0.9 → 1 (`snap`). A second particle runs the pipeline |
| 4,000–5,000 | W4 · "Rolled out to a second service" | "services/billing/" appears. Two particles run in parallel, offset 300 ms |
| 5,000–6,000 | W5 · "Guardrails and evals tuned" | "hooks/pre-merge" flashes `--red` for 400 ms (it blocked a bad merge), then the line gets a lime tick at its right end |
| 6,000–7,000 | W6 · "Measured against week 0" | All after values reach their targets and turn `--lime`; bars turn `--lime`; delta pills pop in (scale 0.8 → 1, `snap`, 80 ms stagger, fill `--lime`, text `--bg`) |

**Metric interpolation:** for each row, progress q = clamp((t − 1,500) ÷ 4,800, 0, 1); value = before + (after − before) × `ease-out-quart`(q). Round lead time to one decimal, the others to whole numbers.

**Mobile (360 × 640):** repo window at x 20, y 24, 320 × 260 (file tree on the left 150 units, chips 130 × 24 at x 180, y = 64 + i × 32). Metrics panel at x 20, y 300, 320 × 252: rows 48 tall, labels and values on one line, bars 280 wide. Week rail at y 590 from x 28 to x 332 (ticks every 50.7). Caption in HTML below the figure instead of in the SVG.

**Reduced motion:** the W6 frame: all files, chips, pill, final metric values, delta pills, full lime rail.

**Figcaption:** "Six weeks: the pipeline goes into your repo, your team runs it, and it is measured against your own week 0. Figures shown are an example."
