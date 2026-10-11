"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { track } from "@/lib/analytics";

const put = (t: string, vars: Record<string, string | number>) => t.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));

type Status = "idle" | "sending" | "done" | "failed";

async function post(payload: Record<string, string>): Promise<boolean> {
  try {
    const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    return res.ok;
  } catch {
    return false;
  }
}

/** A field people never see; the route handler drops anything that fills it. */
function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      className="hp"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      name="website"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

/** The confirmation card shown after a send: label, title, text with the email, checklist. */
function Confirmation({ label, title, text, email, checklist }: { label: string; title: string; text: string; email: string; checklist: string[] }) {
  const [before, after = ""] = text.split("{email}");
  const lines = (s: string) => s.split("\n").flatMap((l, i) => (i ? [<br key={i} />, l] : [l]));
  return (
    <div className="confirm">
      <div className="lab lab-acc">{label}</div>
      <div className="confirm-t">{title}</div>
      <div className="mono-note">
        {lines(before)}
        <span style={{ color: "var(--text)" }}>{email}</span>
        {lines(after)}
      </div>
      <div className="list" style={{ marginTop: 6 }}>
        {checklist.map((c) => (
          <div key={c}>
            <i />
            <span>{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export type CalendarCopy = {
  title: string;
  timezone: string;
  prompt: string;
  pickFirst: string;
  summary: string;
  dayNames: string[];
  monthNames: string[];
  times: string[];
  emailFallback: string;
  notConnected: string;
  fieldPlaceholders: string[];
  submit: string;
  bookedLabel: string;
  bookedTitle: string;
  bookedText: string;
  checklist: string[];
};

/**
 * /book: next week's five working days and eight half-hour slots (GMT), the four fields and Confirm. With a
 * booking tool set in Site settings, Confirm opens it; otherwise the request goes to /api/contact, and the
 * "Booked" card shows only when that succeeds (until an email provider is set up it shows `notConnected`).
 * The days depend on today, so they render after mount.
 */
export function BookCalendar({ copy, bookingUrl }: { copy: CalendarCopy; bookingUrl: string | null }) {
  const [days, setDays] = useState<Date[]>([]);
  const [day, setDay] = useState<number | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [nudge, setNudge] = useState(false);
  const [f, setF] = useState({ name: "", email: "", company: "", problem: "", website: "" });
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + (((8 - d.getDay()) % 7) || 7)); // next Monday
    // Browser-only (it depends on today): set once after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDays(Array.from({ length: 5 }, (_, i) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + i)));
  }, []);

  const picked = day !== null && time ? days[day] : null;
  const summary = picked
    ? put(copy.summary, { day: copy.dayNames[picked.getDay()], date: picked.getDate(), month: copy.monthNames[picked.getMonth()], time: time! })
    : nudge
      ? copy.pickFirst
      : copy.prompt;

  const confirm = async () => {
    if (!picked) return setNudge(true);
    if (bookingUrl) {
      track("consult_booked", { via: "booking-tool" });
      window.location.href = bookingUrl;
      return;
    }
    setStatus("sending");
    const ok = await post({ kind: "booking", ...f, slot: summary });
    if (ok) track("consult_booked", { via: "request" });
    setStatus(ok ? "done" : "failed");
  };

  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  const [pName, pEmail, pCo, pWhat] = copy.fieldPlaceholders;
  return (
    <div id="cal" className={`cal${status === "done" ? " done" : ""}`}>
      <div className="live" style={{ gap: 18 }}>
        <div className="cal-top">
          <div className="lab">{copy.title}</div>
          <div className="lab lab-acc">{copy.timezone}</div>
        </div>
        <div className="days">
          {days.map((d, i) => (
            <button key={i} type="button" className={day === i ? "on" : undefined} aria-pressed={day === i} onClick={() => setDay(i)}>
              {copy.dayNames[d.getDay()]}
              <b>{d.getDate()}</b>
              {copy.monthNames[d.getMonth()]}
            </button>
          ))}
        </div>
        <div className="slots">
          {copy.times.map((t) => (
            <button key={t} type="button" className={time === t ? "on" : undefined} aria-pressed={time === t} onClick={() => setTime(t)}>
              {t}
            </button>
          ))}
        </div>
        <div className="cal-sum" aria-live="polite">
          {summary}
        </div>
        <div className="f">
          <input aria-label={pName} placeholder={pName} value={f.name} onChange={set("name")} />
          <input aria-label={pEmail} placeholder={pEmail} type="email" value={f.email} onChange={set("email")} />
          <input aria-label={pCo} placeholder={pCo} value={f.company} onChange={set("company")} />
          <textarea aria-label={pWhat} placeholder={pWhat} value={f.problem} onChange={set("problem")} />
          <Honeypot value={f.website} onChange={(v) => setF((x) => ({ ...x, website: v }))} />
        </div>
        <button type="button" className="btnp" onClick={confirm} disabled={status === "sending"}>
          {copy.submit}
        </button>
        {status === "failed" ? (
          <div className="mono-note" role="status">
            {copy.notConnected}
          </div>
        ) : null}
      </div>
      <Confirmation
        label={copy.bookedLabel}
        title={copy.bookedTitle}
        text={copy.bookedText}
        email={f.email || copy.emailFallback}
        checklist={copy.checklist}
      />
    </div>
  );
}

export type BriefCopy = {
  title: string;
  duration: string;
  fieldPlaceholders: string[];
  problemLabel: string;
  whenLabel: string;
  whenOptions: string[];
  budgetLabel: string;
  submit: string;
  emailFallback: string;
  notConnected: string;
  receivedLabel: string;
  receivedTitle: string;
  receivedText: string;
  checklist: string[];
};

/** /brief: the form posts to /api/contact; the "Received" card shows only when the send succeeds. */
export function BriefForm({ copy }: { copy: BriefCopy }) {
  const [f, setF] = useState({ name: "", email: "", company: "", problem: "", budget: "", link: "", website: "" });
  const [when, setWhen] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const problem = useRef<HTMLTextAreaElement>(null);

  const send = async () => {
    if (!f.problem.trim()) return problem.current?.focus();
    setStatus("sending");
    const ok = await post({ kind: "brief", ...f, when: when ?? "" });
    if (ok) track("brief_sent", { when: when ?? "" });
    setStatus(ok ? "done" : "failed");
  };

  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  const [pName, pEmail, pCo, pWhat, pBudget, pLink] = copy.fieldPlaceholders;
  const field = (k: keyof typeof f, p: string, type = "text"): ReactNode => (
    <input aria-label={p} placeholder={p} type={type} value={f[k]} onChange={set(k)} />
  );
  return (
    <div id="bf" className={`cal brief${status === "done" ? " done" : ""}`}>
      <div className="live" style={{ gap: 14 }}>
        <div className="cal-top">
          <div className="lab">{copy.title}</div>
          <div className="lab lab-acc">{copy.duration}</div>
        </div>
        <div className="f">
          {field("name", pName)}
          {field("email", pEmail, "email")}
          {field("company", pCo)}
          <div className="lbl">{copy.problemLabel}</div>
          <textarea ref={problem} aria-label={copy.problemLabel} placeholder={pWhat} value={f.problem} onChange={set("problem")} />
          <div className="lbl">{copy.whenLabel}</div>
          <div className="chips2" role="group" aria-label={copy.whenLabel}>
            {copy.whenOptions.map((o) => (
              <button key={o} type="button" className={when === o ? "on" : undefined} aria-pressed={when === o} onClick={() => setWhen(o)}>
                {o}
              </button>
            ))}
          </div>
          <div className="lbl">{copy.budgetLabel}</div>
          {field("budget", pBudget)}
          {field("link", pLink)}
          <Honeypot value={f.website} onChange={(v) => setF((x) => ({ ...x, website: v }))} />
        </div>
        <button type="button" className="btnp" onClick={send} disabled={status === "sending"}>
          {copy.submit}
        </button>
        {status === "failed" ? (
          <div className="mono-note" role="status">
            {copy.notConnected}
          </div>
        ) : null}
      </div>
      <Confirmation
        label={copy.receivedLabel}
        title={copy.receivedTitle}
        text={copy.receivedText}
        email={f.email || copy.emailFallback}
        checklist={copy.checklist}
      />
    </div>
  );
}
