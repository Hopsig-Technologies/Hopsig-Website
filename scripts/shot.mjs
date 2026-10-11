// Screenshot a built route and its reference page at the same width, element by element, and pixel-diff them.
//
//   node scripts/shot.mjs --name approach-closing \
//     --ref reference/site/approach.html --ref-sel "section.close" \
//     --url http://localhost:3000/approach --web-sel "section.close" [--width 1440] [--hover ".hdr .dd:nth-of-type(1)"]
//     [--eval "HA.seek(8000)"]   # freeze animated figures at the same frame on both pages
//     [--no-header]     # hide the sticky header (element shots further down a long page)
//     [--clip-height 520]   # extend the element screenshot downwards (open dropdowns overflow the header)
//
// Writes audit/shots/<name>.{ref,web,diff}.png and prints the share of differing pixels. Canvases are hidden and
// reveal/entrance animations frozen on both sides, so the diff is about layout, type and colour only.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith("--") ? [...acc, [a.slice(2), all[i + 1]]] : acc), []),
);
const width = Number(args.width || 1440);
const out = resolve("audit/shots");
mkdirSync(out, { recursive: true });

const FREEZE = `
  canvas { visibility: hidden !important; }
  .rv, .js .rv { opacity: 1 !important; transform: none !important; transition: none !important; }
  .pg { animation: none !important; }
  .consent { display: none !important; }
  body { grid-template-rows: 1fr !important; transition: none !important; }
  *, *::before, *::after { transition-duration: 0s !important; animation-duration: 0s !important; caret-color: transparent !important; }
`;

async function grab(browser, url, selector, file, hover) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(800); // dev servers keep a connection open, so "networkidle" never arrives
  // --no-header: hide the sticky header, which otherwise lands over element shots taken mid-page.
  await page.addStyleTag({ content: FREEZE + ("no-header" in args ? "#hdr { visibility: hidden !important; }" : "") });
  await page.evaluate(() => document.fonts.ready);
  const el = page.locator(selector).first();
  await el.scrollIntoViewIfNeeded();
  if (hover) {
    await page.locator(hover).first().hover();
    await page.waitForTimeout(400);
  }
  // --eval "<js>": run on both pages once the element is in view, e.g. "HA.seek(8000)" to freeze an animated
  // figure at the same frame (waits for the site's lazy-loaded scene to mount first).
  if (args.eval) {
    await page.waitForFunction(() => window.HA && window.HA.inst && window.HA.inst.length > 0, null, { timeout: 15000 });
    await page.evaluate(args.eval);
    await page.waitForTimeout(150);
  }
  await page.waitForTimeout(150);
  if (args["clip-height"]) {
    const box = await el.boundingBox();
    await page.screenshot({ path: file, clip: { x: box.x, y: box.y, width: box.width, height: Number(args["clip-height"]) } });
  } else {
    await el.screenshot({ path: file });
  }
  await page.close();
}

const browser = await chromium.launch();
const refFile = `${out}/${args.name}.ref.png`;
const webFile = `${out}/${args.name}.web.png`;
await grab(browser, pathToFileURL(resolve(args.ref)).href, args["ref-sel"], refFile, args.hover);
await grab(browser, args.url, args["web-sel"], webFile, args.hover);
await browser.close();

const a = PNG.sync.read(readFileSync(refFile));
const b = PNG.sync.read(readFileSync(webFile));
console.log(`ref ${a.width}×${a.height}  web ${b.width}×${b.height}`);
const w = Math.min(a.width, b.width);
const h = Math.min(a.height, b.height);
const crop = (img) => {
  const c = new PNG({ width: w, height: h });
  PNG.bitblt(img, c, 0, 0, w, h, 0, 0);
  return c;
};
const diff = new PNG({ width: w, height: h });
const n = pixelmatch(crop(a).data, crop(b).data, diff.data, w, h, { threshold: 0.1 });
writeFileSync(`${out}/${args.name}.diff.png`, PNG.sync.write(diff));
console.log(`${((100 * n) / (w * h)).toFixed(2)}% pixels differ (${n} of ${w * h})${a.width !== b.width || a.height !== b.height ? " — sizes differ, compared the overlap" : ""}`);
