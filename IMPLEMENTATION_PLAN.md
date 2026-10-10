# Hopsig website — implementation plan

Decisions this plan is built on (2026-10-10):

- **All content lives in Sanity.** Case studies, notes, services, industries, navigation, site settings and the copy of every static page. Founders replace placeholders in Studio; no deploy needed.
- **Studio is a separate app**, deployed to Sanity hosting (`sanity deploy` → `hopsig.sanity.studio`), not embedded at `/studio`.
- **Existing Sanity project**, two datasets: `development` and `production`.
- **Site on Vercel**, Next.js App Router, static generation with on-demand revalidation from Sanity webhooks.
- **Bundle fixes go first** (Phase 0), before any code.

This plan supersedes `PROMPTS.md` for build order. `CLAUDE.md` stays the rulebook and is updated in Phase 0.

---

## Repo layout

```
hopsig-site/
  web/                 Next.js app (Vercel project root)
  studio/              Sanity Studio (own package.json, deployed with `sanity deploy`)
    schemaTypes/       documents/, singletons/, objects/
    structure/         desk structure (singletons pinned, collections listed)
    tools/placeholders custom Studio tool: every remaining [PLACEHOLDER] by document
  scripts/             seed, extract, placeholder-check, text-diff, screenshot-diff
  content/             seed data (source of the first import only, then Sanity wins)
  reference/  generator/  sanity/schema.ts (superseded by studio/schemaTypes)
  CLAUDE.md  IMPLEMENTATION_PLAN.md
```

pnpm workspaces. `web` gets schema types via `sanity typegen` run in `studio/` and written to `web/sanity/types.ts`. `web` never imports Studio code.

Environment variables (web): `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN` (viewer, for drafts), `SANITY_REVALIDATE_SECRET`, `NEXT_PUBLIC_SANITY_STUDIO_URL`.
Studio: `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`, `SANITY_STUDIO_PREVIEW_URL` (the Vercel URL).

---

## Content model

Design principle: **fixed-layout documents, not a page builder.** Each page is a singleton whose fields mirror the sections of its reference page, in order. Editors change words and list items; they cannot add, remove or reorder sections. This keeps the "do not invent new components" rule enforceable.

### Shared object types (`objects/`)

| type | fields | used by |
|---|---|---|
| `richInline` | Portable Text, one block, marks `strong` / `em` only, no styles | any line with `<b>`/`<i>` (e.g. `measured`) |
| `richBody` | Portable Text: `normal`, `h2`, `blockquote` (pull quote), numbered list; `strong` / `em` | posts, legal sections |
| `multiline` | `text` where `\n` renders as `<br>` | hero titles (the HTML uses `<br>` breaks) |
| `link` | `kind: internal \| external`; `internal` = reference to any routable doc; `external` = url; `label` | nav, buttons, CTAs, offers |
| `pageHero` | eyebrow, title (`multiline`), sub, chips[], buttons[`link` + `variant: lime \| outline`] | every page |
| `fact` | value, label | facts row (4) |
| `ledgerItem` | title, text (`richInline`) | ledger |
| `step` | when (Day 0 / Day 3 / …), title, text | steps |
| `faqItem` | question, answer (`richInline`) | FAQ |
| `closing` | eyebrow, title, buttons[], showEmail | every page |
| `seo` | title, description, ogImage | every routable doc (the reference has none; Phase 12 fills them) |

Internal links are **references**, so Studio blocks deleting a linked page and dead links are impossible by construction. Each routable doc resolves its path through one `resolvePath(doc)` function in `web/lib/routes.ts`, the only place URLs are built.

### Collections (`documents/`)

