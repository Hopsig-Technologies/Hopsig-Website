// Shared by anim_static.mjs and anim_test.mjs: a standalone page that runs one scene on the real engine
// (web/components/anim), the way docs/anim/test_scene.py did for the prototype.
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export const ROOT = resolve(import.meta.dirname, "..");
export const ANIM = resolve(ROOT, "web", "components", "anim");

/** Every scene id (one file per scene in web/components/anim/scenes). */
export const sceneIds = () =>
  readdirSync(resolve(ANIM, "scenes"))
    .filter((f) => f.endsWith(".js"))
    .map((f) => f.slice(0, -3))
    .sort();

// The engine is an ES module in the site (`export default HA`); here it runs as a classic script, like the prototype.
const engine = () => readFileSync(resolve(ANIM, "engine.js"), "utf8").replace(/^export default HA;\s*$/m, "");

/** HTML for one scene at its artboard size: the figure markup the site renders, unstarted (no clock). */
export function scenePage(id) {
  const scene = readFileSync(resolve(ANIM, "scenes", `${id}.js`), "utf8");
  return `<!doctype html><html><head><meta charset="utf-8">
<style>
  body { margin: 0; background: #0E1116; }
  .anim { margin: 0; width: 1200px; position: relative; }
  .anim .frame { position: relative; overflow: hidden; background: #0E1116; }
  .anim svg { display: block; width: 100%; height: 100%; position: relative; z-index: 1; }
  .anim .ha-canvas { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; }
  .ha-btns { position: absolute; inset: 0; pointer-events: none; z-index: 2; }
  .ha-btns button { pointer-events: auto; position: absolute; }
</style></head><body>
<figure class="anim" id="fig-${id}" data-scene="${id}"><div class="frame"></div><figcaption id="fig-${id}-cap"></figcaption></figure>
<script>${engine()}</script>
<script>${scene}</script>
<script>
  (function () {
    var S = HA.scenes[${JSON.stringify(id)}];
    document.querySelector('.frame').style.aspectRatio = (S.w || 1200) + ' / ' + (S.h || 560);
    window.__inst = HA.mount(document.querySelector('figure'));
    window.__scene = { loop: S.loop || 10000, resolved: S.resolved, mode: S.mode || 'loop', w: S.w || 1200, h: S.h || 560 };
  })();
</script>
</body></html>`;
}
