import "server-only";
import { client } from "@/sanity/lib/client";

/** What /book and /brief send. Nothing is stored: it is emailed to Site settings → Form recipients. */
export type ContactMessage =
  | { kind: "brief"; name: string; email: string; company: string; problem: string; when: string; budget: string; link: string }
  | { kind: "booking"; name: string; email: string; company: string; problem: string; slot: string; start: string; timeZone: string };

export type SendResult = { ok: true } | { ok: false; reason: "not-configured" | "failed" };

const or = (v: string) => v || "—";

/** The UTC time of a booking request, for whoever confirms it (the visitor picked it in their own time zone). */
function utc(start: string) {
  const d = new Date(start);
  return Number.isNaN(d.getTime()) ? "" : `${d.toISOString().slice(0, 16).replace("T", " ")} UTC`;
}

function compose(message: ContactMessage) {
  const who = `${message.name || message.email}${message.company ? ` (${message.company})` : ""}`;
  if (message.kind === "booking") {
    return {
      subject: `Consult request from ${who}`,
      lines: [
        `Requested slot: ${or(message.slot)}`,
        `Visitor's time zone: ${or(message.timeZone)}`,
        `Same moment in UTC: ${or(utc(message.start))}`,
        "",
        `Name: ${or(message.name)}`,
        `Email: ${message.email}`,
        `Company · team size: ${or(message.company)}`,
        "",
        "The problem:",
        message.problem,
        "",
        "Not booked yet: the visitor was told a calendar invite follows within one working day.",
      ],
    };
  }
  return {
    subject: `Brief from ${who}`,
    lines: [
      `Name: ${or(message.name)}`,
      `Email: ${message.email}`,
      `Company · team size: ${or(message.company)}`,
      `When it needs to exist: ${or(message.when)}`,
      `Rough budget: ${or(message.budget)}`,
      `Link: ${or(message.link)}`,
      "",
      "The problem:",
      message.problem,
    ],
  };
}

/**
 * Email a consult request (/book) or a brief (/brief) to every address in Site settings → Form recipients, through
 * Resend. Secrets come from the environment only: RESEND_API_KEY (server-only) and CONTACT_FROM (a sender on the
 * domain verified in Resend). Missing either, or no recipient set, reports `not-configured` and the form shows its
 * fallback line.
 */
export async function sendContact(message: ContactMessage): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;
  if (!key || !from) return { ok: false, reason: "not-configured" };

  const recipients = await client
    .withConfig({ useCdn: false })
    .fetch<string[] | null>(`*[_type == "siteSettings" && _id == "siteSettings"][0].contactRecipients`);
  const to = (recipients ?? []).map((r) => r.trim()).filter(Boolean);
  if (!to.length) return { ok: false, reason: "not-configured" };

  const { subject, lines } = compose(message);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, reply_to: message.email, subject, text: lines.join("\n") }),
  });
  if (!res.ok) {
    console.error("contact: Resend refused the email", res.status, (await res.text()).slice(0, 300));
    return { ok: false, reason: "failed" };
  }
  return { ok: true };
}
