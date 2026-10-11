### 6. SaaS, platforms & AI products — "Tenants isolated, releases gated by evals"

Three tenants run in walled lanes; a cross-tenant read bounces off row-level security. A release is blocked at the eval gate at 88%, fixed, passes at 95%, goes to a 5% canary, then to every tenant.

**Artboard:** 1200 × 560. Loop 12,000 ms. Seed 106.

**Layers, back to front**

1. Background and dot grid.
2. **Tenant lanes**: three rects x 70, 700 × 80, rx 10, fill #0A0C0F, stroke `--line`, at y = 96, 200, 304. Micro labels at (+16, +22): "TENANT A", "TENANT B", "TENANT C · WHITE-LABEL". Version pill 100 × 24, rx 12, at (650, lane y + 28), stroke `--line`, micro "v1.3.9" `--ink-dim`.
3. **Walls**: rects 700 × 4 at (70, 186) and (70, 290), fill `--line`.
4. **Lane particles**: 12 per lane, r 2.5, `--ink-dim`, within x 86–630 and lane y + 36 to y + 68, moving right at seeded 40–80 units per second and wrapping.
5. **Intruder particle** (hidden): r 4, `--red`, starts at (400, 236) in lane B.
6. **Evidence pills** (Pill primitive) at y 408: "ROW-LEVEL SECURITY" x 70 w 184; "PER-TENANT KEYS" x 266 w 160; "AUDIT LOG" x 438 w 112.
7. **Release panel**: rect x 800, y 96, 330 × 352, rx 12, fill `--bg-raised`, stroke `--line`. Micro "RELEASE" at (824, 124); version node-label right-aligned at (1106, 124): "v1.4.0".
   - Four stage nodes 282 × 44, rx 8, at x 824, y = 144, 216, 288, 360: node-label at (+14, +28): "Commit", "Eval gate", "Canary · 5%", "All tenants". Connector at x 965 between them.
   - Inside Eval gate: gauge track at (+120, +19), 140 × 6, rx 3, `--line`; threshold mark 2 × 14 at 92% (x +248.8, y +15), `--lime`; value micro right-aligned at (+266, +12), just above the track, starting "0%".
   - Status micro under the panel at (824, 472), hidden.

**Timeline (12,000 ms)**

| t (ms) | What happens | Duration, easing |
| --- | --- | --- |
| 0–1,000 | Before: lanes running, all tenants v1.3.9, panel idle | — |
| 1,000–1,400 | Commit node lit with a Tick | 280 |
| 1,500–2,700 | Eval gauge fills 0 → 88% (bar width 0 → 123), `--amber`; value counts | 1,200, `ease-out-quart` |
| 2,700 | Gate stroke `--amber`; status "BLOCKED · 88% IS BELOW 92%" in `--amber` | 200 |
| 3,000–3,400 | Intruder moves from (400, 236) up toward lane A, reaching the wall at y 190 | 400, `ease-in-out-cubic` |
| 3,400–3,700 | Wall at y 186 flashes `--lime`; intruder bounces back to y 236 and fades; micro "BLOCKED · ROW-LEVEL SECURITY" appears at (430, 222) in `--lime`, fading at 4,600 | 300 |
| 3,600 | Version label becomes "v1.4.1"; gauge resets to 0; status clears | 200 |
| 3,700–4,800 | Gauge fills 0 → 95% (width 133), passing the threshold; turns `--lime`; gate stroke `--lime` with a Tick | 1,100, `ease-out-quart` |
| 4,800–5,400 | Canary node lit; lane A's pill flips (scaleY 1 → 0 → 1) to "v1.4.1" with stroke `--amber`; status "CANARY · ERRORS 0.02%" in `--ink-dim` | 600 |
| 6,600–7,400 | All tenants node lit; lanes B and C pills flip to v1.4.1, 200 ms apart; all three pills `--lime` | 280 each |
| 7,400–8,000 | Evidence pills light (Pill lit state), 150 ms stagger | 280 each |
| 8,000–11,300 | Resolved hold | — |
| 11,300–12,000 | Reset crossfade | 700 |

**Mobile (360 × 640):** lanes 320 × 64 at x 20, y = 24, 100, 176 (walls in the 12-unit gaps); version pills 80 wide. Release panel x 20, y 260, 320 × 212 with nodes 288 × 40 at y 296 + 44k. Evidence pills wrap across y 496 and 536.

**Reduced motion:** all lanes v1.4.1 lime, gate at 95% lime, canary and all-tenants lit, evidence pills lit, no intruder.

**Figcaption:** "Every tenant's data walled off. Every release has to pass its evals, then a canary, before it reaches everyone."
