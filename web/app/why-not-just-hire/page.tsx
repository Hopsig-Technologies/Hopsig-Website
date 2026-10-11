import type { Metadata } from "next";
import { Closing } from "@/components/Closing";
import { Rv } from "@/components/Reveal";
import { HeadRow, PageHero } from "@/components/blocks";
import { FaqBlock } from "@/components/sections";
import { Surface } from "@/components/Surface";
import { comparePage as page } from "@/content";
import { withMode } from "@/lib/mode";
import { getFill } from "@/lib/site";
import type { FetchMode } from "@/sanity/lib/live";

export const metadata: Metadata = { title: "Hopsig — Why not just hire?" };

async function CompareContent({ mode }: { mode: FetchMode }) {
  const fill = await getFill(mode);
  const { table } = page;
  return (
    <main>
      <Surface tone="d">
        <PageHero hero={page.hero} fill={fill} />
      </Surface>

      <Surface tone="l" seam>
        <div className="wrap" style={{ paddingTop: 100 }}>
          <HeadRow head={table.head} fill={fill} style={{ marginBottom: 28 }} />
          <Rv className="cmp">
            <div className="hd">
              <span />
              {table.columns.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
            {table.rows.map((r) => (
              <div key={r.label}>
                <span>{r.label}</span>
                {r.cells.map((c, i) => (
                  <span key={i}>{fill(c)}</span>
                ))}
              </div>
            ))}
          </Rv>
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

export default withMode(CompareContent);
