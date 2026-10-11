import type { Metadata } from "next";
import { Closing } from "@/components/Closing";
import { Rv } from "@/components/Reveal";
import { Cards, Eyebrow, H2, PageHero, TwoCol } from "@/components/blocks";
import { BulletList, FaqBlock } from "@/components/sections";
import { Surface } from "@/components/Surface";
import { agenciesPage as page } from "@/content";
import { withMode } from "@/lib/mode";
import { getFill } from "@/lib/site";
import type { FetchMode } from "@/sanity/lib/live";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/for-agencies");

async function AgenciesContent({ mode }: { mode: FetchMode }) {
  const fill = await getFill(mode);
  const { how, gets, sayNo } = page;
  return (
    <main>
      <Surface tone="d">
        <PageHero hero={page.hero} fill={fill} size={26} />
      </Surface>

      <Surface tone="l" seam>
        <div className="wrap" style={{ paddingTop: 100 }}>
          <section>
            <Rv>
              <H2>{fill(how.head.title)}</H2>
            </Rv>
            <div style={{ marginTop: 40 }}>
              <Cards items={how.items} fill={fill} numbered />
            </div>
          </section>
          <TwoCol
            style={{ paddingTop: 100 }}
            left={
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Eyebrow>{fill(gets.head.eyebrow)}</Eyebrow>
                <H2 size={40}>{fill(gets.head.title)}</H2>
              </div>
            }
            right={<BulletList items={gets.items.map((x) => fill(x))} />}
          />
          <TwoCol
            style={{ paddingTop: 100 }}
            left={<H2 size={40}>{fill(sayNo.head.title)}</H2>}
            right={
              <div className="dash-list" style={{ marginTop: 0, gap: 10, color: "var(--sub)" }}>
                {sayNo.items.map((x) => (
                  <div key={x}>— {fill(x)}</div>
                ))}
              </div>
            }
          />
          <div style={{ height: 120 }} />
        </div>
      </Surface>

      <Surface tone="d" seam>
        <div className="wrap">
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

export default withMode(AgenciesContent);
