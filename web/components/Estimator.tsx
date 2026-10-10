"use client";

import { useState, type ReactNode } from "react";

export type EstimatorWords = { engineer: string; engineers: string; months: string; days: string; total: string; totalNoRate: string };

const fmt = (n: number) => n.toLocaleString("en-GB");
const put = (t: string, vars: Record<string, string | number>) => t.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));

/**
 * Engineers (1–6) × months (3–12) × 21 working days × the Site settings day rate. Until the rate is set the total
 * reads "N × [YOUR RATE]". The words arrive as props, so no copy (and no token) sits in a shared JS chunk (rule 12).
 * The first render computes the default (2 × 6), so the numbers are there without JS too.
 */
export function Estimator({
  title,
  sub,
  engineersLabel,
  monthsLabel,
  note,
  daysLabel,
  totalLabel,
  footnotes,
  words,
  rate,
}: {
  title: string;
  sub: string;
  engineersLabel: string;
  monthsLabel: string;
  note: ReactNode;
  daysLabel: string;
  totalLabel: string;
  footnotes: ReactNode;
  words: EstimatorWords;
  rate: number | null;
}) {
  const [eng, setEng] = useState(2);
  const [mon, setMon] = useState(6);
  const days = eng * mon * 21;
  const total = rate ? put(words.total, { total: fmt(rate * days), rate: fmt(rate) }) : put(words.totalNoRate, { days: fmt(days) });
  return (
    <>
      <div>
        <div className="lab lab-acc">{title}</div>
        <div className="est-sub">{sub}</div>
        <label htmlFor="eng">
          <span>{engineersLabel}</span>
          <span>{put(eng === 1 ? words.engineer : words.engineers, { n: eng })}</span>
        </label>
        <input id="eng" type="range" min={1} max={6} value={eng} onChange={(e) => setEng(Number(e.target.value))} />
        <label htmlFor="mon">
          <span>{monthsLabel}</span>
          <span>{put(words.months, { n: mon })}</span>
        </label>
        <input id="mon" type="range" min={3} max={12} value={mon} onChange={(e) => setMon(Number(e.target.value))} />
        <div className="est-note">{note}</div>
      </div>
      <div className="out">
        <div className="lab">{daysLabel}</div>
        <div className="n">{put(words.days, { n: fmt(days) })}</div>
        <div className="lab">{totalLabel}</div>
        <div className="n" style={{ fontSize: 30, color: "var(--acc)" }}>
          {total}
        </div>
        <div className="mono-note" style={{ marginTop: 8 }}>
          {footnotes}
        </div>
      </div>
    </>
  );
}
