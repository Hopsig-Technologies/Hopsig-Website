// Server-rendered frames for the animated figures (CLAUDE.md "Animations"):
//
//   node scripts/anim_static.mjs        # writes web/public/anim/<id>.static.svg (+ .static.png for canvas scenes)
//
// Each scene runs on the real engine in Playwright, is seeked to its `resolved` frame (state scenes stay at their
// initial state), and its <svg> is saved. <HeroAnim> inlines that SVG inside the figure's frame: it is what shows
// before the scene loads, with JS off, and (for loop and scrub scenes) under prefers-reduced-motion.
// A scene that draws on a canvas under its SVG (the IoT estate) also gets a PNG of that canvas, referenced from the
// SVG as an <image>. The output is deterministic and committed; CI regenerates it and fails on a diff.
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { ROOT, scenePage, sceneIds } from "./anim_page.mjs";

const OUT = resolve(ROOT, "web", "public", "anim");
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: 1 });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

for (const id of sceneIds()) {
  await page.setContent(scenePage(id));
  const { svg, png } = await page.evaluate((id) => {
    const s = window.__scene;
    if (s.mode !== "state") window.HA.seek(s.resolved != null ? s.resolved : s.loop * 0.8, id);
    const svg = document.querySelector(".frame svg");
    const canvas = document.querySelector(".frame .ha-canvas");
    return { svg: svg.outerHTML, png: canvas ? canvas.toDataURL("image/png") : null };
  }, id);
  let out = svg;
  if (png) {
    writeFileSync(resolve(OUT, `${id}.static.png`), Buffer.from(png.split(",")[1], "base64"));
    // The canvas sits under the SVG; in the static frame it becomes the SVG's first layer.
    out = out.replace(/(<svg[^>]*>)/, `$1<image href="/anim/${id}.static.png" x="0" y="0" width="1200" height="560"/>`);
  }
  writeFileSync(resolve(OUT, `${id}.static.svg`), out + "\n");
  console.log(`${id.padEnd(24)} ${(out.length / 1024).toFixed(1)} KB${png ? " + png" : ""}`);
}
await browser.close();
if (errors.length) {
  console.error(`\n${errors.length} page error(s):\n${errors.join("\n")}`);
  process.exit(1);
}
