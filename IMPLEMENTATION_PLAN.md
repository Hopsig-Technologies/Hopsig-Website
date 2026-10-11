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

### P4 — Industries — DONE 2026-10-10

`/industries` (rows with the intro up to its colon, the lead fact and "{count} notes") and the six `/industries/[slug]` pages (first `fullCards` record cases as cards, the rest as compact `CaseRow`s; asks ledger; services that fit; the other industries). Text diff 0 missing on all seven; pixel diff 0.07–0.13% at identical heights; console clean; all static. `withMode` now renders param pages inside Suspense (Next 16 + partialPrefetching requires params below a boundary; the dev server returned 500 without it while the production build was fine).

`/industries` (rows with the lead fact and "{count} notes") and the six `/industries/[slug]` pages.
Gate: text diff on seven.

### P5 — Work — DONE 2026-10-10

`/work` (all case studies by `order`: 12 cards, the rest as rows from 13; "How we report" with the engagement panel's measured scene) and `/work/[slug]` for the three `hasPage` case studies (hero facts; article; Measured box, which shows "—" and "Number to be added from the record." when there is no figure; "More from the record" by the generator's rule: same first domain word, else the first three F records). Text diff 0 missing on all four; pixel diff /work 0.17%, case notes 0.07–0.12%; static; console clean. Case-page wording corrected to the reference's lowercase labels (the coverage check is case-insensitive, so it had not noticed). `generateMetadata` uses the cached fetch (uncached data there is an error under cacheComponents). Dev-server note: edits under `web/content` sometimes need a dev-server restart to show (component edits hot-reload).

`/work` (`CASES_ALL_QUERY`: the first 12 as full cards, the rest compact; engagement panel) and `/work/[slug]` for the three `hasPage` case studies (`generateStaticParams` from `CASE_SLUGS_QUERY`; "More from the record").
Gate: text diff; Presentation edit of a case note shows in the preview.

### P6 — Notes — DONE 2026-10-10

`/notes` (published first, newest first, then unpublished by the new `post.order` field; published rows link, the rest are inert `[DRAFT]` rows; category chips from the posts) and `/notes/[slug]` for the two published notes (`generateStaticParams` from `POST_SLUGS_QUERY`; article from the Portable Text body; sticky aside with "In this note" from the h2s, the offer and Book a consult; "Next notes" = the two after it in list order, wrapping, published ones linked). Text diff 0 missing on all three; pixel diff note pages 0.11–0.12% at identical heights; the index is 44px shorter only by the reference's build note, which never ships. Hero eyebrow drops "· [DATE]" (rule 7), recorded in `content/deviations.json`. All static.

`/notes` (published rows link, drafts inert and marked `[DRAFT]`) and `/notes/[slug]` (sticky aside: in-this-note from h2s, the offer, CTA; "Next notes").
Gate: text diff; Presentation edit of a body shows in the preview.

### P7 — Home — DONE 2026-10-10

Hero scroll sequence (`HomeHero`: 240vh sticky stage; copy fades, the dot field forms the ring, five beats caption it, rail fills, header CTA lights past 30%), core-services file (`ServiceFile`: sticky sheets one tab apart, sized to the tallest, lime tabs when stacked, legend, tab click scrolls), case index (`CaseIndex`: featured case studies by `featuredOrder`; filters with counts, one row open at a time with count-up and before/after bars, cursor-following measured card on fine pointers), mid CTA, capabilities marquee, why, the record, notes journal (first note featured, next five as a ledger; unpublished ones link to /notes), closing. Text diff 0 missing (extras: the before/after bar labels from the record, which the reference also shows once a row opens). Hero and closing pixel diffs 0.03–0.08%; the page is 39px shorter only by the two build notes (never ship) and the sheets are 5px taller because ours are sized after the web fonts load (the reference sizes them before). Counts are live: "All {count} case notes", "{count} notes". `homePage.domains` removed (not on any reference page). Static; console clean.

