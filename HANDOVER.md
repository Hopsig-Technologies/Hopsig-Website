# Hopsig website — handover to Claude Code

## What is in this folder

```
CLAUDE.md              the brief Claude Code reads on every session: rules, tokens, components, content model
IMPLEMENTATION_PLAN.md the build order (phases 0–12) and the Sanity content model
PROMPTS.md             the original build order; superseded by IMPLEMENTATION_PLAN.md
reference/site/        37 approved pages as standalone HTML (open index.html in a browser)
reference/page-map.json  artboard name → clean path
web/                   the Next.js site; web/content/ holds the copy of every static page (typed TypeScript)
studio/                Sanity Studio (case studies, notes, roles, site settings), hosted at hopsig.sanity.studio
content/               seed input for Sanity (case-studies.json, posts.json, job-listings.json) + the check inputs
scripts/               the gates: pnpm check:content, pnpm placeholders, verify_dataset.py, shot.mjs
sanity/schema.ts       caseStudy + post document types
generator/             the Python that produced the prototype, for reference only
```

## How to start

1. Create an empty repo (`hopsig-site`), unzip this bundle into it, commit.
2. Follow `IMPLEMENTATION_PLAN.md`. P0 (the pivot to "CMS only for case studies, notes, careers and site settings") is done; continue at P1, one phase per session.
3. Each phase names the reference page to match and asks for a screenshot comparison and a text diff; insist on both.
4. Keep `CLAUDE.md` current. When you decide something (hosting, analytics, the booking tool, the real day rate), add one line to it rather than telling Claude Code in chat.

## Decisions still open on your side

These are not design questions; Claude Code will ask about them or stall on them.

- **Placeholders** — 51 bracketed tokens across the site (`content/placeholders.json`). The site-wide ones (company reg no, year, email, day rate, legal form, address, VAT, bank country, retainer, agency discount, insurer) are filled once in **Studio → Site settings** and replaced everywhere. The `[ADD …]` numbers on case notes are filled on the case study in Studio. Everything else (join pay bands, legal-page tokens, `[QUOTE]`, `[ANALYTICS TOOL]` …) lives in `web/content` and is a code change. The ones on every page: `[COMPANY REG NO.]`, `[YEAR]`, `[HELLO@HOPSIG.COM]`. Rates: `[YOUR RATE]`. Join: pay bands, employment model, open roles. Legal pages: entity details, governing law, and a review by counsel before they go live.
- **Numbers marked `[ADD …]`** on case notes and industry facts. Either supply the measured figure or leave the placeholder; do not let it be filled in.
- **Booking** — the calendar on `/book` is visual. Pick the tool (Cal.com, Calendly, SavvyCal) and Claude Code wires it.
- **Brief form** — `/brief` posts to a Vercel route handler that emails `[HELLO@HOPSIG.COM]`; pick the email provider. Submissions are not stored in Sanity (the reference's build note says otherwise; the plan overrides it).
- **Hosting and domain** — Vercel (decided; project `hopsig-website`). It is on a personal Hobby scope now; Vercel's Hobby terms exclude commercial sites, so move it to a Hopsig Pro team before launch. `hopsig.si`, if registered, is a 301 to `/ai-transformation`, nothing more.
- **Analytics** — none is specified. If you add any, the privacy page needs the matching paragraph and possibly a consent banner (EU visitors).
- **Mobile** — the prototype is desktop only. Prompt 2 and prompt 10 cover responsive behaviour; review the 390px contact sheet when it arrives.

- **Questions Phase 0 raised** — see "Open questions" at the end of `CLAUDE.md`: the `[DATE]` on note heroes, the illustrative initials and numbers in the engagement panel, copy that mentions Sanity Studio, and the home case-index order.

## What not to let Claude Code do

- Fill a placeholder from a guess, or round a number "to look better".
- Add client names, logos, testimonials, team photos or founder bios.
- Reach for a component library, an animation library, a gradient, a shadow, or a stock image.
- Rewrite copy for "clarity". The copy was written to be read by a head of engineering in five seconds; if a line reads badly, change the JSON and tell it why.

## Where the content lives

| content | where | who edits |
|---|---|---|
| Case studies (32), notes (6), career roles (5), site settings | Sanity Studio — https://hopsig.sanity.studio | founders |
| Every static page, the 8 services, the 6 industries, navigation, footer lines | `web/content/*.ts` in the repo | whoever maintains the repo |

`content/case-studies.json`, `posts.json` and `job-listings.json` are only the first seed of the Studio; once the founders are editing there, the Studio is the record and the seed must not be re-run against that dataset.
