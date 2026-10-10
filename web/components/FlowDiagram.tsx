"use client";

import { useState } from "react";
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
  briefIn: string;
  prOut: string;
};

const W = 1264;
const GAP = 22;
const NODE = (W - GAP * 5) / 6;
const MONO = "IBM Plex Mono, monospace";

/**
 * /agentic-flow: the six stages as an SVG (agents outlined, the three "A person signs" gates in the accent),
 * then the same stages as a table. Hovering or focusing a node marks its row, and hovering a row marks its node;
 * clicking a node scrolls to its row. Geometry and type are the reference's (generator/site.py _flow_svg).
 */
export function FlowDiagram({ stages, labels }: { stages: FlowStage[]; labels: Labels }) {
  const [on, setOn] = useState(-1);
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const go = (i: number) =>
    document.getElementById(`frow-${i}`)?.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "center" });
  return (
    <div onMouseLeave={() => setOn(-1)}>
      <Rv>
        <svg
          className="flow"
          viewBox={`0 0 ${W} 300`}
          width="100%"
          role="img"
          aria-label="The six stages of the agentic pipeline, with the three points where a person signs"
        >
          <defs>
            <pattern id="fd" width="11" height="11" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="var(--dot)" />
            </pattern>
          </defs>
          <rect x="0" y="0" width={W} height="300" fill="url(#fd)" />
          <line x1="0" y1="155" x2={W} y2="155" stroke="var(--sub)" strokeWidth="1.5" strokeDasharray="2 7" />
          {stages.map((s, i) => {
            const x = i * (NODE + GAP);
            const cx = x + NODE / 2;
            return (
              <g key={s.stage}>
                <g
                  className={`node${on === i ? " on" : ""}`}
                  tabIndex={0}
                  onMouseEnter={() => setOn(i)}
                  onFocus={() => setOn(i)}
                  onClick={() => go(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      go(i);
                    }
                  }}
                >
                  <rect x={x} y="96" width={NODE} height="118" rx="12" fill="var(--panel)" stroke="var(--line)" />
                  <text x={x + 18} y="126" fontFamily={MONO} fontSize="11" letterSpacing="1.5" fill="var(--acc)">
                    {String(i + 1).padStart(2, "0")}
                  </text>
                  <text x={x + 18} y="158" fontFamily="Space Grotesk, sans-serif" fontSize="22" fontWeight="600" letterSpacing="-.5" fill="var(--text)">
                    {s.stage}
                  </text>
                  <text x={x + 18} y="184" fontFamily={MONO} fontSize="10.5" letterSpacing="1" fill="var(--dim)">
                    {s.agent.toUpperCase()}
                  </text>
                </g>
                {s.humanGate ? (
                  <g className="gate">
                    <rect x={cx - 7} y="240" width="14" height="14" rx="3" fill="var(--acc)" />
                    <line x1={cx} y1="214" x2={cx} y2="240" stroke="var(--acc)" strokeWidth="1.5" />
                    <text x={cx} y="276" textAnchor="middle" fontFamily={MONO} fontSize="10.5" letterSpacing="1.5" fill="var(--text)">
                      {labels.personSigns.toUpperCase()}
                    </text>
                  </g>
                ) : null}
                {i < stages.length - 1 ? (
                  <path
                    d={`M${x + NODE + 6} 150 L${x + NODE + 11} 155 L${x + NODE + 6} 160`}
                    fill="none"
                    stroke="var(--sub)"
                    strokeWidth="1.5"
                  />
                ) : null}
              </g>
            );
          })}
          <text x="0" y="60" fontFamily={MONO} fontSize="10.5" letterSpacing="1.5" fill="var(--dim)">
            {labels.briefIn.toUpperCase()}
          </text>
          <text x={W} y="60" textAnchor="end" fontFamily={MONO} fontSize="10.5" letterSpacing="1.5" fill="var(--dim)">
            {labels.prOut.toUpperCase()}
          </text>
        </svg>
      </Rv>
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
          <Rv key={s.stage} className={`frow${on === i ? " on" : ""}`} delay={i * 60} onMouseEnter={() => setOn(i)}>
            <span className="n" id={`frow-${i}`}>
              {String(i + 1).padStart(2, "0")}
            </span>
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
    </div>
  );
}
