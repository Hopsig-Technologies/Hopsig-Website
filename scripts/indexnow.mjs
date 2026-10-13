// IndexNow: tell Bing (and Yandex, Seznam, Naver …) that the site's pages changed, so they recrawl now instead
// of eventually. Bing's index also feeds ChatGPT search and Copilot. Submits every URL in the live sitemap.
//
//   INDEXNOW_KEY=<the same key as in Vercel> node scripts/indexnow.mjs [https://hopsig.com]
//
// The key must also be served at <site>/indexnow-key.txt (INDEXNOW_KEY in Vercel; app/indexnow-key.txt/route.ts).
const site = (process.argv[2] || "https://hopsig.com").replace(/\/$/, "");
const key = process.env.INDEXNOW_KEY;
if (!key) {
  console.error("Set INDEXNOW_KEY (the same value as in Vercel).");
  process.exit(1);
}
const served = await fetch(`${site}/indexnow-key.txt`).then((r) => (r.ok ? r.text() : ""));
if (served.trim() !== key) {
  console.error(`${site}/indexnow-key.txt does not serve this key yet (deploy with INDEXNOW_KEY set first).`);
  process.exit(1);
}
const xml = await fetch(`${site}/sitemap.xml`).then((r) => r.text());
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(site).host, key, keyLocation: `${site}/indexnow-key.txt`, urlList }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urlList.length} URLs`);
process.exit(res.ok ? 0 : 1);
