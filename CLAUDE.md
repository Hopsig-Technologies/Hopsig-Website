# Hopsig Technologies — website

Marketing site for Hopsig Technologies: senior engineers and data/AI people who join a client's team or take a build end to end. The company is **Hopsig Technologies LLC, a Wyoming limited liability company (30 N Gould St Ste R, Sheridan, WY 82801, USA)**; the work is delivered from the **Delivery Centre: Lahore, Pakistan** (always worded exactly so, alongside the LLC). Email: info@hopsig.com. Buyers are CTOs, heads of engineering and agency founders at 20–200-person companies in the UK, US and EU.

Brand line: **You think it. We finish it.**
Five-second test, every page: a London head of engineering thinks "senior, will not waste my time".

## What this repo is

- `IMPLEMENTATION_PLAN.md` — the build order (P0–P9) and the content split. Replaces `PROMPTS.md`.
- `reference/site/` — the approved prototype: 37 static HTML pages, desktop only (1440 wide), each self-contained. **This is the design source of truth**, except where a rule below overrides it. Since 2026-10-11 it holds the **v2 design** (new header on every page; animated figures on 17 pages), applied by `scripts/apply_v2_reference.py` from the v2 bundle (kept outside git in `v2 handover/`); the v1 pages are in git history. In the 17 animated pages the figures are empty `<figure class="anim">` shells filled by the prototype's script: open `v2 handover/reference/site-v2/` to watch them run.
- `docs/anim/` — the animation brief, per-scene specs, `DEVIATIONS.md` (deliberate departures; keep them) and the v2 `CHANGES-v2.md`. `reference/page-map.json` maps old artboard names to clean paths.
- `web/` — the Next.js site (Vercel). **`web/content/` holds the copy of every static page as typed TypeScript modules** (`satisfies <Type>` against `web/content/types.ts`; internal hrefs are checked against `web/content/routes.ts`). Edit copy there; never type it into a component.
- `studio/` — Sanity Studio, hosted at https://hopsig.sanity.studio. **Sanity holds only what changes without a developer:** case studies (`caseStudy`), notes (`post`), career listings (`jobListing`) and the site-wide values (`siteSettings`: company reg no, year, email, day rate, booking link …).
- `content/` — seed input for Sanity only: `case-studies.json`, `posts.json`, `job-listings.json`, plus `routes.json` and `placeholders.json` used by the checks. (The page copy was extracted from the reference into `content/pages/*.json` and converted once into `web/content` on 2026-10-10 in the "P0 pivot" commit; git history has the extractor and converter.)
- `scripts/` — the gates: `content_corpus.mjs` (strings/links of `web/content` → `audit/`), `seed.mjs` (→ `audit/seed.ndjson`), `check_bundle.py` (seed invariants + every reference string and link accounted for: `check_pages.py`, `check_links.py`), `verify_dataset.py` (live dataset), `prune_dataset.mjs`, `placeholders.mjs`, `shot.mjs` (screenshot diff), `text_diff.py` (visible text of a built route vs its reference).
- `generator/` — the Python that produced the prototype. Read it when a mechanic in the HTML is unclear; never run it, and never take copy from it (it rewrites strings after rendering).

## Stack

Next.js 16 (App Router, TypeScript, static generation, on-demand revalidation) on **Vercel** (`hopsig-website`, root `web/`, auto-deploys `main`). **Sanity Studio 6 is a separate app** in `studio/`, deployed with `pnpm --filter studio deploy`; datasets `development` (now) and `production` (launch). Tailwind 4 is fine for layout; the tokens below are the only colours, sizes and radii. No component library, no animation library beyond what the prototype does by hand (IntersectionObserver reveals, `requestAnimationFrame` canvases). No third-party scripts except Google Fonts (loaded via `next/font`) and, after consent only, Google Analytics 4 and PostHog (owner decision 2026-10-11; Hotjar was considered and dropped).

