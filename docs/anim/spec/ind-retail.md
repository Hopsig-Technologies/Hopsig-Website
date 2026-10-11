### 2. Retail & e-commerce — "Find the leak, fix it, keep stock true"

Shoppers flow through a five-step funnel as particles; many drop out at checkout (the leak, in amber). A fix drops onto the checkout step, fewer particles fall out, paid orders and weekly revenue climb. Then three disagreeing stock counts (store, warehouse, app) snap to one number.

**Artboard:** 1200 × 560. Loop 10,000 ms. Seed 102. Particles: up to 80 (SVG).

**Layers, back to front**

1. Background and dot grid.
2. **Funnel bars**: five rects, width 100, rx 8, fill `--bg-raised`, stroke `--line`, at x = 70, 220, 370, 520, 670, vertically centred on y 256 (rect y = 256 − h/2). Heights (1 unit = 33.3 sessions): Sessions 300, Product page 198, Cart 111, Checkout 78, Paid 33.
   - Names micro centred under each bar at y 428: "SESSIONS", "PRODUCT", "CART", "CHECKOUT", "PAID". Counts `terminal` centred at y 450: 10,000 / 6,600 / 3,700 / 2,600 / 1,100.
   - Thin connectors between bars at y 256, stroke `--line`.
3. **Particles**: spawn every 50 ms at (70, 256 ± seeded 120), travel right at 280 units per second, vertical position eased toward the next bar's height band. Each particle gets a seeded "furthest stage" matching the stage ratios (66%, 56%, 70%, 42%). At its drop stage it falls: y +60 and opacity → 0 over 600 ms (`ease-in-out-cubic`), colour `--ink-faint`; drops at Checkout are `--amber`. Particles reaching Paid turn `--lime` and fade at x 780.
4. **Leak label**: micro "LEAK · 58% ABANDON AT PAYMENT" at (470, 340), `--amber`, with a 10 × 14 droplet glyph at (452, 330), below the Checkout bar where the amber drops fall.
5. **Fix pill**: 220 × 28, rx 14, fill `--lime`, micro "GUEST CHECKOUT + WALLETS" in `--bg`, centred x 570, starting y 40 (opacity 0).
6. **Revenue tile**: Node 320 × 120 at (810, 96). Micro "REVENUE · THIS WEEK" at (+24, +30); value Space Grotesk 600, 36 px, at (+24, +80): "£96,800"; delta pill 64 × 22 at (+232, +62), hidden.
7. **Stock panel**: Node 320 × 180 at (810, 236). Micro "STOCK · SKU 1042" at (+24, +30). Rows at baselines +64, +104, +144: micro "STORE", "WAREHOUSE", "APP" at x +24; values node-label right-aligned at x +296: 14, 11, 17 in `--amber`. Footer micro "3 DIFFERENT COUNTS" at (+24, +170) in `--amber`.

**Timeline (10,000 ms)**

| t (ms) | What happens | Duration, easing |
| --- | --- | --- |
| 0–2,000 | Before: particles flow, amber drops at checkout, revenue £96,800, stock counts disagree | continuous |
| 2,000–2,600 | Leak label pulses twice (opacity 0.5 → 1 → 0.5 → 1) | 600 |
| 2,600–3,080 | Fix pill fades in and drops from y 40 to y 186, landing on the Checkout bar | 480, `snap` |
| 3,080 | Checkout → Paid ratio switches from 42% to 65% for newly spawned particles; leak label crossfades to "ABANDON 35%" in `--lime` | 200 |
| 3,080–4,400 | Paid bar grows 33 → 51 tall (y and height animate together, centred); Paid count 1,100 → 1,700; revenue counts £96,800 → £149,600 and turns `--lime`; delta pill "+55%" pops in (`snap`) | 1,300, `ease-out-quart` |
| 4,400–4,900 | A lime ring expands across the stock panel from its left edge (circle r 0 → 340, opacity 0.4 → 0, clipped to the panel) | 500 |
| 4,500–5,200 | Stock values count to 12, 12, 12 and turn `--lime`; footer crossfades to "ONE STOCK POSITION · SYNCED 2 S AGO" in `--lime` | 700, `ease-out-quart` |
| 5,200–9,300 | Resolved hold; particles keep flowing at the fixed ratio | — |
| 9,300–10,000 | Reset crossfade (ratios revert under the fade) | 700 |

**Mobile (360 × 640):** funnel bars horizontal instead of vertical: five bars 24 tall stacked at y 40 + 40k, widths proportional (max 300), left-aligned at x 20; particles hidden; leak label under the Checkout bar. Revenue tile x 20, y 260, 320 × 110. Stock panel x 20, y 390, 320 × 180.

**Reduced motion:** fix pill in place, Paid bar 51, revenue £149,600 with +55%, stock 12 / 12 / 12 in lime, no particles.

**Figcaption:** "Find where the funnel leaks and fix it. Keep store, warehouse and app on one stock number. Example figures."
