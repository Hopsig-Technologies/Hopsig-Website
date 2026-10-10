# Hopsig website — handover to Claude Code

## What is in this folder

```
CLAUDE.md              the brief Claude Code reads on every session: rules, tokens, components, content model
IMPLEMENTATION_PLAN.md the build order (phases 0–12) and the Sanity content model
PROMPTS.md             the original build order; superseded by IMPLEMENTATION_PLAN.md
reference/site/        37 approved pages as standalone HTML (open index.html in a browser)
reference/page-map.json  artboard name → clean path
content/               all copy and data as JSON (see below); content/pages/ holds every page's copy
scripts/               extract_pages.py (reference -> content/pages), check_pages.py (coverage check)
sanity/schema.ts       caseStudy + post document types
generator/             the Python that produced the prototype, for reference only
```

## How to start

1. Create an empty repo (`hopsig-site`), unzip this bundle into it, commit.
2. Follow `IMPLEMENTATION_PLAN.md`. Phase 0 (bundle fixes) is done; start at Phase 1, one phase per session.
3. Each phase names the reference page to match and asks for a screenshot comparison and a text diff; insist on both.
4. Keep `CLAUDE.md` current. When you decide something (hosting, analytics, the booking tool, the real day rate), add one line to it rather than telling Claude Code in chat.

## Decisions still open on your side

These are not design questions; Claude Code will ask about them or stall on them.

- **Placeholders** — 53 bracketed tokens across the site (`content/placeholders.json`); once seeded, fill them in Sanity Studio. The ones on every page: `[COMPANY REG NO.]`, `[YEAR]`, `[HELLO@HOPSIG.COM]`. Rates: `[YOUR RATE]`. Join: pay bands, employment model, open roles. Legal pages: entity details, governing law, and a review by counsel before they go live.
- **Numbers marked `[ADD …]`** on case notes and industry facts. Either supply the measured figure or leave the placeholder; do not let it be filled in.
- **Booking** — the calendar on `/book` is visual. Pick the tool (Cal.com, Calendly, SavvyCal) and Claude Code wires it.
- **Brief form** — `/brief` posts to a Vercel route handler that emails `[HELLO@HOPSIG.COM]`; pick the email provider. Submissions are not stored in Sanity (the reference's build note says otherwise; the plan overrides it).
- **Hosting and domain** — Vercel (decided). `hopsig.si`, if registered, is a 301 to `/ai-transformation`, nothing more.
- **Analytics** — none is specified. If you add any, the privacy page needs the matching paragraph and possibly a consent banner (EU visitors).
- **Mobile** — the prototype is desktop only. Prompt 2 and prompt 10 cover responsive behaviour; review the 390px contact sheet when it arrives.

- **Questions Phase 0 raised** — see "Open questions" at the end of `CLAUDE.md`: the `[DATE]` on note heroes, the illustrative initials and numbers in the engagement panel, copy that mentions Sanity Studio, and the home case-index order.

## What not to let Claude Code do

- Fill a placeholder from a guess, or round a number "to look better".
- Add client names, logos, testimonials, team photos or founder bios.
- Reach for a component library, an animation library, a gradient, a shadow, or a stock image.
- Rewrite copy for "clarity". The copy was written to be read by a head of engineering in five seconds; if a line reads badly, change the JSON and tell it why.

## Content JSON

| file | docs | used by |
|---|---|---|
| `case-studies.json` | 32 (`featured` ×8, `hasPage` ×3) | Work index, home strip, case notes, "from the record" sections |
| `posts.json` | 6 (2 published with body) | Notes index, home journal, note pages |
| `services.json` | 8 | Services index, file stack, eight service pages, nav |
| `industries.json` | 6 | Industries index, six industry pages, nav |
| `domains.json` | 6 | Home domains strip |
| `work-filters.json` | 6 | Work index filter chips |
| `flow-stages.json` | 6 | Agentic flow diagram and table |
| `navigation.json` | — | Header, footer |
| `routes.json` | 37 | Route ↔ reference page |
| `placeholders.json` | 53 | Pre-deploy check |
| `pages/*.json` | 18 singletons + templates, siteSettings, engagementPanel | Every page's copy; seeds the Sanity singletons |

`record` fields reference case studies by source key (`F0` = `case-studies.json` entry with `source: "F0"`).
