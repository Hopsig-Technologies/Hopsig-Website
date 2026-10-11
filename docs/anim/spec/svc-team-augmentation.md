### 2. Team augmentation — "In your standup in ten working days"

Two time-zone rings turn into alignment to show the daily overlap; a calendar counts ten working days (skipping the weekend); a senior engineer's role pill slides into the client's standup and ships a first ticket.

**Artboard:** 1200 × 560. Loop 10,000 ms. Seed 22.

**Layers, back to front**

1. Background and dot grid.
2. **Overlap dial** centred (250, 262). Both rings are a 24-hour GMT dial: 0:00 at the top, clockwise, 15° per hour.
   - Outer ring (London) r = 150, track stroke `--line` 10. Working arc 09:00–17:30 = 135° → 262.5°, stroke `--ink-faint` 10, round caps.
   - Inner ring (Lahore) r = 118, track stroke `--line` 10. Working arc 09:00–18:00 PKT = 04:00–13:00 GMT = 60° → 195°, stroke `--ink-faint` 10. The whole inner ring group starts rotated −90°.
   - Overlap: arcs from 135° to 195° on both rings, stroke `--lime` 10, opacity 0; a wedge between r 118 and r 150 over the same angles, fill `--lime-halo`, opacity 0.
   - Hour ticks: 24 lines on the outer edge (r 160 → 166), stroke `--line`; at 0, 6, 12, 18 h, micro labels "00", "06", "12", "18" at r 180.
   - "Now" hand: a line from the centre to r 100, stroke `--ink-dim` 1.5, rotating 360° over 60,000 ms (independent of the loop; under reduced motion fixed at 11:00 = 165°).
   - Centre: counter at (250, 262) in display-num, "0h" → "4h"; micro "DAILY OVERLAP" at (250, 292), centred, `--ink-dim`.
   - Legend at y 448: a 10 × 4 bar `--ink-faint` at x 132 + micro "LONDON 09:00–17:30" at x 148; a second bar at x 132, y 468 + "LAHORE 09:00–18:00 PKT".
3. **Standup board**: rect x 470, y 72, 660 × 260, rx 12, fill `--bg-raised`, stroke `--line`. Micro "YOUR STANDUP · 09:30" at (494, 104), `--ink-dim`.
   - Existing role pills at y 124 (height 32): "PRODUCT LEAD" x 494 w 124; "FRONTEND" x 626 w 92; "FRONTEND" x 726 w 92; "QA" x 826 w 44. Stroke `--line`, micro `--ink-dim`.
   - Empty slot: dashed rect (`4 4`) x 878, y 124, 200 × 32, rx 16, stroke `--ink-faint`.
   - New pill: "SENIOR BACKEND · .NET", 200 × 32, fill `--lime`, micro `--bg`; starts at x 1220 (off-board).
   - Mini board: three columns 196 × 128 at x 494, 704, 914, y 180, stroke `--line`, rx 8; micro heads "TO DO", "DOING", "DONE" at (+12, +20). Two grey ticket rects 172 × 24 already in DOING and DONE at (+12, +40). The new ticket "PAY-311" (172 × 28, rx 6, fill `--paper`, mono 11 `--paper-ink` at +10, +18) is hidden in TO DO at (+12, +76).
4. **Calendar**: rect x 470, y 360, 660 × 112, rx 12, fill `--bg-raised`, stroke `--line`. Micro "WORKING DAYS FROM THE CALL" at (494, 384). Right-aligned node-label at (1106, 384): "Day 0 of 10".
   - 14 cells, 36 × 36, rx 6, gap 6, from x 494 at y 398 (cell n at x = 494 + n × 42). Letters M T W T F S S repeated, micro centred. Weekend cells (n = 5, 6, 12, 13): dashed stroke `--ink-faint`, letters `--ink-faint`.
   - Milestone labels, micro `--ink-faint`, centred under cells at y 452: "CALL" (n 0), "PROFILES" (n 1), "INTERVIEW" (n 3), "ACCESS" (n 8), "STANDUP" (n 11).
5. Pause button.

**Timeline (10,000 ms)**

| t (ms) | What happens | Duration, easing |
| --- | --- | --- |
| 0–1,000 | Before: inner ring at −90°, all arcs grey; slot empty; calendar empty; "Day 0 of 10" | — |
| 1,000–2,200 | Inner ring rotates −90° → 0° | 1,200, `ease-in-out-cubic` |
| 2,200–2,700 | Overlap arcs and wedge fade in to opacity 1; centre counter 0h → 4h | 500, `ease-out-quart` |
| 1,200–6,200 | Weekday cells fill `--lime` (opacity 0 → 1, 160 ms) one every 500 ms: n = 0, 1, 2, 3, 4, 7, 8, 9, 10, 11. Weekend cells get a diagonal strike drawn in 160 ms when passed. The day counter increments with each fill. Milestone labels turn `--ink` as their cell fills | 160 per step |
| 6,200–6,900 | New pill slides from x 1220 to x 878; the dashed slot fades out | 700, `snap` |
| 6,600 | Ticket "PAY-311" fades into TO DO | 200 |
| 6,900–7,300 | Ticket moves to DOING column | 400, `ease-in-out-cubic` |
| 7,400–7,800 | Ticket moves to DONE; a lime Tick appears at its right edge; micro "FIRST COMMIT" in `--lime` appears under it | 400 |
| 7,900–9,300 | Resolved hold | — |
| 9,300–10,000 | Reset crossfade (inner ring snaps back to −90° under the fade) | 700 |

**Mobile (360 × 640):** dial centred (180, 150), outer r 110, inner r 84, legend hidden (put it in the caption). Standup board x 20, y 290, 320 × 170: pills wrap into two rows (y 330, y 370), mini board hidden, ticket shown under the pills. Calendar x 20, y 476, 320 × 140: two rows of seven 38 × 38 cells (gap 6), milestone labels hidden; counter at top right.

**Reduced motion:** rings aligned, overlap lit, 4h, all ten weekdays lit, new pill in place, ticket in DONE.

**Figcaption:** "Four hours of daily overlap with London. A senior engineer in your standup within ten working days."
