### B. The "never" wall (second figure, under the simulator)

**Artboard:** 1200 × 320. Heading in HTML above it: "What agents never do."

- **Eight buttons** (HTML, disabled-looking but focusable), each 248 × 56, rx 10, fill `--bg-raised`, stroke `--line`, in two rows: y = 48 and y = 120; x = 70, 336, 602, 868. Label node-label `--ink-dim` at left padding 44; a 12 × 14 padlock icon at left padding 18, stroke `--ink-faint`.
- Labels (use the site's own list where it differs): "Merge to main", "Deploy to production", "Add scope", "Spend money", "Skip the tests", "Change the plan unasked", "Read secrets", "Email your client".
- **Log strip**: rect x 70, y 208, 1060 × 64, rx 10, fill #0A0C0F, stroke `--line`; one `terminal` line at (94, 246), `--ink-dim`, initially "guardrails › 8 rules active".
- **On click or Enter:** the button shakes x 0 → −4 → 4 → −4 → 0 over 240 ms; its stroke turns `--red` for 400 ms then back to `--line`; the padlock rotates −8° → 0° over 280 ms; the log line is replaced (typed at 80 characters per second) with "blocked › \<rule> · \<label lowercased> needs a person", for example "blocked › pre-merge hook · merge to main needs a person".
- **Hint:** if the visitor hasn't clicked within 4 s of the figure entering view, outline one button at a time in `--ink-faint` 1.5 px, 1,200 ms each, until any interaction.

**Mobile:** buttons in one column, 320 × 48, 8 px apart, x 20; log strip after the last button.