Version notes (read `web/AGENTS.md`; the bundled docs in `web/node_modules/next/dist/docs/` win over memory):
- Next 16 with `cacheComponents`: cache CMS reads with `'use cache'` + `cacheTag()` + `cacheLife()`; segment exports `revalidate` / `dynamic` / `fetchCache` throw. `revalidateTag(tag, …)` takes two arguments. `params` are async; use the generated `PageProps<'/x/[slug]'>` / `LayoutProps<'/'>` (run `next typegen`). `middleware.ts` is now `proxy.ts`. `generateStaticParams` must return at least one entry.
- Commands: `pnpm check:content` (the content gate; run after editing `web/content` or `content/`), `pnpm placeholders` (what is still bracketed), `pnpm --filter studio typegen` (after any schema or query change; CI fails if `web/sanity/types.ts` is stale), `pnpm --filter studio deploy`, `pnpm dev` (web), `pnpm dev:studio`, `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm shot -- --name … --ref … --ref-sel … --url … --web-sel … [--hover sel] [--clip-height px]`, `python scripts/text_diff.py http://localhost:3100 /route …` (set `MSYS_NO_PATHCONV=1` in Git Bash, or it rewrites `/route` into a Windows path).
- Seed (collections only, deterministic ids): `node scripts/seed.mjs` → `pnpm --filter studio exec sanity dataset import ../audit/seed.ndjson --dataset development --replace` → `python scripts/verify_dataset.py`. `--replace` overwrites edits made in Studio: once the founders are editing a dataset, never re-seed it. `--with-settings` also writes an EMPTY `siteSettings`: never against a dataset whose settings are filled.

## Hard rules (from the brief; do not relax)

1. **Never invent proof.** Every number on the site comes from the record (`web/content`, `content/`, Sanity). Where the record has no number yet the copy carries a bracketed placeholder (`[ADD THE NUMBER]`, `[YOUR RATE]`, `[COMPANY REG NO.]`, `[YEAR]`, `[HELLO@HOPSIG.COM]`, …). Keep placeholders visible until the founders replace them. Do not fill one in from a guess, ever.
2. **Client names are withheld** on every case note. Do not add logos, names or testimonials.
3. **Company voice, no people.** No founder names, photos, bios or "our team" sections anywhere. "We", "the people who would do the work", "the record".
4. **Nothing from the banned list:** purple/blue gradient blobs, glassmorphism, neon, 3D shapes, circuit-board or "AI brain" imagery, stock photography, rounded friendly-SaaS styling, generic wordmarks, overpromising taglines, **card drop shadows**. Depth comes from borders and tone changes, never shadows. (`box-shadow: inset 0 0 0 1px` used as a border is fine.)
5. **One Lime moment per screen** on dark surfaces (the accent is the eyebrow, or the button, or the ring — not all three). Approved exceptions: collapsed tabs in the services file stack are Lime; the header's AI capsule (AI transformation · Agentic flow) is Lime on every page (v2).
6. Light surfaces use **Moss** as the accent, never Lime (Lime on Paper fails contrast). This includes hover: link hover is `--acc` darkened/underlined per tone, **never `#A9D437`** (the reference uses it globally; do not copy it).
7. **No reading times, person bylines or newsletter pop-ups** on Notes. Notes show their publish (and updated) date and the organisational byline "Hopsig engineering" (owner decision 2026-10-11; no names, no role claims). A consent banner exists because GA4 and PostHog are installed; nothing non-essential loads before consent.
8. Mobile is **not designed yet** (prototype is 1440 wide). Build responsive from the tokens and the desktop reference; keep the hierarchy, drop the side-by-side grids to single column below 900px, and do not invent new components to do it.
9. **Build notes never ship.** The reference renders designer notes as visible text ("Build note: …", "Source: Sanity · caseStudy · …"). They are not in the content and `check_pages.py` skips them; never reproduce them.
10. **Content is visible with JS off.** `.rv` (and the home hero captions) start hidden only under `html.js`, set by an inline script in `<head>`; the reference hides them unconditionally — do not copy that. Large pages also need the `<noscript>` stylesheet in `app/layout.tsx` (React streams a big `<main>` out of order into a hidden div); check with `node scripts/check_nojs.mjs` against a production build.
11. **Focus is visible everywhere**: one global `:focus-visible` ring (2px `var(--acc)`, offset 3px) on links, buttons, form fields and dropdown triggers. Never `outline: none` without a replacement.
12. **Nothing from `web/content` reaches a client bundle.** `web/content/index.ts` is `server-only`; client components get the strings they need as props (so `[YOUR RATE]` is never in a shared JS chunk).
13. **No rates anywhere** (owner decision 2026-10-11): no Rates page (`/rates` redirects to `/book`), no day rates, "Priced" callouts, estimators or rate cards. Engagement shape only ("Embedded · monthly, per engineer", "Built · fixed scope per increment"); non-price terms (notice, replacement, IP on payment, NET 14) stay. Pricing questions are answered "we scope it on the call".
14. **No time zones or overlap** (owner decision 2026-10-11): no "4 h overlap", GMT windows, overlap clocks or local times. Location is only "Delivery Centre: Lahore, Pakistan".
15. **Every removal of reference copy is recorded** in `content/deviations.json` under its decision (`removed`, `removed_routes`, `retired_placeholders`); the checks accept exactly those.

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

