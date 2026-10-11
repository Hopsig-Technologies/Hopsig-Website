import type { Metadata } from "next";
import Link from "next/link";
import { Closing } from "@/components/Closing";
import { Rv } from "@/components/Reveal";
import { Eyebrow, H2, HeadRow, MoreLink, PageHero } from "@/components/blocks";
import { Capabilities, EngagementPanelSlot } from "@/components/more";
import { BulletList, Steps } from "@/components/sections";
import { Surface } from "@/components/Surface";
import { servicesIndexPage as page, services } from "@/content";
import { withMode } from "@/lib/mode";
import { getFill } from "@/lib/site";
import { nn } from "@/lib/tpl";
import type { FetchMode } from "@/sanity/lib/live";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/services");

async function ServicesContent({ mode }: { mode: FetchMode }) {
  const fill = await getFill(mode);
  return (
    <main>
      <Surface tone="d">
        <PageHero hero={page.hero} fill={fill} />
      </Surface>

      <Surface tone="l" seam>
        <div className="wrap">
          {page.modes.map((m, i) => (
            <section key={m.anchor} id={m.anchor} className="svc">
              <Rv style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                <Eyebrow>{fill(m.head.eyebrow)}</Eyebrow>
                <H2>{fill(m.head.title)}</H2>
                <p className="body17" style={{ maxWidth: 560 }}>
                  {fill(m.head.sub)}
                </p>
                <div style={{ marginTop: 10 }}>
                  <div className="lab">{fill(m.getsTitle)}</div>
                  <div style={{ marginTop: 10 }}>
                    <BulletList items={m.gets.map((g) => fill(g))} />
                  </div>
                </div>
                <div style={{ marginTop: 10 }}>
                  <div className="lab">{fill(m.goodForTitle)}</div>
                  <div className="dash-list" style={{ marginTop: 10, gap: 6, fontSize: 15, lineHeight: 1.55, color: "var(--dim)" }}>
                    {m.goodFor.map((g) => (
                      <div key={g}>— {fill(g)}</div>
                    ))}
                  </div>
                </div>
              </Rv>
              <div className="svc-ui">
                {/* Scenes the reference shows: Embedded → people in, Built → scope, Data & AI → measured. */}
                <EngagementPanelSlot phase={([2, 1, 3] as const)[i]} fill={fill} />
                <div className="price">
                  <div className="lab">{fill(m.priceLabel)}</div>
                  <div className="price-t">{fill(m.priceTitle)}</div>
                  <div className="price-x">{fill(m.priceDetail)}</div>
                  <MoreLink cta={m.link} />
                </div>
              </div>
            </section>
          ))}

          <section style={{ padding: "0 0 100px" }}>
            <HeadRow head={page.detail.head} fill={fill} style={{ marginBottom: 24 }} />
            <Rv className="eight">
              {services.map((s) => (
                <Link key={s.id} href={`/services/${s.id}`}>
                  <span className="n">{nn(s.n)}</span>
                  <span className="t">{s.name}</span>
                  <span className="s">{s.shape}</span>
                  <span className="a">→</span>
                </Link>
              ))}
            </Rv>
          </section>

          <section style={{ padding: "100px 0", borderTop: "1px solid var(--hair)" }}>
            <HeadRow head={page.inside.head} fill={fill} style={{ marginBottom: 36 }} />
            <Rv className="tiles">
              {page.inside.items.map((it, i) => (
                <div key={it.title}>
                  <div className="n">{nn(i + 1)}</div>
                  <div className="t">{fill(it.title)}</div>
                  <div className="x">{fill(it.text)}</div>
                </div>
              ))}
            </Rv>
          </section>
        </div>
      </Surface>

      <Surface tone="d" seam>
        <div style={{ height: 100 }} />
        <section style={{ paddingBottom: 140 }}>
          <Capabilities fill={fill} />
        </section>
        <section className="wrap" style={{ padding: "40px 0 140px" }}>
          <Rv className="head-row" style={{ marginBottom: 36 }}>
            <H2>{fill(page.howItRuns.head.title)}</H2>
            <MoreLink cta={page.howItRuns.link} />
          </Rv>
          <Steps steps={page.howItRuns.steps} fill={fill} />
        </section>
      </Surface>

      <Surface tone="l" seam>
        <Closing copy={page.closing} tone="l" fill={fill} />
      </Surface>
    </main>
  );
}

export default withMode(ServicesContent);
