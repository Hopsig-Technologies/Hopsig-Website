import "server-only";
import { stegaClean, toPlainText, type PortableTextBlock } from "next-sanity";
import { homePage, industries, seo, services, site } from "@/content";
import { getFill } from "@/lib/site";
import { SITE_URL } from "@/lib/seo";
import { cachedSanity, PUBLISHED } from "@/sanity/lib/live";
import { CASES_ALL_QUERY, LLMS_POSTS_QUERY } from "@/sanity/queries";

/**
 * /llms.txt and /llms-full.txt (llmstxt.org): the site for AI assistants, in Markdown, built from the same copy
 * the pages use (web/content, Sanity) so it never drifts and adds no claims of its own. A line that still holds a
 * bracketed placeholder is left out (CLAUDE.md rule 1: nothing unconfirmed is presented as a fact).
 */

const url = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;
const plain = (s: string) => s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const known = (s: string | null | undefined) => !!s && !/\[[A-Z0-9 /·.,&'’-]+\]/.test(s);
const clean = (s: string | null | undefined) => plain(stegaClean(s) ?? "");

/** Company and how-we-work pages, in reading order, with their meta descriptions. */
const COMPANY = ["/services", "/industries", "/work", "/approach", "/working-with-us", "/why-not-just-hire", "/for-agencies", "/ai-transformation", "/agentic-flow", "/notes", "/join"] as const;

async function load() {
  const fill = await getFill(PUBLISHED);
  const [{ data: cases }, { data: posts }] = await Promise.all([
    cachedSanity({ query: CASES_ALL_QUERY, ...PUBLISHED }),
    cachedSanity({ query: LLMS_POSTS_QUERY, ...PUBLISHED }),
  ]);
  return { fill, cases, posts };
}

function header(fill: (s: string) => string) {
  const facts = homePage.hero.facts.map((f) => `${fill(f.value)} ${fill(f.label)}`).join(" · ");
  const email = fill("[HELLO@HOPSIG.COM]");
  return [
    `# Hopsig Technologies`,
    ``,
    `> ${plain(fill(site.footer.tagline))}`,
    ``,
    `${plain(fill(homePage.hero.eyebrow))}. ${plain(homePage.hero.title.replace("\n", " "))} ${plain(fill(homePage.hero.location))}.`,
    ``,
    `- ${facts}`,
    `- Book a 30-minute consult: ${url("/book")}`,
    `- Send a written brief: ${url("/brief")}`,
    ...(known(email) ? [`- Email: ${email}`] : []),
  ];
}

export async function llmsTxt() {
  const { fill, cases, posts } = await load();
  const withPage = cases.filter((c) => c.hasPage && c.slug);
  const lines = [
    ...header(fill),
    ``,
    `## Services`,
    ``,
    ...services.map((s) => `- [${s.keyword}](${url(`/services/${s.id}`)}): ${plain(fill(seo[`/services/${s.id}`].description))}`),
    ``,
    `## Industries`,
    ``,
    ...industries.map((d) => `- [${d.keyword}](${url(`/industries/${d.id}`)}): ${plain(fill(seo[`/industries/${d.id}`].description))}`),
    ``,
    `## Company`,
    ``,
    ...COMPANY.map((p) => `- [${seo[p].title.replace(/ \| Hopsig$/, "")}](${url(p)}): ${plain(fill(seo[p].description))}`),
    ``,
    `## Case notes`,
    ``,
    ...withPage.map((c) => {
      const metric = c.metric?.value && known(c.metric.value) ? `: ${clean(c.metric.value)} ${clean(c.metric.label)}` : "";
      return `- [${clean(c.title)}](${url(`/work/${stegaClean(c.slug)}`)})${metric}`;
    }),
    `- [All ${cases.length} case notes](${url("/work")})`,
    ...(posts.length
      ? [``, `## Notes`, ``, ...posts.filter((p) => p.slug).map((p) => `- [${clean(p.title)}](${url(`/notes/${stegaClean(p.slug)}`)}): ${clean(p.excerpt)}`)]
      : []),
    ``,
    `## Optional`,
    ``,
    `- [Everything above in full](${url("/llms-full.txt")}): every service, industry, case note and note as text`,
  ];
  return lines.filter((l) => l === "" || known(l)).join("\n") + "\n";
}

export async function llmsFullTxt() {
  const { fill, cases, posts } = await load();
  const out: string[] = [...header(fill)];
  const add = (...l: string[]) => out.push(...l);
  const list = (items: string[]) => items.map((s) => plain(fill(s))).filter(known).map((s) => `- ${s}`);

  add(``, `## Services`);
  for (const s of services) {
    add(``, `### ${s.keyword}`, ``, `${url(`/services/${s.id}`)}`, ``, `${plain(fill(s.oneLiner))}. ${plain(fill(s.description))}`);
    add(``, `Engagement: ${plain(fill(s.shape))}`, ``, `What you get:`, ...list(s.gets), ``, `Good for:`, ...list(s.goodFor));
    add(``, `Stack (only what we have shipped to production): ${s.stack.map((x) => plain(fill(x))).join(", ")}`);
    const faq = s.faq.filter((q) => known(fill(q.question)) && known(fill(q.answer)));
    if (faq.length) add(``, `Questions:`, ...faq.flatMap((q) => [``, `**${plain(fill(q.question))}**`, plain(fill(q.answer))]));
  }

  add(``, `## Industries`);
  for (const d of industries) {
    add(``, `### ${d.keyword}`, ``, `${url(`/industries/${d.id}`)}`, ``, plain(fill(d.sub)));
    add(``, ...d.facts.map((f) => `${plain(fill(f.value))} ${plain(fill(f.label))}`).filter(known).map((s) => `- ${s}`));
  }

  add(``, `## Company`, ``, ...COMPANY.map((p) => `- [${seo[p].title.replace(/ \| Hopsig$/, "")}](${url(p)}): ${plain(fill(seo[p].description))}`));

  add(``, `## Case notes`, ``, `Client names are withheld; the numbers are not. ${url("/work")}`);
  for (const c of cases) {
    add(``, `### ${clean(c.title)}`, ``, [clean(c.domain), clean(c.shape)].filter(Boolean).join(" · "));
    if (c.hasPage && c.slug) add(`${url(`/work/${stegaClean(c.slug)}`)}`);
    const measured = c.measured ? plain(toPlainText(c.measured as PortableTextBlock[])) : "";
    for (const [k, v] of [["Problem", clean(c.problem)], ["What we did", clean(c.whatWeDid)], ["Measured", measured]] as const)
      if (v && known(v)) add(``, `${k}: ${v}`);
  }

  if (posts.length) {
    add(``, `## Notes`);
    for (const p of posts) {
      if (!p.slug) continue;
      const body = p.body ? toPlainText(p.body as PortableTextBlock[]) : "";
      add(``, `### ${clean(p.title)}`, ``, `${url(`/notes/${stegaClean(p.slug)}`)}`, ``, clean(p.excerpt), ``, body.trim());
    }
  }
  return out.filter((l) => l === "" || known(l)).join("\n").replace(/\n{3,}/g, "\n\n") + "\n";
}