Type: **Space Grotesk** 600 for headings (letter-spacing −0.045em to −0.05em, line-height 1.02–1.05), 400 for body, 500 only inside the v2 animation artboards; **IBM Plex Mono** 400/500 for eyebrows, labels, numbers and nav (11–12px, letter-spacing 0.12–0.16em, uppercase). Load only these weights.
Headline sizes: h1 84 (home) / 72 (page heroes) / 64 (book, brief); h2 56 (closing) / 44 (section) / 40 / 32; file-stack numerals 88 (mono 500).
Full scale in use (px): 9 10 11 12 13 14 15 16 17 18 19 20 21 22 24 26 30 32 34 36 40 42 44 48 56 64 72 84 88. Use these; do not "normalise" them to fewer.

CSS baseline: `box-sizing: content-box` and `line-height: normal` everywhere (the reference's browser defaults; Tailwind's preflight is overridden in `web/app/globals.css`), so the reference's widths and paddings carry over unchanged. Component CSS lives in plain files (`web/app/chrome.css` for header/footer/closing), on the tone variables. The mono stack is `"IBM Plex Mono", monospace` by name (not the next/font variable, which always appends a full-Unicode fallback face), so glyphs Plex Mono lacks (→) fall back to the system monospace like the reference.

Radius: 2–3 (progress rails, bars), 6 (small controls: FAQ plus, chips), 8 (buttons, menu items, inputs), 12 (panels, cards, menus), 14 (file sheets). Container: max-width 1264 + 88px side padding. Header 72px, sticky, `rgba(14,17,22,.86)` + 8px backdrop blur, bottom hairline.

Seam between tones: 120px band of 1px dots on a 22px grid, masked to fade (`.seam`). It overlaps the next section (`margin-bottom:-120px`).

## Components (all have a working instance in `reference/site/`)

