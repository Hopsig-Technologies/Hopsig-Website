"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { track } from "@/lib/analytics";

const put = (t: string, vars: Record<string, string | number>) => t.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));

type Status = "idle" | "sending" | "done" | "failed";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Google reCAPTCHA v3 (owner decision 2026-10-11). The site key is public by design and comes from the environment
// (NEXT_PUBLIC_RECAPTCHA_SITE_KEY); without it the forms send without a token and the server skips the check.
const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
type Grecaptcha = { ready: (cb: () => void) => void; execute: (key: string, o: { action: string }) => Promise<string> };

/**
 * Loads Google's script only once someone starts on a form (focus or tap inside it), not with the page, and asks
 * it for a token when the form is sent. A missing or failed token sends an empty one; the server decides.
 */
function useRecaptcha() {
  const load = useCallback(() => {
    if (!SITE_KEY || document.getElementById("recaptcha-v3")) return;
    const s = document.createElement("script");
    s.id = "recaptcha-v3";
    s.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(SITE_KEY)}`;
    s.async = true;
    document.head.appendChild(s);
  }, []);
  const token = useCallback(
    async (action: "booking" | "brief") => {
      if (!SITE_KEY) return "";
      load();
      const g = await new Promise<Grecaptcha | null>((resolve) => {
        const started = Date.now();
        const poll = () => {
          const w = (window as unknown as { grecaptcha?: Grecaptcha }).grecaptcha;
          if (w?.execute) return resolve(w);
          if (Date.now() - started > 10000) return resolve(null);
          setTimeout(poll, 100);
        };
        poll();
      });
      if (!g) return "";
      return new Promise<string>((resolve) => g.ready(() => g.execute(SITE_KEY, { action }).then(resolve, () => resolve(""))));
    },
    [load],
  );
  return { load, token };
}

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
  aboutNote: string;
  submit: string;
  bookedLabel: string;
  bookedTitle: string;
  bookedText: string;
  checklist: string[];
};

/**
 * /book: next week's five working days and eight half-hour slots in the visitor's own time, the four fields and
 * the request button. The request is emailed to the form recipients (/api/contact) with the visitor's time zone;
 * the confirmation card shows only when that succeeds, otherwise `notConnected`. There is no booking tool (owner
 * decision 2026-10-11): someone sends the calendar invite by hand. The days depend on today, so they render after
 * mount. Arriving from "Ask about this →" (`?about=<case title>`) pre-fills the problem field.
 */
export function BookCalendar({ copy, captchaNote }: { copy: CalendarCopy; captchaNote?: ReactNode }) {
  const [days, setDays] = useState<Date[]>([]);
  const [about, setAbout] = useState("");
  const email = useRef<HTMLInputElement>(null);
  const problem = useRef<HTMLTextAreaElement>(null);
  const captcha = useRecaptcha();
  const [day, setDay] = useState<number | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [nudge, setNudge] = useState(false);
  const [f, setF] = useState({ name: "", email: "", company: "", problem: "", website: "" });
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + (((8 - d.getDay()) % 7) || 7)); // next Monday
    // Browser-only (it depends on today and the URL): set once after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDays(Array.from({ length: 5 }, (_, i) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + i)));
    // "Ask about this →" carries the case title; it travels as its own line, and the problem is still asked for.
    setAbout(new URLSearchParams(window.location.search).get("about")?.trim().slice(0, 200) ?? "");
  }, []);

  const picked = day !== null && time ? days[day] : null;
  const summary = picked
    ? put(copy.summary, { day: copy.dayNames[picked.getDay()], date: picked.getDate(), month: copy.monthNames[picked.getMonth()], time: time! })
    : nudge
      ? copy.pickFirst
      : copy.prompt;

  const confirm = async () => {
    if (!picked) return setNudge(true);
    if (!EMAIL.test(f.email.trim())) return email.current?.focus();
    if (!f.problem.trim()) return problem.current?.focus();
    const [h, m] = time!.split(":").map(Number);
    const start = new Date(picked.getFullYear(), picked.getMonth(), picked.getDate(), h, m).toISOString();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    setStatus("sending");
    const token = await captcha.token("booking");
    const ok = await post({ kind: "booking", ...f, about, start, timeZone, token });
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
        <div className="f" onFocusCapture={captcha.load} onPointerDownCapture={captcha.load}>
          <input aria-label={pName} placeholder={pName} value={f.name} onChange={set("name")} />
          <input ref={email} aria-label={pEmail} placeholder={pEmail} type="email" required value={f.email} onChange={set("email")} />
          <input aria-label={pCo} placeholder={pCo} value={f.company} onChange={set("company")} />
          {about ? <div className="lbl">{put(copy.aboutNote, { title: about })}</div> : null}
          <textarea ref={problem} aria-label={pWhat} placeholder={pWhat} required value={f.problem} onChange={set("problem")} />
          <Honeypot value={f.website} onChange={(v) => setF((x) => ({ ...x, website: v }))} />
        </div>
        <button type="button" className="btnp" onClick={confirm} disabled={status === "sending"}>
          {copy.submit}
        </button>
        {captchaNote ? <div className="captcha-note">{captchaNote}</div> : null}
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
export function BriefForm({ copy, captchaNote }: { copy: BriefCopy; captchaNote?: ReactNode }) {
  const [f, setF] = useState({ name: "", email: "", company: "", problem: "", budget: "", link: "", website: "" });
  const [when, setWhen] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const problem = useRef<HTMLTextAreaElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const captcha = useRecaptcha();

  const send = async () => {
    if (!EMAIL.test(f.email.trim())) return email.current?.focus();
    if (!f.problem.trim()) return problem.current?.focus();
    setStatus("sending");
    const token = await captcha.token("brief");
    const ok = await post({ kind: "brief", ...f, about: "", when: when ?? "", token });
    if (ok) track("brief_sent", { when: when ?? "" });
    setStatus(ok ? "done" : "failed");
  };

  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  const [pName, pEmail, pCo, pWhat, pBudget, pLink] = copy.fieldPlaceholders;
  const field = (k: keyof typeof f, p: string, type = "text"): ReactNode => (
    <input
      ref={k === "email" ? email : undefined}
      aria-label={p}
      placeholder={p}
      type={type}
      required={k === "email"}
      value={f[k]}
      onChange={set(k)}
    />
  );
  return (
    <div id="bf" className={`cal brief${status === "done" ? " done" : ""}`}>
      <div className="live" style={{ gap: 14 }}>
        <div className="cal-top">
          <div className="lab">{copy.title}</div>
          <div className="lab lab-acc">{copy.duration}</div>
        </div>
        <div className="f" onFocusCapture={captcha.load} onPointerDownCapture={captcha.load}>
          {field("name", pName)}
          {field("email", pEmail, "email")}
          {field("company", pCo)}
          <div className="lbl">{copy.problemLabel}</div>
          <textarea ref={problem} aria-label={copy.problemLabel} placeholder={pWhat} required value={f.problem} onChange={set("problem")} />
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
        {captchaNote ? <div className="captcha-note">{captchaNote}</div> : null}
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
