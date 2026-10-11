import type { Metadata } from "next";
import Link from "next/link";
import { Closing } from "@/components/Closing";
import { Rv } from "@/components/Reveal";
import { HeadRow, PageHero } from "@/components/blocks";
import { Surface } from "@/components/Surface";
import { industries, industriesIndexPage as page, templates } from "@/content";
import { withMode } from "@/lib/mode";
import { getFill } from "@/lib/site";
import { nn, tpl } from "@/lib/tpl";
import type { FetchMode } from "@/sanity/lib/live";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/industries");

async function IndustriesContent({ mode }: { mode: FetchMode }) {
  const fill = await getFill(mode);
  return (
    <main>
      <Surface tone="d">
        <PageHero hero={page.hero} fill={fill} />
      </Surface>

      <Surface tone="l" seam>
        <div className="wrap" style={{ padding: "100px 0 120px" }}>
          <HeadRow head={page.list.head} fill={fill} style={{ marginBottom: 28 }} />
          <div className="ilist">
            {industries.map((d, i) => (
              <Rv key={d.id} delay={i * 60}>
                <Link href={`/industries/${d.id}`} className="irow">
                  <span className="n">{nn(d.n)}</span>
                  <span>
                    <span className="t">{d.name}</span>
                    {/* The row shows the intro up to its colon, as the reference does. */}
                    <span className="s">{fill(d.sub.split(":")[0])}</span>
                  </span>
                  <span className="m">
                    <b>{fill(d.facts[0].value)}</b>
                    {fill(d.facts[0].label)}
                  </span>
                  <span className="c">{tpl(templates.industriesIndexRow.count, { count: d.record.length })}</span>
                  <span className="r">→</span>
                </Link>
              </Rv>
            ))}
          </div>
        </div>
      </Surface>

      <Surface tone="l" seam>
        <Closing copy={page.closing} tone="l" fill={fill} />
      </Surface>
    </main>
  );
}

export default withMode(IndustriesContent);
