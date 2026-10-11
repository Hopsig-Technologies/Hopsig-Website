### 4. AI & machine learning — "Eval harness before the demo"

A golden set of questions runs through an eval gate three times (v1, v2, v3). A scoreboard fills in each run, flagging what improved (lime) and what regressed (amber). The ship button stays blocked until the numbers clear a written rule.

**Artboard:** 1200 × 560. Loop 12,000 ms. Seed 44.

**Layers, back to front**

1. Background and dot grid.
2. **Golden set panel**: micro "GOLDEN SET · 8 OF 120 SHOWN" at (70, 80), `--ink-dim`. Eight rows, 300 × 32, rx 6, at x 70, y = 96 + i × 40, fill `--bg-raised`, stroke `--line`. Text in `terminal` 12 px at (+12, +21), `--ink-dim`, truncated at 30 characters:
   1. "Refund window for EU orders?"
   2. "Which plan includes SSO?"
   3. "Prorated if cancelled mid-cycle?"
   4. "Data kept after account deletion?"
   5. "Price of the Enterprise Max plan?" (not in the sources: correct answer is a refusal)
   6. "VAT on UK invoices?"
   7. "CSV export row limit?"
   8. "Who founded your competitor?" (out of scope: correct answer is a refusal)
   - Result dot per row: circle r 5 at (386, row centre y), fill `--ink-faint`.
3. **Eval gate**: rect x 436, y 96, 8 × 312, rx 4, fill `--bg-raised`, stroke `--line`. Micro "EVAL GATE" centred at (440, 84). Each row has a gate segment (the 8 × 32 slice at that row's y) that can flash.
4. **Scoreboard**: rect x 520, y 96, 610 × 248, rx 12, fill `--bg-raised`, stroke `--line`.
   - Header micro at y 128, `--ink-dim`, column x: VERSION 544, ACCURACY 640, CITED 756, REFUSED OK 852, P95 966, $ / 1K 1052.
   - Rows at baselines y 176, 232, 288, rules between at y 148, 204, 260, stroke `--line`. Row labels in node-label: "v1 · baseline", "v2 · reranker", "v3 · eval-tuned prompt". All values start as "—" in `--ink-faint`.
5. **Ship rule**: micro "SHIP RULE: ACCURACY ≥ 90% AND REFUSALS ≥ 85%" at (520, 372), `--ink-dim`.
6. **Ship pill**: 140 × 36, rx 18, at x 990, y 412. Before: stroke `--ink-faint`, micro "BLOCKED" `--ink-faint`, a 10 × 12 padlock icon at left.
7. **Question particles**: one per row, r 4, start at (386, row y), `--ink-faint`.

| Version | Pass pattern (rows 1–8) | Accuracy | Cited | Refused OK | P95 | $ / 1K |
| --- | --- | --- | --- | --- | --- | --- |
| v1 | ✓ ✓ ✗ ✓ ✗ ✓ ✓ ✗ | 71% | 64% | 40% | 1.9 s | $0.82 |
| v2 | ✓ ✓ ✓ ✓ ✗ ✓ ✓ ✓ | 86% | 88% | 70% | 2.4 s | $1.10 |
| v3 | all ✓ | 94% | 97% | 92% | 1.6 s | $0.64 |

**One run (2,400 ms), used three times:**

- Particles leave their rows 150 ms apart and travel x 386 → 440 in 300 ms, `ease-in-out-cubic`.
- **Pass:** the particle passes through the gate to x 500 and fades (200 ms); the gate segment flashes `--lime` (opacity 0 → 1 → 0, 400 ms); the row dot turns `--lime`.
- **Fail:** the particle bounces back to x 400 (200 ms, `ease-out-quart`); the gate segment flashes `--red` (400 ms); the row dot turns `--red`, then fades to `--ink-faint` after 1,000 ms.
- After the last particle (about 1,500 ms in), the version's row counts up from "—": percentages count from 0, times and costs fade in (600 ms, `ease-out-quart`).
- **Diff colouring (v2 and v3 only):** compare each cell with the previous row. Better → text `--lime`; worse → text `--amber` plus a 10 × 10 up-arrow glyph after the value. v2's P95 and $ / 1K are amber; everything in v3 is lime.

**Timeline (12,000 ms)**

| t (ms) | What happens |
| --- | --- |
| 0–800 | Before: table empty, dots grey, ship pill "BLOCKED" |
| 800–3,200 | Run v1; row 1 fills |
| 3,200–5,600 | Dots reset to grey (200 ms); run v2; row 2 fills with diff colours |
| 5,600–8,000 | Dots reset; run v3; row 3 fills, all lime |
| 8,000–8,400 | A lime Tick draws beside the ship rule; the ship pill fills `--lime`, padlock morphs to a tick (crossfade 160), text "SHIP v3" in `--bg`; scale 0.95 → 1, `snap` |
| 8,400–11,300 | Resolved hold |
| 11,300–12,000 | Reset crossfade |

**Mobile (360 × 640):** golden set shows rows 1, 2, 5, 8 only (300 × 32 at x 20, y 40 + i × 40). Gate becomes horizontal: 300 × 8 at x 30, y 212. Scoreboard becomes three stacked cards 320 × 96 at x 20, y = 240, 344, 448, each showing VERSION, ACCURACY, REFUSED OK and $ / 1K. Ship pill centred at (180, 584).

**Reduced motion:** all three rows filled with diff colours, all dots lime (v3 result), ship pill "SHIP v3".

**Figcaption:** "Every version is scored on the same questions. It ships when the numbers clear the rule, not when the demo looks good."
