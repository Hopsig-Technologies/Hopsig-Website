### 1. Fintech & payments — "Payments that clear. Books that balance."

A tokenised £120 payment travels authorise → capture → settle → reconcile. A double-entry ledger writes its lines as it goes, and the totals land on a lime "difference 0.00". Beside it, switching tokenisation on shrinks the card-data scope box from four systems to one.

**Artboard:** 1200 × 560. Loop 12,000 ms. Seed 101.

**Layers, back to front**

1. Background and dot grid.
2. **Lifecycle rail**: four Nodes 200 × 56 at y 96, x = 70, 360, 650, 940 (centres x 170, 460, 750, 1040). Micro index "01"–"04" at (+14, +22); node-label at (+14, +42): Authorise, Capture, Settle, Reconcile. Connectors at y 124.
3. **Payment token**: Sheet rect 104 × 36, rx 6, centred over the active node at y 62. Mono 11 `--paper-ink` at (+10, +15): "tok\_8f2a"; Space Grotesk 13 at (+10, +30): "£120.00". Starts opacity 0 over Authorise.
4. **Ledger panel**: rect x 70, y 200, 680 × 300, rx 12, fill #0A0C0F, stroke `--line`. Header micro at y 232, `--ink-faint`: "STAGE" x 94, "ACCOUNT" x 214, "DEBIT" right-aligned at x 590, "CREDIT" right-aligned at x 726.
   - Seven row slots, `terminal` 13, baselines y = 264 + 24k (hidden until posted):

| Row | Stage | Account | Debit | Credit |
| --- | --- | --- | --- | --- |
| 1 | AUTH | Customer funds held (no posting) | — | — |
| 2 | CAPTURE | Receivable · PSP | 120.00 |  |
| 3 | CAPTURE | Payable · merchant |  | 116.40 |
| 4 | CAPTURE | Fee revenue |  | 3.60 |
| 5 | SETTLE | Bank | 120.00 |  |
| 6 | SETTLE | Receivable · PSP |  | 120.00 |
| 7 | RECONCILE | Bank statement line matched |  | Tick at x 712 |

Ledger styling:

- Stage column in `--ink-faint`; account `--ink-dim`; numbers `--ink`. Row 1 is entirely `--ink-faint`.
- Totals: rule at y 428 (`--line`); at baseline 452 micro "TOTAL" at x 94, debit total right-aligned at x 590, credit total right-aligned at x 726, both counters starting "0.00". Micro "DIFFERENCE" at (94, 484) with its value at (214, 484), hidden.

5. **Scope panel**: rect x 790, y 200, 340 × 300, rx 12, fill `--bg-raised`, stroke `--line`. Micro "CARD DATA SCOPE" at (814, 232).
   - Toggle: track 36 × 20, rx 10, at (1070, 218), fill `--line`; knob circle r 8 at (1080, 228), fill `--ink-dim`. Micro "TOKENISED" right-aligned at x 1062, y 232.
   - Systems: four Nodes 120 × 36, rx 8, node-label 13 px: "App" at (814, 260), "API" at (974, 260), "Ledger" at (814, 316), "PSP vault" at (974, 372).
   - Scope box: rect, dashed `5 4`, stroke 1.5. Before: x 802, y 248, 316 × 172, stroke `--amber`. After: x 962, y 360, 144 × 60, stroke `--lime`.
   - Scope label micro at (814, 450): before "IN SCOPE: 4 SYSTEMS" in `--amber`; after "IN SCOPE: PSP VAULT ONLY" in `--lime`.
   - Footnote micro at (814, 478), `--ink-faint`: "BUILT TO KEEP PCI DSS SCOPE SMALL".

**Timeline (12,000 ms)**

| t (ms) | What happens | Duration, easing |
| --- | --- | --- |
| 0–1,000 | Before: ledger empty, totals 0.00, scope box large and amber, toggle off | — |
| 1,000–1,400 | Token fades in over Authorise (y 54 → 62); Authorise node lit | 400, `ease-out-quart` |
| 1,200–1,600 | Ledger row 1 types | 40 characters per second |
| 1,600–2,300 | Token travels to Capture; connector 1→2 lime with Flow | 700, `ease-in-out-cubic` |
| 2,300–2,750 | Capture lit; rows 2, 3, 4 appear (opacity 0 → 1, x −6 → 0), 150 ms stagger; debit total counts to 120.00, credit total to 120.00 | 280 each |
| 2,900–3,600 | Token travels to Settle | 700 |
| 3,600–3,900 | Settle lit; rows 5, 6 appear; totals count to 240.00 / 240.00 | 280 each |
| 4,200–4,900 | Token travels to Reconcile | 700 |
| 4,900–5,200 | Reconcile lit; row 7 appears; its Tick draws | 280 |
| 5,200–5,700 | "DIFFERENCE" and "0.00" fade in, value in `--lime` with a Tick; ledger panel stroke flashes `--lime` (opacity 0 → 1 → 0.4) | 500 |
| 6,000–6,200 | Toggle switches on: knob x 1080 → 1096, track fill `--lime`, knob `--bg` | 200, `snap` |
| 6,200–6,900 | Scope box animates from the before rect to the after rect (x, y, width, height interpolated — the one permitted size animation here), stroke `--amber` → `--lime`; App, API and Ledger fade to 50% opacity; label crossfades | 700, `ease-in-out-cubic` |
| 7,000–11,300 | Resolved hold | — |
| 11,300–12,000 | Reset crossfade | 700 |

**Mobile (360 × 640):** rail as four pills 74 × 32 at y 24 (x 20, 102, 184, 266) with short labels "AUTH", "CAPTURE", "SETTLE", "RECON"; token sits at y 64. Ledger x 20, y 112, 320 × 300 with columns ACCOUNT (x 36), DEBIT (right at 248), CREDIT (right at 324); stage column dropped. Scope panel x 20, y 428, 320 × 188, systems 2 × 2 at 136 × 32.

**Reduced motion:** all rows posted, totals 240.00 / 240.00, difference 0.00 lime, scope small and lime, toggle on.

**Figcaption:** "Every payment posts as balanced double entries and reconciles to the bank. Tokenisation keeps card data in the payment provider's vault. Example figures."
