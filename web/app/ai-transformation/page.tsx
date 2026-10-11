import type { Metadata } from "next";
import { Closing } from "@/components/Closing";
import { Rich } from "@/components/Rich";
import { HeroAnim } from "@/components/anim/HeroAnim";
import { ScrubWiring } from "@/components/anim/ScrubWiring";
import { Rv } from "@/components/Reveal";
import { Eyebrow, H2, HeadRow, Ledger, MoreLink, PageHero, TwoCol } from "@/components/blocks";
import { BulletList, CaseCard, FaqBlock, Steps } from "@/components/sections";
import { Surface } from "@/components/Surface";
import { aiTransformationPage as page } from "@/content";
import { casesByKey } from "@/lib/cases";
import { withMode } from "@/lib/mode";
import { inlineToBlocks } from "@/lib/portable";
import { getFill } from "@/lib/site";
import { nn } from "@/lib/tpl";
import type { FetchMode } from "@/sanity/lib/live";

export const metadata: Metadata = { title: "Hopsig — AI transformation" };

async function AiContent({ mode }: { mode: FetchMode }) {
  const fill = await getFill(mode);
  const { offer, pipeline, weeks, measures, record } = page;
  const cases = await casesByKey(record.cases, mode);
  // "Priced: <terms> · <link>": the reference sets the terms in --sub and the link as a mono label.
  const priced = /^(.*?:) (.*) · (<a .*)$/.exec(offer.priced);
  return (
    <main>
      <Surface tone="d">
        <PageHero hero={page.hero} fill={fill} size={26} />
        {/* v2: "Six weeks in your repo", scrubbed by scroll through a 250vh section with a sticky figure. */}
        <section className="scrub wrap">
          <div className="stick">
            <div className="head-row" style={{ marginBottom: 20 }}>
              <Eyebrow>{fill(page.scrub.eyebrow)}</Eyebrow>
              <span className="lab" style={{ letterSpacing: "0.12em" }}>
                {fill(page.scrub.hint)}
              </span>
            </div>
            <HeroAnim id="ai-transformation" style={{ margin: 0 }} />
          </div>
          <ScrubWiring id="ai-transformation" />
        </section>
      </Surface>

      <Surface tone="l" seam>
        <div className="wrap" style={{ paddingTop: 100 }}>
          <section className="svc-intro">
            <Rv style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <H2>{fill(offer.head.title)}</H2>
              <BulletList items={offer.gets.map((g) => fill(g))} />
              <div className="svc-priced">
                {priced ? (
                  <>
                    {priced[1]} <span style={{ color: "var(--sub)" }}>{fill(priced[2])}</span> ·{" "}
                    <span className="more-inline">
                      <Rich value={inlineToBlocks(priced[3])} fill={fill} inline />
                    </span>
                  </>
                ) : (
                  <Rich value={inlineToBlocks(offer.priced)} fill={fill} inline />
                )}
              </div>
            </Rv>
            <Rv delay={90} style={{ display: "flex", flexDirection: "column", gap: 36 }}>
              <div>
                <div className="lab">{offer.goodForTitle}</div>
                <div className="dash-list">
                  {offer.goodFor.map((g) => (
                    <div key={g}>— {fill(g)}</div>
                  ))}
                </div>
              </div>
              <div>
                <div className="lab lab-acc">{offer.sayNoTitle}</div>
                <div className="dash-list" style={{ color: "var(--sub)" }}>
                  {offer.sayNo.map((g) => (
                    <div key={g}>— {fill(g)}</div>
                  ))}
                </div>
              </div>
            </Rv>
          </section>
          <TwoCol
            style={{ paddingTop: 100 }}
            left={
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Eyebrow>{fill(pipeline.head.eyebrow)}</Eyebrow>
                <H2 size={40}>{fill(pipeline.head.title)}</H2>
                <p className="body16">{fill(pipeline.head.sub)}</p>
              </div>
            }
            right={<Ledger items={pipeline.items} fill={fill} titleWidth={150} tone="sub" stagger={false} />}
          />
          <div style={{ height: 120 }} />
        </div>
      </Surface>

      <Surface tone="d" seam>
        <div className="wrap">
          <section style={{ padding: "100px 0 0" }}>
            <HeadRow head={weeks.head} fill={fill} style={{ marginBottom: 36 }} />
            <Steps steps={weeks.steps} fill={fill} />
          </section>
          <section style={{ padding: "100px 0 0" }}>
            <HeadRow head={measures.head} fill={fill} style={{ marginBottom: 24 }} />
            <Rv className="why" style={{ marginTop: 0 }}>
              {measures.items.map((it, i) => (
                <div key={it.title} className="tile2" style={i === 0 ? { borderTopColor: "var(--acc)" } : undefined}>
                  <div className="tile2-n">{nn(i + 1)}</div>
                  <div className="tile2-t">{fill(it.title)}</div>
                  <div className="tile2-x">{fill(it.text)}</div>
                </div>
              ))}
            </Rv>
          </section>
          {cases.length ? (
            <section style={{ padding: "100px 0 0" }}>
              <Rv className="head-row" style={{ marginBottom: 28 }}>
                <H2>{fill(record.head.title)}</H2>
                <MoreLink cta={record.allLink} />
              </Rv>
              <div className="case-grid">
                {cases.map((c, i) => (
                  <CaseCard key={c._id} c={c} n={i + 1} fill={fill} delay={(i % 2) * 90} />
                ))}
              </div>
            </section>
          ) : null}
          <FaqBlock faq={page.faq} fill={fill} />
          <div style={{ height: 120 }} />
        </div>
      </Surface>

      <Surface tone="l" seam>
        <Closing copy={page.closing} tone="l" fill={fill} />
      </Surface>
    </main>
  );
}

export default withMode(AiContent);
