import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Closing } from "@/components/Closing";
import { Rv } from "@/components/Reveal";
import { H2, HeadRow, MoreLink, PageHero, Tags } from "@/components/blocks";
import { BulletList, CaseCard, FaqBlock, Steps } from "@/components/sections";
import { Surface } from "@/components/Surface";
import { HeroAnim } from "@/components/anim/HeroAnim";
import { SERVICE_SLUGS, scenesFor, services, templates, type ServiceSlug } from "@/content";
import { casesByKey } from "@/lib/cases";
import { withMode } from "@/lib/mode";
import { getFill } from "@/lib/site";
import { nn, tpl } from "@/lib/tpl";
import type { FetchMode } from "@/sanity/lib/live";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

const find = (slug: string) => services.find((s) => s.id === (slug as ServiceSlug));

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const s = find((await params).slug);
  return { title: s ? `Hopsig — ${s.name}` : "Hopsig" };
}

async function ServiceContent({ mode, params }: { mode: FetchMode; params: Params }) {
  const s = find((await params).slug);
  if (!s) notFound();
  const t = templates.servicePage;
  const fill = await getFill(mode);
  // The page shows at most four record cards (generator/site.py service_page: cases[:4]); the AI service lists six.
  const record = await casesByKey(s.record.slice(0, 4), mode);
  // v2: the service scene under the hero facts; the second scene on the route is the agentic strip.
  const heroScene = scenesFor(`/services/${s.id}`).find((x) => x.id !== "agentic-strip");
  return (
    <main>
      <Surface tone="d">
        <PageHero
          fill={fill}
          hero={{
            eyebrow: tpl(t.heroEyebrow, { nn: nn(s.n), name: s.name }),
            title: s.pageTitle,
            sub: s.description,
            buttons: t.buttons,
            facts: [...s.tiles.map((x) => ({ value: x.title, label: x.text })), { value: t.pricedLabel, label: s.shape }],
          }}
          figure={heroScene ? <HeroAnim id={heroScene.id} /> : undefined}
        />
      </Surface>

      <Surface tone="l" seam>
        <div className="wrap" style={{ paddingTop: 100 }}>
          <section className="svc-intro">
            <Rv style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <H2>{t.getsTitle}</H2>
              <BulletList items={s.gets.map((g) => fill(g))} />
              <div className="svc-priced">
                {t.pricedPrefix} <span style={{ color: "var(--sub)" }}>{fill(s.shape)}</span> ·{" "}
                <MoreLink cta={t.ratesLink} />
              </div>
            </Rv>
            <Rv delay={90} style={{ display: "flex", flexDirection: "column", gap: 36 }}>
              <div>
                <div className="lab">{t.goodForLabel}</div>
                <div className="dash-list">
                  {s.goodFor.map((g) => (
                    <div key={g}>— {fill(g)}</div>
                  ))}
                </div>
              </div>
              <div>
                <div className="lab lab-acc">{t.sayNoLabel}</div>
                <div className="dash-list" style={{ color: "var(--sub)" }}>
                  {s.sayNoWhen.map((g) => (
                    <div key={g}>— {fill(g)}</div>
                  ))}
                </div>
              </div>
              <div>
                <div className="lab">{t.stackLabel}</div>
                <div style={{ marginTop: 12 }}>
                  <Tags items={s.stack} />
                </div>
              </div>
            </Rv>
          </section>

          {record.length ? (
            <section style={{ padding: "110px 0 120px" }}>
              <Rv className="head-row" style={{ marginBottom: 28 }}>
                <H2>{t.recordTitle}</H2>
                <MoreLink cta={t.recordLink} />
              </Rv>
              <div className="case-grid">
                {record.map((c, i) => (
                  <CaseCard key={c._id} c={c} n={i + 1} fill={fill} delay={(i % 2) * 90} />
                ))}
              </div>
            </section>
          ) : (
            <div style={{ height: 120 }} />
          )}
        </div>
      </Surface>

      <Surface tone="d" seam>
        <div className="wrap">
          <section style={{ padding: "100px 0 0" }}>
            <HeadRow head={{ title: t.stepsTitle, aside: t.stepsAside }} fill={fill} style={{ marginBottom: 36 }} />
            <Steps steps={s.steps} fill={fill} />
          </section>
          {/* v2: the agentic strip, one link to the pipeline (no caption, no pause button). */}
          <section style={{ padding: "100px 0 0" }}>
            <Link className="strip" href="/agentic-flow" aria-label={t.stripLabel}>
              <HeroAnim id="agentic-strip" style={{ margin: 0 }} />
            </Link>
          </section>
          <FaqBlock fill={fill} title={t.faqTitle} faq={{ title: t.faqTitle, items: s.faq }} />
          <section style={{ padding: "100px 0 120px" }}>
            <HeadRow head={{ title: t.othersTitle, aside: t.othersAside }} fill={fill} size={32} style={{ marginBottom: 20 }} />
            <Rv className="svc-grid">
              {services.map((o) =>
                o.id === s.id ? (
                  <span key={o.id}>
                    <span className="n">{nn(o.n)}</span>
                    <span className="t">{o.name}</span>
                    <span className="a">{t.hereLabel}</span>
                  </span>
                ) : (
                  <Link key={o.id} href={`/services/${o.id}`}>
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
        <Closing fill={fill} tone="l" copy={{ eyebrow: tpl(t.closingEyebrow, { name: s.name }), title: s.closing, buttons: t.buttons, showEmail: true }} />
      </Surface>
    </main>
  );
}

export default withMode(ServiceContent);
