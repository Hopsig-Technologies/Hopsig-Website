// ind-iot — "200+ buildings, still playing when the network drops". 1200 x 560, loop 12,000 ms, seed 105.
// 208 isometric buildings light up on a canvas under the SVG as telemetry arrives; a partner API answers; the link is cut,
// the signage keeps playing from cache while messages queue on the devices; the link returns and the queue flushes to the broker.
HA.scenes['ind-iot'] = { loop: 12000, seed: 105, resolved: 10000, w: 1200, h: 560, mode: 'loop', build: function (c) {
  var T = HA.T, E = HA.ease, L = HA.g(c.svg), rng = c.rng, i, j;
  var LOOP = 12000, RESET = 11300, LIT = 160, SWEEP = 1000, SWEEP_END = 3780, BUILD = 600;
  var TYPE0 = 4000, CPS = 60, RESP0 = 4550, RCPS = 120, CUT = 5400, FLASH = 400, QFILL = [5400, 7400], RESTORE = 7600, DRAIN = [7600, 8400], TAGOUT = 8600;
  var QMAX = 1284, QW = 380 * .7, SLIDE = 1500, SX = [760, 890, 1020], LX = [820, 950, 1080], NP = 24, PSTAG = 25, PDUR = 600, CW = 7.8;
  // 2. estate on a canvas under the svg (208 boxes > the 150-shape budget). The harness page has no CSS for .ha-canvas, so the
  // layer is positioned inline here; the svg's own dot-grid rect is hidden because the canvas draws the grid (otherwise the dots
  // would sit on top of the estate).
  var cv = HA.canvasUnder(c); cv.el.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;display:block;z-index:0';
  c.svg.style.position = 'relative'; c.svg.style.zIndex = '1'; var bgr = c.svg.querySelectorAll(':scope > rect'); if (bgr[1]) bgr[1].setAttribute('fill', 'none');
  var B = []; for (i = 0; i < 16; i++) for (j = 0; j < 13; j++) B.push({ x: 420 + (i - j) * 18, y: 120 + (i + j) * 9, h: 6 + 18 * rng(), t0: SWEEP + (i + j) * 100 + 80 * rng(), d: i + j });
  B.sort(function (a, b) { return a.d - b.d; });
  var FL = HA.mix(T.raised, T.bg, .5), FR = HA.mix(T.raised, T.line, .5);   // left face darker, right face lighter than the top
  function face(ctx, pts, fill, a) { ctx.globalAlpha = a == null ? 1 : a; ctx.fillStyle = fill; ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); for (var n = 2; n < pts.length; n += 2) ctx.lineTo(pts[n], pts[n + 1]); ctx.closePath(); ctx.fill(); }
  function box(b, lit) { var ctx = cv.ctx, x = b.x, y = b.y, h = b.h, top = [x, y - h - 9, x + 18, y - h, x, y - h + 9, x - 18, y - h];
    face(ctx, [x - 18, y - h, x, y - h + 9, x, y + 9, x - 18, y], FL); face(ctx, [x, y - h + 9, x + 18, y - h, x + 18, y, x, y + 9], FR); face(ctx, top, T.raised);
    if (lit > .002) face(ctx, top, T.lime, lit); ctx.globalAlpha = 1; }
  // 3. estate counter and sparkline (the "before" counter fades back in under the reset)
  HA.text(L, 70, 452, 'Buildings reporting', 'micro', T.dim);
  var cnt0 = HA.text(L, 70, 496, '0', 'num', T.faint, { 'font-size': 40, opacity: 0 }), cnt = HA.text(L, 70, 496, '0', 'num', T.faint, { 'font-size': 40 });
  var sv = .5, pts = []; for (i = 0; i < 40; i++) { sv = HA.clamp(sv + (rng() - .5) * .35, .08, .95); pts.push((240 + 220 * i / 39).toFixed(1) + ' ' + (500 - 40 * sv).toFixed(1)); }
  var spark = HA.el('path', { d: 'M' + pts.join(' L'), fill: 'none', stroke: T.dim, 'stroke-width': 1.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1 }, L);
  // 4. screens: slide crossfade and progress bar run from t with a seeded phase (kept off the loop seam). "PLAYING CACHED" is
  // 111 units at micro tracking inside a 120 screen, so its tracking is tightened (textLength 104) to keep an 8-unit inset.
  var SA = T.raised, SB = HA.mix(T.raised, T.line, .5);
  var scr = SX.map(function (x) { var g = HA.g(L); HA.el('rect', { x: x, y: 96, width: 120, height: 72, rx: 6, fill: T.log, stroke: T.line }, g);
    return { slide: HA.el('rect', { x: x + 6, y: 102, width: 108, height: 54, rx: 2, fill: SA }, g), bar: HA.el('rect', { x: x + 6, y: 162, width: 0, height: 2, fill: T.lime }, g),
      tagA: HA.text(g, x + 8, 112, 'Playing cached', 'micro', T.amber, { opacity: 0, textLength: 104, lengthAdjust: 'spacing' }), tagB: HA.text(g, x + 8, 112, 'Synced', 'micro', T.lime, { opacity: 0 }), ph: 200 + rng() * 1100 }; });
  // 5. links: two halves per link scale about the screen / broker ends to open the 10-unit gap; solid and dashed strokes crossfade.
  // The connected base is a dimmed lime so the lime Flow dashes stay visible on it.
  var LB = HA.mix(T.line, T.lime, .45);
  function half(g, d) { g.s = HA.el('path', { d: d, fill: 'none', stroke: LB, 'stroke-width': 1.5, 'stroke-linecap': 'round' }, g); g.d = HA.el('path', { d: d, fill: 'none', stroke: T.faint, 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-dasharray': '3 4', opacity: 0 }, g); return g; }
  var links = LX.map(function (x) { var o = { x: x, top: half(HA.g(L), 'M0 0 V 26'), bot: half(HA.g(L), 'M0 0 V -26') }; o.flow = HA.flow(L, 'M' + x + ' 168 V 220'); return o; });
  // 6. broker
  HA.el('rect', { x: 760, y: 220, width: 380, height: 44, rx: 10, fill: T.raised, stroke: T.line }, L);
  HA.text(L, 774, 238, 'Platform · MQTT', 'micro', T.dim);
  var stOn = HA.text(L, 1126, 250, 'Connected', 'label', T.lime, { 'text-anchor': 'end' }), stOff = HA.text(L, 1126, 250, 'Link down', 'label', T.amber, { 'text-anchor': 'end', opacity: 0 });
  // 7. queue meter
  HA.el('rect', { x: 760, y: 276, width: 380, height: 6, rx: 3, fill: T.line }, L);
  var qbar = HA.el('rect', { x: 760, y: 276, width: 0, height: 6, rx: 3, fill: T.amber }, L);
  HA.text(L, 760, 292, 'Queued on devices', 'micro', T.dim);
  var qval = HA.text(L, 1140, 292, '0', 'terminal', T.faint, { 'text-anchor': 'end' });
  // 8. API console. Request typed at 60 cps; the response streams at 120 cps so it lands by 5,200 (78 characters in 650 ms).
  HA.el('rect', { x: 760, y: 316, width: 380, height: 184, rx: 12, fill: T.log, stroke: T.line }, L);
  HA.text(L, 784, 344, 'Partner API', 'micro', T.dim);
  var con = HA.g(L), REQ = 'GET /buildings/0142/telemetry';
  var meth = HA.text(con, 784, 372, '', 'terminal', T.lime), path = HA.text(con, 784 + 4 * CW, 372, '', 'terminal', T.ink);
  var RESP = [['200 OK · 38 ms', 0, T.ink], ['{', 0, T.dim], ['"occupancy": 0.62,', 2, T.dim], ['"kwh_today": 418.3,', 2, T.dim], ['"status": "online" }', 2, T.dim]];
  var rt = RESP0, rl = RESP.map(function (r, n) { var e = HA.text(con, 784 + r[1] * CW, 394 + 22 * n, '', 'terminal', r[2]); e.t0 = rt; rt += (r[0].length + r[1]) / RCPS * 1000; return e; });
  // 9. sync particles (24 < 150, so SVG)
  var parts = []; for (i = 0; i < NP; i++) { var pt = HA.particle(L, LX[i % 3], 168); pt.lit(1); HA.op(pt, 0); parts.push(pt); }

  return function update(t) {
    var k = t >= RESET ? 1 - HA.seg(t, RESET, LOOP, E.inOutCubic) : 1;   // reset crossfade: every lit quantity x k
    // estate: each top flashes to .85 then settles to .35 over 600 ms; the counter and sparkline follow the lit count
    cv.clear(); var n = 0;
    for (i = 0; i < 208; i++) { var b = B[i]; if (t >= b.t0) n++; var a = HA.seg(t, b.t0, b.t0 + 80, E.linear), s = HA.seg(t, b.t0 + 80, b.t0 + BUILD); box(b, a * (.85 - .5 * s) * k); }
    HA.setText(cnt, n); cnt.setAttribute('fill', HA.mix(HA.mix(T.faint, T.ink, HA.seg(t, SWEEP, SWEEP + LIT)), T.lime, HA.seg(t, SWEEP_END, SWEEP_END + 200))); HA.op(cnt, k); HA.op(cnt0, 1 - k);
    spark.setAttribute('stroke-dashoffset', 1 - n / 208); HA.op(spark, k);
    // screens: always playing; tags only while cached / just synced
    for (i = 0; i < 3; i++) { var sc = scr[i], tt = t + sc.ph, u = tt % SLIDE, odd = Math.floor(tt / SLIDE) % 2;
      sc.slide.setAttribute('fill', HA.mix(odd ? SA : SB, odd ? SB : SA, HA.seg(u, 0, 280))); sc.bar.setAttribute('width', 108 * u / SLIDE);
      HA.op(sc.tagA, HA.seg(t, CUT, CUT + LIT) * (1 - HA.seg(t, RESTORE, RESTORE + 280))); HA.op(sc.tagB, HA.seg(t, RESTORE, RESTORE + 280) * (1 - HA.seg(t, TAGOUT, TAGOUT + 280))); }
    // links: gap opens at the cut, red flash, faint dashed halves; closes at the restore and the flow resumes
    var cut = HA.seg(t, CUT, CUT + LIT) * (1 - HA.seg(t, RESTORE, RESTORE + 280, E.inOutCubic));
    var dashed = HA.seg(t, CUT + FLASH, CUT + FLASH + 200) * (1 - HA.seg(t, RESTORE, RESTORE + 280));
    var redA = HA.seg(t, CUT, CUT + 100, E.linear) * (1 - HA.seg(t, CUT + FLASH, CUT + FLASH + 200)), sy = 1 - cut * 5 / 26, lc = HA.mix(LB, T.red, redA);
    links.forEach(function (o) { o.top.setAttribute('transform', 'translate(' + o.x + ' 168) scale(1 ' + sy + ')'); o.bot.setAttribute('transform', 'translate(' + o.x + ' 220) scale(1 ' + sy + ')');
      [o.top, o.bot].forEach(function (g) { g.s.setAttribute('stroke', lc); HA.op(g.s, 1 - dashed); HA.op(g.d, dashed); }); o.flow.run(t, true); HA.op(o.flow, 1 - cut); });
    var down = HA.seg(t, CUT, CUT + LIT) * (1 - HA.seg(t, RESTORE, RESTORE + 280)); HA.op(stOn, 1 - down); HA.op(stOff, down);
    // queue meter: fills linearly while the link is down, drains when it returns and turns lime
    var qp = HA.seg(t, QFILL[0], QFILL[1], E.linear) * (1 - HA.seg(t, DRAIN[0], DRAIN[1], E.inOutCubic));
    var qc = HA.mix(T.faint, HA.mix(T.amber, T.lime, HA.seg(t, RESTORE, RESTORE + 280)), HA.seg(t, CUT, CUT + LIT) * k);
    qbar.setAttribute('width', QW * qp); qbar.setAttribute('fill', qc); HA.setText(qval, HA.fmt(QMAX * qp)); qval.setAttribute('fill', qc);
    // console
    var typed = HA.typed(REQ, t, TYPE0, CPS); HA.setText(meth, typed.slice(0, 3)); HA.setText(path, typed.slice(4));
    for (i = 0; i < rl.length; i++) HA.setText(rl[i], HA.typed(RESP[i][0], t, rl[i].t0, RCPS)); HA.op(con, k);
    // sync particles: screen bottom -> broker top, 25 ms stagger, 600 ms each
    for (i = 0; i < NP; i++) { var s0 = RESTORE + PSTAG * i, pp = HA.seg(t, s0, s0 + PDUR, E.inOutCubic); parts[i].move(LX[i % 3], HA.lerp(168, 220, pp)); HA.op(parts[i], t >= s0 && t < s0 + PDUR ? Math.min(1, pp / .15, (1 - pp) / .25) : 0); }
  };
} };
