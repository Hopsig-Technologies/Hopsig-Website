### 3. Healthcare & life sciences — "Built for audit, data stays in your cloud"

A study record moves upload → model → clinician review → sign-off inside a box labelled "your cloud account". Each step writes a hash-chained audit row. The delivery team sits outside the box: when they need access, a time-boxed request is approved, logged, and closes itself.

Only show the compliance lines that are true for Hopsig; remove any that aren't before building.

**Artboard:** 1200 × 560. Loop 12,000 ms. Seed 103.

**Layers, back to front**

1. Background and dot grid.
2. **Cloud boundary**: rect x 70, y 72, 760 × 420, rx 16, fill none, stroke `--ink-faint` 1.5, dashed `6 4`. Micro "YOUR CLOUD ACCOUNT · YOUR REGION" at (94, 96), `--ink-dim`.
3. **Steps**: four Nodes 150 × 56 at y 156, x = 100, 290, 480, 670 (centres 175, 365, 555, 745). Micro index at (+14, +22); node-label at (+14, +42): Upload, Model, Clinician review, Sign-off. Connectors at y 184.
4. **Record card**: Sheet 104 × 36, centred over the active step at y 128 (card y 110–146). Mono 11 `--paper-ink`: "STUDY 0381" at (+10, +15); micro tag at (+10, +29): empty, later "1 EDIT" or "SIGNED".
5. **Audit table**: rect x 100, y 228, 700 × 236, rx 12, fill #0A0C0F, stroke `--line`. Micro "AUDIT TRAIL · APPEND-ONLY" at (124, 256), `--ink-faint`. Columns at x: TIME 124, ACTOR 214, ACTION 354, HASH right-aligned at 776. Five row baselines y = 288 + 28k, `terminal` 13, hidden until written. Roles only, never names.

| Row | Time | Actor | Action | Hash |
| --- | --- | --- | --- | --- |
| 1 | 09:14:02 | uploader | study uploaded | 3f9a…c21 |
| 2 | 09:14:09 | model v2.3 | findings drafted, confidence 0.91 | 8b02…7de |
| 3 | 09:31:44 | clinician | findings amended (1 edit) | c47e…a10 |
| 4 | 09:33:10 | supervisor | signed off | e9d1…5bb |
| 5 | 09:40:12 | engineer | access granted, 60 min, ticket 482 | 2a6c…f03 |

Hash chain: from each hash to the next, a short vertical link (two 4 × 6 rounded rects overlapping, stroke `--lime`) at x 760, drawn when the lower row is written.

6. **Delivery panel** (outside the boundary): rect x 880, y 72, 250 × 420, rx 12, fill `--bg-raised`, stroke `--line`.
   - Node 202 × 56 at (904, 104): micro "DELIVERY TEAM", node-label "Lahore".
   - Access line: dashed `4 4` from (904, 132) to (830, 132), stroke `--ink-faint`. Padlock icon 14 × 18 centred at (850, 132) (body rect 14 × 10, rx 2; shackle an arc r 5), stroke `--ink-dim`.
   - Access pill (hidden): 202 × 28 at (904, 176), micro "ACCESS REQUEST · 60 MIN".
   - Compliance list, micro `--ink-dim`, at x 924, baselines 300, 336, 372, 408, each with a Tick slot at x 904: "BAA / DPA IN PLACE", "DATA STAYS IN YOUR REGION", "AUDIT LOG APPEND-ONLY", "ACCESS TIME-BOXED AND LOGGED".
   - Micro "NO STANDING ACCESS TO PATIENT DATA" at (904, 464), `--ink-faint`, wrapped to 210 wide.

**Timeline (12,000 ms)**

| t (ms) | What happens | Duration, easing |
| --- | --- | --- |
| 0–800 | Before: steps idle, table empty, padlock closed | — |
| 800–1,200 | Record card fades in over Upload; Upload lit; row 1 types; hash appears | 400 / type 500 |
| 1,400–2,000 | Card travels to Model | 600, `ease-in-out-cubic` |
| 2,000–2,600 | Model lit; row 2 types; chain link 1→2 draws | 500 / link 280 |
| 2,800–3,400 | Card travels to Clinician review | 600 |
| 3,400–4,000 | Clinician lit; card tag "1 EDIT" in `--amber`; row 3 types; link 2→3 | — |
| 4,200–4,800 | Card travels to Sign-off | 600 |
| 4,800–5,400 | Sign-off lit; card tag becomes "SIGNED" in `--lime` with a Tick; row 4; link 3→4 | — |
| 6,000–6,200 | Access pill fades in (`--amber`); access line turns `--amber` | 200 |
| 6,600–6,880 | Approved: pill turns `--lime` and its text becomes "APPROVED · 60:00"; padlock shackle rotates open (−30° about its left end); line turns `--lime`; row 5 types; link 4→5 | 280 |
| 6,880–7,400 | Pill timer counts 60:00 → 00:00 (compressed) | 520, `linear` |
| 7,400–7,680 | Shackle closes; line back to `--ink-faint`; pill text "CLOSED · LOGGED" in `--ink-dim` | 280 |
| 7,600–8,200 | Compliance ticks draw, 150 ms stagger; boundary stroke turns `--lime` at 60% opacity | 280 each |
| 8,200–11,300 | Resolved hold | — |
| 11,300–12,000 | Reset crossfade | 700 |

**Mobile (360 × 640):** boundary x 12, y 16, 336 × 420; steps as four pills 72 × 32 at y 48 (x 24, 104, 184, 264); card above them hidden (tags move into the active pill as a dot). Audit table x 24, y 96, 312 × 320 with TIME and ACTOR on one line and ACTION wrapped under; hashes hidden, links hidden. Delivery panel x 20, y 452, 320 × 168: team node, padlock line drawn vertically up to the boundary, compliance list as two columns.

**Reduced motion:** all five rows written with links, card "SIGNED", padlock closed, pill "CLOSED · LOGGED", ticks drawn.

**Figcaption:** "Every step leaves an audit row a reviewer can trace. Patient data stays in your cloud; engineer access is requested, time-boxed and logged."
