### 3. Data engineering — "Three answers become one"

Three teams ask for last week's revenue and get three numbers through tangled pipes. A warehouse and one metric definition replace the tangle, and all three dashboards snap to the same lime number. A strip underneath shows a nightly batch failing while an incremental run keeps ticking.

**Artboard:** 1200 × 560. Loop 10,000 ms. Seed 33.

**Layers, back to front**

1. Background and dot grid.
2. **Sources** (Node primitive, 160 × 56) at x 70, y = 120, 252, 384. Micro type at (+14, +22): "POSTGRES", "REST API", "CSV EXPORT"; node-label at (+14, +42): "Orders", "Payments", "Marketing".
3. **Tangled paths** (before): three cubic paths, stroke `--ink-faint` 1.5, Flow dashes moving at half speed (−12 per 800 ms):
   - Orders (230, 148) → tile C (900, 414), controls (565, 148), (565, 414)
   - Payments (230, 280) → tile A (900, 146), controls (565, 280), (565, 146)
   - Marketing (230, 412) → tile B (900, 280), controls (565, 412), (565, 280)
4. **Warehouse** (hidden at start): top ellipse rx 64, ry 14 centred (600, 236); body rect x 536, y 236, 128 × 80; bottom ellipse rx 64, ry 14 centred (600, 316) (draw only its lower half). Fill `--bg-raised`, stroke `--line`. Micro "WAREHOUSE" centred at (600, 284).
5. **Metric pill** (hidden): 168 × 32, rx 16, centred (600, 356), stroke `--line`, micro "METRIC · REVENUE".
6. **Clean paths** (hidden, drawn later), stroke `--lime` 1.5:
   - Each source right edge → warehouse left (536, 276): controls (400, y\_source), (460, 276)
   - Warehouse bottom (600, 330) → pill top (600, 340): straight
   - Pill right (684, 356) → each tile's left-centre (900, 146 / 280 / 414): controls (790, 356), (810, y\_tile)
7. **Flow particles** on clean paths: 6 per path, r 2.5, `--lime`, evenly spaced, travelling at 160 units per second, `linear`, hidden until their path is drawn.
8. **Dashboard tiles** (Node primitive, 230 × 100) at x 900, y = 96, 230, 364. Micro "REVENUE · LAST WEEK" at (+16, +24). Value at (+16, +64) in Space Grotesk 600, 28 px, `--ink`. Subtitle micro at (+16, +86), `--ink-dim`.
   - Before values: A "£412,880" (subtitle "ASKED BY FINANCE"), B "£398,120" ("ASKED BY SALES"), C "£441,005" ("ASKED BY MARKETING").
   - After value (all three): "£418,240", subtitle "ONE DEFINITION".
9. **Mismatch label**: micro "3 DIFFERENT ANSWERS" at (900, 80), `--red`.
10. **Batch strip**:
    - Row 1: micro "NIGHTLY BATCH" at (70, 476); track x 260, y 470, 600 × 6, rx 3, fill `--line`; fill bar `--ink-faint`; time label `terminal` at (880, 476): "02:00 → 07:40".
    - Row 2: micro "INCREMENTAL · EVERY 5 MIN" at (70, 506); 24 segments 22 × 6, rx 2, gap 3, from x 260, y 500, fill `--line`; time label at (880, 506): "LAST RUN 2 MIN AGO".

**Timeline (10,000 ms)**

| t (ms) | What happens | Duration, easing |
| --- | --- | --- |
| 0–1,500 | Before: tangled paths flowing slowly; tiles show three different values | — |
| 600–1,500 | "3 DIFFERENT ANSWERS" fades in (160) and out at 1,500 (160) | — |
| 0–3,000 | Nightly batch bar fills 0 → 600 wide | 3,000, `linear` |
| 3,000–3,900 | Batch bar and its time label turn `--red`; label text becomes "FAILED 07:40"; then fades to 40% opacity and a 1 px strike line draws through the row | 160 / strike 280 |
| 0–10,000 | Incremental segments fill `--lime` one every 400 ms, cycling (after 24 they all clear in 160 ms and restart) | 160 each |
| 1,500–1,900 | Tangled paths fade to opacity 0 | 400, `ease-in-out-cubic` |
| 1,700–2,180 | Warehouse fades in and scales 0.9 → 1 about its centre | 480, `snap` |
| 2,100–2,700 | Source → warehouse paths draw (dashoffset 1 → 0), 100 ms stagger; their particles start | 600, `ease-out-quart` |
| 2,900–3,180 | Metric pill pops in (scale 0.8 → 1); warehouse → pill line draws | 280, `snap` |
| 3,100–3,700 | Pill → tile paths draw, 100 ms stagger; particles start | 600 |
| 3,500–4,400 | Each tile value counts from its own old value to £418,240 (rounded to whole pounds, comma-separated) and turns `--lime`; tile strokes turn `--lime`; subtitles crossfade to "ONE DEFINITION" | 900, `ease-out-quart` |
| 4,400–9,300 | Resolved hold; particles keep flowing | — |
| 9,300–10,000 | Reset crossfade | 700 |

**Mobile (360 × 640):** sources as three pills across the top (100 × 36 at x 20, 130, 240, y 24). Warehouse centred (180, 200), scaled 0.8. Metric pill centred (180, 276). Tiles stacked: 320 × 72 at x 20, y = 320, 404, 488. Paths re-routed vertically with the same rules. Batch strip hidden.

**Reduced motion:** warehouse, pill, clean paths (no moving particles), all tiles at £418,240 in lime, batch row struck through.

**Figcaption:** "Three teams, three revenue numbers. One warehouse and one definition later, the same number everywhere."
