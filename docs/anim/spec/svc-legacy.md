### 6. Legacy modernisation — "One seam at a time"

Requests flow through a routing facade into a grey monolith. One seam at a time, a group of modules lifts out of the monolith into a new service, the route switches, and a parity bar shows old and new outputs matching before the next seam starts.

**Artboard:** 1200 × 560. Loop 10,000 ms. Seed 66. Particles: 24.

**Layers, back to front**

1. Background and dot grid.
2. **Requests pill**: 120 × 32, rx 16, at (70, 300), micro "REQUESTS", stroke `--line`.
3. **Routing facade**: Node 140 × 56 at (230, 288); micro "FACADE" at (+14, +22), node-label "Router" at (+14, +42). A connector from (190, 316) to (230, 316).
4. **Monolith**: an 8 × 6 grid of squares, 36 × 36, rx 4, gap 4, top-left (470, 200), so cell (c, r) is at x = 470 + 40c, y = 200 + 40r. Fill `--bg-raised`, stroke `--ink-faint`. Micro label "MONOLITH · 48 MODULES" at (470, 456).
5. **New services**: four Nodes 160 × 56 at y 72, x = 420, 600, 780, 960; labels "Auth", "Billing", "Reports", "Notifications" with micro "SERVICE" above. Idle opacity 0.35.
6. **Routes**: path router → monolith: straight line (370, 316) → (470, 316), stroke `--ink-faint`. Paths router → service i (hidden): cubic from (370, 316) via controls (400, 200) and (x\_i + 80, 200) to the service's bottom centre (x\_i + 80, 128), stroke `--lime`.
7. **Parity panel**: rect x 820, y 200, 310 × 236, rx 12, fill `--bg-raised`, stroke `--line`. Micro "PARITY · OLD VS NEW" at (844, 224). Four rows at y0 = 248 + 44i: micro service name at (844, y0); value at (1106, y0) right-aligned `terminal`, "—"; track (844, y0 + 12), 262 × 6, rx 3, `--line`; fill bar on top. Footer micro at (844, 424): "12,400 REPLAYED REQUESTS PER SEAM", `--ink-faint`.
8. **Traffic particles**: 24 loop continuously, each taking 1,600 ms from the requests pill to its destination (`linear`), spawned every 66 ms. Particle k is assigned to seam k mod 4. While its seam is unmigrated it follows the monolith path and is `--ink-faint`; once migrated it follows that service's path and is `--lime`.

**Seams:** Auth = columns 0–1, rows 0–4; Billing = columns 2–3, rows 0–4; Reports = columns 4–5, rows 0–4; Notifications = columns 6–7, rows 0–4. Row 5 (8 modules) stays.

**One seam (1,600 ms), starting at s:**

| Offset (ms) | What happens | Duration, easing |
| --- | --- | --- |
| s + 0 | The seam's 10 squares stroke `--lime` | 200 |
| s + 200 → s + 800 | They translate to the service's centre, scale 1 → 0.2, opacity → 0, 30 ms stagger; dashed outlines (`3 3`, `--ink-faint`) stay where they were | 600, `ease-in-out-cubic` |
| s + 800 | Service node opacity 0.35 → 1, stroke `--lime`; route path draws | 400, `ease-out-quart` |
| s + 1,000 → s + 1,300 | Parity bar fills to 97.3%, value text `--amber` "97.3%" | 300 |
| s + 1,300 → s + 1,600 | Bar completes to 100%, text "100.0%" in `--lime`, bar `--lime` | 300, `snap` |
| s + 1,200 | This seam's particles switch to the new route (on their next spawn) | — |

**Timeline (10,000 ms):** 0–1,200 before (all traffic to the monolith). Seams start at s = 1,200 (Auth), 2,800 (Billing), 4,400 (Reports), 6,000 (Notifications). At 7,600 the monolith label changes to "MONOLITH · 8 OF 48 MODULES LEFT" and the remaining 8 squares dim to 50%. Hold 7,600–9,300. Reset crossfade 9,300–10,000 (squares return to their cells under the fade).

**Mobile (360 × 640):** services as a 2 × 2 grid of 150 × 44 nodes at (20, 24), (190, 24), (20, 76), (190, 76). Router 140 × 44 centred (180, 160). Monolith 8 × 6 grid of 30 × 30 squares (gap 4) from (44, 220). Parity panel x 20, y 444, 320 × 168. Requests pill hidden; particles start at the router.

**Reduced motion:** all four services lit with routes, all parity bars 100.0%, monolith with 8 modules left and 40 dashed outlines.

**Figcaption:** "Each piece moves only when old and new give the same answers. You can stop after any seam and still have a working system."
