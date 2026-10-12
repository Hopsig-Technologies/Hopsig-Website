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
  slotsTitle: string;
  slotsOptional: string;
  slotsHint: string;
  times: string[];
  slotsPicked: string;
  slotsNone: string;
  dayNames: string[];
  monthNames: string[];
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

/** The next `n` working days (Monday to Friday), starting tomorrow: never today, never a past date. */
function nextWorkingDays(n: number) {
  const days: Date[] = [];
  const d = new Date();
  while (days.length < n) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) days.push(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
  }
  return days;
}

/** Thirty minutes, the length of the call. */
const CALL_MS = 30 * 60 * 1000;

/**
 * /book: the four fields, then optional slots (owner decision 2026-10-12): the next five working days from
 * tomorrow; pick a day to see its slots (in the visitor's own time), pick any number of slots on any number of
 * days, or none. The request is emailed (/api/contact) with the slots as instants and the visitor's time zone;
 * someone sends the invite by hand (no booking tool). The confirmation card shows only when the send succeeds,
 * otherwise `notConnected`. The days depend on today, so they render after mount. Arriving from "Ask about this →"
 * (`?about=<case title>`) shows the case above the problem field and sends it as its own line.
 */
export function BookCalendar({ copy, captchaNote }: { copy: CalendarCopy; captchaNote?: ReactNode }) {
  const [days, setDays] = useState<Date[]>([]);
  const [day, setDay] = useState(0);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [about, setAbout] = useState("");
  const email = useRef<HTMLInputElement>(null);
  const problem = useRef<HTMLTextAreaElement>(null);
  const captcha = useRecaptcha();
  const [f, setF] = useState({ name: "", email: "", company: "", problem: "", website: "" });
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    // Browser-only (it depends on today and the URL): set once after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDays(nextWorkingDays(5));
    // "Ask about this →" carries the case title; it travels as its own line, and the problem is still asked for.
    setAbout(new URLSearchParams(window.location.search).get("about")?.trim().slice(0, 200) ?? "");
  }, []);

  const at = (d: Date, time: string) => {
    const [h, m] = time.split(":").map(Number);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m);
  };
  const toggle = (key: string) =>
    setPicked((s) => {
      const n = new Set(s);
      if (n.has(key)) n.delete(key);
      else n.add(key);
      return n;
    });
  // Picked slots in calendar order, for the summary and the request.
  const chosen = days.flatMap((d, i) => copy.times.flatMap((t, j) => (picked.has(`${i}-${j}`) ? [{ d, t, start: at(d, t) }] : [])));
  const dayLabel = (d: Date) => `${copy.dayNames[d.getDay()]} ${d.getDate()} ${copy.monthNames[d.getMonth()]}`;

  const confirm = async () => {
    if (!EMAIL.test(f.email.trim())) return email.current?.focus();
    if (!f.problem.trim()) return problem.current?.focus();
    const slots = chosen.map((c) => ({ start: c.start.toISOString(), end: new Date(c.start.getTime() + CALL_MS).toISOString() }));
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    setStatus("sending");
    const token = await captcha.token("booking");
    const ok = await post({ kind: "booking", ...f, about, slots: JSON.stringify(slots), timeZone, token });
    if (ok) track("consult_booked", { via: "request", slots: slots.length });
    setStatus(ok ? "done" : "failed");
  };

  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  const [pName, pEmail, pCo, pWhat] = copy.fieldPlaceholders;
  const active = days[day];
  return (
    <div id="cal" className={`cal${status === "done" ? " done" : ""}`}>
      <div className="live" style={{ gap: 18 }} onFocusCapture={captcha.load} onPointerDownCapture={captcha.load}>
        <div className="cal-top">
          <div className="lab">{copy.title}</div>
        </div>
        <div className="f">
          <input aria-label={pName} placeholder={pName} value={f.name} onChange={set("name")} />
          <input ref={email} aria-label={pEmail} placeholder={pEmail} type="email" required value={f.email} onChange={set("email")} />
          <input aria-label={pCo} placeholder={pCo} value={f.company} onChange={set("company")} />
          {about ? <div className="lbl">{put(copy.aboutNote, { title: about })}</div> : null}
          <textarea ref={problem} aria-label={pWhat} placeholder={pWhat} required value={f.problem} onChange={set("problem")} />
          <Honeypot value={f.website} onChange={(v) => setF((x) => ({ ...x, website: v }))} />
        </div>
        <div className="when" role="group" aria-labelledby="when-t">
          <div className="cal-top">
            <div id="when-t" className="lab lab-acc">
              {copy.slotsTitle}
            </div>
            <div className="lab">{copy.slotsOptional}</div>
          </div>
          <div className="days">
            {days.map((d, i) => {
              const n = copy.times.filter((_, j) => picked.has(`${i}-${j}`)).length;
              return (
                <button key={i} type="button" className={day === i ? "on" : undefined} aria-pressed={day === i} aria-label={`${dayLabel(d)}${n ? `, ${n}` : ""}`} onClick={() => setDay(i)}>
                  {copy.dayNames[d.getDay()]}
                  <b>{d.getDate()}</b>
                  {copy.monthNames[d.getMonth()]}
                  {n ? <i className="n">{n}</i> : null}
                </button>
              );
            })}
          </div>
          {active ? (
            <div className="slots">
              {copy.times.map((t, j) => {
                const key = `${day}-${j}`;
                const on = picked.has(key);
                return (
                  <button key={key} type="button" className={on ? "on" : undefined} aria-pressed={on} aria-label={`${dayLabel(active)}, ${t}`} onClick={() => toggle(key)}>
                    {t}
                  </button>
                );
              })}
            </div>
          ) : null}
          <div className="cal-sum" aria-live="polite">
            {chosen.length ? (
              <>
                {put(copy.slotsPicked, { n: chosen.length })}
                <span className="when-list">{chosen.map((c) => `${dayLabel(c.d)} · ${c.t}`).join("  ·  ")}</span>
              </>
            ) : (
              copy.slotsNone
            )}
            <span className="when-hint">{copy.slotsHint}</span>
          </div>
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