| Component | Where to look | Mechanic |
|---|---|---|
| Header + dropdowns | any page | Services (wide, 2-col, 8 items + footer links), Industries (6 + "All six"), Company (7). Hover/focus-within opens; tap toggles on touch; Esc and outside click close; current page marked `.on` inside its menu. Below 1300px gaps tighten; below 1180px the wordmark drops "Technologies". |
| Hero ring | `index.html`, every page hero | Canvas dot field that forms an ellipse ("engagement ring") and reacts to the cursor; home version is a 240vh scroll sequence with five beats (Day 0 → Fortnightly). Respects `prefers-reduced-motion`. |
| Reveal | everywhere, `.rv` | Use the `Rv` component (`web/components/Reveal.tsx`), never a hand-written `className="rv"`: React owns the `in` class, so there is no hydration mismatch. Opacity 0→1, translateY 14→0, .6s; `delay` staggers; a sweep fallback catches rows a fast scroll skips. Hidden only under `html.js` (rule 10). |
| Services file stack | `index.html` → "Eight things we do" | Nine sticky sheets (8 services + a closing sheet) with 46px tabs; each sheet docks under the previous; a docked sheet's tab turns Lime; the section after slides over the finished stack. See `generator/site.py` `core_services()` and `fSize()` in the JS. |
| Case index (home) | `index.html` → "Where we have done this before" | The featured case studies from Sanity in `featuredOrder`. Cursor-following "Measured" card (lerp .13, velocity tilt); in-place row expansion (`grid-template-rows 0fr→1fr`); domain filter chips (`homePage.caseIndex.filters` ↔ `caseStudy.filterDomain`). |
| Work page | `work/index.html` | **Not** the case index. Every case study by `order`: the first 12 as full cards ("Selected."), the rest as "The rest of the record." (compact rows). No cursor card, no filters. Then the engagement panel and closing. |
| Engagement panel | `services/index.html` (×3), `work/index.html` | One engagement in five scenes (call → scope → people → measured → review), static; each page shows one scene (`/services`: 2, 1, 3; `/work`: 3). `web/components/EngagementPanel.tsx`, copy in `web/content/engagementPanel.ts`; invented people and results are placeholders (deviations.json). |
| Notes journal | `index.html` → Notes, `notes/` | Feature + ledger from the `post` query: published rows link, drafts are inert `[DRAFT]` rows. |
| Facts row | service/industry/case heroes | 4 mono numbers with labels; 26px on index pages, 22px on detail pages. |
| Ledger | many | `44px 260px 1fr` grid rows with mono index, title, text; hairline dividers. |
| Steps | approach, service pages | Day 0 / Day 3 / Day 10 / Week 6 / Fortnightly beats. |
| FAQ | service, industry, agentic | Disclosure rows, one open at a time. |
| Estimator | `rates.html` `#est`, `why-not-just-hire.html` | Engineers (slider) × months (slider) × 21 working days × day rate. Until `siteSettings.dayRate` is set, the total reads "N × [YOUR RATE]". Keep its code page-local so `[YOUR RATE]` is not in a shared JS chunk. |
| Calendar | `book.html` `#cal` | `components/ContactForms.tsx` `BookCalendar`: next week's days, eight GMT slots, the fields. Confirm opens `siteSettings.bookingUrl` when set; otherwise posts to `/api/contact`. The "Booked" card shows only after a successful send, never as decoration. |
| Brief form | `brief.html` `#bf` | `BriefForm` posts to `/api/contact` (`app/api/contact/route.ts` → `lib/contact.ts` `sendContact`), which will email `siteSettings.briefRecipient`; submissions are not stored. Until a provider is wired it answers 503 and the form shows `notConnected` (email us instead). |
| Flow diagram | `agentic-flow.html` | SVG: six nodes from `agenticFlowPage.flow.stages`, three "A PERSON SIGNS" gates in Lime; hovering a node highlights its table row and vice versa. |
| Closing | every page | Ring canvas + eyebrow + 56px h2 + two buttons + email line. |

Buttons: `lime` (Lime/Ink on dark → Ink/Paper on light via the variables), `outline` (1px inset `--line`; transparent, or `--bg` in the closing). Mono 500 uppercase, letter-spacing 0.12em, radius 8; default 12px with 16×24 padding, `sm` 11px with 12×17 (header CTA). No shadows, no gradients.

## Content model

