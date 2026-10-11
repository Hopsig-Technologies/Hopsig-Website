import type { Metadata } from "next";
import { Suspense } from "react";
import { Closing } from "@/components/Closing";
import { FlowTable } from "@/components/FlowTable";
import { HeroAnim } from "@/components/anim/HeroAnim";
import { Rv } from "@/components/Reveal";
import { Eyebrow, FigHint, H2, HeadRow, MoreLink, PageHero, Tags } from "@/components/blocks";
import { BulletList } from "@/components/sections";
import { Surface } from "@/components/Surface";
import { agenticFlowPage as page } from "@/content";
import { withMode } from "@/lib/mode";
import { getFill } from "@/lib/site";
import type { FetchMode } from "@/sanity/lib/live";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/agentic-flow");

async function FlowContent({ mode }: { mode: FetchMode }) {
  const fill = await getFill(mode);
  const { flow, agents, tooling } = page;
  const [whereTitle, whereText] = tooling.where;
  return (
    <main>
      <Surface tone="d">
        <PageHero hero={page.hero} fill={fill} size={26} figure={<HeroAnim id="agentic-flow-sim" />} />
        {/* v2: the never wall replaces the "What they never do." list; each rule is a button. */}
        {/* Its own boundary, so the hero above is sent inline and paints first (components/Surface.tsx). */}
        <Suspense fallback={null}>
          <section className="wrap sp-t100 sp-b120">
            <Rv className="head-row" style={{ marginBottom: 28 }}>
              <H2>{fill(agents.neverTitle)}</H2>
              <Eyebrow>
                <FigHint text={fill(agents.neverAside)} hint={fill(agents.neverAsideHint)} />
              </Eyebrow>
            </Rv>
            <Rv>
              <HeroAnim id="agentic-never-wall" style={{ margin: 0 }} />
              {/* Phones: the figure is hidden, so the rules it draws are listed (anim.css .fig-alt). */}
              <div className="fig-alt">
                <BulletList items={agents.never.map((r) => fill(r))} nolime />
              </div>
            </Rv>
          </section>
        </Suspense>
      </Surface>

      <Surface tone="l" seam>
        <div className="wrap sp-t100 sp-b120">
          <HeadRow head={flow.head} fill={fill} style={{ marginBottom: 28 }} />
          <FlowTable
            stages={flow.stages.map((s) => ({
              ...s,
              input: fill(s.input),
              output: fill(s.output),
              guardrail: fill(s.guardrail),
              humanNote: s.humanNote ? fill(s.humanNote) : undefined,
            }))}
            labels={flow.labels}
          />
        </div>
      </Surface>

      <Surface tone="d" seam>
        <div className="wrap">
          <section className="agents">
            <Rv>
              <div className="agents-h">
                <h2 className="h2" style={{ fontSize: 36 }}>
                  {fill(agents.head.title)}
                </h2>
              </div>
              <BulletList items={agents.does.map((x) => fill(x))} />
            </Rv>
          </section>
          <section className="tooling">
            <Rv style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Eyebrow>{fill(tooling.head.eyebrow)}</Eyebrow>
              <H2 size={40}>{fill(tooling.head.title)}</H2>
              <p className="body16">{fill(tooling.head.sub)}</p>
              <div style={{ marginTop: 4 }}>
                <Tags items={tooling.tools.map((t) => fill(t))} />
              </div>
            </Rv>
            <Rv delay={90} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div className="where">
                <div className="lab">{fill(tooling.whereLabel)}</div>
                <div className="where-t">{fill(whereTitle)}</div>
                <div className="where-x">{fill(whereText)}</div>
                <div style={{ display: "flex", gap: 24, marginTop: 6 }}>
                  {tooling.links.map((l) => (
                    <MoreLink key={l.href} cta={l} />
                  ))}
                </div>
              </div>
            </Rv>
          </section>
        </div>
      </Surface>

      <Surface tone="l" seam>
        <Closing copy={page.closing} tone="l" fill={fill} />
      </Surface>
    </main>
  );
}

export default withMode(FlowContent);
