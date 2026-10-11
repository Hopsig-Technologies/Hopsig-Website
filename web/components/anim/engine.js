// Hopsig website port (web/components/anim/engine.js). Copied from `v2 handover/anim/engine.js`; the scenes in
// ./scenes are byte-identical to the handover. The only edits, all at the end of this file or marked "port:":
//   - the IntersectionObserver is kept on the instance (inst.io) so HA.unmount can disconnect it;
//   - HA.unmount(fig): forget a figure when React unmounts it (client-side navigation);
//   - HA.start(): start the one rAF clock and the visibilitychange reset once (HA.boot without the DOM scan);
//   - export default HA (ES module; the scenes still reach it through the window.HA global the engine sets).
// ---------- HA: Hopsig animation engine (shared by every scene) ----------
// One rAF clock drives every <figure class="anim" data-scene="id"> on the page.
// A scene is { loop, seed, resolved, w, h, mode, build(S) -> update(t) }.
//   loop     ms per loop (loop scenes), or total timeline (scrub scenes)
//   resolved the t used as the reduced-motion / server frame
//   mode     'loop' (default) | 'scrub' (t = scroll progress x loop) | 'state' (scene owns time; update(dt) gets elapsed ms)
// Every element's state is a pure function of t. Transform and opacity only, except where a spec says otherwise.
var HA = window.HA = { scenes: {}, inst: [], debug: /anim-debug=1/.test(location.search) };
HA.T = { bg: '#0E1116', raised: '#12161C', log: '#0A0C0F', line: '#262C34', hair: '#1C222B', ink: '#E7ECEF', dim: '#939A96', faint: '#545A60',
         lime: '#C6F24E', amber: '#D9A441', red: '#E06A55', paper: '#F7F8F4', pink: '#0E1116', sheetline: '#D9D9D2' };
HA.NS = 'http://www.w3.org/2000/svg';
HA.MONO = "'IBM Plex Mono', monospace"; HA.SANS = "'Space Grotesk', sans-serif";

// ---- math
HA.clamp = function (x, a, b) { return x < a ? a : x > b ? b : x; };
HA.lerp = function (a, b, p) { return a + (b - a) * p; };
HA.ease = {
  linear: function (x) { return x; },
  outQuart: function (x) { return 1 - Math.pow(1 - x, 4); },
  inOutCubic: function (x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; },
  // spring: stiffness 380, damping 30, mass 1; evaluated over 0.5 s and normalised so snap(1) = 1
  snap: function (x) { var w0 = Math.sqrt(380), z = 30 / (2 * w0), wd = w0 * Math.sqrt(1 - z * z), t = x * .5; var v = 1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + (z * w0 / wd) * Math.sin(wd * t)); return x >= 1 ? 1 : v; }
};
// progress of t through [a, b], eased (default outQuart)
HA.seg = function (t, a, b, e) { var p = HA.clamp((t - a) / (b - a), 0, 1); return (e || HA.ease.outQuart)(p); };
HA.between = function (t, a, b) { return t >= a && t < b; };
// pulse: 0 -> 1 -> 0 over [a, b]
HA.pulse = function (t, a, b) { var p = HA.clamp((t - a) / (b - a), 0, 1); return Math.sin(p * Math.PI); };
HA.rng = function (seed) { var a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
HA.hex = function (c) { if (c.charAt(0) !== '#') { var m = c.match(/[\d.]+/g); return [+m[0], +m[1], +m[2]]; } c = c.replace('#', ''); return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]; };
HA.mix = function (c1, c2, p) { if (p <= 0) return c1; if (p >= 1) return c2; var a = HA.hex(c1), b = HA.hex(c2); return 'rgb(' + Math.round(a[0] + (b[0] - a[0]) * p) + ',' + Math.round(a[1] + (b[1] - a[1]) * p) + ',' + Math.round(a[2] + (b[2] - a[2]) * p) + ')'; };
HA.fmt = function (n, o) { o = o || {}; var d = o.dec || 0; var s = (Math.round(n * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d); if (o.comma !== false) { var parts = s.split('.'); parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); s = parts.join('.'); } return (o.prefix || '') + s + (o.suffix || ''); };
// characters typed so far at cps characters per second from t0
HA.typed = function (str, t, t0, cps) { var n = Math.floor(Math.max(0, t - t0) * (cps || 40) / 1000); return str.slice(0, Math.min(str.length, n)); };
// point along an SVG path at fraction p (0..1)
HA.at = function (path, p) { var L = path.getTotalLength(); return path.getPointAtLength(HA.clamp(p, 0, 1) * L); };

