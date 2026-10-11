import "server-only";

/**
 * Google reCAPTCHA v3 on the forms (owner decision 2026-10-11). The browser asks Google for a token when the form
 * is sent (components/ContactForms.tsx); this checks it with the secret key: it must be valid, for the same action,
 * and score at least RECAPTCHA_MIN_SCORE (default 0.5, from 0 = bot to 1 = person).
 *
 * Keys live only in the environment: NEXT_PUBLIC_RECAPTCHA_SITE_KEY (public by design) and RECAPTCHA_SECRET_KEY
 * (server). Without the secret the check is skipped, so a local build without keys still sends.
 */
export async function verifyCaptcha(token: string, action: "booking" | "brief"): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    if (process.env.VERCEL_ENV === "production") console.warn("contact: RECAPTCHA_SECRET_KEY is not set; forms are not protected");
    return true;
  }
  if (!token) return false;
  const min = Number(process.env.RECAPTCHA_MIN_SCORE ?? "0.5");
  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const r = (await res.json()) as { success?: boolean; action?: string; score?: number; "error-codes"?: string[] };
    const ok = !!r.success && r.action === action && (r.score ?? 0) >= min;
    if (!ok) console.warn("contact: captcha refused", { action: r.action, score: r.score, errors: r["error-codes"] });
    return ok;
  } catch (err) {
    console.error("contact: captcha check failed", err);
    return false;
  }
}
