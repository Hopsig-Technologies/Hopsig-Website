// The v2 animation audit (PROMPTS-v2 §8), against a production build:
//
//   pnpm --filter web build && pnpm --filter web start -p 3100
//   node scripts/anim_audit.mjs [http://localhost:3100]
//
// On every route with figures: no console errors; a playing figure stops when scrolled out and when the tab is
// hidden; the pause button toggles and relabels; with reduced motion, loop and scrub figures stay on their static
// frame (no engine loaded) while the interactive ones still work; frame rate with the CPU throttled ×4 compared with
// the prototype running the same scene (headless Chromium renders without a GPU, so absolute 60 fps cannot be
// measured here: this is a regression gate, real devices are checked by hand); below 768px the frames are hidden
// and the captions stay. Screenshots go to audit/v2/.
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:3100";
const OUT = resolve(import.meta.dirname, "..", "audit", "v2");
mkdirSync(OUT, { recursive: true });
const ROUTES = [
  "/", "/services/custom-software", "/services/team-augmentation", "/services/data-engineering",
  "/services/ai-machine-learning", "/services/cloud-devops", "/services/legacy-modernisation", "/services/mobile",
  "/services/qa-test-automation", "/industries/fintech-payments", "/industries/retail-ecommerce",
  "/industries/healthcare-life-sciences", "/industries/logistics-travel-marketplaces",
  "/industries/iot-signage-built-environment", "/industries/saas-platforms-ai-products", "/agentic-flow", "/ai-transformation",
];

let failures = 0;
const check = (ok, what) => {
  if (!ok) failures++;
  console.log(`${ok ? "ok  " : "FAIL"}  ${what}`);
};
const browser = await chromium.launch();
const tOf = (page, id) => page.evaluate((id) => window.HA.inst.find((i) => i.id === id)?.t, id);
const centre = (page, sel) => page.evaluate((s) => document.querySelector(s).scrollIntoView({ block: "center" }), sel);
const live = (page, id) => page.waitForFunction((id) => window.HA?.inst?.some((i) => i.id === id), id, { timeout: 15000 });

// 1. Every route: each figure mounts when scrolled to, with no console errors; a full-page screenshot.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  for (const route of ROUTES) {
    const errors = [];
    page.removeAllListeners("console");
    page.removeAllListeners("pageerror");
    // Sanity live updates only allow the site's own origins (CORS), not this audit's localhost:3100: not a page error.
    page.on("console", (m) => m.type() === "error" && !/data\/live\/events.*CORS|ERR_FAILED/.test(m.text()) && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(BASE + route);
    const ids = await page.$$eval("figure.anim", (fs) => fs.map((f) => f.dataset.scene));
    for (const id of ids) {
      await centre(page, `#fig-${id}`);
      await live(page, id).catch(() => errors.push(`${id} did not mount`));
    }
    await page.screenshot({ path: resolve(OUT, `page${route === "/" ? "-home" : route.replaceAll("/", "-")}.png`), fullPage: true });
    check(errors.length === 0, `${route}: ${ids.join(", ")} mounted, no console errors${errors.length ? " — " + errors[0] : ""}`);
  }
  await page.close();
}

// 2. Playback: off-screen and hidden-tab pauses; the pause button.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + "/services/qa-test-automation");
  await centre(page, "#fig-svc-qa");
  await live(page, "svc-qa");
  const a = await tOf(page, "svc-qa");
  await page.waitForTimeout(600);
  check((await tOf(page, "svc-qa")) !== a, "a visible loop figure plays");
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  const b = await tOf(page, "svc-qa");
  await page.waitForTimeout(800);
  check((await tOf(page, "svc-qa")) === b, "it stops when scrolled out of view");
  await centre(page, "#fig-svc-qa");
  await page.waitForTimeout(300);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  const c = await tOf(page, "svc-qa");
  await page.waitForTimeout(800);
  check((await tOf(page, "svc-qa")) === c, "it stops while the tab is hidden");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => false });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  const pause = page.locator("#fig-svc-qa .ha-pause");
  check((await pause.getAttribute("aria-label")) === "Pause animation", "pause button labelled 'Pause animation'");
  await pause.click();
  const d = await tOf(page, "svc-qa");
  await page.waitForTimeout(800);
  check((await tOf(page, "svc-qa")) === d && (await pause.getAttribute("aria-label")) === "Play animation", "pause stops it and relabels to 'Play animation'");
  await pause.click();
  await page.waitForTimeout(500);
  check((await tOf(page, "svc-qa")) !== d, "play resumes it");
  await page.close();
}

