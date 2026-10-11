// svc-data-engineering — "Three answers become one". 1200 x 560, loop 10,000 ms, seed 33.
// Three sources feed three dashboards through tangled pipes; a warehouse and one metric definition replace the tangle and every tile agrees.
HA.scenes['svc-data-engineering'] = { loop: 10000, seed: 33, resolved: 8000, w: 1200, h: 560, mode: 'loop', build: function (c) {
  var T = HA.T, E = HA.ease, L = HA.g(c.svg), i, j;
  var LOOP = 10000, RESET = 9300, AFTER = 418240;
  var MISM = [600, 1500], TANGLE = [1500, 1900], WH = [1700, 2180], SRC0 = 2100, PILL = [2900, 3180], TILE0 = 3100, DRAW = 600, STAG = 100, COUNT = [3500, 4400];
  var BATCH = 3000, FAIL = 3000, FADE = 3200, STRIKE = 3300, SEG0 = 400, SEGS = 400, SEGD = 160, CLEAR = 9840;
  var SY = [148, 280, 412], TY = [146, 280, 414];                        // source / tile centre y

  // 2. sources
  [['Postgres', 'Orders'], ['REST API', 'Payments'], ['CSV export', 'Marketing']].forEach(function (s, n) { HA.node(L, 70, 120 + n * 132, 160, s[0], s[1]); });
  // 3. tangled paths: solid faint line with dim flow dashes on top. 12 dash cycles per loop (833 ms, near the spec's 800) so the seam closes exactly.
  var tangle = HA.g(L), tflows = [];
  [[148, 414], [280, 146], [412, 280]].forEach(function (p) { var d = 'M230 ' + p[0] + ' C565 ' + p[0] + ' 565 ' + p[1] + ' 900 ' + p[1]; HA.connector(tangle, d, T.faint); var f = HA.flow(tangle, d); f.setAttribute('stroke', T.dim); HA.op(f, 1); tflows.push(f); });
  // 4. warehouse: body + lower half of the bottom ellipse as one path, top ellipse over it
  var wh = HA.g(L, { opacity: 0 });
  HA.el('path', { d: 'M536 236 V316 A64 14 0 0 0 664 316 V236 Z', fill: T.raised, stroke: T.line }, wh);
  HA.el('ellipse', { cx: 600, cy: 236, rx: 64, ry: 14, fill: T.raised, stroke: T.line }, wh);
  HA.text(wh, 600, 284, 'Warehouse', 'micro', T.dim, { 'text-anchor': 'middle' });
  // 5. metric pill
  var pillG = HA.g(L, { opacity: 0 }); HA.pill(pillG, 600, 356, 168, 'Metric · Revenue');
  // 6. clean paths, drawn with dashoffset
  function drawn(d) { return HA.el('path', { d: d, fill: 'none', stroke: T.lime, 'stroke-width': 1.5, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1, opacity: 0 }, L); }
  var srcP = SY.map(function (y) { return drawn('M230 ' + y + ' C400 ' + y + ' 460 276 536 276'); });
  var vP = drawn('M600 330 V340');
  var tileP = TY.map(function (y) { return drawn('M684 356 C790 356 810 ' + y + ' 900 ' + y); });
  // 7. flow particles: 6 per path, evenly spaced, 160 units/s
  var parts = [], FP = srcP.concat(tileP), FT = [SRC0, SRC0 + STAG, SRC0 + 2 * STAG, TILE0, TILE0 + STAG, TILE0 + 2 * STAG];
  for (i = 0; i < 6; i++) for (j = 0; j < 6; j++) parts.push({ c: HA.el('circle', { r: 2.5, fill: T.lime, opacity: 0 }, L), p: FP[i], len: FP[i].getTotalLength(), j: j, t0: FT[i] });
  // 8. dashboard tiles (Node primitive, 230 x 100, own text layout)
  var VALS = [[412880, 'Asked by finance'], [398120, 'Asked by sales'], [441005, 'Asked by marketing']], tiles = [];
  for (i = 0; i < 3; i++) { var ty = 96 + i * 134, nd = HA.node(L, 900, ty, 230, null, '', 100);
    HA.text(nd.g, 916, ty + 24, 'Revenue · Last week', 'micro', T.dim);
    tiles.push({ nd: nd, v0: HA.text(nd.g, 916, ty + 64, HA.fmt(VALS[i][0], { prefix: '£' }), 'num', T.ink, { 'font-size': 28, opacity: 0 }), cnt: HA.counter(nd.g, 916, ty + 64, 0, 'num', T.ink, { 'font-size': 28 }),
      s0: HA.text(nd.g, 916, ty + 86, VALS[i][1], 'micro', T.dim), s1: HA.text(nd.g, 916, ty + 86, 'One definition', 'micro', T.dim, { opacity: 0 }) }); }
  // 9. labels. "Example figures" sits one row above the mismatch label: both at y 80 would overlap (900–1050 vs 1011–1130).
  var mism = HA.text(L, 900, 80, '3 different answers', 'micro', T.red, { opacity: 0 });
  HA.text(L, 1130, 62, 'Example figures', 'micro', T.faint, { 'text-anchor': 'end' });
  // 10. batch strip. Track, segments and time labels sit 20 px right of the spec (280 / 900): "INCREMENTAL · EVERY 5 MIN" is 198 px wide and ran under the first segment at 260.
  var row1 = HA.g(L); HA.text(row1, 70, 476, 'Nightly batch', 'micro', T.dim);
  HA.el('rect', { x: 280, y: 470, width: 600, height: 6, rx: 3, fill: T.line }, row1);
  var bar = HA.el('rect', { x: 280, y: 470, width: 0, height: 6, rx: 3, fill: T.faint }, row1);
  var tl0 = HA.text(row1, 900, 476, '02:00 → 07:40', 'terminal', T.dim), tl1 = HA.text(row1, 900, 476, 'FAILED 07:40', 'terminal', T.red, { opacity: 0 });
  var strike = HA.el('line', { x1: 70, y1: 472.5, x2: 1010, y2: 472.5, stroke: T.dim, 'stroke-width': 1, pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1 }, L);
  HA.text(L, 70, 506, 'Incremental · Every 5 min', 'micro', T.dim);
  var segs = []; for (i = 0; i < 24; i++) segs.push(HA.el('rect', { x: 280 + i * 25, y: 500, width: 22, height: 6, rx: 2, fill: T.line }, L));
  HA.text(L, 900, 506, 'LAST RUN 2 MIN AGO', 'terminal', T.dim);

  return function update(t) {
    var k = t >= RESET ? 1 - HA.seg(t, RESET, LOOP, E.inOutCubic) : 1;   // reset crossfade: every lit quantity x k
    // before layer: tangle fades out (and back under the reset), dashes crawl at half speed
    HA.op(tangle, 1 - HA.seg(t, TANGLE[0], TANGLE[1], E.inOutCubic) * k);
    var dof = -12 * ((t * 12 / LOOP) % 1); for (i = 0; i < 3; i++) tflows[i].setAttribute('stroke-dashoffset', dof);
    HA.op(mism, HA.seg(t, MISM[0], MISM[0] + 160) - HA.seg(t, MISM[1], MISM[1] + 160));
    // warehouse and pill pop in about their centres (and shrink back under the reset)
    var ws = .9 + .1 * HA.seg(t, WH[0], WH[1], E.snap) * k; HA.tf(wh, 600 * (1 - ws), 276 * (1 - ws), ws); HA.op(wh, HA.seg(t, WH[0], WH[1]) * k);
    var ps = .8 + .2 * HA.seg(t, PILL[0], PILL[1], E.snap) * k; HA.tf(pillG, 600 * (1 - ps), 356 * (1 - ps), ps); HA.op(pillG, HA.seg(t, PILL[0], PILL[1]) * k);
    // clean paths draw, then fade under the reset
    function draw(p, t0, d) { var q = HA.seg(t, t0, t0 + d); p.setAttribute('stroke-dashoffset', 1 - q); HA.op(p, q > 0 ? k : 0); }
    for (i = 0; i < 3; i++) { draw(srcP[i], SRC0 + i * STAG, DRAW); draw(tileP[i], TILE0 + i * STAG, DRAW); }
    draw(vP, PILL[0], PILL[1] - PILL[0]);
    // particles ride their path at 160 u/s, fading in once it is mostly drawn
    for (i = 0; i < parts.length; i++) { var P = parts[i], pt = HA.at(P.p, (Math.max(0, t - P.t0) * .16 / P.len + P.j / 6) % 1); P.c.setAttribute('cx', pt.x); P.c.setAttribute('cy', pt.y); HA.op(P.c, HA.seg(t, P.t0 + 300, P.t0 + 460) * k); }
    // tiles: count to the shared figure, stroke and value go lime, subtitle crossfades; the before value crossfades back under the reset
    var cp = HA.seg(t, COUNT[0], COUNT[1]), cpk = cp * k;
    for (i = 0; i < 3; i++) { var tl = tiles[i]; tl.nd.lit(cpk); tl.cnt.set(VALS[i][0], AFTER, cp, { prefix: '£' }, T.ink, T.lime); HA.op(tl.cnt, k); HA.op(tl.v0, 1 - k); HA.op(tl.s0, 1 - cpk); HA.op(tl.s1, cpk); }
    // batch strip: nightly bar fills, fails red, row fades to 40% and is struck through; incremental segments tick on, clearing at the loop end
    bar.setAttribute('width', 600 * HA.seg(t, 0, BATCH, E.linear) * k);
    var rd = HA.seg(t, FAIL, FAIL + 160) * k; bar.setAttribute('fill', HA.mix(T.faint, T.red, rd)); HA.op(tl0, 1 - rd); HA.op(tl1, rd);
    HA.op(row1, 1 - .6 * HA.seg(t, FADE, FADE + 280) * k);
    strike.setAttribute('stroke-dashoffset', 1 - HA.seg(t, STRIKE, STRIKE + 280)); HA.op(strike, k);
    var clr = 1 - HA.seg(t, CLEAR, LOOP);
    for (i = 0; i < 24; i++) segs[i].setAttribute('fill', HA.mix(T.line, T.lime, HA.seg(t, SEG0 + i * SEGS, SEG0 + i * SEGS + SEGD) * clr));
  };
} };
