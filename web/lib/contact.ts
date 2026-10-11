import "server-only";
import { emails } from "@/content";

/** What /book and /brief send. Nothing is stored: it is emailed. */
export type ContactMessage =
  | { kind: "brief"; name: string; email: string; company: string; problem: string; about: string; when: string; budget: string; link: string }
  | { kind: "booking"; name: string; email: string; company: string; problem: string; about: string; start: string; timeZone: string };

export type SendResult = { ok: true } | { ok: false; reason: "not-configured" | "failed" };

type Row = [label: string, value: string];
type Mail = { eyebrow: string; title: string; text: string; rowsTitle?: string; rows: Row[] };

const put = (t: string, vars: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** The requested slot in the visitor's own time zone ("Tue 13 Oct, 09:00") and in UTC; empty if unreadable. */
function slotIn(start: string, timeZone: string) {
  const d = new Date(start);
  if (Number.isNaN(d.getTime())) return { local: "", utc: "" };
  const fmt = (tz: string) =>
    new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: tz })
      .format(d)
      .replace(/^(\w+) (\d+ \w+),? /, "$1 $2, ");
  let local = "";
  try {
    local = fmt(timeZone || "UTC");
  } catch {
    local = fmt("UTC");
  }
  return { local, utc: `${fmt("UTC")} UTC` };
}

/** Plain text and HTML of one email. The HTML is the site's light surface with the dark wordmark band. */
function render(mail: Mail) {
  const rows = mail.rows.filter(([, v]) => v.trim());
  const text = [
    mail.title,
    "",
    mail.text,
    "",
    ...(mail.rowsTitle ? [mail.rowsTitle.toUpperCase(), ""] : []),
    ...rows.flatMap(([k, v]) => [`${k}:`, v, ""]),
    "—",
    emails.footer,
    emails.site,
  ].join("\n");
  const mono = "font-family:'IBM Plex Mono',Menlo,Consolas,monospace";
  const sans = "font-family:'Space Grotesk',Helvetica,Arial,sans-serif";
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#F7F8F4">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F8F4"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;background:#FFFFFF;border:1px solid #D6DAD2;border-radius:12px;border-collapse:separate;overflow:hidden">
<tr><td style="background:#0E1116;padding:20px 28px;${sans};font-size:22px;font-weight:600;letter-spacing:-0.03em;color:#E7ECEF">Hop<span style="color:#C6F24E">sig</span></td></tr>
<tr><td style="padding:28px 28px 8px">
<div style="${mono};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#3F6B1F">${esc(mail.eyebrow)}</div>
<h1 style="margin:10px 0 0;${sans};font-size:26px;line-height:1.15;font-weight:600;letter-spacing:-0.03em;color:#0E1116">${esc(mail.title)}</h1>
<p style="margin:14px 0 0;${sans};font-size:15px;line-height:1.6;color:#3C424A">${esc(mail.text)}</p>
${mail.rowsTitle ? `<div style="margin-top:26px;${mono};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#545A60">${esc(mail.rowsTitle)}</div>` : ""}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:${mail.rowsTitle ? 10 : 22}px">
${rows
  .map(
    ([k, v]) => `<tr><td style="border-top:1px solid #EAECE6;padding:12px 0">
<div style="${mono};font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#545A60">${esc(k)}</div>
<div style="margin-top:4px;${sans};font-size:15px;line-height:1.55;color:#0E1116;white-space:pre-wrap">${esc(v)}</div></td></tr>`,
  )
  .join("\n")}
</table></td></tr>
<tr><td style="padding:18px 28px 22px;border-top:1px solid #EAECE6;${mono};font-size:11px;line-height:1.7;color:#545A60">${esc(emails.footer)}<br><a href="https://hopsig.com" style="color:#3F6B1F;text-decoration:none">${esc(emails.site)}</a></td></tr>
</table></td></tr></table></body></html>`;
  return { text, html };
}

/** The team's email and the visitor's receipt for one submission. */
function compose(m: ContactMessage) {
  const L = emails.labels;
  const who = `${m.name || m.email}${m.company ? ` (${m.company})` : ""}`;
  const about = m.about ? put(emails.aboutCase, { title: m.about }) : "";
  if (m.kind === "booking") {
    const slot = slotIn(m.start, m.timeZone);
    const sent: Row[] = [
      [L.slot, slot.local],
      [L.timeZone, m.timeZone],
      [L.name, m.name],
      [L.company, m.company],
      [L.about, about],
      [L.problem, m.problem],
    ];
    const team = emails.team.booking;
    const receipt = emails.receipt.booking;
    return {
      team: {
        subject: put(team.subject, { who }),
        mail: { ...team, rows: [sent[0], sent[1], [L.utc, slot.utc] as Row, sent[2], [L.email, m.email] as Row, ...sent.slice(3)] },
      },
      receipt: {
        subject: receipt.subject,
        mail: { ...receipt, text: put(receipt.text, { slot: slot.local, timeZone: m.timeZone || "UTC" }), rowsTitle: emails.receipt.sentLabel, rows: sent },
      },
    };
  }
  const sent: Row[] = [
    [L.name, m.name],
    [L.company, m.company],
    [L.about, about],
    [L.problem, m.problem],
    [L.when, m.when],
    [L.budget, m.budget],
    [L.link, m.link],
  ];
  const team = emails.team.brief;
  const receipt = emails.receipt.brief;
  return {
    team: { subject: put(team.subject, { who }), mail: { ...team, rows: [sent[0], [L.email, m.email] as Row, ...sent.slice(1)] } },
    receipt: { subject: receipt.subject, mail: { ...receipt, rowsTitle: emails.receipt.sentLabel, rows: sent } },
  };
}

/** The team's addresses: CONTACT_RECIPIENTS, a comma-separated list (environment only, owner decision 2026-10-11). */
function recipients() {
  return (process.env.CONTACT_RECIPIENTS ?? "")
    .split(",")
    .map((r) => r.trim())
    .filter((r) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r));
}

async function resend(key: string, body: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) console.error("contact: Resend refused the email", res.status, (await res.text()).slice(0, 300));
  return res.ok;
}

/**
 * Email a consult request (/book) or a brief (/brief) to every address in CONTACT_RECIPIENTS, reply-to the visitor,
 * then a receipt to the visitor with a copy of what they sent (replies go to CONTACT_FROM, so it must be an inbox
 * someone reads). Through Resend; RESEND_API_KEY and CONTACT_FROM (a sender on the domain verified in Resend) come
 * from the environment only. Missing any of them reports `not-configured` and the form shows its fallback line.
 * The send counts as done when the team's email goes; a failed receipt is logged, not shown.
 */
export async function sendContact(message: ContactMessage): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;
  const to = recipients();
  if (!key || !from || !to.length) return { ok: false, reason: "not-configured" };

  const { team, receipt } = compose(message);
  const t = render(team.mail);
  const sent = await resend(key, { from, to, reply_to: message.email, subject: team.subject, text: t.text, html: t.html });
  if (!sent) return { ok: false, reason: "failed" };

  const r = render(receipt.mail);
  await resend(key, { from, to: [message.email], subject: receipt.subject, text: r.text, html: r.html });
  return { ok: true };
}
