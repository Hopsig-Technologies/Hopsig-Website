### 5. IoT, signage & the built environment — "200+ buildings, still playing when the network drops"

An isometric estate of 208 buildings lights up as telemetry arrives, a partner API returns a live reading, then the network link is cut: the signage screens keep playing from cache while messages queue on the devices, and flush when the link returns.

**Artboard:** 1200 × 560. Loop 12,000 ms. Seed 105. The estate has more than 150 moving shapes, so draw it on a `<canvas>` under the SVG (same 1200 × 560 coordinate space, device-pixel-ratio aware).

**Layers, back to front**

1. Background and dot grid.
2. **Estate (canvas)**: tiles (i, j) for i = 0–15, j = 0–12 (208 buildings). Base centre x = 420 + (i − j) × 18, y = 120 + (i + j) × 9. Each building is an isometric box: top face a rhombus 36 wide × 18 tall centred on (x, y − h); left face and right face parallelograms dropping h units to the base. Height h seeded between 6 and 24. Fills: top `--bg-raised`, left #121418, right #181B20; no strokes. Draw in order of increasing i + j so nearer boxes overlap farther ones.
   - Lit state: top face fill `--lime` at opacity 0.35 (flash to 0.85 first).
3. **Estate counter**: micro "BUILDINGS REPORTING" at (70, 452); value Space Grotesk 600, 40 px at (70, 496): "0" → "208". To its right a sparkline 220 × 40 at (240, 460): 40 points of seeded kWh values, stroke `--ink-dim`, drawn as the sweep runs.
4. **Screens**: three rects 120 × 72, rx 6, fill #0A0C0F, stroke `--line`, at y 96, x = 760, 890, 1020. Inside each (inset 6): a slide rect 108 × 54 crossfading between `--bg-raised` and #1C2026 every 1,500 ms; a 2 px progress bar at (+6, +66) growing 0 → 108 every 1,500 ms in `--lime`, always running (seeded phase per screen). Status tag micro at (+8, +16), hidden.
5. **Links**: three vertical connectors from each screen's bottom centre (820, 168), (950, 168), (1080, 168) down to y 220, stroke `--lime` with Flow.
6. **Broker**: Node 380 × 44 at (760, 220). Micro "PLATFORM · MQTT" at (+14, +18); status node-label right-aligned at (+366, +30): "Connected" in `--lime`.
7. **Queue meter**: micro "QUEUED ON DEVICES" at (760, 292); value `terminal` right-aligned at (1140, 292): "0"; track at (760, 276), 380 × 6, rx 3, `--line`; fill bar on top.
8. **API console**: rect x 760, y 316, 380 × 184, rx 12, fill #0A0C0F, stroke `--line`. Micro "PARTNER API" at (784, 344). `terminal` 12 lines at x 784, baselines 372 + 22k: line 0 "GET /buildings/0142/telemetry" (method in `--lime`); response lines 1–5: "200 OK · 38 ms", "{", "  "occupancy": 0.62,", "  "kwh\_today": 418.3,", "  "status": "online" }". All hidden at start.

**Timeline (12,000 ms)**

| t (ms) | What happens | Duration, easing |
| --- | --- | --- |
| 0–1,000 | Before: estate dark, counter 0, screens playing, link connected | — |
| 1,000–3,780 | Sweep: building (i, j) lights at t = 1,000 + (i + j) × 100 + seeded 0–80 ms: top face flashes to 0.85, settles to 0.35. The counter increments with each; the sparkline draws in step | 600 per building, `ease-out-quart` |
| 4,000–5,200 | Console types the request, then the response (60 characters per second) | `linear` |
| 5,400 | Link cut: each connector splits with a 10-unit gap at its midpoint (y 194), flashes `--red` 400 ms, then `--ink-faint` dashed `3 4`; broker status "Link down" in `--amber`; screen tags "PLAYING CACHED" in `--amber`. Screens keep playing | 400 |
| 5,400–7,400 | Queue meter fills to 70% width, value counts 0 → 1,284, colour `--amber` | 2,000, `linear` |
| 7,600 | Link restored: gaps close, connectors `--lime` with Flow; broker "Connected" | 280 |
| 7,600–8,400 | 24 lime particles fly from the screens' bottoms up to the broker (25 ms stagger, 600 ms each); meter drains 1,284 → 0 and turns `--lime`; screen tags become "SYNCED" in `--lime`, fading out at 8,600 | 800, `ease-in-out-cubic` |
| 8,600–11,300 | Resolved hold | — |
| 11,300–12,000 | Reset crossfade (estate fades to dark) | 700 |

**Mobile (360 × 640):** estate 10 × 8 buildings (80) at half scale (tile 18 × 9, base centre x = 180 + (i − j) × 9, y = 40 + (i + j) × 4.5), still on canvas. Counter at (20, 196). Screens three 96 × 56 at y 240, x 20, 132, 244. Broker x 20, y 330, 320 × 40. Queue meter at y 388. Console x 20, y 420, 320 × 176, five lines.

**Reduced motion:** all 208 buildings lit at 0.35, counter 208, sparkline drawn, console shown, link connected, queue 0.

**Figcaption:** "Telemetry from 200+ buildings on one platform. Screens keep playing when the network drops and sync when it returns."
