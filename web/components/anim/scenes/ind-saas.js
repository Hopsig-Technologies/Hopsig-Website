// ind-saas — "Tenants isolated, releases gated by evals". 1200 x 560, loop 12,000 ms, seed 106.
// Three tenants run in walled lanes; a cross-tenant read bounces off row-level security. A release is blocked at the eval gate
// at 88%, fixed, passes at 95%, goes to a 5% canary on tenant A, then to every tenant; the evidence pills light.
HA.scenes['ind-saas'] = { loop: 12000, seed: 106, resolved: 10000, w: 1200, h: 560, mode: 'loop', build: function (c) {
  var T = HA.T, E = HA.ease, L = HA.g(c.svg), rng = c.rng, i;
  var LOOP = 12000, RESET = 11300, LIT = 160, LY = [96, 200, 304], PX = [86, 630], PW = PX[1] - PX[0], NPP = 12;
  var COMMIT = 1000, FILL1 = [1500, 2700], BLOCK = 2700, INTR = [3000, 3400], BOUNCE = [3400, 3700], BL_OUT = 4600, VER = 3600, FILL2 = [3700, 4800], PASS = 4350;
  var CANARY = [4800, 5400], ALL = 6600, FLIP = [[4800, 5400], [6600, 6880], [6800, 7080]], LIME = [[7100, 7400], [6740, 6900], [6940, 7100]], BACK = [[11350, 11750], [11450, 11850], [11550, 11950]], EVID = 7400, EVST = 150;
  var NAMES = ['Tenant A', 'Tenant B', 'Tenant C · white-label'], STAGES = ['Commit', 'Eval gate', 'Canary · 5%', 'All tenants'], SY = [144, 216, 288, 360];
  // 2-3. lanes, labels, version pills, walls
  LY.forEach(function (y, n) { HA.el('rect', { x: 70, y: y, width: 700, height: 80, rx: 10, fill: T.log, stroke: T.line }, L); HA.text(L, 86, y + 22, NAMES[n], 'micro', T.dim); });
  var walls = [186, 290].map(function (y) { return HA.el('rect', { x: 70, y: y, width: 700, height: 4, fill: T.line }, L); });
  // 4. lane particles. Speeds 40-80 u/s never divide the loop, so a second set carrying next-loop positions crossfades in under
  // the reset: at t = loop the second set sits exactly where the first set sits at t = 0.
  var dots = []; LY.forEach(function (y) { for (i = 0; i < NPP; i++) { var d = { x0: rng() * PW, y: y + 36 + rng() * 32, v: 40 + rng() * 40 };
    d.a = HA.el('circle', { cy: d.y, r: 2.5, fill: T.dim }, L); d.b = HA.el('circle', { cy: d.y, r: 2.5, fill: T.dim, opacity: 0 }, L); dots.push(d); } });
  function wrap(x) { return PX[0] + ((x % PW) + PW) % PW; }
  // 5. intruder and the blocked label
  var intr = HA.el('circle', { cx: 0, cy: 0, r: 4, fill: T.red, opacity: 0 }, L);
  var blk = HA.text(L, 430, 222, 'Blocked · row-level security', 'micro', T.lime, { opacity: 0 });
  // 6. evidence pills
  var evid = [[70, 184, 'Row-level security'], [266, 160, 'Per-tenant keys'], [438, 112, 'Audit log']].map(function (p) { return HA.pill(L, p[0] + p[1] / 2, 424, p[1], p[2]); });
  // version pills: a second label so the version can crossfade back under the reset; the flip scales the group about its centre
  var vp = LY.map(function (y) { var p = HA.pill(L, 700, y + 40, 100, 'v1.3.9', 24); p.lbl2 = HA.text(p.g, 700, y + 44, 'v1.4.1', 'micro', T.dim, { 'text-anchor': 'middle', opacity: 0 }); p.cy = y + 40; return p; });
  // 7. release panel
  HA.el('rect', { x: 800, y: 96, width: 330, height: 352, rx: 12, fill: T.raised, stroke: T.line }, L);
  HA.text(L, 824, 124, 'Release', 'micro', T.dim);
  var v0 = HA.text(L, 1106, 124, 'v1.4.0', 'label', T.ink, { 'text-anchor': 'end' }), v1 = HA.text(L, 1106, 124, 'v1.4.1', 'label', T.ink, { 'text-anchor': 'end', opacity: 0 });
  // the panel's top-right carries the version, so the figures label sits bottom-right inside the panel
  HA.text(L, 1106, 436, 'Example figures', 'micro', T.faint, { 'text-anchor': 'end' });
  var conns = [0, 1, 2].map(function (n) { return HA.connector(L, 'M965 ' + (SY[n] + 44) + ' V ' + SY[n + 1]); });
  function stage(y, label) { var g = HA.g(L); var r = HA.el('rect', { x: 824, y: y, width: 282, height: 44, rx: 8, fill: T.raised, stroke: T.line }, g); var l = HA.text(g, 838, y + 28, label, 'label', T.dim);
    var o = { g: g, rect: r, lbl: l }; o.set = function (pa, pr) { r.setAttribute('stroke', HA.mix(HA.mix(T.line, T.amber, pa), T.lime, pr)); r.setAttribute('stroke-width', 1 + .5 * Math.max(pa, pr)); l.setAttribute('fill', HA.mix(T.dim, T.ink, Math.max(pa, pr))); }; return o; }
  var st = SY.map(function (y, n) { return stage(y, STAGES[n]); });
  var tk0 = HA.tick(L, 902, 160), tk1 = HA.tick(L, 914, 232);   // ticks sit right after the label; the gate's right end holds the gauge value
  // gauge inside the eval gate
  HA.el('rect', { x: 944, y: 235, width: 140, height: 6, rx: 3, fill: T.line }, L);
  var gbar = HA.el('rect', { x: 944, y: 235, width: 0, height: 6, rx: 3, fill: T.amber }, L);
  HA.el('rect', { x: 1072.8, y: 231, width: 2, height: 14, fill: T.lime }, L);
  var gv0 = HA.text(L, 1090, 228, '0%', 'micro', T.faint, { 'text-anchor': 'end', opacity: 0 }), gv = HA.text(L, 1090, 228, '0%', 'micro', T.faint, { 'text-anchor': 'end' });
  // status line under the panel
  var sBlk = HA.text(L, 824, 472, 'Blocked · 88% is below 92%', 'micro', T.amber, { opacity: 0 }), sCan = HA.text(L, 824, 472, 'Canary · errors 0.02%', 'micro', T.dim, { opacity: 0 }), sAll = HA.text(L, 824, 472, 'Released · all tenants', 'micro', T.lime, { opacity: 0 });

  return function update(t) {
    var k = t >= RESET ? 1 - HA.seg(t, RESET, LOOP, E.inOutCubic) : 1;   // reset crossfade: every lit quantity x k
    // lane particles
    for (i = 0; i < dots.length; i++) { var d = dots[i]; d.a.setAttribute('cx', wrap(d.x0 + d.v * t / 1000)); d.b.setAttribute('cx', wrap(d.x0 + d.v * (t - LOOP) / 1000)); HA.op(d.a, k); HA.op(d.b, 1 - k); }
    // commit
    var cm = HA.seg(t, COMMIT, COMMIT + LIT) * k; st[0].set(0, cm); tk0.draw(HA.seg(t, COMMIT, COMMIT + 280)); HA.op(tk0, k);
    // eval gate: 88% amber and blocked, reset at the fix, 95% passing the threshold and turning lime
    var f1 = HA.seg(t, FILL1[0], FILL1[1]) * (1 - HA.seg(t, VER, VER + 100, E.linear)), f2 = HA.seg(t, FILL2[0], FILL2[1]), pct = 88 * f1 + 95 * f2;
    var ga = HA.seg(t, BLOCK, BLOCK + 200) * (1 - HA.seg(t, VER, VER + 200)), gl = HA.seg(t, PASS, PASS + 280) * k;
    var gc = HA.mix(HA.mix(T.faint, T.amber, HA.seg(t, FILL1[0], FILL1[0] + LIT)), T.lime, HA.seg(t, PASS, PASS + 280));
    gbar.setAttribute('width', 1.4 * pct); gbar.setAttribute('fill', gc); HA.op(gbar, k);
    HA.setText(gv, Math.round(pct) + '%'); gv.setAttribute('fill', gc); HA.op(gv, k); HA.op(gv0, 1 - k);
    st[1].set(ga, gl); tk1.draw(HA.seg(t, PASS, PASS + 280)); HA.op(tk1, k); conns[0].setAttribute('stroke', HA.mix(T.line, T.lime, gl));
    HA.op(sBlk, ga); var vq = HA.seg(t, VER, VER + 200) * k; HA.op(v0, 1 - vq); HA.op(v1, vq);
    // intruder: up to the wall, bounce, fade; the wall flashes lime and the blocked label shows
    var up = HA.seg(t, INTR[0], INTR[1], E.inOutCubic), iy = t < BOUNCE[0] ? HA.lerp(236, 194, up) : HA.lerp(194, 236, HA.seg(t, BOUNCE[0], BOUNCE[1], E.inOutCubic));
    HA.tf(intr, 400, iy); HA.op(intr, HA.seg(t, INTR[0], INTR[0] + 100) * (1 - HA.seg(t, BOUNCE[0] + 60, BOUNCE[1])));
    walls[0].setAttribute('fill', HA.mix(T.line, T.lime, HA.seg(t, BOUNCE[0], BOUNCE[0] + 60, E.linear) * (1 - HA.seg(t, BOUNCE[0] + 200, BOUNCE[0] + 600))));
    HA.op(blk, HA.seg(t, BOUNCE[0], BOUNCE[0] + LIT) * (1 - HA.seg(t, BL_OUT, BL_OUT + 280)));
    // canary and all tenants
    var cn = HA.seg(t, CANARY[0], CANARY[0] + LIT) * k, al = HA.seg(t, ALL, ALL + LIT) * k;
    st[2].set(0, cn); conns[1].setAttribute('stroke', HA.mix(T.line, T.lime, cn)); st[3].set(0, al); conns[2].setAttribute('stroke', HA.mix(T.line, T.lime, al));
    HA.op(sCan, HA.seg(t, CANARY[0], CANARY[0] + LIT) * (1 - HA.seg(t, ALL, ALL + LIT))); HA.op(sAll, al);
    // version pills: flip (scaleY 1 -> 0 -> 1) with the label swapped at the midpoint, amber on the canary, lime for all.
    // Under the reset they flip back to v1.3.9 (the swap lands at scaleY 0) instead of crossfading two different labels.
    for (i = 0; i < 3; i++) { var p = vp[i], fp = HA.seg(t, FLIP[i][0], FLIP[i][1], E.inOutCubic), fb = HA.seg(t, BACK[i][0], BACK[i][1], E.inOutCubic), mid = (FLIP[i][0] + FLIP[i][1]) / 2;
      var s = Math.max(.001, Math.abs(Math.cos(Math.PI * fp)) * Math.abs(Math.cos(Math.PI * fb)));
      p.g.setAttribute('transform', 'translate(0 ' + (p.cy * (1 - s)) + ') scale(1 ' + s + ')');
      var sw = t >= mid && t < (BACK[i][0] + BACK[i][1]) / 2 ? 1 : 0, am = i === 0 ? HA.seg(t, mid, mid + 100) * k : 0, lm = HA.seg(t, LIME[i][0], LIME[i][1]) * k;
      var tone = HA.mix(HA.mix(T.line, T.amber, am), T.lime, lm), ltone = HA.mix(HA.mix(T.dim, T.amber, am), T.lime, lm);
      p.rect.setAttribute('stroke', tone); p.lbl.setAttribute('fill', ltone); p.lbl2.setAttribute('fill', ltone); HA.op(p.lbl, 1 - sw); HA.op(p.lbl2, sw); }
    // evidence pills
    for (i = 0; i < 3; i++) evid[i].lit(HA.seg(t, EVID + EVST * i, EVID + EVST * i + 280) * k);
  };
} };
