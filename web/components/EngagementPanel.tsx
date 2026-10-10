import type { CSSProperties } from "react";
import { engagementPanel as p } from "@/content";
import type { Fill } from "./Filled";

/**
 * The engagement panel (568×392): one engagement in five scenes, stacked; `phase` picks the scene this page shows
 * (reference: /services Embedded 2, Built 1, Data & AI 3; /work 3). Static, as in the reference. Invented specifics
 * are placeholders (see web/content/engagementPanel.ts).
 */

const mono: CSSProperties = { fontFamily: "var(--font-mono)" };
const lab: CSSProperties = { ...mono, fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--dim)" };
const layer = (on: boolean): CSSProperties => ({ position: "absolute", inset: 0, opacity: on ? 1 : 0 });

export function EngagementPanel({ phase, fill }: { phase: 0 | 1 | 2 | 3 | 4; fill: Fill }) {
  // Placeholders render as plain text inside the panel, as the reference shows "[Client]" and "[YOUR RATE]".
  const T = (s: string) => fill(s);
  return (
    <div className="ep">
      <div className="ep-top">
        <div style={lab}>{T(p.client)}</div>
        <div style={{ position: "relative", width: 200, height: 14 }}>
          {p.phases.map((ph, i) => (
            <div key={ph} aria-hidden={i !== phase} style={{ ...lab, color: "var(--acc)", whiteSpace: "nowrap", position: "absolute", inset: 0, textAlign: "right", opacity: i === phase ? 1 : 0 }}>
              {ph}
            </div>
          ))}
        </div>
      </div>
      <div className="ep-bars">
        {p.phases.map((ph, i) => (
          <div key={ph} style={{ background: i < phase ? "#545A60" : i === phase ? "var(--acc)" : "var(--line)" }} />
        ))}
      </div>
      <div style={{ position: "relative", height: 196 }}>
        {/* 0 · the call */}
        <div style={layer(phase === 0)} aria-hidden={phase !== 0}>
          <div style={{ ...lab, fontSize: 10 }}>{p.call.meta}</div>
          <div style={{ marginTop: 10, fontSize: 19, fontWeight: 600, letterSpacing: "-.03em", lineHeight: "26px", color: "var(--text)" }}>
            <span className="ep-quote">{p.call.quote}</span>
          </div>
          <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 9, ...mono, fontSize: 12, color: "var(--sub)" }}>
            {p.call.options.map((o, i) => (
              <div key={o} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className={`ep-box${i === p.call.chosen ? " on" : ""}`} />
                <span style={i === p.call.chosen ? { color: "var(--text)" } : undefined}>{o}</span>
              </div>
            ))}
          </div>
        </div>
        {/* 1 · the scope */}
        <div style={layer(phase === 1)} aria-hidden={phase !== 1}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="ep-h">{p.scope.title}</div>
            <div style={{ ...lab, color: "var(--acc)", border: "1px solid var(--acc)", borderRadius: 6, padding: "5px 8px" }}>{p.scope.badge}</div>
          </div>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column" }}>
            {p.scope.rows.map((r) => (
              <div key={r.label} className="ep-row">
                <span style={{ ...lab, paddingTop: 3 }}>{r.label}</span>
                <span style={{ color: r.strong ? "var(--text)" : "var(--dim)" }}>{T(r.value)}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: 10, fontSize: 12, lineHeight: "18px", color: "var(--dim)" }}>{p.scope.note}</div>
          </div>
        </div>
        {/* 2 · people in */}
        <div style={layer(phase === 2)} aria-hidden={phase !== 2}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {p.people.engineers.map((e, i) => (
              <div key={i} className="ep-person">
                <div className="ep-av">{T(e.initials)}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-.01em", color: "var(--text)" }}>{T(e.role)}</div>
                  <div style={{ ...mono, fontSize: 10, color: "var(--dim)" }}>{e.note}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, ...mono, fontSize: 11, lineHeight: "20px", color: "var(--sub)" }}>
            {p.people.commits.map((c) => (
              <div key={c.hash} style={{ display: "grid", gridTemplateColumns: "52px 1fr auto", gap: 10 }}>
                <span style={{ color: "var(--dim)" }}>{c.hash}</span>
                <span style={{ color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.message}</span>
                <span style={{ color: "var(--dim)" }}>{c.when}</span>
              </div>
            ))}
          </div>
        </div>
        {/* 3 · measured */}
        <div style={layer(phase === 3)} aria-hidden={phase !== 3}>
          <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-.03em", lineHeight: "24px", color: "var(--text)" }}>{p.measured.title}</div>
          <div style={{ ...lab, fontSize: 10, marginTop: 4 }}>{p.measured.sub}</div>
          <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 16 }}>
            {p.measured.metrics.map((m) => (
              <div key={m.label}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-.01em", color: "var(--text)" }}>{m.label}</div>
                  <div style={{ ...mono, fontSize: 12, color: "var(--dim)" }}>
                    {T(m.before)} → <span style={{ color: "var(--acc)" }}>{T(m.after)}</span>
                  </div>
                </div>
                {/* The bar shows the measured ratio; with no real figures it stays an empty track. */}
                <div style={{ marginTop: 8, height: 8, borderRadius: 3, background: "#3C424A" }} />
              </div>
            ))}
          </div>
        </div>
        {/* 4 · the review */}
        <div style={layer(phase === 4)} aria-hidden={phase !== 4}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <svg width="28" height="28" viewBox="0 0 28 28" style={{ flex: "none" }} aria-hidden="true">
              <rect x="1" y="1" width="26" height="26" rx="7" fill="none" stroke="var(--acc)" strokeWidth="1.5" />
              <path d="M8 14.5 L12.5 19 L20 9.5" fill="none" stroke="var(--acc)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="ep-h">{p.review.title}</div>
          </div>
          <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {p.review.stats.map((s) => (
              <div key={s.label} style={{ borderTop: "1px solid var(--line)", paddingTop: 8 }}>
                <div style={lab}>{s.label}</div>
                <div style={{ ...mono, fontSize: 15, color: "var(--text)", marginTop: 4 }}>{T(s.value)}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <div className="ep-btn lime">{p.review.actions[0]}</div>
            <div className="ep-btn">{p.review.actions[1]}</div>
            <div style={{ alignSelf: "center", marginLeft: "auto", ...mono, fontSize: 11, color: "var(--dim)" }}>{p.review.note}</div>
          </div>
        </div>
      </div>
      <div className="ep-terms">
        {p.terms.map((t) => (
          <div key={t.label}>
            <div style={{ ...lab, whiteSpace: "nowrap" }}>{t.label}</div>
            <div style={{ ...mono, fontSize: 12, color: "var(--text)", marginTop: 3, whiteSpace: "nowrap" }}>{fill(t.value)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
