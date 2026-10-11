// svc-legacy — "One seam at a time". 1200 x 560, loop 10,000 ms, seed 66, 24 traffic particles.
// Requests flow through a routing facade into a grey monolith; four seams lift out into services, each proved by a parity bar before the next.
HA.scenes['svc-legacy'] = { loop: 10000, seed: 66, resolved: 8500, w: 1200, h: 560, mode: 'loop', build: function (c) {
  var T = HA.T, E = HA.ease, L = HA.g(c.svg), i, j, r;
  var LOOP = 10000, RESET = 9300, S0 = 1200, SEAM = 1600, LIFT = 200, TRAVEL = 600, STAG = 30, LIT = 800, DRAW = 400, PAR1 = 1000, PAR2 = 1300, SWITCH = 1200, LEFT = 7600;
  // 24 particles, one trip each; the loop holds a whole number of trips so the seam closes: 10,000 / 6 = 1,667 ms per trip (spec: 1,600), spawned every 69 ms
  var N = 24, PERIOD = LOOP / 6, SRC = 190, RTR = 370, MONO = 470;   // pill edge, router right edge, monolith left edge (all on y 316)
  var SX = [420, 600, 780, 960], SN = ['Auth', 'Billing', 'Reports', 'Notifications'], SEAMS = SX.map(function (x, n) { return S0 + SEAM * n; });

  // 2–3. requests pill, connector, routing facade; 6a. route router -> monolith
  HA.pill(L, 130, 316, 120, 'Requests'); HA.connector(L, 'M190 316 H230'); HA.node(L, 230, 288, 140, 'Facade', 'Router');
  HA.connector(L, 'M370 316 H470', T.faint);
  // 4. monolith: dashed outlines under the 40 migrating cells, then the squares (each a group centred on its cell), then the 8 that stay
  var ghostG = HA.g(L), sqG = HA.g(L), cells = [], stay = [];
  for (j = 0; j < 4; j++) for (r = 0; r < 5; r++) for (i = 0; i < 2; i++) { var cx = 470 + 40 * (2 * j + i) + 18, cy = 200 + 40 * r + 18;
    var gh = HA.el('rect', { x: cx - 18, y: cy - 18, width: 36, height: 36, rx: 4, fill: 'none', stroke: T.faint, 'stroke-dasharray': '3 3', opacity: 0 }, ghostG);
    var g = HA.g(sqG), rc = HA.el('rect', { x: -18, y: -18, width: 36, height: 36, rx: 4, fill: T.raised, stroke: T.faint }, g); HA.tf(g, cx, cy);
    cells.push({ g: g, rect: rc, ghost: gh, cx: cx, cy: cy, seam: j, st: SEAMS[j] + LIFT + STAG * (2 * r + i), tx: SX[j] + 80, ty: 100 }); }
  for (i = 0; i < 8; i++) stay.push(HA.el('rect', { x: 470 + 40 * i, y: 400, width: 36, height: 36, rx: 4, fill: T.raised, stroke: T.faint }, sqG));
  var lab0 = HA.text(L, 470, 456, 'Monolith · 48 modules', 'micro', T.dim), lab1 = HA.text(L, 470, 456, 'Monolith · 8 of 48 modules left', 'micro', T.dim, { opacity: 0 });
  // 5. new services, idle at 35%
  var svc = SX.map(function (x, n) { var nd = HA.node(L, x, 72, 160, 'Service', SN[n]); HA.op(nd.g, .35); return nd; });
  // 6b. routes router -> service, drawn with dashoffset; the same paths carry the migrated particles
  var routes = SX.map(function (x) { return HA.el('path', { d: 'M370 316 C400 200 ' + (x + 80) + ' 200 ' + (x + 80) + ' 128', fill: 'none', stroke: T.lime, 'stroke-width': 1.5, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1, opacity: 0 }, L); });
  var curveLen = routes.map(function (p) { return p.getTotalLength(); });
  // 7. parity panel
  HA.el('rect', { x: 820, y: 200, width: 310, height: 236, rx: 12, fill: T.raised, stroke: T.line }, L);
  HA.text(L, 844, 224, 'Parity · old vs new', 'micro', T.dim);
  var rows = SN.map(function (nm, n) { var y0 = 248 + 44 * n; HA.text(L, 844, y0, nm, 'micro', T.dim);
    var dash = HA.text(L, 1106, y0, '—', 'terminal', T.faint, { 'text-anchor': 'end' }), val = HA.text(L, 1106, y0, '', 'terminal', T.amber, { 'text-anchor': 'end', opacity: 0 });
    HA.el('rect', { x: 844, y: y0 + 12, width: 262, height: 6, rx: 3, fill: T.line }, L);
    return { dash: dash, val: val, bar: HA.el('rect', { x: 844, y: y0 + 12, width: 0, height: 6, rx: 3, fill: T.amber }, L) }; });
  HA.text(L, 844, 424, '12,400 replayed requests per seam', 'micro', T.faint);
  // 8. traffic particles (top layer)
  var parts = []; for (i = 0; i < N; i++) parts.push(HA.particle(L, SRC, 316));

  return function update(t) {
    var k = t >= RESET ? 1 - HA.seg(t, RESET, LOOP, E.inOutCubic) : 1;   // reset crossfade: every lit quantity x k
    // monolith squares: stroke lime, then travel to the service centre shrinking and fading; dashed outlines stay. All return under the reset.
    for (i = 0; i < cells.length; i++) { var C = cells[i], q = HA.seg(t, C.st, C.st + TRAVEL, E.inOutCubic) * k;
      C.rect.setAttribute('stroke', HA.mix(T.faint, T.lime, HA.seg(t, SEAMS[C.seam], SEAMS[C.seam] + LIFT) * k));
      HA.tf(C.g, HA.lerp(C.cx, C.tx, q), HA.lerp(C.cy, C.ty, q), HA.lerp(1, .2, q)); HA.op(C.g, 1 - q);
      HA.op(C.ghost, HA.seg(t, C.st, C.st + 160) * k); }
    // the two labels share a baseline, so under the reset the "left" one fades out in the first half and the "48 modules" one fades in during the second
    var left = HA.seg(t, LEFT, LEFT + 280); for (i = 0; i < 8; i++) HA.op(stay[i], 1 - .5 * left * k);
    HA.op(lab1, left * (1 - HA.seg(t, RESET, RESET + 350, E.inOutCubic))); HA.op(lab0, 1 - left * (1 - HA.seg(t, RESET + 350, LOOP, E.inOutCubic)));
    // services light and routes draw; parity fills to 97.3% in amber, then snaps to 100.0% in lime
    for (j = 0; j < 4; j++) { var s = SEAMS[j], lit = HA.seg(t, s + LIT, s + LIT + DRAW) * k; svc[j].lit(lit); HA.op(svc[j].g, .35 + .65 * lit);
      routes[j].setAttribute('stroke-dashoffset', 1 - HA.seg(t, s + LIT, s + LIT + DRAW)); HA.op(routes[j], t >= s + LIT ? k : 0);
      var p1 = HA.seg(t, s + PAR1, s + PAR2, E.linear), p2 = HA.clamp(HA.seg(t, s + PAR2, s + SEAM, E.snap), 0, 1), v = (97.3 * p1 + 2.7 * p2) * k, a = HA.seg(t, s + PAR1, s + PAR1 + 160) * k;
      var R = rows[j], col = HA.mix(T.amber, T.lime, p2 * k); R.bar.setAttribute('width', 2.62 * v); R.bar.setAttribute('fill', col);
      HA.setText(R.val, HA.fmt(v, { dec: 1, suffix: '%' })); R.val.setAttribute('fill', col); HA.op(R.val, a); HA.op(R.dash, 1 - a); }
    // particles: particle i spawns every PERIOD at phase i / 24 and rides to the monolith, or to its seam's service once a spawn falls after the switch;
    // the two positions share the trip fraction, so under the reset a migrated particle slides back onto the monolith line
    for (i = 0; i < N; i++) { var P = parts[i], sm = i % 4, ph = i * PERIOD / N, u = (((t - ph) % PERIOD) + PERIOD) % PERIOD / PERIOD, t0 = t - u * PERIOD;
      var m = t0 >= SEAMS[sm] + SWITCH ? k : 0, mx = SRC + (MONO - SRC) * u, sx = mx, sy = 316;
      if (m > 0) { var d = u * (RTR - SRC + curveLen[sm]); if (d > RTR - SRC) { var pt = HA.at(routes[sm], (d - (RTR - SRC)) / curveLen[sm]); sx = pt.x; sy = pt.y; } else sx = SRC + d; }
      P.move(HA.lerp(mx, sx, m), HA.lerp(316, sy, m)); P.lit(m); HA.op(P, HA.clamp(Math.min(u / .04, (1 - u) / .06), 0, 1)); }
  };
} };