| type | count | notes |
|---|---|---|
| `caseStudy` | 32 | fields from the current schema, plus `source` (`F0`… read-only), `measured` as `richInline`, `slug` = **route slug** (`payments-platform`, not the title slug), `hasPage`, `featured`, `order`, `metric`, `filterDomain`. `clientName` stays hidden and is never queried by `web`. |
| `post` | 6 | current schema, plus `status` replaced by `publishedAt` (see Phase 0). `offer.route` becomes a `link`. `closing` stays a string. |
| `service` | 8 | everything in `content/services.json`: `n`, name, oneLiner, description, tiles[], stack[], shape, goodFor, pageTitle, gets[], sayNoWhen[], steps[`step`], `record` = references to `caseStudy` (max 3), faq[`faqItem`], `closing`. `slug` = route slug (`data-engineering`). `orderRank` sets order in the nav and the file stack. |
| `industry` | 6 | everything in `content/industries.json`: name, short, title, sub, facts[`fact`] ×4, `record` refs, `lead` ref, asks[], `services` refs, close. Slug = route slug. |

### Singletons (`singletons/`)

Pinned at the top of the Studio desk; no create/delete/duplicate actions.

| singleton | what is in it |
|---|---|
| `siteSettings` | company reg no, legal form, year, email, address, VAT status, bank country, **day rate (number, optional)**, booking URL, brief form recipient. These hold the placeholders that appear on every page. Empty = the bracketed placeholder renders. |
| `navigation` | primary (with dropdown children as `link`s plus `desc`), CTA, footer columns, all with one `{label, link}` shape (fixes the two footer shapes) |
| `homePage` | hero beats (5), domains[6, `lead` ref], file-stack closing sheet, record section, why-Hopsig, "since [YEAR]" band, notes heading, closing. Featured work and notes are **queried**, not stored. |
| `servicesIndexPage`, `industriesIndexPage`, `workIndexPage`, `notesIndexPage` | hero, section headings, intro copy, closing; lists are queried |
| `approachPage`, `ratesPage`, `bookPage`, `briefPage`, `comparePage` (why-not-just-hire), `workingWithUsPage`, `aiTransformationPage`, `agenticFlowPage` (with `stages[6]` from `flow-stages.json`), `agenciesPage`, `joinPage`, `privacyPage`, `termsPage`, `notFoundPage` | one field group per section of the reference page, in order. Legal pages: `sections[] { heading, body: richBody }`. |

The work filter chips come from the `filterDomain` option list, with labels in `workIndexPage.filters[]`, so a filter can't exist without a matching value.

### Placeholder handling in Studio

The "never invent proof" rule now has to hold in a CMS that anyone with access can edit:

1. **Field-level warning (not error)**: a shared validation rule flags any string or Portable Text that contains `\[[A-Z][A-Z0-9 .,/&@→×'+\-–]*\]`. The message is "Placeholder — leave until the real figure is known". Publishing is still allowed, because placeholders are meant to ship.
2. **Placeholders tool** (`tools/placeholders`): a Studio tab that scans every document and lists each remaining token with its document and field, linked to the editor. This replaces `content/placeholders.json` as the live list.
3. **Number fields carry a source note**: `metric`, `facts` and `measured` have a required `evidence` field (hidden on the site) once the placeholder is replaced. "Where did this number come from" then lives next to the number.
4. **Roles**: founders get Editor; anyone else gets Contributor (drafts only). Publishing stays with the founders.

### Preview and publishing

- **Presentation tool** in the separate Studio, with `previewUrl.origin = SANITY_STUDIO_PREVIEW_URL` and `previewMode.enable = '/api/draft-mode/enable'`. Editors see the real page, click text to edit it, and see drafts before publishing.
- **Stega** (click-to-edit encoding) is on in draft mode only. Wrap any value used for logic (filter keys, slugs, the day rate, `filterDomain`) in `stegaClean()`.
- **Revalidation**: a Sanity GROQ webhook on publish calls `web/app/api/revalidate` (signature checked with `parseBody`) → `revalidateTag(doc._type)` plus `revalidateTag(\`${_type}:${slug}\`)`. Every `sanityFetch` declares its tags. Pages are statically generated and update within seconds of publishing.
- **CORS origins** on the Sanity project: the Vercel production domain, preview domains (`*.vercel.app` with credentials only for preview), `localhost:3000`, and the studio host.

---

## Phases

