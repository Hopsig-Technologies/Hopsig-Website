# Hopsig Technologies — website

Marketing site for Hopsig Technologies: senior engineers and data/AI people who join a client's team or take a build end to end. Delivery from Lahore, Pakistan. Buyers are CTOs, heads of engineering and agency founders at 20–200-person companies in the UK, US and EU.

Brand line: **You think it. We finish it.**
Five-second test, every page: a London head of engineering thinks "senior, will not waste my time".

## What this repo is

- `IMPLEMENTATION_PLAN.md` — the build order (phases 0–12) and the Sanity content model. Replaces `PROMPTS.md`.
- `reference/site/` — the approved prototype: 37 static HTML pages, desktop only (1440 wide), each self-contained. **This is the design source of truth**, except where a rule below overrides it. `reference/page-map.json` maps old artboard names to clean paths.
- `content/` — every word and number on the site, as data. It seeds Sanity once (Phase 3); after that **Sanity is the source of truth** and these files are history.
  - `case-studies.json`, `posts.json`, `services.json`, `industries.json`, `domains.json`, `flow-stages.json`, `work-filters.json`, `navigation.json` — collections and navigation.
  - `pages/*.json` — the copy of every page singleton, extracted from the reference by `scripts/extract_pages.py`. Blocks are in page order; `{"from": "<collection>", "refs": [...]}` marks rows that render from a collection; `templateText` holds the words a template adds around the data; `buildNotes` are prototype notes that **must not render**.
  - `pages/templates.json` — wording of the detail templates (service, industry, case, note), `{tokens}` filled from the document.
  - `pages/siteSettings.json` — footer lines, default closing, and the site-wide values that are placeholders today.
  - `pages/engagementPanel.json` — the animated engagement mock shown on `/services` (×3) and `/work`.
  - `placeholders.json` — all 53 bracketed tokens and the routes they appear on.
- `scripts/check_pages.py` — every visible string on every reference page must exist in `content/`. Run it after any change to `content/`; it must report 0.
- `sanity/schema.ts` — the first draft of `caseStudy` and `post`; superseded by `studio/schemaTypes/` in Phase 2.
- `generator/` — the Python that produced the prototype. Read it when a mechanic in the HTML is unclear; never run it, and never take copy from it (it rewrites strings after rendering).

## Stack

Next.js (App Router, TypeScript, static generation, on-demand revalidation) on **Vercel**, in `web/`. **Sanity Studio is a separate app** in `studio/`, deployed with `sanity deploy` (not embedded at `/studio`); datasets `development` and `production`. All copy comes from Sanity, including every static page. Tailwind is fine for layout; the tokens below are the only colours, sizes and radii. No component library, no animation library beyond what the prototype does by hand (IntersectionObserver reveals, `requestAnimationFrame` canvases). No third-party scripts except Google Fonts (loaded via `next/font`).

Version notes (read `web/AGENTS.md`; the bundled docs in `web/node_modules/next/dist/docs/` win over memory):
- Next 16 with `cacheComponents`: cache CMS reads with `'use cache'` + `cacheTag()` + `cacheLife()`; segment exports `revalidate` / `dynamic` / `fetchCache` throw. `revalidateTag(tag, 'max')` takes two arguments. `params` are async; use the generated `PageProps<'/x/[slug]'>` / `LayoutProps<'/'>` (run `next typegen`). `middleware.ts` is now `proxy.ts`. `generateStaticParams` must return at least one entry.
- Commands: `pnpm dev` (web), `pnpm dev:studio`, `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm check:content`, `pnpm shot -- --name … --ref … --ref-sel … --url … --web-sel …`.

## Hard rules (from the brief; do not relax)

1. **Never invent proof.** Every number on the site comes from the record (`content/`, then Sanity). Where the record has no number yet the copy carries a bracketed placeholder (`[ADD THE NUMBER]`, `[YOUR RATE]`, `[COMPANY REG NO.]`, `[YEAR]`, `[HELLO@HOPSIG.COM]`, …). Keep placeholders visible until the founders replace them. Do not fill one in from a guess, ever.
2. **Client names are withheld** on every case note. Do not add logos, names or testimonials.
3. **Company voice, no people.** No founder names, photos, bios or "our team" sections anywhere. "We", "the people who would do the work", "the record".
4. **Nothing from the banned list:** purple/blue gradient blobs, glassmorphism, neon, 3D shapes, circuit-board or "AI brain" imagery, stock photography, rounded friendly-SaaS styling, generic wordmarks, overpromising taglines, **card drop shadows**. Depth comes from borders and tone changes, never shadows. (`box-shadow: inset 0 0 0 1px` used as a border is fine.)
5. **One Lime moment per screen** on dark surfaces (the accent is the eyebrow, or the button, or the ring — not all three). The one approved exception: collapsed tabs in the services file stack are Lime.
6. Light surfaces use **Moss** as the accent, never Lime (Lime on Paper fails contrast). This includes hover: link hover is `--acc` darkened/underlined per tone, **never `#A9D437`** (the reference uses it globally; do not copy it).
7. **No reading times, dates, bylines or newsletter pop-ups** on Notes. No cookie banner unless legally required for the analytics actually installed.
8. Mobile is **not designed yet** (prototype is 1440 wide). Build responsive from the tokens and the desktop reference; keep the hierarchy, drop the side-by-side grids to single column below 900px, and do not invent new components to do it.
9. **Build notes never ship.** The reference renders designer notes as visible text ("Build note: …", "Source: Sanity · caseStudy · …"). They are kept in `buildNotes` fields and are instructions, not copy.
10. **Content is visible with JS off.** `.rv` (and the home hero captions) start hidden only under `html.js`, set by an inline script in `<head>`; the reference hides them unconditionally — do not copy that.
11. **Focus is visible everywhere**: one global `:focus-visible` ring (2px `var(--acc)`, offset 3px) on links, buttons, form fields and dropdown triggers. Never `outline: none` without a replacement.

