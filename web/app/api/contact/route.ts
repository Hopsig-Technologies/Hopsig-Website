import { sendContact, type ContactMessage } from "@/lib/contact";

const MAX = 5000;
const str = (v: unknown, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** POST from the /book calendar and the /brief form. 400 on bad input, 503 while no email provider is set up. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return Response.json({ error: "bad-request" }, { status: 400 });
  // Honeypot: a field people never see. A bot that fills it gets a quiet success.
  if (str(body.website)) return Response.json({ ok: true });

  const email = str(body.email);
  const problem = str(body.problem, MAX);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !problem) return Response.json({ error: "invalid" }, { status: 400 });

  const common = { name: str(body.name), email, company: str(body.company), problem };
  const message: ContactMessage =
    body.kind === "booking"
      ? { kind: "booking", ...common, slot: str(body.slot) }
      : { kind: "brief", ...common, when: str(body.when), budget: str(body.budget), link: str(body.link, 1000) };

  const result = await sendContact(message);
  if (result.ok) return Response.json({ ok: true });
  return Response.json({ error: result.reason }, { status: result.reason === "not-configured" ? 503 : 502 });
}
