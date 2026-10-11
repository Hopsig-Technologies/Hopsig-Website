import type { Metadata } from "next";
import { Closing } from "@/components/Closing";
import { Rv } from "@/components/Reveal";
import { Eyebrow, H2, HeadRow, PageHero } from "@/components/blocks";
import { EngagementPanelSlot } from "@/components/more";
import { BulletList, CaseCard, CaseRow } from "@/components/sections";
import { Surface } from "@/components/Surface";
import { industries, services, templates, workIndexPage as page } from "@/content";
import { withMode } from "@/lib/mode";
import { getFill } from "@/lib/site";
import { cachedSanity, type FetchMode } from "@/sanity/lib/live";
import { CASES_ALL_QUERY } from "@/sanity/queries";
import { pageMeta } from "@/lib/seo";
import { stegaClean } from "next-sanity";
import { WorkFilter } from "@/components/WorkFilter";

export const metadata: Metadata = pageMeta("/work");

async function WorkContent({ mode }: { mode: FetchMode }) {
  const fill = await getFill(mode);
  const { data: cases } = await cachedSanity({ query: CASES_ALL_QUERY, ...mode });
  const { selected, reporting } = page;
  const cards = cases.slice(0, selected.fullCards);
  const rest = cases.slice(selected.fullCards);
  // Filter tags: which industries and services name each case in their record lists, and whether it has a number.
  const tags = (c: (typeof cases)[number]) => {
    const key = stegaClean(c.source) ?? "";
    const value = stegaClean(c.metric?.value) ?? "";
    return {
      "data-ind": industries.filter((d) => (d.record as readonly string[]).includes(key)).map((d) => d.id).join(" "),
      "data-svc": services.filter((s) => (s.record as readonly string[]).includes(key)).map((s) => s.id).join(" "),
      "data-num": value && !value.includes("[") ? "1" : "0",
    };
  };
  return (
    <main>
      <Surface tone="d">
        <PageHero hero={page.hero} fill={fill} buttonRow="chips" />
      </Surface>

      <Surface tone="l" seam>
        <div className="wrap sp-t100 sp-b120">
          <WorkFilter
            copy={templates.workFilters}
            industries={industries.map((d) => ({ id: d.id, label: d.short }))}
            services={services.map((s) => ({ id: s.id, label: s.name }))}
          />
          <div className="wf-group">
            <HeadRow head={selected.head} fill={fill} style={{ marginBottom: 28 }} />
            <div className="case-grid">
              {cards.map((c, i) => (
                <div key={c._id} className="wf-item" {...tags(c)}>
                  <CaseCard c={c} n={i + 1} fill={fill} delay={(i % 2) * 90} />
                </div>
              ))}
            </div>
          </div>
          {rest.length ? (
            <div className="wf-group">
              <HeadRow head={{ title: selected.restTitle, aside: selected.restAside }} fill={fill} style={{ margin: "100px 0 20px" }} />
              <div style={{ borderTop: "1px solid var(--line)" }}>
                {rest.map((c, i) => (
                  <div key={c._id} className="wf-item" {...tags(c)}>
                    <CaseRow c={c} n={cards.length + i + 1} fill={fill} />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </Surface>

      <Surface tone="d" seam>
        <section className="wrap work-report">
          <Rv style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Eyebrow>{fill(reporting.head.eyebrow)}</Eyebrow>
            <H2>{fill(reporting.head.title)}</H2>
            <p className="body17" style={{ maxWidth: 520 }}>
              {fill(reporting.head.sub)}
            </p>
            <div style={{ maxWidth: 520 }}>
              <BulletList items={reporting.points.map((x) => fill(x))} />
            </div>
          </Rv>
          {/* The reference shows the "measured" scene here. */}
          <EngagementPanelSlot phase={3} fill={fill} />
        </section>
      </Surface>

      <Surface tone="l" seam>
        <Closing copy={page.closing} tone="l" fill={fill} />
      </Surface>
    </main>
  );
}

export default withMode(WorkContent);
