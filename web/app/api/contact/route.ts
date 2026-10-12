import { sendContact, type ContactMessage, type Slot } from "@/lib/contact";
import { verifyCaptcha } from "@/lib/recaptcha";

const MAX = 5000;
const str = (v: unknown, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** The picked slots (a JSON list of {start, end}): at most 45, well-formed, short, and not in the past. */
function slotsFrom(v: unknown): Slot[] {
  let list: unknown;
  try {
    list = JSON.parse(str(v, 4000) || "[]");
  } catch {
    return [];
  }
  if (!Array.isArray(list)) return [];
  const now = Date.now();
  return list
    .slice(0, 45)
    .map((w) => ({ start: str((w as Slot)?.start, 40), end: str((w as Slot)?.end, 40) }))
    .filter((w) => {
      const a = Date.parse(w.start), b = Date.parse(w.end);
      return a > now && b > a && b - a <= 2 * 3600e3;
    });
}

/**
 * POST from the /book calendar and the /brief form. 400 on bad input or a failed captcha, 503 while email is not
 * set up (no key, sender or recipients).
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return Response.json({ error: "bad-request" }, { status: 400 });
  // Honeypot: a field people never see. A bot that fills it gets a quiet success.
  if (str(body.website)) return Response.json({ ok: true });

  const kind = body.kind === "booking" ? "booking" : "brief";
  if (!(await verifyCaptcha(str(body.token, 4000), kind))) return Response.json({ error: "captcha" }, { status: 400 });

  const email = str(body.email);
  const problem = str(body.problem, MAX);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !problem) return Response.json({ error: "invalid" }, { status: 400 });

  const common = { name: str(body.name), email, company: str(body.company), problem, about: str(body.about, 200) };
  const message: ContactMessage =
    kind === "booking"
      ? { kind, ...common, slots: slotsFrom(body.slots), timeZone: str(body.timeZone, 80) }
      : { kind, ...common, when: str(body.when), budget: str(body.budget), link: str(body.link, 1000) };

  const result = await sendContact(message);
  if (result.ok) return Response.json({ ok: true });
  return Response.json({ error: result.reason }, { status: result.reason === "not-configured" ? 503 : 502 });
}