// ---- SVG helpers
HA.el = function (tag, attrs, parent) { var e = document.createElementNS(HA.NS, tag); if (attrs) for (var k in attrs) if (attrs[k] !== undefined && attrs[k] !== null) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
HA.set = function (e, attrs) { for (var k in attrs) if (attrs[k] !== undefined && attrs[k] !== null) e.setAttribute(k, attrs[k]); return e; };
HA.g = function (parent, attrs) { return HA.el('g', attrs || {}, parent); };
HA.STYLE = {
  num: { 'font-family': HA.SANS, 'font-size': 56, 'font-weight': 600, 'letter-spacing': '-0.03em', 'font-variant-numeric': 'tabular-nums' },
  title: { 'font-family': HA.SANS, 'font-size': 22, 'font-weight': 500, 'letter-spacing': '-0.02em' },
  label: { 'font-family': HA.SANS, 'font-size': 15, 'font-weight': 500 },
  micro: { 'font-family': HA.MONO, 'font-size': 11, 'font-weight': 500, 'letter-spacing': '0.12em', 'text-transform': 'uppercase' },
  terminal: { 'font-family': HA.MONO, 'font-size': 13, 'font-weight': 400 },
  mono12: { 'font-family': HA.MONO, 'font-size': 12, 'font-weight': 400 },
  mono11: { 'font-family': HA.MONO, 'font-size': 11, 'font-weight': 400 },
  sans12: { 'font-family': HA.SANS, 'font-size': 12, 'font-weight': 500 },
  sans13: { 'font-family': HA.SANS, 'font-size': 13, 'font-weight': 500 }
};
// text(parent, x, y, string, styleName, fill, extraAttrs) -> <text>; micro style uppercases the string
HA.text = function (parent, x, y, str, style, fill, extra) {
  var st = HA.STYLE[style || 'label']; var a = { x: x, y: y, fill: fill || HA.T.ink };
  for (var k in st) if (k !== 'text-transform') a[k] = st[k];
  if (extra) for (var k2 in extra) a[k2] = extra[k2];
  var e = HA.el('text', a, parent); e.textContent = st['text-transform'] === 'uppercase' ? String(str).toUpperCase() : str; return e;
};
HA.setText = function (e, s, upper) { s = String(s); if (upper) s = s.toUpperCase(); if (e.textContent !== s) e.textContent = s; };
HA.op = function (e, v) { e.setAttribute('opacity', HA.clamp(v, 0, 1)); };
HA.tf = function (e, x, y, s, r) { e.setAttribute('transform', 'translate(' + (x || 0) + ' ' + (y || 0) + ')' + (s !== undefined && s !== 1 ? ' scale(' + s + ')' : '') + (r ? ' rotate(' + r + ')' : '')); };

// ---- primitives (geometry from the spec; each returns handles + a lit(p) setter where it makes sense)
HA.grid = function (svg, id, w, h) {
  var defs = HA.el('defs', {}, svg); var p = HA.el('pattern', { id: 'dots-' + id, width: 24, height: 24, patternUnits: 'userSpaceOnUse' }, defs);
  HA.el('circle', { cx: 12, cy: 12, r: 1.2, fill: '#FFFFFF', opacity: .07 }, p);
  HA.el('rect', { x: 0, y: 0, width: w, height: h, fill: HA.T.bg }, svg); HA.el('rect', { x: 0, y: 0, width: w, height: h, fill: 'url(#dots-' + id + ')' }, svg); return defs;
};
// Node: rect h 56 rx 10; index micro at (+14,+22); label at (+14,+42); status dot at (+w-14,+16)
HA.node = function (parent, x, y, w, index, label, h) {
  h = h || 56; var g = HA.g(parent); var r = HA.el('rect', { x: x, y: y, width: w, height: h, rx: 10, fill: HA.T.raised, stroke: HA.T.line, 'stroke-width': 1 }, g);
  var i = index != null ? HA.text(g, x + 14, y + 22, index, 'micro', HA.T.faint) : null; var l = HA.text(g, x + 14, y + 42, label, 'label', HA.T.dim);
  var d = HA.el('circle', { cx: x + w - 14, cy: y + 16, r: 3, fill: HA.T.faint }, g);
  var o = { g: g, rect: r, idx: i, lbl: l, dot: d, x: x, y: y, w: w, h: h, cx: x + w / 2, cy: y + h / 2 };
  o.lit = function (p) { r.setAttribute('stroke', HA.mix(HA.T.line, HA.T.lime, p)); r.setAttribute('stroke-width', 1 + .5 * p); l.setAttribute('fill', HA.mix(HA.T.dim, HA.T.ink, p)); d.setAttribute('fill', HA.mix(HA.T.faint, HA.T.lime, p)); return o; };
  o.stroke = function (c, w2) { r.setAttribute('stroke', c); if (w2) r.setAttribute('stroke-width', w2); }; return o;
};
// Pill: h 32 rx 16, micro label centred; idle stroke line / label dim; lit fill lime / label bg
HA.pill = function (parent, cx, cy, w, label, h) {
  h = h || 32; var g = HA.g(parent); var r = HA.el('rect', { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: h / 2, fill: 'none', stroke: HA.T.line, 'stroke-width': 1 }, g);
  var l = HA.text(g, cx, cy + 4, label, 'micro', HA.T.dim, { 'text-anchor': 'middle' });
  var o = { g: g, rect: r, lbl: l, cx: cx, cy: cy, w: w };
  o.lit = function (p) { r.setAttribute('fill', p > 0 ? HA.T.lime : 'none'); r.setAttribute('fill-opacity', p); r.setAttribute('stroke', HA.mix(HA.T.line, HA.T.lime, p)); l.setAttribute('fill', HA.mix(HA.T.dim, HA.T.bg, p)); return o; };
  o.tone = function (c) { r.setAttribute('stroke', c); l.setAttribute('fill', c); }; o.label = function (s) { HA.setText(l, s, true); }; return o;
};
HA.connector = function (parent, d, color) { return HA.el('path', { d: d, fill: 'none', stroke: color || HA.T.line, 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent); };
// Flow: same path dashed 4 8; call flow.run(t) each frame while visible (offset 0 -> -12 every 400 ms)
HA.flow = function (parent, d) { var p = HA.el('path', { d: d, fill: 'none', stroke: HA.T.lime, 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-dasharray': '4 8', opacity: 0 }, parent); p.run = function (t, on) { HA.op(p, on ? 1 : 0); p.setAttribute('stroke-dashoffset', -12 * ((t % 400) / 400)); }; return p; };
// Tick: 14 x 12 drawn with dashoffset; draw(p) 0..1
HA.tick = function (parent, x, y, scale, color, width) { var g = HA.g(parent); HA.tf(g, x, y, scale || 1); var p = HA.el('path', { d: 'M0 6 L5 11 L14 1', fill: 'none', stroke: color || HA.T.lime, 'stroke-width': width || 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1 }, g); g.draw = function (q) { p.setAttribute('stroke-dashoffset', 1 - HA.clamp(q, 0, 1)); }; g.path = p; return g; };
// Counter: text in display-num; set(from, to, p, fmtOpts) -> value text, colour fades faint -> lime over the last 20% of p
HA.counter = function (parent, x, y, from, style, fill, extra) { var e = HA.text(parent, x, y, '', style || 'num', fill || HA.T.faint, extra); e.set = function (a, b, p, o, cFrom, cTo) { HA.setText(e, HA.fmt(HA.lerp(a, b, p), o)); e.setAttribute('fill', HA.mix(cFrom || HA.T.faint, cTo || HA.T.lime, HA.clamp((p - .8) / .2, 0, 1))); }; return e; };
// Sheet: paper rect rx 6 with a 1px line instead of a shadow (card shadows are banned on this site)
HA.sheet = function (parent, x, y, w, h) { var g = HA.g(parent); var r = HA.el('rect', { x: x, y: y, width: w, height: h, rx: 6, fill: HA.T.paper, stroke: '#C9CCC3', 'stroke-width': 1 }, g); g.rect = r; g.line = function (lx, ly, lw) { return HA.el('rect', { x: lx, y: ly, width: lw, height: 4, rx: 2, fill: HA.T.sheetline }, g); }; return g; };
HA.particle = function (parent, x, y, color) { var g = HA.g(parent); var halo = HA.el('circle', { cx: 0, cy: 0, r: 8, fill: HA.T.lime, opacity: 0 }, g); var c = HA.el('circle', { cx: 0, cy: 0, r: 2.5, fill: color || HA.T.faint }, g); HA.tf(g, x, y); g.c = c; g.halo = halo; g.lit = function (p) { c.setAttribute('fill', HA.mix(HA.T.faint, HA.T.lime, p)); c.setAttribute('r', 2.5 + .5 * p); HA.op(halo, .18 * p); }; g.move = function (px, py) { HA.tf(g, px, py); }; return g; };
// Cursor: arrow pointer 14 x 20
HA.cursor = function (parent) { var g = HA.g(parent, { opacity: 0 }); HA.el('path', { d: 'M0 0 L0 16 L4.2 12.4 L7 19 L9.6 18 L6.8 11.6 L12 11.6 Z', fill: HA.T.ink, stroke: HA.T.bg, 'stroke-width': 1, 'stroke-linejoin': 'round' }, g); g.at = function (x, y, s) { HA.tf(g, x, y, s || 1); }; return g; };
// Ripple ring: show(p) grows r0 -> r1 and fades .6 -> 0
HA.ripple = function (parent, color) { var c = HA.el('circle', { cx: 0, cy: 0, r: 6, fill: 'none', stroke: color || HA.T.lime, 'stroke-width': 1.5, opacity: 0 }, parent); c.show = function (x, y, p, r0, r1) { c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', HA.lerp(r0 || 6, r1 || 22, p)); HA.op(c, p > 0 && p < 1 ? .6 * (1 - p) : 0); }; return c; };
// Diamond gate: 20 x 20 rotated 45 at (cx, cy); tone(c), fill(p), tick draw
// Diamond gate: 20 x 20 rotated 45 at (cx, cy). set(pa, pr): pa = amber amount (pending), pr = resolved amount (lime fill + tick)
HA.gate = function (parent, cx, cy, size) { size = size || 20; var g = HA.g(parent); var r = HA.el('rect', { x: -size / 2, y: -size / 2, width: size, height: size, rx: 2, fill: HA.T.bg, stroke: HA.T.faint, 'stroke-width': 1.5, transform: 'rotate(45)' }, g); var tk = HA.tick(g, -5, -4, 10 / 14, HA.T.bg, 2); HA.tf(g, cx, cy); g.rect = r; g.tk = tk; g.cx = cx; g.cy = cy;
  g.set = function (pa, pr) { pa = pa || 0; pr = pr || 0; r.setAttribute('stroke', HA.mix(HA.mix(HA.T.faint, HA.T.amber, pa), HA.T.lime, pr)); r.setAttribute('fill', HA.mix(HA.T.bg, HA.T.lime, pr)); tk.draw(pr); };
  g.state = function (s, p) { if (s === 'idle') g.set(0, 0); else if (s === 'amber') g.set(p == null ? 1 : p, 0); else g.set(1, p == null ? 1 : p); }; return g; };
// Padlock 14 x 18 centred at (cx, cy): body + shackle; open(p) rotates the shackle -30deg about its left end
HA.padlock = function (parent, cx, cy, color) { var g = HA.g(parent); var sh = HA.el('path', { d: 'M-4 -2 V-6 A4 4 0 0 1 4 -6 V-2', fill: 'none', stroke: color || HA.T.dim, 'stroke-width': 1.5 }, g); HA.el('rect', { x: -7, y: -2, width: 14, height: 10, rx: 2, fill: 'none', stroke: color || HA.T.dim, 'stroke-width': 1.5 }, g); HA.tf(g, cx, cy); g.open = function (p) { sh.setAttribute('transform', 'rotate(' + (-30 * p) + ' -4 -2)'); }; g.tone = function (c) { g.querySelectorAll('path,rect').forEach(function (e) { e.setAttribute('stroke', c); }); }; return g; };
// Log lines as a pure function of t: events = [[t0, text], ...]; n visible lines at baselines baseY-(n-1)*dy .. baseY;
// a new line enters at the bottom, older lines move up dy over 280 ms, the one pushed above the top fades out.
HA.log = function (parent, x, baseY, n, dy, style, color) {
  var els = [], i; for (i = 0; i < n + 1; i++) els.push(HA.text(parent, x, baseY, '', style || 'terminal', color || HA.T.dim));
  var o = { els: els };
  o.render = function (events, t, cps, k) {
    var live = events.filter(function (e) { return e[0] <= t; }); var shiftT = live.length > n ? live[live.length - 1][0] : -1e9; var sh = HA.seg(t, shiftT, shiftT + 280);
    var show = live.slice(-(n + 1)); for (i = 0; i < n + 1; i++) HA.setText(els[i], '');
    for (i = 0; i < show.length; i++) { var e = els[i], ev = show[i]; var idx = i - (show.length - 1); var y = baseY + idx * dy + (live.length > n ? dy * (1 - sh) : 0); if (show.length <= n) y = baseY + idx * dy; var c2 = ev[2] != null ? ev[2] : cps; HA.setText(e, c2 ? HA.typed(ev[1], t, ev[0], c2) : ev[1]); e.setAttribute('y', y); var top = baseY - (n - 1) * dy; HA.op(e, (y < top - .5 ? HA.clamp(1 - (top - y) / dy, 0, 1) : 1) * (k == null ? 1 : k)); }
  };
  return o;
};


// ---- HTML controls over the artboard (interactive scenes). Positioned by percentages of the artboard so they scale with it.
// HA.button(c, x, y, w, h, label, cls, onClick) -> <button>; cls: 'lime' | 'outline' | 'pillb' (left-aligned pill)
HA.button = function (c, x, y, w, h, label, cls, onClick) {
  var wrap = c.frame.querySelector('.ha-btns'); if (!wrap) { wrap = document.createElement('div'); wrap.className = 'ha-btns'; c.frame.appendChild(wrap); }
  var b = document.createElement('button'); b.type = 'button'; b.className = cls || 'outline'; b.textContent = label;
  b.style.cssText = 'left:' + (x / c.w * 100) + '%;top:' + (y / c.h * 100) + '%;width:' + (w / c.w * 100) + '%;height:' + (h / c.h * 100) + '%;';
  if (onClick) b.addEventListener('click', onClick); wrap.appendChild(b);
  b.show = function (on) { b.style.display = on ? '' : 'none'; }; b.label = function (s) { b.textContent = s; }; return b;
};
// ---- canvas layer under the SVG for scenes with more than 150 moving shapes. Returns { ctx, w, h, clear() }.
// Coordinates on the canvas are artboard units (the context is scaled by DPR x container scale each frame via clear()).
HA.canvasUnder = function (c) {
  var cv = document.createElement('canvas'); cv.className = 'ha-canvas'; cv.setAttribute('aria-hidden', 'true'); c.frame.insertBefore(cv, c.svg);
  var rects = c.svg.querySelectorAll(':scope > rect'); if (rects[0]) rects[0].setAttribute('fill', 'none'); // the svg background goes transparent; the canvas draws bg + grid
  var ctx = cv.getContext('2d'); var o = { el: cv, ctx: ctx, w: c.w, h: c.h };
  o.clear = function () { var r = c.frame.getBoundingClientRect(); var dpr = window.devicePixelRatio || 1; var W = Math.max(1, Math.round(r.width * dpr)), H = Math.max(1, Math.round(r.height * dpr)); if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; } ctx.setTransform(W / c.w, 0, 0, H / c.h, 0, 0); ctx.fillStyle = HA.T.bg; ctx.fillRect(0, 0, c.w, c.h); ctx.fillStyle = 'rgba(255,255,255,.07)'; for (var x = 12; x < c.w; x += 24) for (var y = 12; y < c.h; y += 24) { ctx.beginPath(); ctx.arc(x, y, 1.2, 0, 6.283); ctx.fill(); } };
  return o;
};

// ---- playback
HA.prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
HA.mount = function (fig) {
  var id = fig.getAttribute('data-scene'); var S = HA.scenes[id]; if (!S || fig._ha) return; fig._ha = true;
  var w = S.w || 1200, h = S.h || 560; var frame = fig.querySelector('.frame') || fig; var svg = frame.querySelector('svg'); if (!svg) { svg = HA.el('svg', {}, frame); frame.insertBefore(svg, frame.firstChild); }
  HA.set(svg, { viewBox: '0 0 ' + w + ' ' + h, width: '100%', height: '100%', role: 'img', 'aria-labelledby': fig.id ? fig.id + '-cap' : null, 'data-ha': id });
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  HA.grid(svg, id + '-' + HA.inst.length, w, h);
  var inst = { id: id, S: S, fig: fig, svg: svg, t: 0, playing: false, visible: false, paused: false, mode: S.mode || 'loop', loop: S.loop || 10000, rng: HA.rng(S.seed || 1) };
  var ctx = { svg: svg, fig: fig, frame: frame, w: w, h: h, rng: inst.rng, T: HA.T, inst: inst, reduced: HA.prefersReduced };
  inst.update = S.build(ctx) || function () {};
  if (S.mode === 'state') { inst.update(0, 0, ctx); }
  else { inst.update(0); }
  // pause button (required for loops > 5 s)
  if (inst.mode === 'loop' && inst.loop > 5000 && !S.nopause && !fig.querySelector('.ha-pause')) {
    var b = document.createElement('button'); b.className = 'ha-pause'; b.type = 'button'; b.setAttribute('aria-label', 'Pause animation');
    b.innerHTML = '<svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true"><circle cx="16" cy="16" r="15.5" fill="none" stroke="' + HA.T.line + '"/><rect class="p1" x="11" y="11" width="3" height="10" fill="' + HA.T.dim + '"/><rect class="p2" x="18" y="11" width="3" height="10" fill="' + HA.T.dim + '"/><path class="pl" d="M12 10 L23 16 L12 22 Z" fill="' + HA.T.dim + '" opacity="0"/></svg>';
    b.style.cssText = 'position:absolute;left:' + ((w - 80) / w * 100) + '%;top:' + ((h - 48) / h * 100) + '%;width:32px;height:32px;padding:0;border:0;background:transparent;cursor:pointer;';
    b.addEventListener('click', function () { inst.paused = !inst.paused; b.setAttribute('aria-label', inst.paused ? 'Play animation' : 'Pause animation'); b.querySelector('.p1').setAttribute('opacity', inst.paused ? 0 : 1); b.querySelector('.p2').setAttribute('opacity', inst.paused ? 0 : 1); b.querySelector('.pl').setAttribute('opacity', inst.paused ? 1 : 0); });
    frame.appendChild(b);
  }
  if (HA.prefersReduced && inst.mode !== 'state') { inst.t = S.resolved != null ? S.resolved : inst.loop * .8; inst.update(inst.t); inst.frozen = true; }
  HA.inst.push(inst);
  if ('IntersectionObserver' in window) { var io = new IntersectionObserver(function (es) { es.forEach(function (e) { inst.visible = e.isIntersecting; }); }, { threshold: .35 }); io.observe(fig); inst.io = io; /* port: kept for HA.unmount */ } else inst.visible = true;
  if (HA.debug) HA.debugOverlay(inst, w, h);
  return inst;
};
HA.last = 0;
HA.tick_ = function (now) {
  var dt = HA.last ? Math.min(now - HA.last, 50) : 16; HA.last = now;
  HA.inst.forEach(function (inst) {
    if (inst.frozen || inst.seeked) return;
    if (inst.mode === 'scrub') { inst.update(inst.scrubT || 0); return; }
    if (!inst.visible || inst.paused || document.hidden) return;
    if (inst.mode === 'state') { inst.t += dt; inst.update(inst.t, dt); return; }
    inst.t = (inst.t + dt) % inst.loop; inst.update(inst.t);
  });
  requestAnimationFrame(HA.tick_);
};
// scroll-scrub: p 0..1 set from outside
HA.scrub = function (inst, p) { inst.scrubT = HA.clamp(p, 0, 1) * inst.loop; };
// test hook: freeze every instance at t (or a specific id)
HA.seek = function (t, id) { HA.inst.forEach(function (inst) { if (id && inst.id !== id) return; inst.seeked = true; inst.t = t; if (inst.mode === 'scrub') inst.update(t); else if (inst.mode === 'state') inst.update(t, 0); else inst.update(t % inst.loop); }); };
HA.resume = function () { HA.inst.forEach(function (i) { i.seeked = false; }); };
HA.debugOverlay = function (inst, w, h) {
  var g = HA.g(inst.svg, { 'pointer-events': 'none' }); for (var x = 0; x <= w; x += 40) HA.el('line', { x1: x, y1: 0, x2: x, y2: h, stroke: x % 200 ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.14)' }, g);
  for (var y = 0; y <= h; y += 40) HA.el('line', { x1: 0, y1: y, x2: w, y2: y, stroke: y % 200 ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.14)' }, g);
  for (var xx = 0; xx <= w; xx += 200) for (var yy = 0; yy <= h; yy += 200) HA.text(g, xx + 3, yy + 11, xx + ',' + yy, 'mono11', 'rgba(255,255,255,.4)');
  var tt = HA.text(g, w - 8, 16, '', 'mono12', HA.T.lime, { 'text-anchor': 'end' }); var up = inst.update; inst.update = function (t, dt) { up(t, dt); HA.setText(tt, Math.round(t) + ' ms'); };
};
HA.boot = function () { Array.prototype.slice.call(document.querySelectorAll('figure.anim[data-scene]')).forEach(HA.mount); document.addEventListener('visibilitychange', function () { HA.last = 0; }); requestAnimationFrame(HA.tick_); };

// ---- port: lifecycle for React (client-side navigation mounts and unmounts figures)
HA.started = false;
HA.start = function () { if (HA.started) return; HA.started = true; document.addEventListener('visibilitychange', function () { HA.last = 0; }); requestAnimationFrame(HA.tick_); };
// Also removes what mount added beside the svg (HTML buttons, pause button, canvas), so a remount (React Strict Mode
// runs effects twice in development) does not stack a second set of controls over the first.
HA.unmount = function (fig) {
  HA.inst = HA.inst.filter(function (inst) { if (inst.fig !== fig) return true; if (inst.io) inst.io.disconnect(); return false; });
  Array.prototype.slice.call(fig.querySelectorAll('.ha-btns, .ha-pause, .ha-canvas')).forEach(function (e) { e.parentNode.removeChild(e); });
  fig._ha = false;
};

export default HA;
