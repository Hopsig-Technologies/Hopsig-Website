// Mobile gate (round M): every route at 360 and 390 wide, as a phone (touch, mobile viewport).
//
//   node scripts/check_mobile.mjs [http://localhost:3100] [--route /x] [--width 390] [--verbose]
//
// Fails a route when
//   - the page is wider than the screen (sideways scroll);
//   - visible text sits closer than 16px to a screen edge (the 20px gutter is lost), unless it is inside something
//     that scrolls or clips sideways (the comparison table, the marquee);
//   - a link, button or field is under 44px tall (inline links inside running text are exempt), or is focusable
//     with no size at all;
//   - a text field is under 16px (iOS zooms the page on focus);
//   - text is under 11px outside an animation artboard.
// Run it against a production build (`pnpm build && pnpm start -p 3100`).
import { chromium } from "playwright";
import fs from "node:fs";

const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith("http")) || "http://localhost:3100";
const opt = (k) => (args.includes(k) ? args[args.indexOf(k) + 1] : null);
const verbose = args.includes("--verbose");
const dump = opt("--json"); // write every finding, for working through them
const all = [];
const routes = opt("--route")
  ? [opt("--route")]
  : JSON.parse(fs.readFileSync(new URL("../content/routes.json", import.meta.url), "utf8"))
      .map((r) => r.route)
      .filter((r) => r !== "/rates" && r !== "/404");
const widths = opt("--width") ? [+opt("--width")] : [360, 390];

const browser = await chromium.launch();
let failures = 0;
for (const width of widths) {
  const ctx = await browser.newContext({ viewport: { width, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: "load", timeout: 120000 });
    await page.addStyleTag({
      content: "*,*::before,*::after{transition:none!important;animation:none!important} .rv{opacity:1!important;transform:none!important} .consent,nextjs-portal{display:none!important}",
    });
    await page.waitForTimeout(500);
    const r = await page.evaluate((vw) => {
      // The device width, not innerWidth: on a phone a too-wide page zooms out and innerWidth grows to match it.
      const problems = [];
      const name = (el) => `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}${typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : ""}`;
      const shown = (el) => el.checkVisibility({ checkOpacity: false, checkVisibilityCSS: true }) && !el.closest("[aria-hidden='true'], .anim .frame");
      // Exempt only what is meant to scroll sideways (the comparison table) or run past the edge (the marquee).
      // Text cut off by an `overflow: hidden` box is a fault, not an exemption.
      const clipsSideways = (el) => {
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
          const ox = getComputedStyle(p).overflowX;
          if ((ox === "auto" || ox === "scroll") && p.scrollWidth > p.clientWidth + 1) return true;
          if (p.matches(".mq")) return true;
        }
        return false;
      };
      const ownText = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());

      // The page scrolls sideways when anything reaches past the screen (an overflow-x on html/body would hide the
      // scrollbar but not the problem, so measure the content too).
      const sw = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
      if (sw > vw) problems.push(`page is ${sw}px wide`);

      const scope = document.querySelectorAll("header *, main *, footer *");
      const edge = [], small = [], tiny = [], zero = [], field = [];
      for (const el of scope) {
        if (!shown(el)) continue;
        const rc = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        if (ownText(el) && rc.width > 0 && !el.closest(".anim")) {
          // Measure the text itself, not its box (a full-width block with padding is fine).
          const range = document.createRange();
          range.selectNodeContents(el);
          const tr = [...range.getClientRects()].filter((q) => q.width > 0);
          const left = Math.min(...tr.map((q) => q.left)), right = Math.max(...tr.map((q) => q.right));
          const ellipsis = cs.textOverflow === "ellipsis" && cs.overflowX !== "visible"; // cut on purpose, with a mark
          if (tr.length && (left < 16 || right > vw - 16) && !ellipsis && !clipsSideways(el)) edge.push(`${name(el)} [${Math.round(left)}–${Math.round(right)}]`);
          // The wordmark is a logotype, and the engagement panel is a drawn mock UI like the artboards.
          if (parseFloat(cs.fontSize) < 11 && !el.closest(".wm, .ep, .hdr-wm, .foot-brand")) tiny.push(`${name(el)} ${cs.fontSize}`);
        }
        if (el.matches("a[href], button, input:not([type=hidden]), select, textarea, summary")) {
          if (rc.width === 0 || rc.height === 0) {
            if (el.tabIndex >= 0) zero.push(name(el));
            continue;
          }
          const inline = cs.display === "inline" && el.parentElement && [...el.parentElement.childNodes].some((n) => n !== el && n.textContent.trim());
          if (rc.height < 44 && !inline) small.push(`${name(el)} ${Math.round(rc.height)}px "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 24)}"`);
          if (el.matches("input, textarea, select") && parseFloat(cs.fontSize) < 16) field.push(`${name(el)} ${cs.fontSize}`);
        }
      }
      const add = (label, list) => list.length && problems.push(`${label} ×${list.length}: ${list.slice(0, 4).join(" | ")}`);
      window.__findings = { edge, small, zero, field, tiny };
      add("text at the screen edge", edge);
      add("tap target under 44px", small);
      add("focusable with no size", zero);
      add("field under 16px", field);
      add("text under 11px", tiny);
      return { problems, height: document.documentElement.scrollHeight, findings: window.__findings };
    }, width);
    all.push({ width, route, ...r.findings });
    const ok = r.problems.length === 0;
    if (!ok) failures++;
    console.log(`${ok ? "ok  " : "FAIL"}  ${width}  ${route.padEnd(48)} ${Math.round(r.height / 800)} screens`);
    if (!ok) for (const p of verbose ? r.problems : r.problems.slice(0, 5)) console.log(`        ${p}`);
  }
  await ctx.close();
}
await browser.close();
if (dump) fs.writeFileSync(dump, JSON.stringify(all, null, 1));
console.log(`\n${failures} failure(s)`);
process.exit(failures ? 1 : 0);
