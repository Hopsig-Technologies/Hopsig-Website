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
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/why-not-just-hire");

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
          {/* A real table (column and row headers), laid out as the reference's grid rows. */}
          <Rv>
            <table className="cmp">
              <thead>
                <tr className="hd">
                  <td />
                  {table.columns.map((c) => (
                    <th key={c} scope="col">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((r) => (
                  <tr key={r.label}>
                    <th scope="row">{r.label}</th>
                    {r.cells.map((c, i) => (
                      <td key={i}>{fill(c)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
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
