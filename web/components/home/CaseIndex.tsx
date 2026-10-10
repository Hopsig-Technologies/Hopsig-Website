"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Rv } from "../Reveal";

export type Metric = {
  value: string;
  label: string;
  before: number | null;
  after: number | null;
  beforeLabel: string | null;
  afterLabel: string | null;
};

export type CaseIndexRow = {
  id: string;
  title: string;
  domain: string;
  shape: string;
  /** Filter key (payments, retail, health, ai, iot). */
  filter: string;
  metric: Metric | null;
  problem: string;
  whatWeDid: string;
  /** The measured paragraph, rendered on the server (Portable Text). */
  measured: ReactNode;
  stack: string[];
  link: { href: string; label: string };
};

type Labels = { problem: string; whatWeDid: string; measured: string };

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** "150+" counts up from 0 over 0.9 s (ease-out cubic) each time `run` changes; non-numbers show as they are. */
function useCountUp(value: string, run: number) {
  // `frame` is the in-flight count; null shows the value itself.
  const [frame, setFrame] = useState<string | null>(null);
  useEffect(() => {
    const m = /^([0-9]+(?:\.[0-9]+)?)(.*)$/.exec(value);
    if (!run || !m || reduced()) return;
    const n = parseFloat(m[1]);
    const dec = (m[1].split(".")[1] || "").length;
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const k = 1 - Math.pow(1 - Math.min(1, (t - t0) / 900), 3);
      setFrame(k < 1 ? (n * k).toFixed(dec) + m[2] : null);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      setFrame(null);
    };
  }, [value, run]);
  return frame ?? value;
}

/** The measured card: value, label and, when the record has both, a before/after pair of bars. */
function Measure({ metric, run, label, children }: { metric: Metric | null; run: number; label: string; children?: ReactNode }) {
  const value = useCountUp(metric?.value ?? "", run);
  const has = metric?.before != null && metric?.after != null;
  const before = metric?.before ?? 0;
  const after = metric?.after ?? 0;
  const mx = Math.max(before, after, 1);
  return (
    <>
      <div className="k">{label}</div>
      <div className="v">{value}</div>
      <div className="l">{metric?.label}</div>
      <div className={`bars${has ? "" : " none"}`} key={`b${run}`}>
        {has ? (
          <>
            <i style={{ height: `${Math.max(4, (before / mx) * 100)}%` }} />
            <i className="on" style={{ height: `${Math.max(4, (after / mx) * 100)}%` }} />
          </>
        ) : null}
      </div>
      <div className={`bl${has ? "" : " none"}`}>
        {has ? (
          <>
            <span>{metric?.beforeLabel || "Before"}</span>
            <span>{metric?.afterLabel || "After"}</span>
          </>
        ) : null}
      </div>
      {children}
    </>
  );
}

/**
 * "Where we have done this before": the featured case studies as rows. A row opens in place (one at a time) to
 * the problem, the work, the measured line and the stack; the filters collapse the rows of other domains and
 * re-stagger the rest; on a fine pointer a measured card follows the cursor over a closed row. Port of the
 * reference's `#cidx` script. Without JS every row shows open.
 */