One phase is one Claude Code session (or `/clear` between). Every phase ends with the checks listed under it. Every UI phase compares screenshots at 1440 against the reference **and** runs the text diff (see Tooling).

### Phase 0 — Fix the bundle (no app code) — DONE 2026-10-10

Gate: `python scripts/check_bundle.py` (0 failures). What was done is recorded in `CLAUDE.md`; the items below are the original brief for it.

1. `content/posts.json`: give the two published posts real `publishedAt` values. Ask the founders; until then use a fixed past date, which only drives ordering. Drafts keep `null`. Separately, find out what `[DATE]` on the two note pages is: CLAUDE.md rule 7 says Notes show no dates, so either it is something else (e.g. a "last reviewed" line) or it breaks the rule and should go.
2. `content/case-studies.json`: set `slug.current` to the route slug for the three `hasPage` studies; keep the long title slug as `_id`. Do the same for services and industries `_id` ↔ route mismatches (`data-engineering`, `retail-ecommerce`, `iot-signage-built-environment`).
3. `content/navigation.json`: footer columns to one `{label, route}` shape.
4. Extract the copy that has no JSON into `content/pages/*.json` (one file per singleton, keys matching the Phase 2 schema) with `scripts/extract-pages.ts`. Do it once, then review by hand. Copy taken from HTML must keep entities resolved and `<br>` turned into `\n`.
5. Decide the four reference deviations and record each in `CLAUDE.md` as a one-line rule:
   - link hover on light surfaces uses Moss (no `#A9D437` anywhere);
   - `.rv` is hidden only when `<html class="js">` is set by an inline head script (content visible with JS off; same for hero captions);
   - a global `:focus-visible` ring (2px `--acc`, offset 3px) for links, buttons and form fields;
   - radii and type sizes: add the sizes and radii actually used (6/3/2px; the full size list) to the token section rather than "correcting" the design.
6. Rewrite in `CLAUDE.md`: the "Selected work index" row (home = 8 featured with cursor card, expansion and filters; `/work` = all 32: 12 full cards then "the rest of the record", no cursor card); the estimator formula (engineers × months × 21 days × rate); Stack (separate Studio, Vercel, Sanity for everything); the placeholder check (now against the Placeholders tool / dataset, not `placeholders.json`).
7. Drop "Run prompts in PROMPTS.md" from `HANDOVER.md`; point to this file.

Check: a script asserts 2 posts have `publishedAt`, the 3 `hasPage` slugs equal their route tails, and every page JSON file exists.

### Phase 1 — Scaffold — DONE 2026-10-10

Next.js 16.4 (Turbopack, `cacheComponents` + `partialPrefetching` on), React 19.3, Tailwind 4, Sanity Studio 6.18 (TypeScript ~6.0 as the Sanity CLI template pins). Project `e1ib49ry`, studio host `hopsig`. `pnpm shot` = `scripts/shot.mjs` (Playwright element screenshots + pixel diff into `audit/shots/`). Closing section of `/phase1` vs `approach.html`: type, colour and button geometry identical; residual diff is mono anti-aliasing and the reference's sticky header. Not done here, needs your accounts: `sanity login`, dataset creation, `sanity deploy`, Vercel project link.

- pnpm workspace with `web/` (Next.js latest stable, App Router, TypeScript, Tailwind) and `studio/` (`npm create sanity@latest`, current major, connected to the existing project ID).
- `web`: tokens and `.tone-d` / `.tone-l` into `globals.css`; Space Grotesk 400/600 and IBM Plex Mono 400/500 via `next/font` (only the weights used); `Surface` (tone + optional seam) and `Button` (lime / outline); the `<html class="js">` head script from Phase 0.
- ESLint, Prettier, `tsc --noEmit` in CI (GitHub Actions); Vercel project linked to `web/`.

Check: throwaway page vs the closing section of `reference/site/approach.html` at 1440; build passes on Vercel preview.

### Phase 2 — Studio schemas and structure — DONE 2026-10-10

