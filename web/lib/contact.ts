import "server-only";

/** What /book and /brief send. Nothing is stored: it is emailed to Site settings → briefRecipient. */
export type ContactMessage =
  | { kind: "brief"; name: string; email: string; company: string; problem: string; when: string; budget: string; link: string }
  | { kind: "booking"; name: string; email: string; company: string; problem: string; slot: string };

export type SendResult = { ok: true } | { ok: false; reason: "not-configured" | "failed" };

/**
 * Deliver a message to the brief recipient. No email provider is chosen yet (CLAUDE.md "Open questions"), so
 * this reports `not-configured` and the forms show the "email us instead" line. When one is chosen: read the
 * recipient (`*[_id == "siteSettings"][0].briefRecipient`, server-side only), send with the provider's API using
 * a secret from the environment, and return `{ ok: true }`.
 */
export async function sendContact(message: ContactMessage): Promise<SendResult> {
  void message;
  return { ok: false, reason: "not-configured" };
}
