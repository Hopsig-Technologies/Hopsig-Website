// The animation harness (port of docs/anim/test_scene.py), CLAUDE.md "Animations":
//
//   node scripts/anim_test.mjs [id …]        # default: every scene
//
// For each scene on the real engine: no page errors while seeking through the timeline; for loop scenes, the
// frame at t = loop − 1 equals the frame at t = 0 (≤ 10 differing pixels is anti-aliasing, more is a broken seam).
// Writes audit/v2/<id>.{start,mid,end}.png so a frame can be checked by eye.
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import pixelmatch from "pixelmatch";
import { chromium } from "playwright";
import { PNG } from "pngjs";
import { ROOT, scenePage, sceneIds } from "./anim_page.mjs";

const SEAM_MAX = 10;
const OUT = resolve(ROOT, "audit", "v2");
mkdirSync(OUT, { recursive: true });
const ids = process.argv.slice(2).length ? process.argv.slice(2) : sceneIds();

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: 1 });
let errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

const shot = async (t, id) => {
  await page.evaluate(([t, id]) => window.HA.seek(t, id), [t, id]);
  return PNG.sync.read(await page.locator(".frame").screenshot());
};

let failures = 0;
for (const id of ids) {
  errors = [];
  await page.setContent(scenePage(id));
  const s = await page.evaluate(() => window.__scene);
  // Walk the timeline in 250 ms steps: every seek must render without throwing.
  for (let t = 0; t <= s.loop; t += 250) await page.evaluate(([t, id]) => window.HA.seek(t, id), [t, id]);
  const start = await shot(0, id);
  const mid = await shot(s.resolved ?? Math.round(s.loop / 2), id);
  const end = await shot(s.loop - 1, id);
  writeFileSync(resolve(OUT, `${id}.start.png`), PNG.sync.write(start));
  writeFileSync(resolve(OUT, `${id}.mid.png`), PNG.sync.write(mid));
  writeFileSync(resolve(OUT, `${id}.end.png`), PNG.sync.write(end));
  let seam = "n/a";
  let ok = errors.length === 0;
  if (s.mode === "loop") {
    seam = pixelmatch(start.data, end.data, null, start.width, start.height, { threshold: 0.1 });
    ok = ok && seam <= SEAM_MAX;
  }
  if (!ok) failures++;
  console.log(`${ok ? "ok  " : "FAIL"}  ${id.padEnd(24)} ${s.mode.padEnd(6)} seam ${String(seam).padStart(4)} px  errors ${errors.length}${errors.length ? ": " + errors[0] : ""}`);
}
await browser.close();
console.log(`\n${failures} failure(s)`);
process.exit(failures ? 1 : 0);
