# Hopsig website — v3 design brief

For: the design round (Claude Design), then the founders for sign-off. Written 11 October 2026 from @Arslan's "Design ideas & SEO review" (same date). The functional and copy parts of that review are already built (rounds R0–R8); this brief covers only the parts that need **new visual design** before anyone codes them.

The site is live at `hopsig-website.vercel.app`, and the v1 + v2 references are in `reference/site/` and `v2 handover/`. Design against the live build, not against older exports. Since the v1 export, rates, overlap and time zones have been removed, the legal identity has changed and the header has its AI capsule.

---

## 1. What does not change

These are fixed. A concept that needs one of them broken goes back to the founders as a question; it does not quietly break the rule.

- **Tokens.** Ink `#0E1116`, Paper `#F7F8F4`, Lime `#C6F24E` (dark surfaces only), Moss `#3F6B1F` (light surfaces), neutrals 100–900, and the `.tone-d` / `.tone-l` variable sets in `CLAUDE.md`. Space Grotesk 600/400 and IBM Plex Mono 400/500 only. The type scale in `CLAUDE.md` (do not normalise it). Radii 2–3 / 6 / 8 / 12 / 14. Container 1264 + 88 px.
- **One Lime moment per screen** on dark surfaces. The existing exceptions are the collapsed file-stack tabs and the header AI capsule. Light surfaces use Moss.
- **Depth from borders and tone changes only.** No drop shadows, gradients, glass, neon, 3D, stock imagery, "AI brain" or circuit motifs, or rounded friendly-SaaS styling.
- **Never invent proof.** Every number, name and outcome comes from the record (`content/case-studies.json`, the page modules in `web/content/`, Sanity). A number the record does not have yet is a visible bracketed placeholder (`[ADD THE NUMBER]`). Artboard UI may use fictional figures only when labelled `EXAMPLE FIGURES` on the artboard, as in v2.
- **Client names are withheld.** No people anywhere: no names, faces, photos or bylines other than "Hopsig engineering".
- **No rates, prices, time zones or overlap hours** (owner decisions, 11 Oct 2026).
- **Content works without JS and with reduced motion.** Every animated piece has a resolved static frame that carries the same information, and motion never hides text that should be indexable.
- **The motion system from v2.** The `HA` engine and its contract (`docs/anim/BRIEF.md`, `docs/anim/spec/_shared.md`) still apply: one clock, scenes as pure functions of `t`, seeded randomness, amber `#D9A441` for pending, red `#E06A55` for failure (≤ 1.2 s on screen), Lime inside an artboard meaning "done and correct". New scenes use that engine.

---

## 2. The idea: "the record"

The review's one-line concept: Hopsig shows evidence, not adjectives. The proof is 32 measured case notes with the clients withheld. v3 makes that proof the design through a few reusable motifs, so each page feels designed without each page needing its own system.

Design the motifs first (§3); the page pieces in §4 mostly reuse them.

---

## 3. Site-wide motifs (design once, reuse)

### 3.1 Redacted dossier card

- **What:** the case card (home case index, /work, industry pages, "More from the record") restyled as a dossier. A solid bar sits where the client name would be. On hover or focus the bar slides back to reveal the **sector descriptor**, never the name.
- **Content:** the reveal text is a new optional `caseStudy` field (`sectorDescriptor`, e.g. "Gulf property group"), written by the founders. Without it, the bar stays closed and reads "Client withheld". The rest of the card is today's content: number, domain, shape, title, Problem / What we did / Measured, stack.
- **Constraints:** the bar is Ink on light and neutral-700 on dark, never Lime. Touch has no hover: design the tap state, or show the descriptor statically below 900 px. Focus-visible ring as everywhere.
- **Deliver:** the card at full (/work "Selected") and compact (row) sizes, light and dark; closed, hover/revealed, focus, and no-descriptor states.

### 3.2 The number before the claim (before → after counter)

