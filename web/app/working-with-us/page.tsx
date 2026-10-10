import type { Metadata } from "next";
import { Closing } from "@/components/Closing";
import { Cards, Eyebrow, H2, HeadRow, Ledger, PageHero, TwoCol } from "@/components/blocks";
import { Surface } from "@/components/Surface";
import { workingWithUsPage as page } from "@/content";
import { withMode } from "@/lib/mode";
import { getFill } from "@/lib/site";
import type { FetchMode } from "@/sanity/lib/live";

export const metadata: Metadata = { title: "Hopsig — Working with us" };

async function WorkingWithUsContent({ mode }: { mode: FetchMode }) {
  const fill = await getFill(mode);
  const { checks, asks } = page;
  return (
    <main>
      <Surface tone="d">
        <PageHero hero={page.hero} fill={fill} />
      </Surface>

      <Surface tone="l" seam>
        <div className="wrap" style={{ paddingTop: 100 }}>
          <TwoCol
            style={{ paddingTop: 100 }}
            left={
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Eyebrow>{fill(checks.head.eyebrow)}</Eyebrow>
                <H2 size={40}>{fill(checks.head.title)}</H2>
                <p className="body16">{fill(checks.head.sub)}</p>
              </div>
            }
            right={<Ledger items={checks.items} fill={fill} titleWidth={200} tone="sub" stagger={false} mark="phx" />}
          />
          <div style={{ height: 120 }} />
        </div>
      </Surface>

      <Surface tone="d" seam>
        <div className="wrap">
          <section style={{ padding: "100px 0 120px" }}>
            <HeadRow head={asks.head} fill={fill} style={{ marginBottom: 24 }} />
            <Cards items={asks.items} fill={fill} />
          </section>
        </div>
      </Surface>

      <Surface tone="l" seam>
        <Closing copy={page.closing} tone="l" fill={fill} />
      </Surface>
    </main>
  );
}

export default withMode(WorkingWithUsContent);
