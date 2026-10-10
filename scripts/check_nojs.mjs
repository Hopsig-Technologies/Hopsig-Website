// Rule 10: every page is readable with JavaScript off. Loads each route of a running build with JS disabled and
// checks that <main> has height and sits between the header and the footer.
//
//   node scripts/check_nojs.mjs [http://localhost:3100]
//
// Run it against a production build (`pnpm build && pnpm start`): the dev server streams differently.
import { chromium } from "playwright";

const base = process.argv[2] || "http://localhost:3100";
const routes = [
  "/", "/approach", "/working-with-us", "/services", "/services/custom-software", "/services/ai-machine-learning",
  "/industries", "/industries/fintech-payments", "/work", "/work/payments-platform", "/notes",
  "/notes/the-sow-is-the-pitch", "/join", "/rates", "/why-not-just-hire", "/book", "/brief", "/ai-transformation",
  "/agentic-flow", "/for-agencies", "/privacy", "/terms", "/does-not-exist",
];

const browser = await chromium.launch();
const page = await (await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } })).newPage();
let failures = 0;
for (const route of routes) {
  await page.goto(base + route);
  const r = await page.evaluate(() => {
    const [h, m, f] = ["header", "main", "footer"].map((s) => document.querySelector(s)?.getBoundingClientRect());
    if (!h || !m || !f) return { ok: false, why: "header, main or footer missing" };
    if (m.height < 200) return { ok: false, why: `main is ${Math.round(m.height)}px tall` };
    if (!(h.top <= m.top && m.bottom <= f.top + 1)) return { ok: false, why: "main is not between header and footer" };
    return { ok: true, why: `main ${Math.round(m.height)}px` };
  });
  if (!r.ok) failures++;
  console.log(`${r.ok ? "ok  " : "FAIL"}  ${route.padEnd(34)} ${r.why}`);
}
await browser.close();
console.log(`\n${failures} failure(s)`);
process.exit(failures ? 1 : 0);