- **What:** a measured figure animates from its before value to its after value when it scrolls into view ($2K → $12K, 0 → 150+ merchants, a bar shrinking 60%).
- **Content limit (important):** most case notes record only the after value. The `caseStudy` schema will gain optional `metricBefore` / `metricAfter` (round R5), filled by the founders. Design three states:
  - **before and after known:** animates;
  - **after only:** the number lands with no count-up from an invented zero (a plain reveal, not a counter);
  - **placeholder:** `[ADD THE NUMBER]` shown plainly, no animation.
- **Reduced motion / no JS:** the final value, with the before value in small mono where known.
- **Deliver:** one component spec (mono numerals, timing, easing from the v2 set) in three sizes: hero facts 26/22, card metric, the home cursor card.

### 3.3 The SOW sheet

- **What:** the two-page scope document as an object: In / Out / Done-when columns that fill in on scroll, ending with a Week 6 stamp. **No cost line.**
- **Used on:**
  - the Custom software hero (replacing or extending the v2 `svc-custom-software` scene: decide which, and say why);
  - the services hub "Built" model;
  - the SOW note (`/notes/the-sow-is-the-pitch`);
  - the Brief page as a live preview (§4.9).
- **Deliver:** the static sheet (light and dark), the fill sequence as an `HA` scene spec, and the Brief variant that takes the visitor's own words.

### 3.4 The gate stamp

- **What:** wherever a person signs off, the same "Signed" stamp lands with a short, damped thud. The places are:
  - the agentic flow's three gates;
  - the fortnightly review beat;
  - the healthcare sign-off scene;
  - the Approach board's last card (§4.7).
- **Constraints:** the stamp names a **role** ("Signed · Reviewer", "Signed · Clinician"), never a person. Lime on dark, Moss on light, counted as that screen's one accent. Reduced motion: the stamp is already down.
- **Deliver:** the stamp mark, its landing motion (an `HA` primitive spec so every scene uses the same one), and the light/dark versions.

---

## 4. Page pieces

Each item: what it is, where it goes, what content it uses, and what to deliver. "Scene" means an `HA` scene with a spec in `docs/anim/spec/<id>.md` in the v2 format.

### 4.1 Home: hero as a live handover
- **What:** a sketch-style wireframe in pencil strokes that inks itself into a production UI with a "deployed" badge as the visitor scrolls. "You think it." is the sketch; "We finish it." is the shipped state.
- **Constraint:** the current hero is a 240vh scroll sequence with five beats (Day 0 → Fortnightly) over the ring canvas. Either fold the inking into that sequence or replace the ring. Say which, and keep the five beats (see 4.2).
- **Keeps:** the H1 with its keyword line, the tagline, two buttons, the three proof chips and the legal-identity line (all built in R8).
- **Deliver:** the desktop sequence storyboard (frames at each beat), the scene spec and the resolved frame.

### 4.2 Home: the five beats as a scrubbable timeline
- **What:** Day 0 → Day 3 → Day 10 → Week 6 → Fortnightly as a horizontal track with a draggable marker. Each stop shows its object:
  - Day 3: the SOW sheet (3.3);
  - Day 10: a first-commit card;
  - Week 6: a before/after metric (3.2, with `EXAMPLE FIGURES` unless it is a record number);
  - Fortnightly: the review with the gate stamp (3.4).
- **Constraints:** keyboard operable (arrow keys move between stops, each stop a real button), reduced motion = stops as a static row.
- **Deliver:** the track at rest and at each stop, plus focus states.

### 4.3 Home: services as tabs (shorter file stack)
- **What:** the nine-sheet sticky stack is good but long. Collapse it to eight index tabs: hovering or focusing a tab lifts that sheet's headline and three facts, and clicking opens the service page. The review estimates about 1,500 words less scroll.
- **Constraint:** the Lime-tab exception exists for the stack. If the tabs replace the stack, say whether that exception still applies.
- **Deliver:** rest, hover and focus states, and the transition into the agentic band that follows.

