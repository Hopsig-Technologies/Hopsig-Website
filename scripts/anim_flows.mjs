// The interactive figures, end to end on a running site (CLAUDE.md "Animations"):
//
//   node scripts/anim_flows.mjs [http://localhost:3000]
//
// 1. /agentic-flow simulator: Run → reject (with a reason) → approve → … → approve → Yes → shipped → run another,
//    once with the mouse and once with the keyboard only (Tab to each button, Enter), checking the 2px Lime focus ring.
// 2. /agentic-flow never wall: pressing a rule changes the figure.
// 3. /ai-transformation scroll scrub: scrolling to 45% of the section sets t ≈ 3150; the "W3" tick lands at t ≈ 3000.
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:3000";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
let failures = 0;
const check = (ok, what) => {
  if (!ok) failures++;
  console.log(`${ok ? "ok  " : "FAIL"}  ${what}`);
};

const sim = "#fig-agentic-flow-sim";
const visibleButton = (re) => page.locator(`${sim} .ha-btns button`).filter({ hasText: re }).filter({ visible: true }).first();

async function mountFlow() {
  await page.goto(`${BASE}/agentic-flow`);
  await page.locator(sim).scrollIntoViewIfNeeded();
  await page.waitForFunction(() => window.HA?.inst?.some((i) => i.id === "agentic-flow-sim"), null, { timeout: 15000 });
}

/** Press a button: with the mouse, or by tabbing to it from the top of the figure and pressing Enter. */
async function press(re, keyboard) {
  const b = visibleButton(re);
  await b.waitFor({ state: "visible", timeout: 15000 });
  if (!keyboard) return b.click();
  await page.evaluate((s) => document.querySelector(s).querySelector(".frame").setAttribute("tabindex", "-1"), sim);
  await page.focus(`${sim} .frame`);
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press("Tab");
    // the focused element itself (buttons hide and show as the story moves, so do not re-resolve a locator)
    const focused = await page.evaluate(() => {
      const a = document.activeElement;
      return a && a.closest(".ha-btns") ? { text: a.textContent, ring: getComputedStyle(a).outline } : null;
    });
    if (focused && re.test(focused.text)) {
      if (!/2px/.test(focused.ring) || !/198, 242, 78/.test(focused.ring)) check(false, `focus ring on "${focused.text}" is ${focused.ring}`);
      return page.keyboard.press("Enter");
    }
  }
  throw new Error(`could not Tab to a button matching ${re}`);
}

for (const keyboard of [false, true]) {
  const how = keyboard ? "keyboard" : "mouse";
  try {
    await mountFlow();
    await press(/^Run a story$/, keyboard);
    await press(/^Reject$/, keyboard);
    await visibleButton(/./).waitFor();
    // the three reason pills are the visible "pillb" buttons
    const pill = page.locator(`${sim} .ha-btns button.pillb`).filter({ visible: true }).first();
    await pill.waitFor({ state: "visible", timeout: 15000 });
    if (keyboard) await press(new RegExp("^" + (await pill.textContent()).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$"), true);
    else await pill.click();
    await press(/^Approve/, keyboard); // the revised plan
    await press(/^Approve/, keyboard); // the pull request
    await press(/^Yes$/, keyboard); // the escalation
    await visibleButton(/Run/).waitFor({ state: "visible", timeout: 15000 }); // shipped: "run another"
    check(true, `simulator full path with the ${how} (shipped; run button: "${await visibleButton(/Run/).textContent()}")`);
    await press(/Run/, keyboard);
    // a new run starts: the Run button goes away while the story moves
    await page.waitForTimeout(1500);
    check((await visibleButton(/Run/).count()) === 0, `simulator starts another run with the ${how}`);
  } catch (e) {
    check(false, `simulator path with the ${how}: ${e.message.split("\n")[0]}`);
  }
}

// Never wall: pressing a rule must change the figure.
{
  const wall = "#fig-agentic-never-wall";
  // centred: the engine only renders a figure while at least 35% of it is in view
  await page.evaluate((w) => document.querySelector(w).scrollIntoView({ block: "center" }), wall);
  await page.waitForFunction(() => window.HA?.inst?.some((i) => i.id === "agentic-never-wall"), null, { timeout: 15000 });
  await page.waitForTimeout(300);
  const before = await page.locator(`${wall} svg`).innerHTML();
  await page.locator(`${wall} .ha-btns button`).first().click();
  await page.waitForTimeout(600);
  const after = await page.locator(`${wall} svg`).innerHTML();
  check(before !== after, "never wall responds to a rule");
}

// Scroll scrub (V6): skipped until the section exists.
await page.goto(`${BASE}/ai-transformation`);
if (await page.locator(".scrub").count()) {
  await page.waitForTimeout(500);
  const range = await page.evaluate(() => {
    const sec = document.querySelector(".scrub");
    const stick = sec.querySelector(".stick");
    return { top: sec.getBoundingClientRect().top + scrollY, len: sec.offsetHeight - stick.offsetHeight };
  });
  await page.evaluate((y) => scrollTo(0, y), range.top);
  await page.waitForFunction(() => window.HA?.inst?.some((i) => i.id === "ai-transformation"), null, { timeout: 15000 });
  await page.evaluate((y) => scrollTo(0, y), range.top + range.len * 0.45);
  await page.waitForTimeout(400);
  const t45 = await page.evaluate(() => window.HA.inst.find((i) => i.id === "ai-transformation").scrubT);
  check(Math.abs(t45 - 3150) < 60, `scrub at 45%: t = ${Math.round(t45)} (expect ≈ 3150)`);
  await page.locator("#fig-ai-transformation .ha-btns button").filter({ hasText: /^W3$/ }).click();
  await page.waitForTimeout(1500);
  const t3 = await page.evaluate(() => window.HA.inst.find((i) => i.id === "ai-transformation").scrubT);
  check(Math.abs(t3 - 3000) < 60, `"W3" lands at t = ${Math.round(t3)} (expect ≈ 3000)`);
} else console.log("skip  /ai-transformation has no .scrub section yet");

check(errors.length === 0, `no console errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
await browser.close();
console.log(`\n${failures} failure(s)`);
process.exit(failures ? 1 : 0);
