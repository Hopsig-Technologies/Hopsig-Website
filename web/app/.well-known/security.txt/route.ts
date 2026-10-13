import { organization } from "@/content";
import { SITE_URL } from "@/lib/seo";

/** RFC 9116: where to report a security problem. Expires a year after each build, as the RFC asks. */
export async function GET() {
  const expires = new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().replace(/\.\d+Z$/, "Z");
  const body = [`Contact: mailto:${organization.email}`, `Expires: ${expires}`, `Preferred-Languages: en`, `Canonical: ${SITE_URL}/.well-known/security.txt`, ``].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
