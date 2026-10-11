import "server-only";
import { client } from "@/sanity/lib/client";

/** What /book and /brief send. Nothing is stored: it is emailed to Site settings → briefRecipient. */
export type ContactMessage =
  | { kind: "brief"; name: string; email: string; company: string; problem: string; when: string; budget: string; link: string }
  | { kind: "booking"; name: string; email: string; company: string; problem: string; slot: string };

export type SendResult = { ok: true } | { ok: false; reason: "not-configured" | "failed" };

/**
 * Email a brief to the brief recipient (Site settings) through Resend. Secrets come from the environment only:
 * RESEND_API_KEY (server-only) and CONTACT_FROM (a sender on the domain verified in Resend). Missing either, or no
 * recipient set, reports `not-configured` and the form shows its fallback line.
 *
 * Booking requests are not emailed: /book confirms "Booked … invite sent", which only a booking tool can make true,
 * so they wait for the Cal.com link (Site settings → Booking link).
 */
export async function sendContact(message: ContactMessage): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;
  if (message.kind !== "brief" || !key || !from) return { ok: false, reason: "not-configured" };

  const to = await client
    .withConfig({ useCdn: false })
    .fetch<string | null>(`*[_type == "siteSettings" && _id == "siteSettings"][0].briefRecipient`);
  if (!to) return { ok: false, reason: "not-configured" };

  const lines = [
    `Name: ${message.name || "—"}`,
    `Email: ${message.email}`,
    `Company · team size: ${message.company || "—"}`,
    `When it needs to exist: ${message.when || "—"}`,
    `Rough budget: ${message.budget || "—"}`,
    `Link: ${message.link || "—"}`,
    "",
    "The problem:",
    message.problem,
  ];
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: message.email,
      subject: `Brief from ${message.name || message.email}${message.company ? ` (${message.company})` : ""}`,
      text: lines.join("\n"),
    }),
  });
  if (!res.ok) {
    console.error("contact: Resend refused the email", res.status, (await res.text()).slice(0, 300));
    return { ok: false, reason: "failed" };
  }
  return { ok: true };
}