### 4.4 Services hub: three-door chooser
- **What:** two toggles ("Do you have a team?" / "Do you have a deadline?") open the matching door: Embedded, Built, or Data & AI. The H2 "Tell us the problem. We will tell you which of the three it is." becomes the interaction.
- **Also:** each model gets its own mock instead of the shared ones: engineer cards for Embedded (no faces or names, role and seniority only), the SOW sheet for Built, a before/after dashboard for Data & AI (`EXAMPLE FIGURES`).
- **Deliver:** the four toggle combinations and what each opens; the three model mocks.

### 4.5 Industries hub: the mosaic
- **What:** six tiles, each a tiny live scene: a ledger ticking (fintech), a funnel (retail), a heartbeat line (healthcare), a moving truck (logistics), a building grid (IoT), a stack of tenants (SaaS). Hover or focus enlarges a tile and shows its headline number.
- **Content:** the number comes from the row's hub fact (built in R8: 150+, 5×, 60%, 500%, 200+, 98%). The keyword paragraph and note count stay as text under the mosaic or inside the tiles, because they are the page's indexable copy.
- **Constraint:** six simultaneous loops. Respect the v2 performance budget (shared clock; canvas only above 150 moving shapes).
- **Deliver:** the six tile scenes (small artboards), rest and expanded states.

### 4.6 Work: the evidence wall
- **What:** /work with every note as a dossier card (3.1) with the counter (3.2).
- **Built in R8:** the filters (industry, service, "with a number"). Design their motion: cards leaving and arriving, not a hard cut.
- **Sort:** we deliberately did **not** build a sort (newest / biggest number). The record has no reliable dates per case, and the numbers are not comparable across units (×, %, $, counts). Do not design one unless the founders add dated, comparable fields.
- **"Closest to my problem" picker:** the review's two-question picker (industry + service) is the same as the filters. Fold it in rather than adding a second control.
- **Deliver:** the wall at 1440 with filters on and off, and the filter transition.

### 4.7 Company pages (one visual each)
- **Approach:** a "how an account runs" board with three columns (Staff · Deliver · Review). Cards move across as the visitor scrolls and end on the gate stamp "A person signs every increment".
- **Working with us:** a procurement checklist with tick boxes (Contracts, IP, Data, Security, Insurance, Invoicing, Subcontracting, Company) and a "Download as PDF for procurement" button.
  - Design the printable PDF as well (A4, the same content, no animations, Paper tone).
  - Values that are still placeholders (insurer, certifications, tax status, bank country) print as placeholders.
- **For agencies:** a white-label toggle. A mock SOW header flips between "Your Agency Ltd" (a fictional example name, labelled as such) and Hopsig, while the engineering content underneath stays identical.
- **Join:** the five-step vetting track as a path from "Send a shipped system" to "Written offer", with "No whiteboard puzzles" as the first square.
  - Steps come from `joinPage.ts`.
  - No GMT or overlap hours anywhere.
- **Why not just hire:** a situation picker ("3 months / 2 years", "I can manage them / I can't") that lights the matching column of the comparison table. Sometimes that column is not Hopsig, and that honesty is the hook.
  - The table is now a real `<table>` (R8); keep it as the source of truth and the no-JS state.

### 4.8 AI transformation: the "5 → 1" band
- **What:** five developer outlines collapse into one plus an agent pipeline, for the record's claim "Two Android apps scoped at five developers were shipped by one, on the original timeline" (`aiTransformationPage.ts`, `agenticFlowPage.ts`). Give it its own band.
- **Constraints:** the outlines are abstract shapes, not people or faces (rule 3). This is a record number, so it carries no `EXAMPLE FIGURES` label.
- **Also:** a "Friday dashboard" with a Week 0 ↔ Week 6 slider over five metrics. The v2 `ai-transformation` scrub already does before/after. Say whether the slider replaces it or is dropped. Its figures need the founders' agentic-delivery numbers; until then it is `EXAMPLE FIGURES`.