## Tokens

```
Ink        #0E1116   dark background
Paper      #F7F8F4   light background
Lime       #C6F24E   dark-surface accent (never as text on light)
Moss       #3F6B1F   light-surface accent
neutral-100 #EAECE6  200 #D6DAD2  300 #B9BFB6  400 #939A96  500 #545A60  600 #3C424A  700 #262C34  800 #1C222B  900 #181D24
```

Tone system — every section is wrapped in `.tone-d` or `.tone-l`, which set the CSS variables; components only ever use the variables:

```
.tone-d { --bg:#0E1116; --text:#E7ECEF; --dim:#939A96; --sub:#B9BFB6; --line:#262C34; --panel:#12161C; --hair:#1C222B; --acc:#C6F24E; --btn:#C6F24E; --btnText:#0E1116; --seamdot:#454C55; --dot:#1C222B }
.tone-l { --bg:#F7F8F4; --text:#0E1116; --dim:#545A60; --sub:#3C424A; --line:#D6DAD2; --panel:#FFFFFF; --hair:#EAECE6; --acc:#3F6B1F; --btn:#0E1116; --btnText:#F7F8F4; --seamdot:#A9AFA6; --dot:#D9DECF }
```

Type: **Space Grotesk** 600 for headings (letter-spacing −0.045em to −0.05em, line-height 1.02–1.05), 400 for body; **IBM Plex Mono** 400/500 for eyebrows, labels, numbers and nav (11–12px, letter-spacing 0.12–0.16em, uppercase). Load only these weights.
Headline sizes: h1 84 (home) / 72 (page heroes) / 64 (book, brief); h2 56 (closing) / 44 (section) / 40 / 32; file-stack numerals 88 (mono 500).
Full scale in use (px): 9 10 11 12 13 14 15 16 17 18 19 20 21 22 24 26 30 32 34 36 40 42 44 48 56 64 72 84 88. Use these; do not "normalise" them to fewer.

Radius: 2–3 (progress rails, bars), 6 (small controls: FAQ plus, chips), 8 (buttons, menu items, inputs), 12 (panels, cards, menus), 14 (file sheets). Container: max-width 1264 + 88px side padding. Header 72px, sticky, `rgba(14,17,22,.86)` + 8px backdrop blur, bottom hairline.

Seam between tones: 120px band of 1px dots on a 22px grid, masked to fade (`.seam`). It overlaps the next section (`margin-bottom:-120px`).

## Components (all have a working instance in `reference/site/`)

