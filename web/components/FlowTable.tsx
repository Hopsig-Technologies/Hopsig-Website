import type { FlowStage } from "@/content/types";
import { Rv } from "./Reveal";

type Labels = {
  stage: string;
  input: string;
  output: string;
  guardrail: string;
  whoDecides: string;
  personSigns: string;
  noGate: string;
  runsAlone: string;
};

/**
 * /agentic-flow: the six stages as a table (input, output, guardrail, who decides). In v2 the static diagram that
 * sat above it is gone; the simulator in the hero is the picture now.
 */
export function FlowTable({ stages, labels }: { stages: FlowStage[]; labels: Labels }) {
  return (
    <>
      <Rv className="flist-hd">
        <span />
        <span>{labels.stage}</span>
        <span>{labels.input}</span>
        <span>{labels.output}</span>
        <span>{labels.guardrail}</span>
        <span>{labels.whoDecides}</span>
      </Rv>
      <div className="flist">
        {stages.map((s, i) => (
          <Rv key={s.stage} className="frow" delay={i * 60}>
            <span className="n">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <div className="t">{s.stage}</div>
              <div className="a">{s.agent}</div>
            </div>
            <div>
              <span className="k">{labels.input}</span>
              {s.input}
            </div>
            <div>
              <span className="k">{labels.output}</span>
              {s.output}
            </div>
            <div>
              <span className="k">{labels.guardrail}</span>
              {s.guardrail}
            </div>
            <div>
              {s.humanGate ? (
                <>
                  <span className="k" style={{ color: "var(--acc)" }}>
                    {labels.personSigns}
                  </span>
                  {s.humanNote}
                </>
              ) : (
                <>
                  <span className="k">{labels.noGate}</span>
                  {labels.runsAlone}
                </>
              )}
            </div>
          </Rv>
        ))}
      </div>
    </>
  );
}