// 3. Reduced motion: static frames for loop and scrub; the interactive scenes still mount.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  for (const [route, id, shouldLoad] of [
    ["/services/custom-software", "svc-custom-software", false],
    ["/ai-transformation", "ai-transformation", false],
    ["/agentic-flow", "agentic-flow-sim", true],
  ]) {
    await page.goto(BASE + route);
    await centre(page, `#fig-${id}`);
    await page.waitForTimeout(1500);
    const st = await page.evaluate((id) => ({ engine: !!window.HA, live: !!window.HA?.inst?.some((i) => i.id === id), svg: !!document.querySelector(`#fig-${id} .frame svg`) }), id);
    check(st.svg && st.live === shouldLoad, `reduced motion ${route}: ${shouldLoad ? "interactive scene loads" : "static frame only, engine not loaded"} (${JSON.stringify(st)})`);
  }
  await page.screenshot({ path: resolve(OUT, "reduced-motion-agentic-flow.png") });
  await ctx.close();
}

// 4. Frame rate with the CPU throttled ×4, against the prototype running the same scene (the heaviest three).
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const cdp = await page.context().newCDPSession(page);
  const REF = (f) => pathToFileURL(resolve(import.meta.dirname, "..", "v2 handover", "reference", "site-v2", f)).href;
  const measure = async (url, id) => {
    await page.goto(url);
    await page.waitForTimeout(500);
    await centre(page, `#fig-${id}`);
    await live(page, id);
    await page.waitForTimeout(500);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    const fps = await page.evaluate(
      () =>
        new Promise((done) => {
          let n = 0;
          const t0 = performance.now();
          const step = (t) => (t - t0 < 3000 ? (n++, requestAnimationFrame(step)) : done((n * 1000) / (t - t0)));
          requestAnimationFrame(step);
        }),
    );
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
    return fps;
  };
  for (const [route, file, id] of [
    ["/", "index.html", "home-agentic"],
    ["/industries/iot-signage-built-environment", "industries/iot-signage-built-environment.html", "ind-iot"],
    ["/services/qa-test-automation", "services/qa-test-automation.html", "svc-qa"],
  ]) {
    // best of three each: software rendering is noisy (single runs swing by half)
    let ours = 0;
    let proto = 0;
    for (let k = 0; k < 3; k++) {
      ours = Math.max(ours, await measure(BASE + route, id));
      proto = Math.max(proto, await measure(REF(file), id));
    }
    check(ours >= proto * 0.8, `${id}: ${ours.toFixed(0)} fps vs the prototype's ${proto.toFixed(0)} fps (CPU ×4, no GPU)`);
  }
  await page.close();
}

// 5. Below 768px: the frames are hidden, the captions stay; nothing loads.
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE + "/industries/fintech-payments");
  await page.waitForTimeout(800);
  const st = await page.evaluate(() => {
    const f = document.querySelector("#fig-ind-fintech");
    return { frame: getComputedStyle(f.querySelector(".frame")).display, caption: getComputedStyle(f.querySelector("figcaption")).display, engine: !!window.HA, overflow: document.documentElement.scrollWidth > innerWidth };
  });
  check(st.frame === "none" && st.caption !== "none" && !st.engine && !st.overflow, `390px: frame hidden, caption shown, no engine, no sideways scroll (${JSON.stringify(st)})`);
  await page.screenshot({ path: resolve(OUT, "mobile-fintech.png"), fullPage: true });
  await page.close();
}

await browser.close();
console.log(`\n${failures} failure(s)`);
process.exit(failures ? 1 : 0);
