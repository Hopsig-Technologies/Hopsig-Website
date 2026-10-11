import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stegaClean } from "next-sanity";
import { Button } from "@/components/Button";
import { Closing } from "@/components/Closing";
import { Rich } from "@/components/Rich";
import { Rv } from "@/components/Reveal";
import { MoreLink, PageHero, Tags } from "@/components/blocks";
import { BulletList, CaseRow } from "@/components/sections";
import { Surface } from "@/components/Surface";
import { seoTemplates, templates } from "@/content";
import { withMode } from "@/lib/mode";
import { getFill } from "@/lib/site";
import { tpl } from "@/lib/tpl";
import { cachedSanity, PUBLISHED, type FetchMode } from "@/sanity/lib/live";
import { CASE_BY_SLUG_QUERY, CASE_SLUGS_QUERY, CASES_ALL_QUERY } from "@/sanity/queries";
import { askHref } from "@/lib/cases";
import { meta, SITE_URL } from "@/lib/seo";
import { breadcrumbsLd, JsonLd, orgRef } from "@/components/JsonLd";
import { TrackView } from "@/components/Analytics";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const { data } = await cachedSanity({ query: CASE_SLUGS_QUERY, ...PUBLISHED });
  return data.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  // Same cached fetch as the page (uncached data in generateMetadata is an error under cacheComponents).
  const { data } = await cachedSanity({ query: CASE_BY_SLUG_QUERY, params: { slug }, ...PUBLISHED });
  if (!data) return {};
  // The document's own SEO fields win; otherwise "<title> — Case Study | Hopsig" and the problem as the description.
  const t = seoTemplates.caseNote;
  return meta(
    `/work/${slug}`,
    stegaClean(data.seo?.title) || tpl(t.title, { title: stegaClean(data.title) ?? "" }),
    stegaClean(data.seo?.description) || tpl(t.description, { problem: stegaClean(data.problem) ?? "" }),
    "article",
  );
}

/** Record order of the generator (F0…F19, then C0…C11), which "More from the record" follows. */
const recordRank = (source: string | null | undefined) => {
  const m = /^([FC])(\d+)$/.exec(stegaClean(source) ?? "");
  return m ? (m[1] === "F" ? 0 : 1000) + Number(m[2]) : 9999;
};

async function CaseContent({ mode, params }: { mode: FetchMode; params: Params }) {
  const { slug } = await params;
  const t = templates.casePage;
  const fill = await getFill(mode);
  const [{ data: c }, { data: all }] = await Promise.all([
    cachedSanity({ query: CASE_BY_SLUG_QUERY, params: { slug }, ...mode }),
    cachedSanity({ query: CASES_ALL_QUERY, ...mode }),
  ]);
  if (!c) notFound();

  // "More from the record" (generator/site.py case_page): up to three others whose domain starts with this one's
  // first word; otherwise the first three of the F record.
  const byRecord = [...all].sort((a, b) => recordRank(a.source) - recordRank(b.source));
  const word = (stegaClean(c.domain) ?? "").split(" ")[0].replace(/[&;]+$/, "").toLowerCase();
  const others = byRecord.filter((o) => o._id !== c._id);
  const related = others.filter((o) => (stegaClean(o.domain) ?? "").toLowerCase().startsWith(word)).slice(0, 3);
  const more = related.length ? related : others.filter((o) => stegaClean(o.source)?.startsWith("F")).slice(0, 3);

  const metric = c.metric?.value ? { value: c.metric.value, label: c.metric.label ?? "" } : null;
  const shape = c.shape ?? "";
  const domain = c.domain ?? "";
  return (
    <main>
      <TrackView event="case_note_opened" slug={slug} />
      <JsonLd
        data={{
          "@type": "Article",
          headline: stegaClean(c.title),
          about: stegaClean(c.domain),
          author: orgRef,
          publisher: orgRef,
          mainEntityOfPage: `${SITE_URL}/work/${slug}`,
        }}
      />
      <JsonLd data={breadcrumbsLd([[t.crumb, "/work"], [stegaClean(c.title) ?? "", `/work/${slug}`]])} />
      <Surface tone="d">
        <PageHero
          fill={fill}
          hero={{
            eyebrow: tpl(t.heroEyebrow, { domain }),
            title: c.title ?? "",
            sub: c.problem ?? "",
            buttons: t.heroButtons.map((b) => (b.href === "/book" ? { ...b, href: askHref(c.title) } : b)),
            facts: [
              metric ?? { value: t.missingMetricValue, label: t.missingMetricLabel },
              { value: shape, label: t.shapeTitle },
              { value: domain, label: t.domainNote },
              { value: t.clientWithheld, label: t.clientNote },
            ],
          }}
        />
      </Surface>

      <Surface tone="l" seam>
        <div className="wrap case-body">
          <Rv className="art">
            <h2>{t.problemTitle}</h2>
            <p>{fill(c.problem)}</p>
            <h2>{t.whatWeDidTitle}</h2>
            <p>{fill(c.whatWeDid)}</p>
            <h2>{t.measuredTitle}</h2>
            <p>
              <Rich value={c.measured} fill={fill} inline />
            </p>
            {c.stack?.length ? (
              <div style={{ marginTop: 30 }}>
                <div className="lab">{t.stackLabel}</div>
                <div style={{ marginTop: 10 }}>
                  <Tags items={c.stack.map((s) => fill(s))} />
                </div>
              </div>
            ) : null}
          </Rv>
          <Rv delay={90}>
            <div className="case-aside">
              {/* With no figure on record the box shows a dash and the note, never an invented number. */}
              <div className="case-metric">
                <div className="lab">{t.measuredTitle}</div>
                <div className="case-metric-v">{metric ? fill(metric.value) : "—"}</div>
                <div className="case-metric-l">{metric ? fill(metric.label) : t.noMetricNote}</div>
              </div>
              <BulletList
                items={[
                  <>
                    <span className="dimc">{t.shapeLabel} </span>
                    {fill(shape)}
                  </>,
                  <>
                    <span className="dimc">{t.domainLabel} </span>
                    {fill(domain)}
                  </>,
                  <>
                    <span className="dimc">{t.clientLabel} </span>
                    {t.clientValue}
                  </>,
                ]}
              />
              <Button href={askHref(c.title)}>{t.askButton.label}</Button>
            </div>
          </Rv>
        </div>
      </Surface>

      <Surface tone="d" seam>
        <div className="wrap">
          <section style={{ padding: "100px 0 120px" }}>
            <Rv className="head-row" style={{ marginBottom: 20 }}>
              <h2 className="h2" style={{ fontSize: 32 }}>
                {t.moreTitle}
              </h2>
              <MoreLink cta={t.moreLink} />
            </Rv>
            <div style={{ borderTop: "1px solid var(--line)" }}>
              {more.map((o, i) => (
                <CaseRow key={o._id} c={o} n={i + 1} fill={fill} />
              ))}
            </div>
          </section>
        </div>
      </Surface>

      <Surface tone="l" seam>
        <Closing fill={fill} tone="l" copy={{ eyebrow: t.closingEyebrow, title: t.closingTitle, buttons: templates.servicePage.buttons, showEmail: true }} />
      </Surface>
    </main>
  );
}

export default withMode(CaseContent);
