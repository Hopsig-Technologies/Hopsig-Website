### 7. Mobile — "One codebase, two stores, works offline"

One code panel feeds two phones (iOS and Android) that build the same screen at the same moment. Both lose signal, the visitor sees two items queue in amber, the connection returns and they sync to lime. A release train then carries build 142 to live while crash-free sessions climb.

**Artboard:** 1200 × 560. Loop 12,000 ms. Seed 77.

**Layers, back to front**

1. Background and dot grid.
2. **Code panel**: rect x 70, y 96, 300 × 348, rx 12, fill #0A0C0F, stroke `--line`. Micro "ONE CODEBASE" at (94, 124). `terminal` 12 px lines at x 94, baselines 160 + 22k: "export function Cart() {", "  const items = useSync('cart')", "  const add = useQueue(addItem)", "  return \<List items={items} />", "}". Keywords (`export`, `function`, `const`, `return`) in `--ink`; the rest `--ink-dim`.
3. **Fork**: connector from (370, 254) to (410, 254). From there: a straight connector to phone A at (450, 254); and a path to phone B: (410, 254) → (410, 464) → (830, 464) → (830, 444), round joins.
4. **Phone A (iOS)**: rect x 450, y 64, 220 × 380, rx 32, fill `--bg-raised`, stroke `--line` 1.5. Screen rect inset 10, rx 24, fill #0A0C0F. Notch pill 64 × 14, rx 7, centred at (560, 84), fill `--bg`.
5. **Phone B (Android)**: rect x 720, y 64, 220 × 380, rx 26, same fills. Punch-hole circle r 5 at (830, 86).
6. **Phone UI** (identical in both; offsets from the phone's top-left):
   - Signal: three bars 3 wide, heights 4, 7, 10, at (+176, +80 − height), fill `--ink-dim`. Offline state: fill `--ink-faint` plus a 1.5 px diagonal slash.
   - Offline banner (hidden): rect (+10, +98), 200 × 24, fill `--amber` at 15%, micro text at (+22, +114) in `--amber`.
   - Title "Cart" node-label at (+24, +136).
   - List rows: rect 172 × 36, rx 8, at (+24, +148 + 44k), fill `--bg-raised`, stroke `--line`; two line-rects inside (90 × 6 and 54 × 6). Rows 0–1 exist; rows 2–3 are added later.
   - Queued marker: a 3 × 36 rect at the row's left edge, `--amber`, plus micro "QUEUED" at (+148, row y + 22).
   - Add button: rect 172 × 32, rx 16, at (+24, +328), stroke `--lime`, micro "ADD ITEM" centred in `--lime`.
7. **Stats panel**: rect x 980, y 64, 150 × 380, rx 12, fill `--bg-raised`, stroke `--line`. Micro "CRASH-FREE" at (996, 92); value at (996, 130) Space Grotesk 600 28 px "97.1%"; micro "SESSIONS · 7 DAYS" at (996, 150), `--ink-faint`. Rule at y 172. Micro "OFFLINE QUEUE" at (996, 200); value at (996, 238) "0". Rule at y 260. Micro "SYNC CONFLICTS" at (996, 288); value at (996, 326) "0".
8. **Release train**: four pills 150 × 32 at y 480, x = 450, 620, 790, 960: "BUILD 142", "BETA TRACKS", "STORE REVIEW", "LIVE". Connectors between them at y 496. A train dot r 6 `--lime` (with halo) starts at (440, 496).

**Timeline (12,000 ms)**

| t (ms) | What happens | Duration, easing |
| --- | --- | --- |
| 0–1,000 | Before: phone screens empty; code lines grey | — |
| 1,000–1,600 | A lime particle (r 4) runs from the code panel along the fork and splits into two, arriving at both phones together | 600, `ease-in-out-cubic` |
| 1,600–2,600 | Both phones build the UI in sync: signal, title, rows 0–1, Add button, each opacity 0 → 1 and y +8 → 0, 80 ms stagger | 280 each, `ease-out-quart` |
| 3,000–3,200 | Both go offline: signal bars dim and slash; banner slides in (y −24 → 0) with "OFFLINE" | 200 |
| 3,400 | Tap on Add (both phones): ripple circle at the button's centre, r 4 → 24, opacity 0.5 → 0, `--lime`; row 2 appears with queued marker; banner "OFFLINE · 1 QUEUED"; queue value 0 → 1 in `--amber` | ripple 400; row 280 |
| 4,000 | Second tap: row 3 queued; banner "OFFLINE · 2 QUEUED"; queue 2 | same |
| 5,000 | Signal returns; banner turns lime-tinted with "SYNCING…" in `--lime` | 200 |
| 5,000–5,600 | Queued markers turn `--lime` one after another (150 ms apart); queue counts 2 → 0 | 280 each |
| 5,600 | Banner "SYNCED" with a Tick; slides out at 6,000 | 200 |
| 6,200–8,400 | Train dot travels the four pills, 500 ms per leg (`ease-in-out-cubic`), each pill filling `--lime` when reached; crash-free counts 97.1% → 99.8% (one decimal) and turns lime at the end | 2,200 total |
| 8,400–11,300 | Resolved hold | — |
| 11,300–12,000 | Reset crossfade | 700 |

**Mobile (360 × 640):** code panel hidden (caption names it); two phones 150 × 260 side by side at (20, 24) and (190, 24), UI scaled 0.68. Stats as a row of three tiles 100 × 72 at y 304 (x 20, 130, 240). Release train as a vertical list of four pills 320 × 32 at y 396 + 44k.

**Reduced motion:** both phones built, four rows synced (lime markers), banner hidden, all release pills lime, crash-free 99.8%, queue 0.

**Figcaption:** "One codebase on iOS and Android. Works offline, syncs when back. Crash reporting live before the first store release."
