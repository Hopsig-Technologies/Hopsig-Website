### 5. Cloud & DevOps — "Deploys that are boring, a bill you can explain"

A CI run fails on a flaky test, a fix commit lands, the re-run goes green through `terraform plan` to deploy, and the deploy count ticks up. Then three fixes shrink the monthly cloud bill from $18,400 to $11,900.

**Artboard:** 1200 × 560. Loop 12,000 ms. Seed 55.

**Layers, back to front**

1. Background and dot grid.
2. **Run label**: micro at (70, 80): "RUN #482" in `--ink-dim`.
3. **Pipeline**: six Nodes 150 × 56 at y 96, x = 70, 250, 430, 610, 790, 970. Micro index "01"–"06" at (+14, +22); node-label at (+14, +42): Lint, Test, Build, Plan, Deploy, Smoke. Connectors at y 124 between nodes (30 units each). Inside each node a 2 px progress bar at (+14, +50), max width 122.
4. **Git log**: rect x 70, y 200, 520 × 200, rx 12, fill #0A0C0F, stroke `--line`. Micro "GIT LOG · MAIN" at (94, 228). `terminal` lines at x 94, baselines 260, 284, 308: "a41f2c  feat: refund endpoint", "7d02e9  chore: bump deps", "c9a113  docs: runbook" in `--ink-dim`, hash in `--ink-faint`.
5. **Deploy counter**: micro "DEPLOYS THIS WEEK" at (94, 352); counter baseline at (94, 388) in Space Grotesk 600, 40 px, tabular numerals, starting at "11". Both sit inside the git-log box.
6. **Bill panel**: rect x 640, y 200, 490 × 200, rx 12, fill `--bg-raised`, stroke `--line`.
   - Micro "AWS BILL · MONTHLY" at (664, 228). Total at (1106, 232) right-aligned, Space Grotesk 600, 24 px: "$18,400".
   - Stacked bar at x 664, y 256, height 20, rx 4. Segment widths (1 unit = $41.63): Compute 173, Database 98, NAT egress 62, Storage 43, Other 66 (total 442). Fills: shades of `--ink-faint` alternating 100% / 70% opacity, 2-unit gaps.
   - Segment labels micro under each at y 296, `--ink-dim`: "COMPUTE", "DB", "NAT", "S3", "OTHER" (hide a label if its segment is under 40 wide).
   - Fix lines (`terminal` 12, hidden) at x 664, baselines 330, 354, 378.
7. **Plan strip**: rect x 70, y 424, 1060 × 84, rx 12, fill #0A0C0F, stroke `--line`. Line 1 at (94, 456): "$ terraform plan" in `--ink-dim`. Line 2 at (94, 484), typed later: "Plan: " `--ink`, "3 to add" `--lime`, ", ", "1 to change" `--amber`, ", ", "0 to destroy." `--ink-faint`.

**Timeline (12,000 ms)**

| t (ms) | What happens | Duration, easing |
| --- | --- | --- |
| 0–600 | Before: pipeline idle, bill at $18,400 | — |
| 600–1,000 | Lint runs (progress bar 0 → 122) and turns lime with a Tick at (+128, +16) | 400, `linear` |
| 1,000–1,400 | Test runs to 60% of its bar | 400 |
| 1,400 | Test fails: stroke and bar `--red`; micro "1 FLAKY TEST" in `--red` under the node at (+14, +72); run label becomes "RUN #482 FAILED" in `--red` | 160 |
| 2,400 | Red clears: Test node back to idle; label back to `--ink-dim` | 280 |
| 2,400–3,000 | New line types at the top of the git log (older lines shift down 24): "9be310  fix: deterministic clock in test" with the message in `--lime` | 600 |
| 3,000 | Run label "RUN #483"; all nodes reset | — |
| 3,000–5,450 | Stages run in order, 350 ms each, each ending lime with a Tick; connectors turn lime with Flow as each finishes. Plan (4,050–4,400) also types line 2 of the plan strip (4,050–4,750) | 350 each, `linear` |
| 5,450 | Run label "RUN #483 PASSED" in `--lime`; deploy counter 11 → 12 (scale 1.15 → 1, `snap`) | 280 |
| 5,600–6,400 | Fix 1: Database segment shrinks 98 → 52 (later segments slide left); line "− $1,900  idle read replica removed" fades in; total counts to $16,500 | 480, `ease-in-out-cubic` |
| 6,400–7,200 | Fix 2: NAT segment 62 → 21; "− $1,700  S3 traffic via VPC endpoint"; total $14,800 | 480 |
| 7,200–8,000 | Fix 3: Compute segment 173 → 103; "− $2,900  node pool right-sized"; total $11,900 turns `--lime` | 480 |
| 8,000–11,300 | Resolved hold | — |
| 11,300–12,000 | Reset crossfade | 700 |

In the fix lines, "− $1,900" etc. are `--lime`; the description is `--ink-dim`.

**Mobile (360 × 640):** pipeline as a 3 × 2 grid of nodes 100 × 48 (x 20, 130, 240; y 40, 100). Git log x 20, y 172, 320 × 120, two lines. Bill panel x 20, y 308, 320 × 200, bar 272 wide, fix lines as on desktop. Plan strip x 20, y 524, 320 × 72, plan line abbreviated to "+3 \~1 −0".

**Reduced motion:** run #483 passed, all lime, git log with the fix commit, deploys 12, bill at $11,900 with all three fix lines, plan line shown.

**Figcaption:** "A flaky test fixed, not retried. Infrastructure reviewed as a plan. A cloud bill cut from $18,400 to $11,900 a month (example figures)."
