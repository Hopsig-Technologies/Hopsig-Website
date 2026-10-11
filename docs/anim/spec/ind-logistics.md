### 4. Logistics, travel & marketplaces — "Real-time, even on a bad connection"

A dispatcher drags a load onto a truck; the assignment reaches the driver instantly. The truck drives through a no-coverage zone, the driver app queues its events in amber, and they sync the moment signal returns.

**Artboard:** 1200 × 560. Loop 12,000 ms. Seed 104.

**Layers, back to front**

1. Background and dot grid.
2. **Map panel**: rect x 70, y 72, 700 × 420, rx 12, fill #0A0C0F, stroke `--line`. Micro "LIVE BOARD" at (94, 96).
3. **Roads** (stroke `--line` 2, round joins):
   - R1: M 100 420 L 260 300 L 420 320 L 600 180 L 740 120
   - R2: M 110 140 L 300 200 L 420 320 L 560 440 L 740 460
   - R3: M 260 300 L 300 200 L 480 110
4. **Dead zone**: rect x 470, y 220, 120 × 120, fill a hatch `<pattern>` (diagonal lines 1 px, 6 apart, `--line`), no stroke. Micro "NO COVERAGE" at (476, 236), `--ink-faint`.
5. **Pickup marker**: 12 × 12 square, rx 2, centred (600, 180), stroke `--ink-dim`. Micro "PICKUP · LOAD 7781" at (612, 168), hidden.
6. **Background trucks**: five circles r 5, fill `--ink-dim`, each with a ring r 9 stroke `--line`. Two loop along R2 (periods 9,000 and 11,000 ms), two along R3 (7,000 and 10,000 ms, ping-pong), one along R1's last segment (8,000 ms, ping-pong). Seeded start offsets.
7. **Truck 14**: circle r 7 at (260, 300), fill `--ink-faint`, ring r 12 stroke `--ink-faint`, micro "14" at (272, 292). Idle pulse: ring opacity 0.3 → 0.8 every 1,600 ms.
8. **Loads panel**: rect x 800, y 72, 330 × 260, rx 12, fill `--bg-raised`, stroke `--line`. Micro "UNASSIGNED · 3" at (824, 98). Three cards 282 × 48, rx 8, stroke `--line`, at x 824, y = 112, 172, 232: micro "LOAD 7781" at (+14, +18) and node-label at (+14, +38) "Leeds → Hull · 18 t"; "LOAD 7782" "York → Selby · 9 t"; "LOAD 7790" "Hull → Goole · 22 t".
9. **Driver app**: rect x 800, y 352, 330 × 140, rx 12, fill `--bg-raised`, stroke `--line`. Micro "DRIVER APP · TRUCK 14" at (824, 380). Signal bars at (1096, 380) as in the Mobile service spec. Status node-label at (824, 412): "Idle". Two event lines, `terminal` 12, at (824, 440) and (824, 464), each with a 3 × 14 marker at x 816.
10. **Cursor**: as in the home band, starting at (1210, 540).

**Timeline (12,000 ms)**

| t (ms) | What happens | Duration, easing |
| --- | --- | --- |
| 0–1,000 | Before: background trucks moving; truck 14 idle; three loads unassigned | continuous |
| 1,000–1,600 | Cursor travels to card 1 centre (965, 136) | 600, `ease-in-out-cubic` |
| 1,600–1,760 | Press: card lifts (shadow 0 8 20, scale 1.02) | 160 |
| 1,800–2,600 | A ghost of card 1 (opacity 0.85) follows the cursor to truck 14 at (260, 300), scaling 1 → 0.5 | 800, `ease-in-out-cubic` |
| 2,600 | Drop: three lime rings at truck 14, r 6 → 40, opacity 0.6 → 0, 150 ms apart; truck 14 fill and ring `--lime`; ghost fades; card 1 removed and cards 2–3 slide up 60 (280 ms); header "UNASSIGNED · 2"; driver status "Assigned · pickup Leeds" in `--lime`; event line 1: "pushed over websocket · 120 ms" with a lime marker; pickup label appears | rings 400 each |
| 2,800–6,800 | Truck 14 drives R1 from (260, 300) via (420, 320) to (600, 180), leaving a lime trail (path drawn behind it) | 4,000, `linear` along path length |
| While inside the dead-zone rect | Driver app offline: signal bars dim and slash; status "No signal" in `--amber`; 300 ms after entering, event line 1 becomes "queued · checkpoint passed" with an amber marker; 600 ms later line 2 "queued · ETA 09:41" amber; the truck's trail inside the zone is `--amber` | point-in-rect test each frame |
| On leaving the zone | Signal returns; both markers turn `--lime`, lines change "queued" → "synced"; status "Online · 2 events synced" | 280 |
| 6,800 | Arrival: pickup marker fills `--lime`; status "At pickup · loading" | 200 |
| 7,400 | Label at the pickup changes to "LOADED 09:42" in `--lime` with a Tick | 280 |
| 7,600–11,300 | Resolved hold (background trucks keep moving) | — |
| 11,300–12,000 | Reset crossfade (truck 14 returns to its depot under the fade, card 1 back in the list) | 700 |

**Mobile (360 × 640):** map x 20, y 24, 320 × 300 with all coordinates scaled 0.457 from the map panel's origin; dead-zone label hidden. Loads panel hidden; instead one load card 320 × 48 at (20, 340) that the cursor drags up onto the map. Driver app x 20, y 404, 320 × 140.

**Reduced motion:** truck 14 at pickup (lime) with its trail, amber segment in the zone, load assigned, both events synced, "LOADED 09:42".

**Figcaption:** "Assign a load and the driver has it instantly. In a dead zone the app queues events and syncs when signal returns."
