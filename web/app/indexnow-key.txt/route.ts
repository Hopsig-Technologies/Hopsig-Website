/**
 * IndexNow (Bing, Yandex, Seznam …; Bing feeds ChatGPT search and Copilot): proof that we own the site. The key is
 * the INDEXNOW_KEY environment variable; `scripts/indexnow.mjs` submits the sitemap's URLs with this file as the
 * key location. Without the variable this is a 404.
 */
export async function GET() {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return new Response("Not found", { status: 404 });
  return new Response(key, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
