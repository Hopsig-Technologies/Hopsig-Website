import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Closing } from "@/components/Closing";
import { Rv } from "@/components/Reveal";
import { Eyebrow, H2, HeadRow, Ledger, MoreLink, PageHero, TwoCol } from "@/components/blocks";
import { CaseCard, CaseRow } from "@/components/sections";
import { Surface } from "@/components/Surface";
import { HeroAnim } from "@/components/anim/HeroAnim";
import { INDUSTRY_SLUGS, industries, scenesFor, services, templates, type IndustrySlug } from "@/content";
import { casesByKey } from "@/lib/cases";
import { withMode } from "@/lib/mode";
import { getFill } from "@/lib/site";
import { nn, tpl } from "@/lib/tpl";
import type { FetchMode } from "@/sanity/lib/live";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return INDUSTRY_SLUGS.map((slug) => ({ slug }));
}

const find = (slug: string) => industries.find((d) => d.id === (slug as IndustrySlug));

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const d = find((await params).slug);
  return { title: d ? `Hopsig — ${d.name}` : "Hopsig" };
}

async function IndustryContent({ mode, params }: { mode: FetchMode; params: Params }) {
  const d = find((await params).slug);
  if (!d) notFound();
  const t = templates.industryPage;
  const fill = await getFill(mode);
  const record = await casesByKey(d.record, mode);
  const cards = record.slice(0, d.fullCards);
  const rows = record.slice(d.fullCards);
  // v2: the industry scene under the hero facts (web/content/animations.ts).
  const heroScene = scenesFor(`/industries/${d.id}`)[0];
  return (
    <main>
      <Surface tone="d">
        <PageHero
          fill={fill}
          size={26}
          hero={{ eyebrow: tpl(t.heroEyebrow, { name: d.name }), title: d.title, sub: d.sub, buttons: t.buttons, facts: d.facts }}
          figure={heroScene ? <HeroAnim id={heroScene.id} /> : undefined}
        />
      </Surface>

      <Surface tone="l" seam>
        <div className="wrap" style={{ padding: "100px 0 120px" }}>
          <HeadRow head={{ title: t.recordTitle, aside: tpl(t.recordAside, { count: d.record.length }) }} fill={fill} style={{ marginBottom: 28 }} />
          <div className="case-grid">
            {cards.map((c, i) => (
              <CaseCard key={c._id} c={c} n={i + 1} fill={fill} delay={(i % 2) * 90} />
            ))}
          </div>
          {rows.length ? (
            <div className="case-rows">
              {rows.map((c, i) => (
                <CaseRow key={c._id} c={c} n={cards.length + i + 1} fill={fill} />
              ))}
            </div>
          ) : null}
          <Rv style={{ marginTop: 22, display: "flex", justifyContent: "flex-end" }}>
            <MoreLink cta={t.recordLink} />
          </Rv>
          <TwoCol
            style={{ paddingTop: 100 }}
            left={
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Eyebrow>{t.asksTitle}</Eyebrow>
                <H2 size={40}>{t.asksSub}</H2>
              </div>
            }
            right={<Ledger items={d.asks} fill={fill} titleWidth={200} tone="sub" stagger={false} />}
          />
        </div>
      </Surface>

      <Surface tone="d" seam>
        <div className="wrap">
          <section style={{ padding: "100px 0 0" }}>
            <Rv className="head-row" style={{ marginBottom: 24 }}>
              <H2>{t.servicesTitle}</H2>
              <MoreLink cta={{ label: t.servicesLink, href: t.servicesHref, variant: "link" }} />
            </Rv>
            <Rv className="fit-grid">
              {d.services.map((f) => {
                const s = services.find((x) => x.id === f.service)!;
                return (
                  <Link key={s.id} href={`/services/${s.id}`}>
                    <span className="n">{nn(s.n)}</span>
                    <span>
                      <span className="t">{s.name}</span>
                      <span className="x">{fill(f.text)}</span>
                    </span>
                    <span className="a">→</span>
                  </Link>
                );
              })}
            </Rv>
          </section>
          <section style={{ padding: "100px 0 120px" }}>
            <Rv className="head-row" style={{ marginBottom: 20 }}>
              <H2 size={32}>{t.othersTitle}</H2>
              <MoreLink cta={t.othersLink} />
            </Rv>
            <Rv className="svc-grid three">
              {industries.map((o) =>
                o.id === d.id ? (
                  <span key={o.id}>
                    <span className="n">{nn(o.n)}</span>
                    <span className="t">{o.name}</span>
                    <span className="a">{t.hereLabel}</span>
                  </span>
                ) : (
                  <Link key={o.id} href={`/industries/${o.id}`}>
                    <span className="n">{nn(o.n)}</span>
                    <span className="t">{o.name}</span>
                    <span className="a">→</span>
                  </Link>
                ),
              )}
            </Rv>
          </section>
        </div>
      </Surface>

      <Surface tone="l" seam>
        <Closing fill={fill} tone="l" copy={{ eyebrow: tpl(t.closingEyebrow, { short: d.short }), title: d.close, buttons: t.buttons, showEmail: true }} />
      </Surface>
    </main>
  );
}

export default withMode(IndustryContent);
