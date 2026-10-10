# Hopsig website — implementation plan

Decisions this plan is built on (2026-10-10, revised the same day after the pivot below):

- **Sanity holds only what changes without a developer:** case studies, notes (blog), career listings, and one small Site settings document (company reg no, year, email, day rate, booking link …). The founders edit those in the Studio.
- **Every other page is a Next.js page with its copy in code** (`web/content/*.ts`, typed): services, industries, home, approach, rates, book, brief, why-not-just-hire, working-with-us, ai-transformation, agentic-flow, for-agencies, join (page copy; roles from Sanity), privacy, terms, 404.
- **Studio is a separate app**, deployed to https://hopsig.sanity.studio. Project `e1ib49ry`, datasets `development` and `production`.
- **Site on Vercel** (`hopsig-website`, root `web/`), Next.js App Router, static generation with on-demand revalidation from a Sanity webhook.

`CLAUDE.md` is the rulebook; this file is the order of work.

## History

Phases 0–4 of the first plan (bundle fixes, scaffold, a Studio with every page as a singleton, seed, data layer) are on `main` (commits 1df8d87 … c0ee887). The owner then decided the CMS should hold only the collections. **P0** below replaced the page singletons with typed content modules and kept everything else: workspace, tokens/tone CSS, `Surface`/`Button`, Studio hosting, the `caseStudy`/`post` schemas, Placeholders tool, Presentation tool, typegen + CI drift check, `defineLive`/`cachedSanity`/draft mode/webhook, Vercel project and secrets, CORS, the screenshot diff script, the checks.

## Content split