83 schema types (18 shared objects, 6 page objects, 4 collections, 4 site singletons, 18 page singletons); `sanity schema validate` clean; Placeholders tab; singleton actions locked; typegen into `web/sanity/types.ts` with a CI drift check; deployed to https://hopsig.sanity.studio (appId in `sanity.cli.ts`). Changes from the plan below: site-wide tokens are filled once in Site settings and substituted at render (see CLAUDE.md); `homePage.caseIndex.cases` and `workIndexPage.selected.cases` are ordered reference lists, which settles the case-order question in favour of an explicit editor-controlled order; brief submissions are not a document type. No `orderable-document-list` plugin: services and industries order by `n`, case studies by `order`. Editors not yet invited.

- All object, document and singleton types above, TypeScript, `defineType`/`defineField`, validation on required copy.
- Desk structure: "Site" group (settings, navigation), "Pages" group (singletons in nav order), "Work" (case studies ordered by `order`, filter views for featured / hasPage), "Notes" (published / drafts), "Services", "Industries".
- Singleton actions locked down; `orderable-document-list` for services and industries.
- Placeholder validation rule and the Placeholders tool.
- `sanity typegen generate` → `web/sanity/types.ts`; add to CI.
- `sanity deploy` the studio; invite founders as Editors.

Check: Studio opens on the hosted URL; every singleton opens with empty fields; typegen output compiles in `web`.

### Phase 3 — Seed

- `scripts/seed.ts`: reads `content/*.json` and `content/pages/*.json` and writes NDJSON with deterministic `_id`s:
  - case-study record keys (`F0`, `C2`) become references;
  - route strings become `link` references;
  - `<b>`/`<i>` become Portable Text marks; `<br>` becomes `\n`;
  - entities are decoded.
- Then run `sanity dataset import seed.ndjson development --replace`. It is safe to re-run.
- Verification queries, all scripted:
  - `count(*[_type=="caseStudy"])` = 32; `featured` = 8; `hasPage` = 3;
  - posts with `defined(publishedAt)` = 2;
  - services = 8, industries = 6;
  - every singleton exists;
  - no unresolved references;
  - the Placeholders tool reports the tokens in `content/placeholders.json` (53) except `[FORM ENDPOINT]` and `[INBOX]`, which live only in build notes and are not seeded.

### Phase 4 — Data layer in `web`

- `next-sanity` client, `defineLive` / `sanityFetch` with tags, GROQ queries in `web/sanity/queries.ts` (one per page, projections only of fields the page renders, typed via typegen).
- Portable Text renderers for `richInline` and `richBody` (strong/em, h2, pull quote, ordered list), no other marks.
- `resolvePath()`; `generateStaticParams` for services, industries, case studies (`hasPage`), posts (published).
- Draft mode routes, `<VisualEditing />` in draft only, revalidate route handler, webhook created in Sanity.
- `siteSettings` placeholder fallback: `value ?? '[COMPANY REG NO.]'` lives in one helper so a missing setting always renders its placeholder.

Check: editing a word in Studio shows in the Presentation preview, and after publishing it appears on the Vercel preview without a deploy.

### Phase 5 — Header and footer

From `navigation`: wordmark lockup, three dropdowns (hover / focus-within, tap toggles, Esc and outside click close, current item `.on`), CTA, four-column footer with the settings line (reg no, year, email). Responsive: tighten at 1300, drop "Technologies" at 1180, hamburger below 900 (same tokens).
Reference: `services/data-engineering.html` with each menu open.

### Phase 6 — Shared components and services

Page hero with ring canvas (`hero_anim.py` → a small TS class, `aria-hidden`, reduced-motion static frame), facts row, gets list, say-no list, steps, ledger, FAQ (one open at a time), closing with ring. Then `/services` and the eight `/services/[slug]` from `service` docs.
Reference: `services/custom-software.html`, then each service.

### Phase 7 — Industries

`/industries` and six `/industries/[slug]`.

### Phase 8 — Home

