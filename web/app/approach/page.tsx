import type { Metadata } from "next";
import { Closing } from "@/components/Closing";
import { Filled } from "@/components/Filled";
import { Rv } from "@/components/Reveal";
import { Cards, Eyebrow, H2, HeadRow, Ledger, MoreLink, PageHero, Tags, TwoCol } from "@/components/blocks";
import { Surface } from "@/components/Surface";
import { approachPage as page } from "@/content";
import { withMode } from "@/lib/mode";
import { getFill } from "@/lib/site";
import type { FetchMode } from "@/sanity/lib/live";

export const metadata: Metadata = { title: "Hopsig — Approach" };


async function ApproachContent({ mode }: { mode: FetchMode }) {
  const fill = await getFill(mode);
  const { staffing, agentic, where } = page;
  return (
    <main>
      <Surface tone="d">
        <PageHero hero={page.hero} fill={fill} />
      </Surface>

      <Surface tone="l" seam>
        <div className="wrap" style={{ paddingTop: 100 }}>
          <section style={{ paddingBottom: 120 }}>
            <Rv>
              <H2>{fill(staffing.head.title)}</H2>
            </Rv>
            <div style={{ marginTop: 40 }}>
              <Cards items={staffing.items} fill={fill} />
            </div>
          </section>

          <TwoCol
            ratio="1fr 1.15fr"
            gap={64}
            style={{ paddingBottom: 120 }}
            left={
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <Eyebrow>{fill(agentic.head.eyebrow)}</Eyebrow>
                <H2>{fill(agentic.head.title)}</H2>
                <p className="body17" style={{ maxWidth: 520 }}>
                  {fill(agentic.head.sub)}
                </p>
                <div style={{ marginTop: 4 }}>
                  <Tags items={agentic.tags} />
                </div>
                <div style={{ display: "flex", gap: 24 }}>
                  {agentic.links.map((l) => (
                    <MoreLink key={l.href} cta={l} />
                  ))}
                </div>
              </div>
            }
            right={<Ledger items={agentic.items} fill={fill} titleWidth={150} pad={20} />}
          />
        </div>
      </Surface>

      <Surface tone="d" seam>
        <div style={{ height: 100 }} />
        <section className="wrap" style={{ paddingBottom: 120 }}>
          <HeadRow head={where.head} fill={fill} />
          <Rv className="hours-p">
            {where.paragraphs.map((p) => (
              <div key={p.slice(0, 24)}>
                <Filled text={p} fill={fill} />
              </div>
            ))}
          </Rv>
        </section>
      </Surface>

      <Surface tone="l" seam>
        <Closing copy={page.closing} tone="l" fill={fill} />
      </Surface>
    </main>
  );
}

export default withMode(ApproachContent);