| Where | What | Edited by |
|---|---|---|
| `web/content/pages/*.ts` | copy of the 18 static pages, fields in the page's section order | developer (typed; `pnpm check:content` keeps it honest against the reference) |
| `web/content/{services,industries,navigation,site,templates,engagementPanel}.ts` | the two static collections, header/footer, site lines, detail-template wording, the engagement mock | developer |
| Sanity `caseStudy` | 32 case studies: note copy, `order` (/work), `featured` + `featuredOrder` (home), `source` key (named by static pages' `record` lists), `metric`, `hasPage` | founders |
| Sanity `post` | 6 notes: 2 published, 4 drafts (`[DRAFT]` rows) | founders |
| Sanity `jobListing` | roles on /join; empty status renders `[STATUS]` | founders |
| Sanity `siteSettings` | the site-wide tokens' values, booking URL, brief recipient; substituted at render, placeholder stays while empty | founders |

Fetch pattern, substitution, revalidation: see `CLAUDE.md` "Content model".

## Phases

One phase is one Claude Code session (or `/clear` between). Every UI phase: `pnpm shot` at 1440 against the reference **and** `scripts/text_diff.mjs` (visible text of the built route vs the reference, same normalisation as `check_pages.py`; written in P1).

### P0 — Pivot — DONE 2026-10-10

Copy converted to `web/content` (24 modules; every string verified present), Studio cut to 4 types (schema validate 0/0; typegen 10 queries / 20 types), `development` dataset migrated (44 documents imported, 35 of the removed types deleted, `verify_dataset.py` all ok, `documents validate` 0 errors), webhook re-created with the four-type filter, Studio deployed, `/phase4` removed, checks rewritten around `audit/content-corpus.json`. Deviation from the approved plan: `Href` is derived from `web/content/routes.ts` rather than Next's `typedRoutes`, because `typedRoutes` validates against routes that exist in the app and none of the 37 pages existed yet; switch to it in P9.

### P1 — Chrome — DONE 2026-10-10

Header (client component, navigation strings as props; dropdowns on hover/focus/tap, Esc and outside click close, current page `.on`; reference breakpoints 1300/1180/1060; a Menu panel below 900px), Footer and Closing (server; Site settings substituted), `RingCanvas` (TS port of the reference `Field`, draws only on screen, reduced motion respected), `Lines`, the not-found page, `scripts/text_diff.py`. Measured against `404.html`: header 0.12%, Services/Industries/Company menus open 0.06/0.05/0.04%, footer 0.08%, closing 0.02% pixels differ; text diff 0 missing (1 intended extra: the mobile "Menu" button). Site settings → footer verified end to end (fill, then placeholder back on unset). Two global fixes found by the diffs: `box-sizing: content-box` (Tailwind preflight made the menu 18px narrow) and the mono font's adjusted fallback (drew → as ⟶). `/phase1` deleted. `Rich` moves to P2, where the first rich strings render.

Header from `navigation.ts` (three dropdowns: hover/focus-within open, tap toggles, Esc and outside click close, current page `.on`; tighten at 1300, drop "Technologies" at 1180, hamburger below 900 with the same tokens), Footer (`site.footer` lines through `getFill`), `Closing` (ring canvas; `sub` falls back to `site.defaultClosing`), `Rich` (PortableText with the site's marks and link), `withMode` in use, `text_diff.mjs`; delete `/phase1`.
Gate: shots of the header with each menu open vs `services/data-engineering.html` and the closing vs `approach.html`; the route is ○ in the build output; in draft mode an edited email in Site settings shows in the footer.

### P2 — First static pages — DONE 2026-10-10

`/approach` and `/working-with-us` from their content modules, on shared blocks (`web/components/blocks.tsx`: PageHero, FactsRow, HeadRow, Cards, Ledger, TwoCol, Tags, MoreLink; `Filled` marks leftover placeholders as `tok`/`phx`; `blocks.css`). Full-page diff vs the reference: 0.05% / 0.04% of pixels, same page heights; text diff 0 missing on both; both routes static (○). Reveal rewritten as a React-owned `Rv` component after the dev server showed hydration mismatches (a DOM-mutating observer added `in` before hydration); console clean, no element stuck hidden, nothing hidden with JS off. FactsRow styling is unverified until P3 (first page that shows it). The approach page's time-zone bars are data (`hours.bars`, GMT hours).

`/approach`, `/working-with-us`: page hero with ring canvas, ledger, two-column section, facts row, closing.
Gate: shots + text diff on both.

### P3 — Services — DONE 2026-10-10

`/services` and the eight `/services/[slug]` pages (static, from `services.ts`; record cards from Sanity via `casesByKey`, capped at four as the generator does). New shared pieces: `CaseCard`, `Rich` (Portable Text with fill + placeholder marking), `Faq` (one open at a time; answers visible with JS off), `Steps`, `BulletList`, `Capabilities` (the scrolling rows, reused on home), `tpl`. Text diff: all eight service pages 0 missing; `/services` 0 missing apart from the engagement panel's own strings. Full-page pixel diff: service pages 0.09–0.10%, `/services` 0.42% (the three empty panel slots). Fixed a site-wide font issue: the mono stack now names "IBM Plex Mono" directly, because next/font always appends a full-Unicode fallback face that drew → differently (improved every page). Engagement panel built (decision 2026-10-10: invented people and results become placeholders; recorded in `content/deviations.json`, which the checks honour); `/services` text diff 0 missing.

`/services` (hero chips → anchors, three engagement modes with the engagement panel, the eight-services list, "inside every engagement", steps) and the eight `/services/[slug]` pages from `services.ts` (facts, gets, say-no, steps, FAQ, "From the record" via `casesByKey`).
Gate: shots on three pages, text diff on all nine.

### P4 — Industries

`/industries` (rows with the lead fact and "{count} notes") and the six `/industries/[slug]` pages.
Gate: text diff on seven.

### P5 — Work

`/work` (`CASES_ALL_QUERY`: the first 12 as full cards, the rest compact; engagement panel) and `/work/[slug]` for the three `hasPage` case studies (`generateStaticParams` from `CASE_SLUGS_QUERY`; "More from the record").
Gate: text diff; Presentation edit of a case note shows in the preview.

### P6 — Notes

`/notes` (published rows link, drafts inert and marked `[DRAFT]`) and `/notes/[slug]` (sticky aside: in-this-note from h2s, the offer, CTA; "Next notes").
Gate: text diff; Presentation edit of a body shows in the preview.

### P7 — Home

Hero scroll sequence (240vh, five beats), domains strip, services file stack (read `generator/site.py core_services()` and the `fSize` / `.stacked` / `.dwell` / `.over` logic first), case index (`CASES_FEATURED_QUERY`; cursor card, expansion, filters), notes journal, the record, closing. Last of the big pages because it composes P3/P5/P6 components.
Gate: shot per section.

### P8 — The rest

`/join` + careers (`JOBS_QUERY`; `[STATUS]` verified with an empty status), `/rates` (page-local estimator; rate from Site settings), `/why-not-just-hire`, `/book` (calendar; `bookingUrl` when chosen), `/brief` (route handler → email; provider still to choose), `/ai-transformation`, `/agentic-flow` (SVG with hover sync), `/for-agencies`, `/privacy`, `/terms`, `not-found`.
Gate: text diff each.

### P9 — Audit & launch

Dead-link crawl of every route; `typedRoutes: true` (all routes now exist) replacing the hand-kept `Href`; `pnpm placeholders` == tokens in the built HTML; Lighthouse on `/`, `/services/data-engineering`, `/work`: performance ≥ 90, accessibility 100; JS disabled: all copy visible; `prefers-reduced-motion`; metadata on every route, `sitemap.ts`, `robots.ts`, OG image; 1440 + 390 contact sheet in `audit/`. Launch: seed `production` (`seed.mjs --with-settings` once, then the founders fill Site settings there), production webhook, CORS for the real domain, move the Vercel project to a Hopsig Pro team (Hobby excludes commercial use), domain; `hopsig.si` → 301 to `/ai-transformation` if registered.

## Tooling (`scripts/`)

| script | purpose |
|---|---|
| `content_corpus.mjs` | strings and links of `web/content` → `audit/content-corpus.json` (Node runs the TS modules directly) |
| `seed.mjs` | `content/{case-studies,posts,job-listings}.json` → `audit/seed.ndjson`; `--with-settings` adds an empty `siteSettings` |
| `check_bundle.py` | seed invariants, `placeholders.json` vs the reference, then `check_pages.py` (0 uncovered strings on 37 pages) and `check_links.py` (0 links missing) — `pnpm check:content` |
| `verify_dataset.py` | the live dataset: counts, orders, no removed types, no dangling refs, placeholders |
| `prune_dataset.mjs` | delete documents of removed types (used once in P0; keep for `production` if ever needed) |
| `placeholders.mjs` | every bracketed token still on the site (static + dataset), minus Site settings that are filled — `pnpm placeholders` |
| `shot.mjs` | Playwright element screenshots of a built route and its reference + pixel diff — `pnpm shot` |
| `text_diff.py` | visible text of a built route vs its reference page (multiset: missing / extra) |

## Still open (blocking the phases named)

| decision | blocks |
|---|---|
| `[DATE]` on note heroes (rule 7), "fetched from Sanity Studio" copy, "Tweaks" in the estimator note, the privacy page's "form storage" line | the pages that show them (P5–P8); see `CLAUDE.md` "Open questions" |
| Booking tool (Cal.com / Calendly / SavvyCal) | P8 `/book`, privacy copy |
| Email provider for the brief form (e.g. Resend, Postmark) | P8 `/brief`, privacy copy |
| Analytics (or none) | privacy copy, consent banner |
| Published dates for the two notes (stand-ins: 2026-01-01 / 2026-01-02; only ordering) | nothing now |
| Founders' Sanity accounts (Editor role) | whenever they want to start editing |
| Counsel review of privacy and terms | launch |
