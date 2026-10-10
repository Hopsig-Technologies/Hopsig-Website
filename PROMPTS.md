# Build order for Claude Code

> **Superseded by `IMPLEMENTATION_PLAN.md`** (2026-10-10): Sanity holds all content, Studio is a separate app, and Phase 0 fixed the bundle. Kept for reference only.

Run from the repo root with this bundle unpacked in it. Each prompt is one session or one `/clear`. Do not skip 0 or 1; everything else leans on them.

## 0 — Orientation (read-only)

> Read CLAUDE.md, then open `reference/site/index.html` and `reference/site/services/data-engineering.html` in the browser tool and describe the tone system, the header, the hero ring and the file stack back to me in your own words. List anything in CLAUDE.md you think is wrong or unclear before writing code.

## 1 — Scaffold + tokens

> Scaffold Next.js 15 (App Router, TypeScript, Tailwind) and Sanity v3 at `/studio`. Add `sanity/schema.ts` from the bundle. Put the tokens and the `.tone-d` / `.tone-l` variable sets from CLAUDE.md into `globals.css`; load Space Grotesk 600/400 and IBM Plex Mono 400/500 with `next/font`. Build the `Surface` component (tone wrapper + optional seam) and the `Button` (lime, outline). Render a throwaway page with a dark and a light surface and both buttons; screenshot at 1440 and compare with the closing section of `reference/site/approach.html`.

## 2 — Header and footer

> Build the header from `content/navigation.json`: wordmark lockup, Services (wide two-column menu), Industries, AI transformation, Agentic flow, Company menu, Rates, CTA. Match `reference/site/services/data-engineering.html` exactly at 1440 (open all three menus). Hover/focus-within open, touch-tap toggles, Esc and outside click close, current page marked inside its menu. Then the four-column footer. Add the responsive behaviour from CLAUDE.md (tighten at 1300, drop "Technologies" at 1180, hamburger below 900 — your design for the hamburger, same tokens).

## 3 — Seed Sanity

> Write a seed script that loads `content/case-studies.json` and `content/posts.json` into Sanity (convert `body` blocks to Portable Text, keep `<b>`/`<i>` as marks). Run it against a dev dataset. Confirm the two GROQ queries in CLAUDE.md return 8 featured case studies and 2 published posts.

## 4 — Page hero, facts row, ledger, steps, FAQ, closing

> Build the shared page components against `reference/site/services/custom-software.html`: page hero with ring canvas, facts row, "what you get" list, say-no list, steps, ledger, FAQ, closing. Then generate all eight `/services/*` routes from `content/services.json` with one template. Screenshot each against its reference.

## 5 — Industries

> Same as 4 for `/industries` and the six `/industries/*` routes from `content/industries.json`.

## 6 — Home

> Build `/` against `reference/site/index.html` in this order, screenshotting each section: hero scroll sequence (240vh, five beats, ring canvas), domains strip, services file stack (read `generator/site.py` `core_services()` and the `fSize` / `.stacked` / `.dwell` / `.over` logic before starting — the staggered min-heights and the closing sheet are what make the last sheet collapse), the record, selected work index (from Sanity), notes journal (from Sanity), closing.

## 7 — Work and case notes

> `/work` index with the cursor "Measured" card, row expansion and filters, from Sanity. Then `/work/[slug]` for the three case studies with `hasPage`. Reference: `reference/site/work/`.

## 8 — Notes

> `/notes` index (published rows link, drafts inert and marked `[DRAFT]`) and `/notes/[slug]` with the sticky aside (in-this-note, the offer, CTA) and "Next notes". Reference: `reference/site/notes/`.

## 9 — The rest

> One session each, against the reference page: `/approach`, `/rates` (estimator, rate from an env var that defaults to the `[YOUR RATE]` placeholder), `/book` (calendar component; wire to the real booking tool later), `/brief` (form posts to a route handler; no third-party embed), `/why-not-just-hire`, `/working-with-us`, `/ai-transformation`, `/agentic-flow` (SVG diagram with hover sync), `/for-agencies`, `/join`, `/privacy`, `/terms`, `not-found`.

## 10 — Audit before deploy

> Crawl every route for dead links. Run the placeholder check in CLAUDE.md and diff against `content/placeholders.json`. Lighthouse on `/`, `/services/data-engineering`, `/work`: performance ≥ 90, accessibility 100. Test with JS disabled: all copy visible. Test `prefers-reduced-motion`. Then screenshot every route at 1440 and 390 and put the contact sheet in `audit/`.

## When something in the reference looks wrong

Say so and stop; do not "improve" it silently. The prototype was audited, but it is a prototype. The brand rules in CLAUDE.md win over the reference HTML if the two disagree.
