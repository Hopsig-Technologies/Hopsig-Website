### 8. QA & test automation — "Flakes fixed, not retried"

A heatmap of 20 tests over the last 30 runs is speckled red. The four flaky tests get fixed one by one, new runs come in clean, suite time drops from 41 to 6 minutes, a load test holds p95 under its SLO, and the pull request's merge button turns lime.

**Artboard:** 1200 × 560. Loop 12,000 ms. Seed 88.

**Layers, back to front**

1. Background and dot grid.
2. **Heatmap**: micro "LAST 30 RUNS" at (230, 96), `--ink-dim`. 20 rows × 30 columns of cells 16 × 12, rx 2, gap 3: cell (c, r) at x = 230 + 19c, y = 112 + 15r (grid spans x 230–797, y 112–409).
   - Row labels: `terminal` 11 px, right-aligned at x 218, baseline y = 122 + 15r, `--ink-faint`: checkout.spec, cart.spec, auth.spec, search.spec, refund.spec, profile.spec, invoice.spec, export.spec, webhook.spec, admin.spec, billing.spec, upload.spec, i18n.spec, roles.spec, sso.spec, notify.spec, report.spec, api.spec, rate-limit.spec, health.spec.
   - Pass cell fill `--line`; fail cell fill `--red` at 80%; fixed-era pass cell fill `--lime` at 30%.
   - Flaky rows r = 3, 7, 11, 16: each cell fails with probability 0.22 (seeded). Other rows: probability 0.01.
3. **Fix line**: `terminal` 12 at (230, 436), `--ink-dim`, empty at start.
4. **Suite time panel**: rect x 830, y 112, 300 × 140, rx 12, fill `--bg-raised`, stroke `--line`. Micro "SUITE TIME IN CI" at (854, 140). Value Space Grotesk 600, 48 px, at (854, 204): "41m". Micro "FLAKE RATE" at (854, 232) with value at (1106, 232) right-aligned: "4.1%".
5. **Load panel**: rect x 830, y 272, 300 × 140, rx 12, fill `--bg-raised`, stroke `--line`. Micro "K6 · LOAD TEST" at (854, 296). Plot area x 856–1106, y 304–392 (y 392 = 0 ms, 62 units = 300 ms). SLO line: dashed (`4 4`) `--lime` at y 330, micro "SLO 300 MS" right-aligned at (1106, 324). Virtual-users line (`--ink-dim`, 1.5): (856, 392) → (1031, 304) → (1106, 304). p95 line (`--lime`, 1.5): 26 points evenly spaced in x, y seeded between 338 and 356 (180–260 ms). Both drawn with `stroke-dashoffset`.
6. **Checks strip**: rect x 70, y 456, 1060 × 52, rx 12, fill `--bg-raised`, stroke `--line`. Four pills 150 × 32 at y 466, x = 94, 256, 418, 580: "UNIT", "INTEGRATION", "E2E", "LOAD", each stroke `--line` with a 12 px grey ring icon at left. Merge button 220 × 32, rx 6, at (886, 466): "Merge pull request" in Space Grotesk 13, fill `--line`, text `--ink-faint`.

**Timeline (12,000 ms)**

| t (ms) | What happens | Duration, easing |
| --- | --- | --- |
| 0–1,500 | Before: the grid scrolls one column left every 250 ms (`ease-in-out-cubic`, 200 ms); a new column of seeded results appears at the right edge each time; the leftmost column fades out | 6 shifts |
| 1,500–3,500 | Four fixes, 500 ms each, rows 3, 7, 11, 16 in turn: the row gets a 1.5 px `--amber` outline (160 ms); its red cells turn to `--line` from left to right, 10 ms apart; the outline turns `--lime` then fades; the fix line types a new message | 500 each |
| 1,500–3,500 | Fix messages: "fixed › search.spec: wait for network idle", "fixed › invoice.spec: frozen clock", "fixed › upload.spec: isolated temp dir", "fixed › notify.spec: no shared fixtures" | 40 characters per second |
| 2,000–5,200 | Suite time counts 41m → 6m (whole minutes); flake rate 4.1% → 0.2% | 3,200, `ease-out-quart` |
| 3,700–5,200 | Grid scrolls again, six columns; every new cell is a lime-tinted pass | 250 per shift |
| 5,200–7,200 | Load panel: VU line draws, then the p95 line draws following it; micro "P95 238 MS @ 5,000 VUS" fades in at (854, 404) in `--lime` | 2,000, `linear` |
| 7,200–7,800 | Check pills tick one by one (150 ms apart): stroke `--lime`, ring icon becomes a Tick | 280 each |
| 7,800–8,000 | Merge button fills `--lime`, text `--bg`; scale 0.95 → 1 | 200, `snap` |
| 8,000–11,300 | Resolved hold | — |
| 11,300–12,000 | Reset crossfade | 700 |

**Mobile (360 × 640):** heatmap 12 rows × 14 columns, cells 16 × 12 with gap 3, from (60, 40); row labels hidden. Suite and load panels side by side, 156 × 140, at (20, 260) and (184, 260). Fix line at (20, 432). Checks as a 2 × 2 grid of pills 150 × 32 at y 460 and 500; merge button 320 × 40 at (20, 552).

**Reduced motion:** heatmap with fixed rows and the last six columns lime-tinted, 6m, 0.2%, both load lines drawn with the label, all checks ticked, merge button lime.

**Figcaption:** "Flaky tests fixed at the cause. A suite that runs in minutes. Load tested before launch day."
