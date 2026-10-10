import type { Metadata } from "next";
import { Closing } from "@/components/Closing";
import { FlowDiagram } from "@/components/FlowDiagram";
import { Rv } from "@/components/Reveal";
import { Eyebrow, H2, HeadRow, MoreLink, PageHero, Tags } from "@/components/blocks";
import { BulletList } from "@/components/sections";
import { Surface } from "@/components/Surface";
import { agenticFlowPage as page } from "@/content";
import { withMode } from "@/lib/mode";
import { getFill } from "@/lib/site";
import type { FetchMode } from "@/sanity/lib/live";

export const metadata: Metadata = { title: "Hopsig — Agentic flow" };

async function FlowContent({ mode }: { mode: FetchMode }) {
  const fill = await getFill(mode);
  const { flow, agents, tooling } = page;
  const [whereTitle, whereText] = tooling.where;
  return (
    <main>
      <Surface tone="d">
        <PageHero hero={page.hero} fill={fill} size={26} />
      </Surface>

      <Surface tone="l" seam>
        <div className="wrap" style={{ padding: "100px 0 120px" }}>
          <HeadRow head={flow.head} fill={fill} style={{ marginBottom: 28 }} />
          <FlowDiagram
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
            <Rv delay={90}>
              <div className="agents-h">
                <h2 className="h2" style={{ fontSize: 36 }}>
                  {fill(agents.neverTitle)}
                </h2>
                <Eyebrow>{fill(agents.neverAside)}</Eyebrow>
              </div>
              <BulletList items={agents.never.map((x) => fill(x))} nolime />
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