| Component | Where to look | Mechanic |
|---|---|---|
| Header + dropdowns | any page | Services (wide, 2-col, 8 items + footer links), Industries (6 + "All six"), Company (7). Hover/focus-within opens; tap toggles on touch; Esc and outside click close; current page marked `.on` inside its menu. Below 1300px gaps tighten; below 1180px the wordmark drops "Technologies". |
| Hero ring | `index.html`, every page hero | Canvas dot field that forms an ellipse ("engagement ring") and reacts to the cursor; home version is a 240vh scroll sequence with five beats (Day 0 → Fortnightly). Respects `prefers-reduced-motion`. |
| Reveal | everywhere, `.rv` | IntersectionObserver adds `.in` (opacity 0→1, translateY 14→0, .6s). A scroll "sweep" fallback catches rows missed on fast scroll. Hidden only under `html.js` (rule 10). |
| Services file stack | `index.html` → "Eight things we do" | Nine sticky sheets (8 services + a closing sheet) with 46px tabs; each sheet docks under the previous; a docked sheet's tab turns Lime; the section after slides over the finished stack. See `generator/site.py` `core_services()` and `fSize()` in the JS. |
| Case index (home) | `index.html` → "Where we have done this before" | The 8 featured case studies. Rows render from inline JSON `#caseData` (a trimmed shape, not the Sanity document); cursor-following "Measured" card (lerp .13, velocity tilt); in-place row expansion (`grid-template-rows 0fr→1fr`); domain filter chips from `work-filters.json`. |
| Work page | `work/index.html` | **Not** the case index. All 32 case studies: 12 full cards ("Selected.") then "The rest of the record." (20 compact rows). No cursor card, no filters. Then the engagement panel and closing. |
| Engagement panel | `services/index.html` (×3), `work/index.html` | Animated mock of an engagement (call → scope → people → measured → review). Copy in `content/pages/engagementPanel.json`. |
| Notes journal | `index.html` → Notes, `notes/` | Feature + ledger; on home from inline JSON `#postData`. |
| Facts row | service/industry/case heroes | 4 mono numbers with labels; 26px on index pages, 22px on detail pages. |
| Ledger | many | `44px 260px 1fr` grid rows with mono index, title, text; hairline dividers. |
| Steps | approach, service pages | Day 0 / Day 3 / Day 10 / Week 6 / Fortnightly beats. |
| FAQ | service, industry, agentic | Disclosure rows, one open at a time. |
| Estimator | `rates.html` `#est`, `why-not-just-hire.html` | Engineers (slider) × months (slider) × 21 working days × day rate. Until `siteSettings.dayRate` is set, the total reads "N × [YOUR RATE]". Keep its code page-local so `[YOUR RATE]` is not in a shared JS chunk. |
| Calendar | `book.html` `#cal` | Visual only; wire to the real booking tool. |
| Brief form | `brief.html` `#bf` | Visual only; posts to a Vercel route handler that emails; submissions are not stored in Sanity. |
| Flow diagram | `agentic-flow.html` | SVG: six nodes from `flow-stages.json`, three "A PERSON SIGNS" gates in Lime; hovering a node highlights its table row and vice versa. |
| Closing | every page | Ring canvas + eyebrow + 56px h2 + two buttons + email line. |

Buttons: `lime` (Lime/Ink on dark → Ink/Paper on light via the variables), `outline` (1px inset `--line`; transparent, or `--bg` in the closing). Mono 500 uppercase, letter-spacing 0.12em, radius 8; default 12px with 16×24 padding, `sm` 11px with 12×17 (header CTA). No shadows, no gradients.

## Content model

Full model in `IMPLEMENTATION_PLAN.md`. The facts that matter while building:

- `caseStudy` — 32 docs; 8 `featured` carry a `metric`; 3 have `hasPage: true`. `slug.current` is the **route slug** (`payments-platform`), `_id` the long title slug. `source` (`F0`, `C2`) is the key other files reference.
- Home case index order is the order in `content/pages/homePage.json` refs (`F0 F1 F3 F5 F4 C1 F17 C10`), which is **not** `order asc` (`… F4 F5 F17 C1 …`). Open question for the founders; until answered, match the reference.
- `post` — 6 docs; 2 published (`publishedAt` set; the dates are stand-ins for ordering only), 4 drafts (`publishedAt: null`). GROQ: `*[_type == "post" && defined(publishedAt)] | order(publishedAt desc)`. Drafts render as inert rows marked `[DRAFT]`.
- Services and industries `_id` equal their route slug.
- `body` in posts is a flat block list (`p`, `h2`, `pq` pull-quote, `ol`) with `<b>`/`<i>` inline; convert to Portable Text on seed.

## Routes

37 routes in `content/routes.json`. Services and industries render from their documents (one template each); case notes and posts from Sanity; every other page from its singleton. `404.html` is the not-found page.

## Working rules for this codebase

- Build one route at a time against its reference page; screenshot both at 1440 and compare, and run the text diff, before moving on.
- Copy comes from Sanity (seeded from `content/`), never typed into a component. If a string must change, change it in Studio or the seed JSON, not the component.
- Keep JS small and feature-detected; every canvas and observer has a no-JS fallback (rule 10).
- Placeholder check before any deploy: the bracketed tokens in the built HTML (pattern `\[[A-Z][^\]\n<>"]{0,60}\]`, which also catches `[INSURER · COVER AMOUNT]` and `[IDTA / SCCs / ADEQUACY]`) must equal the tokens still present in the production dataset — never fewer because something was "filled in". Expected differences from `content/placeholders.json`: `[FORM ENDPOINT]` and `[INBOX]` exist only in build notes and do not render.
- Accessibility bar: contrast ≥ 4.5:1 for body, ≥ 3:1 for large text (the token pairs above pass); canvases `aria-hidden`; dropdowns keyboard-operable; focus visible (rule 11).

## Open questions (do not decide these in code)

- `[DATE]` appears in the note-page hero eyebrow ("Note · Delivery · [DATE]") and conflicts with rule 7. Keep it out of the build until the founders decide.
- The engagement panel shows illustrative initials ("A.K.", "S.R.", with years of experience) and illustrative numbers ("5 h 10 m → 18 m", "7 → 0", "14 / 14"). Rules 1 and 3 suggest they should be placeholders or removed; ask before building it.
- Visible copy that describes the implementation: "Eight case notes, fetched from Sanity Studio." (home case index) and "… Fetched from Sanity Studio." (home notes). Probably prototype wording; ask before changing the copy.
- Home case-index order versus `order` (see Content model).
