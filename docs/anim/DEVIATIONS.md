# Where a scene departs from its spec, and why

These are deliberate. Each was made while building against the spec in `spec/<id>.md` and verified frame by frame. Keep them.

## Global (all scenes)

- Colours come from `HA.T` (the site's real tokens), not the spec's sampled hex values. `--bg-raised` → `T.raised`, `--ink-faint` → `T.faint`, `--paper-ink` → `T.pink`, `#0A0C0F` panes → `T.log`, `--lime-halo` → Lime at .18.
- No drop shadows (Sheet has a 1 px edge; "lifts" are scale 1.02 + Lime stroke).
- Periods that do not divide the loop were snapped so the seam closes (drift 3,333 ms not 3,000; dash cycles; truck periods; particle trips).
- Texts sharing a baseline swap in two halves under the reset crossfade so glyphs never overlap.
- Captions are written by the page, not the scene; `EXAMPLE FIGURES` labels sit where the panel has room (noted per scene).

## home-agentic
Gate log lines appear instantly (not typed). Reset is a multiplicative `k` on every lit quantity rather than a two-layer crossfade (same visual, exact seam).

## agentic-strip
Travel is 3,400 ms + two 300 ms gate pauses = 4,000, then 1,200 ms rest, so the loop is exactly 5,200 (the spec's 4,000 + 600 + 1,200 = 5,800 did not fit). No pause button (the strip is a link; a button inside a link is invalid HTML).

## svc-custom-software
Handover sheet stack sits at y 404 (420 overflowed the frame). Table particles fly 3,800–4,500 to land as the table fades in. No `EXAMPLE FIGURES` label: the counters are the fictional app's own dashboard. Spec's fan positions overlap the sheets by 52 px, so "runbook.md" reads "runbook" — labels kept as specified.

## svc-team-augmentation
The "now" hand turns once per loop (a 60 s turn cannot close a 10 s seam), phased to read 11:00 on the resolved frame. Legend rows moved to y 468/488 (the "12" hour label collided). Milestone labels left-aligned on their cell (centred, CALL and PROFILES collided). Counters crossfade under the reset rather than counting down.

## svc-data-engineering
Batch strip moved 20 px right (the row label was 198 px wide). Incremental segments cycle aligned to the loop. `EXAMPLE FIGURES` at (1130, 62), one row above "3 DIFFERENT ANSWERS".

## svc-ai-ml
Scoreboard value columns shifted right (the v3 row label is ~185 px). No question truncated (all fit at 12 px). `EXAMPLE FIGURES` inside the scoreboard's bottom band. "SHIP v3" keeps its case. A failed particle rests at x 400 until the next run.

## svc-cloud-devops
`EXAMPLE FIGURES` under the bill total (the top-right holds the total). Deploy label/counter 4 px lower. Git log shifts first, then types the fix at 92 cps. Run #483 stages are 350 ms each anchored on the spec's Plan window (Smoke ends 5,100, PASSED 5,450).

## svc-legacy
Particle trip 1,667 ms (10,000 / 6), spawn every 69 ms. Square travel 600 ms from s+200+30n. Parity clamps at 100.0 (spring overshoot). No `EXAMPLE FIGURES` (parity is tool UI).

## svc-mobile
"7-DAY SESSIONS" (the spec's label overflowed a 118 px column). `EXAMPLE FIGURES` bottom-right of the stats panel. Train legs 500 ms + 50 ms gaps; the train dot fades on reaching LIVE. Lime trail on the fork and between pills added.

## svc-qa
Flaky rows are 3, 6, 11, 15 (search, invoice, upload, notify — the fix messages name those files; the spec's row numbers pointed at export/report). Fix line types at 80 cps. `EXAMPLE FIGURES` under the suite-time header. SLO line Lime at .6 opacity (static Lime in the before state is otherwise against the rule).

## ind-fintech
Row 1 types at 80 cps. `EXAMPLE FIGURES` above the ledger header (the header line is full). Token card sits 16 above the node. Totals go faint → ink; only DIFFERENCE 0.00 is Lime.

## ind-retail
80-particle pool, ≤ ~53 alive; spawns are a pure function of t and continuous across the seam; particles fade in over 150 ms. Falling particles keep a short horizontal drift. `EXAMPLE FIGURES` in both the revenue tile and the stock panel. Fix pill y is its top edge. Ring sweep is linear so it is visible.

## ind-healthcare
Compliance list reads `BAA / DPA [TO CONFIRM]`, `DATA STAYS IN YOUR CLOUD ACCOUNT`, `AUDIT LOG APPEND-ONLY`, `ACCESS TIME-BOXED AND LOGGED`; long items wrap to two lines. Card tags use amber/lime mixed 40 % toward paper-ink for legibility on paper. No audit header row (spec gives none). Dashed access line drawn in two runs around the padlock.

## ind-logistics
Background-truck periods snapped to divisors of 12,000; loop trucks fade over the first/last 6 % of R2. Dead-zone entry/exit found once at build and used as constants (keeps update pure). "14" tag fades on arrival (it lands on the "LOADED 09:42" label). Reset crossfades the pickup truck out and a depot twin in.

## ind-iot
Estate on the canvas layer (positions set inline; the SVG's own dot grid hidden because the canvas draws it). Request types at 60 cps, response streams at 120 cps to land at 5,200. Connected links use a dimmed Lime base so the Flow dashes read. "PLAYING CACHED" uses `textLength` 104. Screen slide phases seeded 200–1,300 ms so no wrap lands on the seam. No `EXAMPLE FIGURES` (208 / 200+ is from the record).

## ind-saas
A second particle set crossfades in under the reset (speeds 40–80 u/s never divide 12 s). Intruder stops at y 194. Ticks sit after the node labels. Status "RELEASED · ALL TENANTS" added at 6,600. Version pills flip back during the reset. `EXAMPLE FIGURES` bottom-right of the release panel.

## agentic-flow-sim
"Run another story" runs the 700 ms reset and starts S1 directly. R2 re-runs Review with a short re-review output then returns to G2. The done line counts decisions live; the plan title becomes "PLAN V2 FOR YOUR SIGN-OFF" after a rejection; the Build bar runs over Build time minus travel. The phone's "No" button gets ink text and a paper-mixed border (outline style vanishes on paper). Hint stops on click or focus.

## agentic-never-wall
Seven rules (the site's list), four + three; labels wrap to two lines in `sans13` (the rule sentences do not fit at 15 px). Buttons are transparent `HA.button` controls over an SVG face (padlock, raised fill, label) so keyboard/focus/screen-reader paths hold. Log line: `blocked › <rule> · needs a person` with short rule names (pre-merge hook, guardrail lock, environment policy, scope policy, sign-off policy, spend policy, stop signal).

## ai-transformation
A particle run is 900 ms in all (660 travel over three legs + two 120 ms pauses) so it stays inside its week. Caption swap completes in the 200 ms before each boundary so `t = N × 1000` shows week N. Before-value pulse is one dip 1 → .4 → 1 over 400–800 ms. After-values switch from "—" to counting at 1,500 with a 200 ms crossfade, ink while counting, Lime from W6. `EXAMPLE FIGURES` at (1106, 96) as specified.