**Fixed after P7: with JavaScript off, every page with a large `<main>` showed only the header and footer.** React streams a finished Suspense boundary out of order once it passes ~12.8 KB (`progressiveChunkSize`, not exposed by Next), even in a static prerender, and Next wraps each page segment in a boundary; the content sits in `<div hidden id="S:0">` until an inline script moves it. A `<noscript>` stylesheet in `app/layout.tsx` now shows those segments between the header and the footer. `node scripts/check_nojs.mjs` (against a production build) checks every route: 0 failures.

Hero scroll sequence (240vh, five beats), domains strip, services file stack (read `generator/site.py core_services()` and the `fSize` / `.stacked` / `.dwell` / `.over` logic first), case index (`CASES_FEATURED_QUERY`; cursor card, expansion, filters), notes journal, the record, closing. Last of the big pages because it composes P3/P5/P6 components.
Gate: shot per section.

### P8 — The rest — DONE 2026-10-10

All ten pages, each against its reference: text diff 0 missing, full-page pixel diff 0.03–0.09% at identical heights (book/brief are 22px/7px shorter only by their build notes). `/privacy` and `/terms` share `components/LegalPage.tsx`; `/join` lists `jobListing` roles from Sanity (no status → `[STATUS]`; set → "Open"/"Pipeline"); `/rates` and `/why-not-just-hire` share the estimator (`components/Estimator.tsx`, words and tokens passed as props: no copy in any client chunk, checked in `.next/static`); `/book` (calendar; Confirm opens `siteSettings.bookingUrl` once set) and `/brief` post to `/api/contact`, whose sender (`lib/contact.ts`) returns "not configured" until an email provider is chosen, so the pages show an "email us instead" line rather than a fake confirmation; `/agentic-flow` draws the SVG from `agenticFlowPage.flow.stages` with node↔row hover sync; the header CTA is hidden on `/book`, as in the reference. JS-off check: 23 routes, 0 failures.
**Still to connect (founders' decision):** the booking tool (`bookingUrl`) and the email provider (`sendContact`).

`/join` + careers (`JOBS_QUERY`; `[STATUS]` verified with an empty status), `/rates` (page-local estimator; rate from Site settings), `/why-not-just-hire`, `/book` (calendar; `bookingUrl` when chosen), `/brief` (route handler → email; provider still to choose), `/ai-transformation`, `/agentic-flow` (SVG with hover sync), `/for-agencies`, `/privacy`, `/terms`, `not-found`.
Gate: text diff each.

## v2 — design updates (2026-10-11; from `v2 handover/`, see `docs/anim/CHANGES-v2.md`)

Header capsule on every page; animated figures on 17 pages (18 scenes on one engine); `/agentic-flow` and `/ai-transformation` restructured. The v2 bundle's `content/*.json` are the old v1 originals and are **not** used; ours stay. P9 moves after v2 so the audit covers the final design.

| Phase | Scope | Gate |
|---|---|---|
| V0 Intake — DONE | `reference/site` = v2 design (`scripts/apply_v2_reference.py`); engine + 19 scene files in `web/components/anim/`; `web/content/animations.ts` (captions); new copy (home band, service strip label, agentic-flow edits, scrub labels); `placeholders.mjs` scans scenes (`[TO CONFIRM]`); CLAUDE.md v2 sections | check:content 0 uncovered against the v2 references |
| V1 Header — DONE | `span.ai` capsule from `navigation.ts` (`group: "ai"`), CSS from CHANGES §1 | shots at 1440 / 1280 / 1180: 0.13–0.21% (anti-aliasing) |
| V2 Engine wrapper — DONE | `HeroAnim` (server: figure, aspect-ratio frame, inlined static SVG, caption) + `AnimMount` (client: lazy engine + scene at rootMargin 200px, `HA.mount`/`unmount`); `anim.css` (+ font mapping, hide frames < 768px); `pnpm anim:static`, `pnpm anim:test`, CI | seam ≤ 10 px for every loop scene, no errors, zero layout shift, scene chunks ≤ 25 KB gz |
| V3 Home band + service strip — DONE | band after the home hero; `agentic-strip` link between "How it runs." and the FAQ on 8 service pages | text diff 0 missing; figure shots at a seeked frame 0.05–0.08% (needed Space Grotesk 500, which the artboards use) |
| V4 Hero scenes — DONE | `PageHero` figure slot; 8 service + 6 industry scenes | text diff 0 missing on 14; figures at their resolved frame 0.05–0.14%; full pages 0.06–0.09% at identical heights |
| V5 Agentic flow — DONE | simulator in the hero, never-wall section, static SVG and never list removed, agents column 760 | `pnpm anim:flows`: full simulator path with mouse and keyboard-only (2px Lime ring), never wall responds; page 0.03% at identical height |
| V6 AI transformation — DONE | `.scrub` 250vh, sticky at 96, `t = p × 7000`, week ticks → `inst.goto` | `pnpm anim:flows`: 45% → t = 3149, W3 → t = 3001; page 0.04% at identical height |
| V7 Audit + deploy — DONE | no console errors; pause off-screen / hidden tab; pause button; reduced motion; contrast; ≤ 25 KB gz; 60 fps at CPU ×4; < 768px; check_nojs; screenshots in `audit/v2/` | `pnpm anim:audit` (production build): 17 routes mount with no console errors; pauses off-screen and in a hidden tab; pause button toggles and relabels; reduced motion keeps static frames (interactive scenes still load); fps equal to the prototype under CPU ×4 (headless has no GPU, so 60 fps is a manual real-device check); 390px hides frames, keeps captions, no sideways scroll. Scene chunks 0.9–4.0 KB gz, engine 5.4 KB. Figcaption contrast 6.58:1. check_nojs 0 failures |

## Review round (2026-10-11; @Arslan's design & SEO review)

Owner decisions: no rates anywhere; no time zones or overlap; GA4 + PostHog behind consent (Hotjar dropped); legal identity Hopsig Technologies LLC, Wyoming, USA · Delivery Centre: Lahore, Pakistan · info@hopsig.com; notes show dates and a "Hopsig engineering" byline (rule 7 amended); the team-augmentation animation (an overlap dial) is replaced by a new standup scene; the review's new visual concepts go to a v3 design round first.

Not done, or done differently (reasons in the plan): no invented commit-log ticker (rule 1); no accent-for-numbers recolour (token system; v3 brief); "Source states" lines removed, not rewritten as assertions; the "duplicate" case notes are different engagements; "&amp;", double spaces, run-together labels are not bugs; expanded case notes and FAQs only from founder-supplied facts; draft label stays until counsel signs off; FAQPage schema has little payoff; note dates need real dates first.

| Phase | Scope |
|---|---|
| R0 Rules and gates — DONE | CLAUDE.md rules 7, 13–15, legal identity, analytics; `deviations.json` decision groups (`removed`, `removed_routes`, `retired_placeholders`) honoured by check_pages / check_links / text_diff / placeholders |
| R1 Launch blockers — DONE | legal identity + mailto email; remove rates (page → 308 /book, nav, sheets, Priced, estimators, rate card, Site settings fields); remove overlap/GMT; smaller copy fixes; drafts hidden |
| R2 Team augmentation scene — DONE (owner approved 2026-10-11) | new standup scene to BRIEF.md; seam test; owner reviews a frame sheet |
| R3 SEO foundations — DONE | titles + metas (`seo.ts`), keyword in H1, h3s, robots, sitemap, RSS, canonical, OG images, JSON-LD, internal links |
| R4 Notes — DONE (dates; TOC and margin offer moved to R8) | owner-chosen publish dates (22 Jul and 16 Sep 2026) on note heroes, lists, home journal, RSS and BlogPosting; "Hopsig engineering" byline; optional `updatedAt` |
| R5 Content depth | caseStudy fields + richer template; more case pages; metric placeholders list + launch switch; FAQs (founders approve) |
| R6 Analytics + consent — DONE | banner, Consent Mode v2, GA4 + PostHog after consent, events, privacy copy for counsel |
| R7 Booking + brief | Cal.com embed, Resend to info@hopsig.com, pre-filled "Ask about this" |
| R8 Functional improvements | /work filters + sort, real table on Why not just hire, linked legal TOC, Company toggle, fewer CTAs, home tagline + location, industries paragraphs |
| R9 v3 design brief | docs/design/v3-brief.md for Claude Design |
| R10 Domain + launch | old P9: hopsig.com, redirects, Search Console, Lighthouse, 390px, production dataset, counsel |

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