### 4.9 Book and Brief
- **Book:** a two-panel layout with the booking tool on the left (a Cal.com embed styled to the tokens, in the visitor's time zone, no GMT label) and a "What happens next" strip on the right (invite → 30-minute call → two-page scope in three days), each step lighting up as the visitor moves through. Design for the embed's real constraints: we can theme its colours and fonts, not its layout.
- **Brief:** a live SOW preview (3.3) builds beside the form from the visitor's answers (problem → In, timeframe → When, budget band → nothing shown, since no prices). Submitting sends both.

### 4.10 Notes
- **Built in R8:** the index already has dates and the byline; note pages have a sticky linked contents list.
- **Still to design:**
  - **pull-quote cards:** one bold line per note, styled for sharing, with a matching OG image variant;
  - **a "Disagree with one?" closing:** a one-field form that routes to the brief.
- **Not in scope:** reading time (owner decision: no reading time).

### 4.11 Mobile animation artboards (owed from v2)
- The v2 scenes are desktop artboards only. Below 768 px the build shows the figure scaled or hides it.
- **Deliver:** 360 × 640 artboards for every v2 scene (19) and every new v3 scene, from the per-scene specs in `docs/anim/spec/`, plus the mobile layouts of the pieces above.
- Prototype pages are 1440 wide. The rest of mobile still follows CLAUDE.md rule 8: single column below 900 px, no new components.

---

## 5. Question for the founders: an accent for measured numbers?

The review proposes one accent colour reserved for measured numbers only, so the eye learns that colour means proof. It is a good idea, but it collides with the current system: Lime / Moss already carry buttons, eyebrows, the ring and the header capsule, and "one Lime moment per screen" limits how often it can appear.

Show us two options side by side on three screens (home case index, /work, one industry page):

- **A:** keep Lime / Moss as today, with numbers in the text colour and mono;
- **B:** numbers take the accent, and buttons and eyebrows go neutral.

The founders decide. Nothing is built until they do.

---

## 6. Rejected, and why (do not design)

| Idea | Why not |
|---|---|
| Commit-log ticker of "plausible, anonymised activity" | It would be invented evidence of work (rule 1). It is possible only from real, anonymised commit data the founders supply. If they do, it is a new brief. |
| Sort by "Newest" / "Biggest number" on /work | There are no dated or comparable fields in the record (§4.6). |
| Reading time on notes | Owner decision (rule 7 as amended). |
| Merging "duplicate" case notes | They are different engagements in the record. |
| Any time-zone, overlap or price element (calculators, rate cards, GMT clocks) | Owner decisions, 11 Oct 2026. |
| Stack marquee made clickable to case notes | Optional. The review's alternative, a static grouped grid, is simpler and indexable. Propose one if you want to; it is not required. |

---

## 7. What to hand back

The same shape as v2, so the build can follow the same process:

1. `reference/site-v3/`: the changed pages only, at the same routes, desktop 1440, self-contained HTML. Each must be diffable against the current build, with no other changes.
2. `CHANGES.md`: the delta, page by page, in the v2 format (what changed, the markup and CSS of any new component, which tokens).
3. `anim/spec/<id>.md` for every new scene (v2 spec format), the scene files built to `docs/anim/BRIEF.md`, and their entries in an updated animation manifest (captions never state a number).
4. 360 × 640 artboards for every scene (§4.11), and the mobile layouts of the new pieces.
5. Any new content fields (e.g. `sectorDescriptor`, `metricBefore`), listed with where they appear, for the schema. Never filled with guesses.
6. The two accent options (§5) as their own artboards.

Order of priority if the round must be split: motifs (§3) → evidence wall (4.6) → home (4.1–4.3) → mobile artboards (4.11) → everything else.