**Static (code):** `web/content/pages/*.ts` (one module per page, fields in the page's section order), `services.ts` (8), `industries.ts` (6), `navigation.ts`, `site.ts` (footer lines, default closing, capabilities rows), `templates.ts` (the words detail templates put around collection data; `{tokens}` filled from the document), `engagementPanel.ts`. Types in `web/content/types.ts`; routes and slugs in `web/content/routes.ts`. Rich strings (`<b>`, `<i>`, `<a href>`) and legal bodies are converted at render by `web/lib/portable.ts` and rendered with `PortableText` from `next-sanity`, the same renderer as the Sanity content.

**Sanity (Studio at hopsig.sanity.studio, schema in `studio/schemaTypes/`):**
- `caseStudy` — 32 docs. `order` = position on /work (0..31; the first 12 are full cards); `featured` + `featuredOrder` = the home case index (8); `source` = the record key (F0, C2 …) that `services.ts` / `industries.ts` / `aiTransformationPage.ts` name in their `record` lists (`casesByKey` in `web/lib/cases.ts`); `hasPage` ×3 render `/work/<slug>`; `measured` is Portable Text; `metric` drives the cursor card; `clientName` is never queried (rule 2).
- `post` — 5 docs; 2 published (`publishedAt` 2026-07-22 and 2026-09-16, chosen by the owner on 2026-10-11 and shown on the site), 3 unpublished (`publishedAt` empty → hidden). Optional `updatedAt` shows as "Updated …". `body` is Portable Text (normal / h2 / blockquote / numbered / bullets; strong, em, link `{href}`); `offer` is the sticky aside with an `href` path.
- `jobListing` — roles on /join: `title`, `text`, `status` (open / pipeline / closed; empty renders `[STATUS]`), `order`.
- `siteSettings` — one doc (`_id == "siteSettings"`): the `SITE_TOKENS` values (`studio/schemaTypes/singletons/site.ts`, mirrored in `web/lib/tokens.ts`), `bookingUrl`, `briefRecipient`. **Site-wide tokens are substituted at render:** `makeFill(settings)` replaces `[COMPANY REG NO.]`, `[YEAR]`, `[HELLO@HOPSIG.COM]`, `[YOUR RATE]` … in every rendered string when the field is filled, and leaves the token visible when it is empty. Never substitute any other token.
- Placeholder warnings: every text field warns (never errors) while it holds a `[TOKEN]`; the Studio's **Placeholders** tab lists the ones in Sanity. The static copy's tokens are in `pnpm placeholders`.

**Fetching (`web/sanity/lib/live.ts`, `web/lib/`):** always `cachedSanity({query, ...mode})` (the one `'use cache'` boundary, tag `sanity`); queries in `web/sanity/queries.ts` via `defineQuery` (singletons filter on `_type` **and** `_id`); wrap page content with `withMode(Content)` from `web/lib/mode.tsx` so routes prerender (○) and only draft mode renders drafts + stega; `getFill(mode)` from `web/lib/site.ts` for token substitution; `casesByKey(keys, mode)` for record lists; `stegaClean` (from `next-sanity`) on any value used for logic, classes or URLs. Every page fetches `siteSettings` (one shared cache entry).

**Publishing:** a Sanity webhook ("Revalidate website (development)", filter `_type in ["caseStudy","post","jobListing","siteSettings"]`) posts to `/api/revalidate`, which checks the signature and revalidates the `sanity` tag, i.e. the whole site; changes are live in ~5 s with no deploy. Secrets (`SANITY_API_READ_TOKEN` viewer, `SANITY_REVALIDATE_SECRET`) live in Vercel and `web/.env.local`, never in the repo. CORS origins with credentials: `https://hopsig-website.vercel.app`, `http://localhost:3000`.

## Routes

37 routes in `content/routes.json` and `web/content/routes.ts`. Services and industries render from `services.ts` / `industries.ts` (one template each); case notes, notes and roles from Sanity; every other page from its module. `404.html` is the not-found page.

## Working rules for this codebase

- Build one route at a time against its reference page; screenshot both at 1440 and compare (`pnpm shot`), and run the text diff, before moving on.
- Copy comes from `web/content` (static) or Sanity (collections), never typed into a component. If a string must change, change the module or the document. Then `pnpm check:content`: every visible string and link on the 37 reference pages must still be accounted for (0 uncovered, 0 links missing) — a deliberate copy change is the only reason to update the reference comparison.
- Keep JS small and feature-detected; every canvas and observer has a no-JS fallback (rule 10).
- **Deliberate differences from the reference** are recorded in `content/deviations.json` (reference string → replacement, with the owner's decision and date); `check_pages.py`, `text_diff.py` and `placeholders.mjs` accept exactly those and nothing else. Never add an entry without a decision. First entries: the engagement panel's invented people and results became placeholders (decided 2026-10-10).
- Placeholder check before any deploy: `pnpm placeholders` must report every token in `content/placeholders.json` (51) as either still present or resolved in Site settings — never fewer because something was "filled in". (`[FORM ENDPOINT]` and `[INBOX]` existed only in a build note and are not in the list.)
- Accessibility bar: contrast ≥ 4.5:1 for body, ≥ 3:1 for large text (the token pairs above pass); canvases `aria-hidden`; dropdowns keyboard-operable; focus visible (rule 11).

## Open questions (do not decide these in code)

- `[DATE]` appears in the note-page hero eyebrow ("Note · Delivery · [DATE]", `templates.ts` → `notePage.heroEyebrow`) and conflicts with rule 7. It is out of the build (`notePage.heroEyebrow` is "Note · {category}", recorded in `content/deviations.json`) until the founders decide.
- Visible copy that describes the implementation: "Eight case notes, fetched from Sanity Studio." (home case index) and "… Fetched from Sanity Studio." (home notes). Probably prototype wording; ask before changing the copy.
- Booking tool for `/book` and email provider for `/brief` (and the booking request): not chosen. Both are stubbed so nothing pretends to work (`bookingUrl` in Site settings; `sendContact` in `web/lib/contact.ts`). The `notConnected` lines in `bookPage`/`briefPage` are new copy, to remove once connected.
- The privacy page lists the CMS for "content and form storage"; brief submissions are emailed, not stored. For counsel's review.

## SEO (review round R3, 2026-10-11)

- Titles and meta descriptions: `web/content/seo.ts` (every number checked against the record); `lib/seo.ts` `pageMeta(path)` / `meta(...)` build title, description, canonical, Open Graph and Twitter tags; `metadataBase` = `NEXT_PUBLIC_SITE_URL` (the Vercel URL until hopsig.com is live). Case notes and notes use their Sanity `seo` fields, else `seoTemplates`.
- One H1 per page, and it carries the page's plain search phrase: the hero eyebrow is a `span.ph-kw` inside the `<h1>` (same look). Services and industries take it from `keyword` in `services.ts` / `industries.ts`.
- Share images: `opengraph-image.tsx` per route, all through `lib/og.tsx` (fonts in `lib/og/`); a metric only from the record, never a placeholder.
- `app/robots.ts`, `app/sitemap.ts` (seo.ts paths + case notes with pages + published notes), `app/notes/rss.xml/route.ts`.
- JSON-LD via `components/JsonLd.tsx`: Organization (layout), WebSite (home), Service + BreadcrumbList (services), BreadcrumbList (industries), Article (case notes), BlogPosting (notes), FAQPage (every `FaqBlock`). No prices in Service; JobPosting only for open roles; dates only once the notes have real ones.

## Analytics and consent (review round R6, 2026-10-11)

- GA4 (`G-D1Y3WDSLLJ`) and PostHog (project 658205, **US cloud** `https://us.i.posthog.com`) load only after "Accept" in the consent banner (`components/Analytics.tsx`, copy in `site.ts` `consent`); the choice lives in localStorage `hopsig-consent`; "Cookie settings" in the footer reopens it; Decline/withdraw stops both and clears `_ga*` / `ph_*` cookies. IDs in `lib/analytics.ts` (public client keys; `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` override).
- Consent Mode v2: ads signals always denied. PostHog: `person_profiles: identified_only`, history-change pageviews, session recordings with every input masked.
- Events (`track()` in `lib/analytics.ts`, nothing sent without consent): `consult_booked` (/book), `brief_sent` (/brief), `case_note_opened` (/work/<slug>), `email_clicked` (any mailto link).
- The privacy page names them and lists their cookies; it stays a draft for counsel (UK/EU transfers to the US PostHog cloud need SCCs / IDTA).

## Header (v2)

`AI transformation` and `Agentic flow` sit together in a hairline capsule (`span.ai`) between the Industries and Company dropdowns, coloured Lime (`var(--acc)`); the other links stay dim. Capsule border goes Lime at 50 % on hover/focus-within. No dot, no pulse, no extra nav item. The mobile menu is unchanged.

## Animations (v2)

- Runtime: `web/components/anim/engine.js` (the handover engine plus three marked port edits: `HA.start`, `HA.unmount`, `export default`). One clock for every figure, seeded randomness, IntersectionObserver playback at .35, pause on hidden tab, pause button on loops > 5 s, reduced motion = frozen `resolved` frame. Scenes (`web/components/anim/scenes/*.js`) are byte-identical to the handover and are pure functions of `t`; never keep per-frame state in a scene, never re-tune one silently: check `docs/anim/DEVIATIONS.md`, and if a departure is not listed, stop and ask.
- Manifest: `web/content/animations.ts` — route → scene ids, artboard size, mode, caption. Captions come from there, never written in a component. Timings (loop, seed, resolved) live in the scene files.
- Figure markup: `<figure class="anim" id="fig-<id>" data-scene="<id>"><div class="frame" style="aspect-ratio: W / H"></div><figcaption id="fig-<id>-cap">…</figcaption></figure>`; the `.frame` reserves its aspect ratio and holds the server-rendered static frame (`web/public/anim/<id>.static.svg`) before the scene loads (no layout shift, visible with JS off). Styles in `web/app/anim.css`.
- Animation-only tokens: amber `#D9A441` (queued / pending), red `#E06A55` (failure, ≤ 1,200 ms on screen). Not used in page chrome. Lime inside an artboard means "done and correct" only.
- Artboard numbers are a fictional product's UI; figcaptions never state a number; outcome-like scenes carry the on-artboard `EXAMPLE FIGURES` micro label. Never "fix" a figure to look better and never remove a label. Artboard text lives in the scene files (the one place copy sits in client JS, by design); `pnpm placeholders` scans them (`[TO CONFIRM]` in the healthcare scene until the founders confirm BAA / DPA).
- Interactive scenes (`agentic-flow-sim`, `agentic-never-wall`) use real `<button>`s positioned in artboard units (`HA.button`); keyboard-operable, focus ring 2 px Lime.
- `/ai-transformation` is scroll-scrubbed: `.scrub` 250vh with a sticky child; `t = p × 7000`; week ticks call `inst.goto(t)`.
- Verification: every loop scene's frame at `t = loop − 1` equals the frame at `t = 0` (0–10 differing pixels is anti-aliasing, more is a bug): `pnpm anim:test`. Static frames: `pnpm anim:static` (committed; CI fails if they drift). Interactive paths (simulator with mouse and keyboard, never wall, scroll scrub): `pnpm anim:flows` against `pnpm dev`. Playback, reduced motion, fps vs the prototype, mobile: `pnpm anim:audit` against a production build on :3100. Figure shots: `pnpm shot … --eval "HA.seek(<t>)"` against `v2 handover/reference/site-v2/` (the only copy where the reference figures run).
- Mobile artboards are not designed. Below 768 px the figure is hidden and the figcaption stays as copy, until the mobile scenes exist.
