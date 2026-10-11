// svc-custom-software — "Scope on day 3, live in week 6". 1200 x 560, loop 10,000 ms, seed 11, 120 SVG particles.
// A two-page scope is signed, grey particles assemble a working app one block at a time, it goes live with a handover pack.
HA.scenes['svc-custom-software'] = { loop: 10000, seed: 11, resolved: 8000, w: 1200, h: 560, mode: 'loop', build: function (c) {
  var T = HA.T, E = HA.ease, L = HA.g(c.svg), i, k;
  var LOOP = 10000, RESET = 9300;
  var TICK0 = 1200, TICKD = 160, TICKS = 120;            // IN ticks pop (snap), stagger
  var STR0 = 1400, STRD = 200, STRS = 120;               // OUT strikes draw, stagger
  var SIGN = 1800;                                       // "SIGNED · DAY 3" fade (280)
  var WEEK = [1800, 2300, 2800, 3300, 3800, 4800];       // week fills, 500 ms linear each
  var FLY = [[1800, 2700], [2800, 3700], [3800, 4500]];  // header+sidebar, KPI cards, table (table leg is 700 so it lands at 4,500)
  var BLK = [2700, 3700, 4500];                          // block fade-ins (200)
  var COUNT = [3700, 4600], RULE0 = 4600, TEST = 4800, LIVE = 5400, FAN = 5600;

  // 2. scope sheet
  var sh = HA.sheet(L, 70, 72, 260, 380);
  HA.text(sh, 90, 104, 'Scope · 2 pages', 'micro', T.pink);
  HA.text(sh, 90, 144, 'In', 'micro', T.pink, { opacity: .6 }); HA.text(sh, 210, 144, 'Out', 'micro', T.pink, { opacity: .6 });
  var INW = [84, 70, 92, 64], ticks = [];
  for (i = 0; i < 4; i++) { var ly = 164 + i * 24; sh.line(104, ly, INW[i]); var tg = HA.g(sh); HA.tick(tg, -5, -4.3, 10 / 14).draw(1); tg.cx = 95; tg.cy = ly + 2; ticks.push(tg); }
  var OUTW = [80, 66, 88], strikes = [];
  for (i = 0; i < 3; i++) { var oy = 164 + i * 24; sh.line(210, oy, OUTW[i]); strikes.push(HA.el('line', { x1: 208, y1: oy + 2, x2: 212 + OUTW[i], y2: oy + 2, stroke: T.pink, 'stroke-width': 1.5, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1 }, sh)); }
  var BODYW = [200, 168, 184]; for (k = 0; k < 8; k++) sh.line(90, 276 + k * 20, BODYW[k % 3]);
  var signG = HA.g(sh, { opacity: 0 }); HA.text(signG, 90, 436, 'Signed · Day 3', 'micro', T.pink); HA.el('rect', { x: 232, y: 427, width: 12, height: 12, fill: T.lime }, signG);

  // 3. week strip
  var weeks = [];
  for (i = 0; i < 6; i++) { var wx = 370 + i * 128, wg = HA.g(L); HA.el('rect', { x: wx, y: 72, width: 120, height: 28, rx: 6, fill: T.raised, stroke: T.line }, wg);
    weeks.push({ fill: HA.el('rect', { x: wx, y: 72, width: 0, height: 28, rx: 6, fill: T.lime, opacity: .25 }, wg), lbl: HA.text(wg, wx + 10, 91, 'W' + (i + 1), 'micro', T.dim) }); }

  // 8. handover sheets — drawn before the frame so they sit behind its bottom-right corner until they fan out.
  // Stack at y 404 rather than the spec's 420: a 52-tall sheet at 420 would peek 12 px below the frame (bottom 460).
  var HS = ['runbook.md', 'tests/', 'walkthrough.mp4'], STACK = [1056, 430], FANP = [[900, 462, -6], [960, 470, 0], [1020, 462, 6]], sheets = [];
  for (i = 0; i < 3; i++) { var sg = HA.g(L); var s2 = HA.sheet(sg, -56, -26, 112, 52); HA.text(s2, -44, 4, HS[i], 'mono11', T.pink); sheets.push(sg); }

  // 4. browser frame
  HA.el('rect', { x: 370, y: 120, width: 760, height: 340, rx: 12, fill: T.log, stroke: T.line }, L);
  HA.el('line', { x1: 370, y1: 152.5, x2: 1130, y2: 152.5, stroke: T.hair }, L);
  [390, 404, 418].forEach(function (cx) { HA.el('circle', { cx: cx, cy: 136, r: 4, fill: T.line }, L); });
  HA.el('rect', { x: 440, y: 126, width: 220, height: 20, rx: 10, fill: T.raised }, L); HA.text(L, 452, 140, 'app.yourproduct.com', 'mono11', T.dim);
  var pillR = HA.el('rect', { x: 1018, y: 126, width: 96, height: 20, rx: 10, fill: 'none', stroke: T.amber }, L);
  var stg = HA.text(L, 1066, 140, 'Staging', 'micro', T.amber, { 'text-anchor': 'middle' });
  var lv = HA.text(L, 1066, 140, 'Live', 'micro', T.lime, { 'text-anchor': 'middle', opacity: 0 });
  var ring = HA.el('circle', { cx: 1066, cy: 136, r: 0, fill: 'none', stroke: T.lime, 'stroke-width': 1.5, opacity: 0 }, L);

  // 5. app blocks
  function block(x, y, w, h) { var g = HA.g(L, { opacity: 0 }); HA.el('rect', { x: x, y: y, width: w, height: h, rx: 6, fill: T.raised, stroke: T.line }, g); g.box = [x, y, w, h]; return g; }
  var side = block(386, 168, 140, 276); for (k = 0; k < 5; k++) HA.el('rect', { x: 402, y: 192 + k * 28, width: 92, height: 6, rx: 3, fill: T.faint }, side);
  var head = block(542, 168, 572, 40);
  var kpiA = block(542, 224, 276, 96); HA.text(kpiA, 558, 250, 'Orders', 'micro', T.dim); var cA = HA.counter(kpiA, 558, 296, 0, 'num', T.faint, { 'font-size': 32 });
  var kpiB = block(838, 224, 276, 96); HA.text(kpiB, 854, 250, 'Conversion', 'micro', T.dim); var cB = HA.counter(kpiB, 854, 296, 0, 'num', T.faint, { 'font-size': 32 });
  var tbl = block(542, 336, 572, 108), rules = [];
  for (k = 0; k < 4; k++) rules.push(HA.el('line', { x1: 554, y1: 360 + k * 24, x2: 1102, y2: 360 + k * 24, stroke: T.line, pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1 }, tbl));

  // 6. particles: seeded scatter, each assigned an evenly spaced point on its block's outline
  var GROUPS = [[0, 30, head, 0], [30, 70, side, 0], [70, 90, kpiA, 1], [90, 110, kpiB, 1], [110, 120, tbl, 2]], parts = [];
  function outline(b, n, j) { var x = b[0], y = b[1], w = b[2], h = b[3], d = j * 2 * (w + h) / n; if (d < w) return [x + d, y]; d -= w; if (d < h) return [x + w, y + d]; d -= h; if (d < w) return [x + w - d, y + h]; d -= w; return [x, y + h - d]; }
  for (i = 0; i < 120; i++) { var sx = 386 + c.rng() * 728, sy = 168 + c.rng() * 276, ph = c.rng() * Math.PI * 2, G = GROUPS[0];
    for (var j = 0; j < GROUPS.length; j++) if (i >= GROUPS[j][0] && i < GROUPS[j][1]) G = GROUPS[j];
    var tp = outline(G[2].box, G[1] - G[0], i - G[0]); parts.push({ g: HA.particle(L, sx, sy), sx: sx, sy: sy, ph: ph, tx: tp[0], ty: tp[1], f0: FLY[G[3]][0], f1: FLY[G[3]][1] }); }

  // 7. tests label
  var testTk = HA.tick(L, 542, 444); var testL = HA.text(L, 562, 454, '212 tests passing', 'micro', T.ink, { opacity: 0 });

  return function update(t) {
    var k = t >= RESET ? 1 - HA.seg(t, RESET, LOOP, E.inOutCubic) : 1;   // reset crossfade: every lit quantity x k
    // scope sheet
    for (i = 0; i < 4; i++) { var ts = HA.seg(t, TICK0 + i * TICKS, TICK0 + i * TICKS + TICKD, E.snap); HA.tf(ticks[i], ticks[i].cx, ticks[i].cy, ts); HA.op(ticks[i], k); }
    for (i = 0; i < 3; i++) { strikes[i].setAttribute('stroke-dashoffset', 1 - HA.seg(t, STR0 + i * STRS, STR0 + i * STRS + STRD)); HA.op(strikes[i], k); }
    HA.op(signG, HA.seg(t, SIGN, SIGN + 280) * k);
    // week strip: fill grows linear; label turns ink once full
    for (i = 0; i < 6; i++) { weeks[i].fill.setAttribute('width', 120 * HA.seg(t, WEEK[i], WEEK[i] + 500, E.linear)); HA.op(weeks[i].fill, .25 * k); weeks[i].lbl.setAttribute('fill', HA.mix(T.dim, T.ink, HA.seg(t, WEEK[i] + 500, WEEK[i] + 660) * k)); }
    // app blocks
    var b0 = HA.seg(t, BLK[0], BLK[0] + 200) * k, b1 = HA.seg(t, BLK[1], BLK[1] + 200) * k, b2 = HA.seg(t, BLK[2], BLK[2] + 200) * k;
    HA.op(head, b0); HA.op(side, b0); HA.op(kpiA, b1); HA.op(kpiB, b1); HA.op(tbl, b2);
    var cp = HA.seg(t, COUNT[0], COUNT[1]); cA.set(0, 1284, cp); cB.set(0, 3.4, cp, { dec: 1, suffix: '%' });
    for (i = 0; i < 4; i++) rules[i].setAttribute('stroke-dashoffset', 1 - HA.seg(t, RULE0 + i * 100, RULE0 + i * 100 + 300));
    // particles: idle drift on a r 6 circle (3 turns per loop so the seam is exact), fly to outline, go lime, fade; return to scatter under the reset
    var th = t * Math.PI * 6 / LOOP;
    for (i = 0; i < 120; i++) { var P = parts[i], q = HA.seg(t, P.f0, P.f1, E.inOutCubic) * k, a = 6 * (1 - q);
      P.g.move(HA.lerp(P.sx + a * Math.cos(th + P.ph), P.tx, q), HA.lerp(P.sy + a * Math.sin(th + P.ph), P.ty, q));
      P.g.lit(HA.seg(t, P.f1, P.f1 + 100) * k); HA.op(P.g, 1 - HA.seg(t, P.f1 + 60, P.f1 + 200) * k); }
    // tests label, status pill, halo ring
    testTk.draw(HA.seg(t, TEST, TEST + 280)); HA.op(testTk, k); HA.op(testL, HA.seg(t, TEST + 100, TEST + 380) * k);
    var lp = HA.seg(t, LIVE, LIVE + 160) * k; pillR.setAttribute('stroke', HA.mix(T.amber, T.lime, lp)); HA.op(stg, 1 - lp); HA.op(lv, lp);
    var rp = HA.seg(t, LIVE, LIVE + 500, E.linear); ring.setAttribute('r', 40 * HA.seg(t, LIVE, LIVE + 500)); HA.op(ring, rp > 0 && rp < 1 ? .5 * (1 - rp) : 0);
    // handover sheets fan out from the stack at (1000, 420) and slide back under the reset
    for (i = 0; i < 3; i++) { var fp = HA.seg(t, FAN + i * 100, FAN + i * 100 + 480, E.snap) * k, F = FANP[i]; HA.tf(sheets[i], HA.lerp(STACK[0], F[0] + 56, fp), HA.lerp(STACK[1], F[1] + 26, fp), 1, F[2] * fp); }
  };
} };
