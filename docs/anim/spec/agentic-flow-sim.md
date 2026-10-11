### A. The simulator

**Artboard:** 1200 × 600 (`viewBox="0 0 1200 600"`, container `aspect-ratio: 2 / 1`). No loop; a state machine. Seed 7.

**Interactive controls are real HTML buttons**, absolutely positioned over the SVG using percentages of the artboard (left = x / 1200, top = y / 600), so they work with keyboard and screen readers. Focus ring: 2 px `--lime`, offset 2 px.

**Layers, back to front**

1. Background and dot grid.
2. **Pipeline row**: the six nodes from the home band (140 × 56, rx 10) at y = 64, x = 70, 254, 438, 622, 806, 990. Connectors at y = 92. Gate 1 diamond centred (232, 92), Gate 2 centred (784, 92). Gate 3 diamond centred (1060, 156), joined to Escalate by a vertical connector from (1060, 120) to (1060, 146).
3. **Story card**: as on the home band, centred above the active node at y = 30 (card y range 10–50 is fine; it sits over the top edge of the row). Text "STORY-142 · Add refund endpoint".
4. **Agent pane** (left): rect x 70, y 200, 640 × 340, rx 12, fill #0A0C0F, stroke `--line`.
   - Header at (94, 232): micro "AGENT" in `--ink-faint`, then the active stage name in node-label `--ink` at (160, 232).
   - "INPUT" micro at (94, 272); input text in `terminal` style at (94, 296), wrapped at 590 units.
   - "OUTPUT" micro at (94, 360); output lines in `terminal` style from baseline 384, 22 units apart, max 6 lines, typed at 60 characters per second.
   - A 2 px progress line along the pane's bottom edge (y 538, x 70 → 710) fills `--lime` over the stage's run time, `linear`.
5. **Gate pane** (right): rect x 734, y 200, 396 × 340, rx 12, fill `--bg-raised`, stroke `--line`. Idle text centred at (932, 370): micro "NO DECISION NEEDED YET" in `--ink-faint`.
6. **Primary button** (HTML): "Run a story", centred at (600, 572), 200 × 44, the site's lime primary style.

**States and transitions**

| State | What is on screen | Visitor action → next |
| --- | --- | --- |
| S0 Idle | All nodes idle; card hidden; agent pane shows micro "PRESS RUN" centred in it | "Run a story" → S1 |
| S1 Plan running | Card fades in over Plan (400 ms, `ease-out-quart`); Plan node lit; agent pane: input "Ticket: refunds for partially captured payments"; output "4 tasks · touches payments/refunds", "risk: duplicate refunds (idempotency)", "estimate: 3 days". Run time 2,000 ms | auto → G1 |
| G1 Plan gate | Gate 1 diamond `--amber`, scale 1 → 1.15 → 1 every 1,200 ms. Gate pane shows micro "PLAN FOR YOUR SIGN-OFF", then four numbered lines in node-label: "Add POST /refunds", "Idempotency key per refund", "Ledger reversal entry", "Tests: partial, full, duplicate". HTML buttons: "Approve plan" (lime, 164 × 40 at x 754, y 476) and "Reject" (outline, 164 × 40 at x 946, y 476) | Approve → S2. Reject → R1 |
| R1 Reject | Gate pane swaps to micro "WHY?" and three pill buttons stacked at x 754, y 272 / 320 / 368, each 356 × 36: "Scope too large", "Missing a case", "Wrong approach" | Pick one → card shakes x ±4 three times (240 ms), the agent pane prints "revising › \<reason>" and one changed output line (e.g. "added: refund above captured amount → 422"), runs 1,400 ms → back to G1 |
| S2 Stories | Card travels to Stories (700 ms `ease-in-out-cubic`), connector lights with Flow. Output: "3 stories", "11 acceptance criteria", "linked to plan v2" (v1 if no rejection). Run 1,800 ms | auto → S3 |
| S3 Build | Output: "branch feat/refunds", "14 files changed", "38 tests added", "CI: green". Run 2,400 ms; a 2 px progress bar inside the Build node grows 0 → 112 | auto → S4 |
| S4 Review | Output: "2 comments: missing currency check; unclear name", "fixed in 2 commits", "coverage 81% → 87%". Run 2,000 ms | auto → G2 |
| G2 Merge gate | Gate 2 amber pulse. Gate pane: micro "PULL REQUEST", then lines "+412 −37 · 14 files", "CI green · coverage 87%", and a lime-outlined note in micro "AGENTS CANNOT MERGE TO MAIN". Buttons "Approve merge" / "Request changes" at the same positions as G1 | Approve → S5. Request changes → R2 (same as R1, reasons "Needs a test", "Naming", "Split the PR"), back to S4 |
| S5 Document | Output: "README › Refunds", "runbook › failed refunds", "changelog entry". Run 1,600 ms | auto → S6 |
| S6 Escalate | Escalate node lit; Gate 3 amber. Gate pane becomes a phone notification: rect 300 × 150, rx 18, centred at (932, 330), fill `--paper`; micro "HOPSIG PIPELINE · NOW" at its top-left inside 16 px padding; text in Space Grotesk 15 `--paper-ink`: "Refunds over £10,000: require finance sign-off?" Buttons "Yes" and "No", 120 × 36 each, inside the phone, top-left at (800, 352) and (936, 352) | Either → S7 |
| S7 Shipped | Gate 3 resolves (fill lime, tick). All nodes lime. Card text becomes "SHIPPED" with a tick. Agent pane prints "done › 3 decisions made by a person, 0 merges by an agent". Primary button label becomes "Run another story" | → S0 (reset crossfade 700 ms) |

**Gate resolve animation** (every gate): diamond fill `--lime` and tick draw in 280 ms `ease-out-quart`; a ring circle r 10 → 28, opacity 0.6 → 0, stroke `--lime`, 400 ms.

**Mobile (360 × 760, container `aspect-ratio: 360 / 760`):** pipeline vertical as on the home band, nodes 220 × 40 at y = 24 + i × 56 (i = 0–5), gate diamonds in the gaps between nodes 1–2 and 4–5, Gate 3 to the right of Escalate at (316, 324). Agent pane at y 360, 320 × 200 (x 20), max 4 output lines. Gate pane at y 576, 320 × 160. Primary button below the artboard in HTML, full width.

**Reduced motion:** same states, no travel or pulse: card jumps, panes swap instantly, text appears whole.

**Figcaption:** "Run a story through the pipeline. Agents do the work; a person signs every gate."