In order, screenshot after each:
- hero scroll sequence (240vh, five beats);
- domains strip;
- **services file stack**: read `generator/site.py` `core_services()` and the `fSize` / `.stacked` / `.dwell` / `.over` logic first; the sheets come from `service` docs plus the closing sheet from `homePage`;
- the record;
- selected work (featured query, cursor card lerp .13, row expansion, filters);
- notes journal (published + drafts as inert `[DRAFT]` rows);
- closing.

### Phase 9 — Work and case notes

`/work`: 12 full cards then "the rest of the record", from `*[_type=="caseStudy"] | order(order asc)`. Match the reference, not the old doc description. `/work/[slug]` for the three `hasPage` studies.

### Phase 10 — Notes

`/notes` (published link, drafts inert `[DRAFT]`), `/notes/[slug]` with sticky aside (in-this-note from h2s, offer `link`, CTA) and "Next notes". No dates, reading times or bylines.

### Phase 11 — Remaining pages

One session each from its singleton:
- `/approach`
- `/rates`: the estimator uses `siteSettings.dayRate`, and the placeholder shows when it is empty. Keep the estimator code page-local so `[YOUR RATE]` isn't in a shared JS chunk.
- `/book`: the calendar stays visual until the booking tool is chosen, then it gets an embed or a link from `siteSettings.bookingUrl`.
- `/brief`: a route handler on Vercel with validation, a honeypot and a rate limit. It emails `siteSettings` recipient through the chosen email provider. Submissions are **not** stored in Sanity, to keep personal data out of the CMS.
- `/why-not-just-hire`
- `/working-with-us`
- `/ai-transformation`
- `/agentic-flow`: SVG with hover sync between node and table row.
- `/for-agencies`
- `/join`
- `/privacy`
- `/terms`
- `not-found`

### Phase 12 — Audit and launch

- Link crawl of every route (zero dead links).
- Placeholder check: tokens in `.next` HTML output = tokens reported by the Placeholders tool against `production`. Never fewer.
- Text diff of every route vs its reference page (only intended changes).
- Lighthouse on `/`, `/services/data-engineering`, `/work`: performance ≥ 90, accessibility 100.
- JS disabled: all copy visible.
- `prefers-reduced-motion`: no canvas animation, no reveals.
- `seo` fields filled for every routable doc; `sitemap.ts`, `robots.ts`, OG image route.
- Contact sheet at 1440 and 390 in `audit/`.
- Promote: `sanity dataset copy development production` (or re-run the seed against production), point Vercel production to `production`, create the production webhook, set CORS, connect the domain. `hopsig.si` → 301 to `/ai-transformation` if registered.

---

## Tooling built along the way (`scripts/`)

| script | purpose | first used |
|---|---|---|
| `extract_pages.py` | one-time HTML → `content/pages/*.json` (done) | Phase 0 |
| `check_pages.py`, `check_bundle.py` | coverage of every reference string; content invariants | Phase 0, then CI until Phase 3 |
| `seed.ts` | JSON → NDJSON with references and Portable Text | Phase 3 |
| `verify-dataset.ts` | the count/reference/placeholder assertions | Phase 3, then CI |
| `text-diff.ts` | visible text of a built route vs its reference page, normalized; fails on any unexpected change | Phase 5 onward |
| `shot.ts` | Playwright screenshots at 1440 (and 390) for a route and its reference, plus a pixel diff | Phase 1 onward |
| `placeholder-check.ts` | build output vs dataset placeholders | Phase 12, then pre-deploy in CI |

---

## Still open (blocking the phases named)

| decision | blocks |
|---|---|
| Published dates for the two notes | nothing (stand-in dates set: 2026-01-01 / 2026-01-02) |
| `[DATE]` on note heroes, engagement-panel initials and numbers, "fetched from Sanity Studio" copy, home case-index order | the pages that show them (see CLAUDE.md, Open questions) |
| Booking tool (Cal.com / Calendly / SavvyCal) | Phase 11 `/book`, privacy copy |
| Email provider for the brief form (e.g. Resend, Postmark) | Phase 11 `/brief`, privacy copy |
| Analytics (or none) | privacy copy, consent banner |
| Founders' Sanity accounts | Phase 2 invites |
| Counsel review of privacy and terms | launch |
