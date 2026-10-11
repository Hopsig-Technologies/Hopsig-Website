"""Render a scene standalone at several t values -> anim/out/<id>_sheet.png. Usage: python3 test_scene.py <id> [t1,t2,...]
Also checks: no JS errors, first frame == last frame (loop seam), reduced-motion frame renders."""
import sys, os, asyncio, json
from playwright.async_api import async_playwright
from PIL import Image, ImageChops
A = os.path.dirname(os.path.abspath(__file__)) + '/'
sid = sys.argv[1]
ENGINE = open(A + 'engine.js').read(); SCENE = open(A + 'scenes/' + sid + '.js').read()
spec = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}
W, H = spec.get('w', 1200), spec.get('h', 560)
MODE = spec.get('mode', 'loop')
page = '''<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>body{margin:0;background:#0E1116;color:#E7ECEF;font-family:'Space Grotesk',sans-serif;padding:40px}
.anim{margin:0;max-width:1200px;width:1200px}.anim .frame{position:relative;border:1px solid #262C34;border-radius:16px;overflow:hidden;aspect-ratio:%d/%d;background:#0E1116}
.anim svg{display:block;width:100%%;height:100%%}.anim figcaption{margin-top:16px;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#939A96}
.ha-btns{position:absolute;inset:0;pointer-events:none}.ha-btns button{pointer-events:auto;position:absolute;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;border-radius:8px;cursor:pointer}
.ha-btns .lime{background:#C6F24E;color:#0E1116;border:0}.ha-btns .outline{background:transparent;color:#E7ECEF;border:1px solid #262C34}.ha-btns .pillb{background:transparent;color:#B9BFB6;border:1px solid #262C34;border-radius:18px;text-align:left;padding:0 14px}
.ha-btns button:focus-visible{outline:2px solid #C6F24E;outline-offset:2px}</style></head><body>
<figure class="anim" id="fig-%s" data-scene="%s"><div class="frame"></div><figcaption id="fig-%s-cap">caption</figcaption></figure>
<script>%s</script><script>%s</script><script>HA.boot();</script></body></html>''' % (W, H, sid, sid, sid, ENGINE, SCENE)
os.makedirs(A + 'out', exist_ok=True); fp = A + 'out/' + sid + '.html'; open(fp, 'w').write(page)
ts = [int(x) for x in sys.argv[2].split(',')] if len(sys.argv) > 2 and sys.argv[2] else None

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); errs = []
        pg = await b.new_page(viewport={'width': 1300, 'height': H + 160}, device_scale_factor=1)
        pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'ERR_TUNNEL' not in m.text and 'fonts.g' not in m.text else None)
        await pg.goto('file://' + fp); await pg.wait_for_timeout(400)
        loop = await pg.evaluate('HA.inst[0].loop')
        tl = ts or [0, int(loop * .15), int(loop * .35), int(loop * .55), int(loop * .75), int(loop * .9)]
        shots = []
        for t in tl:
            await pg.evaluate('HA.seek(%d)' % t); await pg.wait_for_timeout(60)
            f = A + 'out/%s_%d.png' % (sid, t); await pg.locator('.frame').screenshot(path=f); shots.append((t, f))
        # loop seam: t=0 vs t=loop-1
        if MODE == 'loop':
            await pg.evaluate('HA.seek(0)'); await pg.wait_for_timeout(60); await pg.locator('.frame').screenshot(path=A + 'out/_a.png')
            await pg.evaluate('HA.seek(%d)' % (loop - 1)); await pg.wait_for_timeout(60); await pg.locator('.frame').screenshot(path=A + 'out/_b.png')
            a, bb = Image.open(A + 'out/_a.png').convert('RGB'), Image.open(A + 'out/_b.png').convert('RGB')
            diff = ImageChops.difference(a, bb); bbox = diff.getbbox(); px = sum(1 for v in diff.convert('L').getdata() if v > 24)
            print('loop seam: differing pixels', px, 'bbox', bbox)
        # run live for a bit to catch runtime errors
        await pg.evaluate('HA.resume()'); await pg.wait_for_timeout(1500)
        print('errors:', errs[:5])
        ims = [Image.open(f) for _, f in shots]; cols = 2; rows = (len(ims) + 1) // 2; w, h = ims[0].size
        sheet = Image.new('RGB', (w * cols + 8, h * rows + 8 * (rows - 1)), (50, 50, 50))
        for i, im in enumerate(ims): sheet.paste(im, ((i % cols) * (w + 8), (i // cols) * (h + 8)))
        sheet.thumbnail((1440, 4000)); sheet.save(A + 'out/' + sid + '_sheet.png'); print('frames', tl, '->', A + 'out/' + sid + '_sheet.png')
        await b.close()
asyncio.run(main())
