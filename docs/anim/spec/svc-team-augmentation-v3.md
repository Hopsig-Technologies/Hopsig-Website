## svc-team-augmentation (v3, replaces the overlap dial) — "In your standup in ten working days"

Why: owner decision 2026-10-11 (design & SEO review): no time zones or overlap anywhere on the site. The v2 scene's left half was a 24 h GMT overlap dial ("Daily overlap", London vs Lahore) and its standup read "· 09:30". This version keeps the v2 right half (standup board, ten-working-day calendar, ticket to first commit), unchanged in geometry and timing, and replaces the dial with a profiles panel that feeds the standup. Everything else follows `_shared.md` and `BRIEF.md`.

Artboard 1200 × 560, loop 10,000 ms, seed 22, resolved 8,600 ms, mode loop. No numbers that read as an outcome, so no `Example figures` label ("ten working days" is from the record).

### Layers

1. Background and dot grid (engine).
2. **Profiles panel** (replaces the dial): raised rect x 70, y 72, 360 × 400, rx 12, stroke `line`.
   - `micro` "Profiles, not a bench" at (94, 104), `dim`.
   - Three dashed slots (rx 8, stroke `faint`, dash 4 4) at x 94, y 124 / 200 / 276, 312 × 60: the before state.
   - Three profile cards over the slots (raised fill, stroke `line`): role in `label` at (+16, +26) — "Senior backend · Node.js", "Senior backend · .NET", "Senior data engineer"; under it a `mono11` line in `dim` — "Owned a production system", "Owned a production system", "Pipelines that run without you". Roles only: no names, no years (rules 1 and 3).
   - Card 2 (".NET", the role the standup pill carries) is the one you choose: at the interview it gets a `lime` 1.5 px stroke, a tick top-right and a `micro` "Interviewed" in `lime` right-aligned on its second line; the other two dim to 45 %.
   - `micro` line at (94, 440): "A replacement inside ten working days", `faint` → `ink` once the engineer is in the standup.
3. **Standup board**: as v2, with the title "Your standup" (no time).
4. **Calendar**: as v2 (ten working days from the call; milestones Call, Profiles, Interview, Access, Standup).

### Timeline (ms)

| t | Event |
|---|---|
| 0–1,200 | Before: empty dashed slots, grey calendar, empty standup slot |
| 1,200 + 500·n | Calendar fills one working day every 500 ms (as v2) |
| 1,700 / 1,860 / 2,020 | Profile cards arrive (opacity 0 → 1, x −6 → 0, `outQuart` 280) on the "Profiles" day |
| 2,700 | Interview day: card 2 lit (`lime` stroke), others to 45 % |
| 2,900 | Tick draws on card 2 (280); "Interviewed" fades in (200) |
| 6,200–6,900 | The lime pill "Senior backend · .NET" appears on card 2 and travels to the standup slot (878, 124), `snap`; the dashed slot fades |
| 6,600–7,900 | Ticket appears, moves To do → Doing → Done, tick, "First commit" (as v2) |
| 7,900 | Replacement line goes `faint` → `ink` |
| 8,600 | Resolved frame (everything lit, still) |
| 9,300–10,000 | Reset: every lit quantity × k (`inOutCubic`), the pill travels back under the fade; frame at 9,999 equals frame 0 |