export function CaseIndex({
  rows,
  filters,
  labels,
  head,
  foot,
}: {
  rows: CaseIndexRow[];
  filters: { key: string; label: string; count: number }[];
  labels: Labels;
  /** The heading block, left of the filters. */
  head: ReactNode;
  /** Below the rows (the "All case notes" link). */
  foot: ReactNode;
}) {
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  const [opened, setOpened] = useState(0);
  const [peekId, setPeekId] = useState<string | null>(null);
  const [peekRun, setPeekRun] = useState(0);
  // The card keeps its last case while it fades out.
  const [peekShow, setPeekShow] = useState(false);
  const root = useRef<HTMLElement>(null);
  const peek = useRef<HTMLDivElement>(null);
  const showing = useRef(false);
  const fine = useRef(false);

  // Cursor-following card (fine pointers only): eased position, tilted by horizontal speed.
  useEffect(() => {
    fine.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduced();
    if (!fine.current) return;
    const el = root.current!;
    const card = peek.current!;
    let px = 0;
    let py = 0;
    let tx = 0;
    let ty = 0;
    let lx = 0;
    let rot = 0;
    let raf = 0;
    const place = () => {
      px += (tx - px) * 0.13;
      py += (ty - py) * 0.13;
      const vel = tx - lx;
      lx = tx;
      rot += (Math.max(-9, Math.min(9, vel * 0.3)) - rot) * 0.12;
      let x = px + 24;
      if (x + 280 > window.innerWidth) x = px - 288;
      card.style.transform = `translate3d(${x.toFixed(1)}px,${(py - 24).toFixed(1)}px,0) rotate(${rot.toFixed(2)}deg)`;
      raf = showing.current || Math.abs(tx - px) > 0.4 || Math.abs(ty - py) > 0.4 ? requestAnimationFrame(place) : 0;
    };
    const onMove = (e: MouseEvent) => {
      if (!showing.current && !raf) {
        px = lx = e.clientX;
        py = e.clientY;
      }
      tx = e.clientX;
      ty = e.clientY;
      if (!raf) raf = requestAnimationFrame(place);
    };
    const onLeave = () => {
      showing.current = false;
      setPeekShow(false);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  const enter = (id: string) => {
    if (!fine.current || open === id) return;
    showing.current = true;
    setPeekId(id);
    setPeekShow(true);
    setPeekRun((n) => n + 1);
  };
  const leave = () => {
    showing.current = false;
    setPeekShow(false);
  };
  const toggle = (id: string) => {
    const opening = open !== id;
    setOpen(opening ? id : null);
    if (opening) {
      setOpened((n) => n + 1);
      leave();
    }
  };

  let shownIndex = 0;
  const peekRow = rows.find((r) => r.id === peekId);
  return (
    <section ref={root} id="cidx" className="cidx wrap" style={{ padding: "120px 0 130px" }}>
      <Rv style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40 }}>
        {head}
        <div className="filters" role="tablist" aria-label="Filter by domain">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              className={filter === f.key ? "on" : undefined}
              onClick={() => {
                setFilter(f.key);
                setOpen(null);
              }}
            >
              {f.label}
              <b>{f.count}</b>
            </button>
          ))}
        </div>
      </Rv>
      <div className="rows">
        {rows.map((r, i) => {
          const on = filter === "all" || r.filter === filter;
          const isOpen = open === r.id;
          return (
            <div key={r.id} className={`cw${on ? "" : " hide"}`} style={{ transitionDelay: on ? `${shownIndex++ * 45}ms` : "0ms" }}>
              <div>
                <Rv as="article" className={`cx${isOpen ? " open" : ""}`} delay={i * 55}>
                  <div
                    className="head"
                    role="button"
                    tabIndex={0}
                    aria-expanded={isOpen}
                    onClick={() => toggle(r.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggle(r.id);
                      }
                    }}
                    onMouseEnter={() => enter(r.id)}
                    onMouseLeave={leave}
                  >
                    <span className="n">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="t" style={{ margin: 0 }}>
                      {r.title}
                    </h3>
                    <span className="d">{r.domain}</span>
                    <span className="m">
                      <b>{r.metric?.value}</b>
                      {/* The row shows the label up to its first semicolon or comma. */}
                      {r.metric?.label.split(";")[0].split(",")[0]}
                    </span>
                    <span className="s">{r.shape}</span>
                    <span className="p" aria-hidden="true">
                      <i>+</i>
                    </span>
                  </div>
                  <div className="body">
                    <div>
                      <div className="bi">
                        <div />
                        <div>
                          <div className="k">{labels.problem}</div>
                          <p>{r.problem}</p>
                          <div className="k" style={{ marginTop: 18 }}>
                            {labels.whatWeDid}
                          </div>
                          <p>{r.whatWeDid}</p>
                        </div>
                        <div>
                          <div className="k">{labels.measured}</div>
                          <p>{r.measured}</p>
                          <div className="chips">
                            {r.stack.map((s) => (
                              <span key={s}>{s}</span>
                            ))}
                          </div>
                        </div>
                        <div className="meas">
                          <Measure metric={r.metric} run={isOpen ? opened : 0} label={labels.measured}>
                            <Link className="ask" href={r.link.href as never}>
                              {r.link.label}
                            </Link>
                          </Measure>
                        </div>
                      </div>
                    </div>
                  </div>
                </Rv>
              </div>
            </div>
          );
        })}
      </div>
      {foot}
      <div ref={peek} className={`peek${peekShow && peekRow ? " show" : ""}`} aria-hidden="true">
        <div className="in">
          <Measure metric={peekRow?.metric ?? null} run={peekRun} label={labels.measured} />
        </div>
      </div>
    </section>
  );
}
