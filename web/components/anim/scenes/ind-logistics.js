// ind-logistics — "Real-time, even on a bad connection". 1200 x 560, loop 12,000 ms, seed 104.
// A dispatcher drags load 7781 onto truck 14; the driver app has it at once. The truck drives through a no-coverage zone, the app
// queues two events in amber and syncs them the moment signal returns; the truck arrives, loads, and the board holds.
HA.scenes['ind-logistics'] = { loop: 12000, seed: 104, resolved: 10000, w: 1200, h: 560, mode: 'loop', build: function (c) {
  var T = HA.T, E = HA.ease, L = HA.g(c.svg), i;
  var LOOP = 12000, RESET = 11300, LIT = 160, DEPOT = [260, 300], PICK = [600, 180], ZONE = [470, 220, 590, 340];
  var CUR = [[1000, 1600, [1210, 540], [965, 136]], [1800, 2600, [965, 136], DEPOT]], PRESS = [1600, 1760], DRAG = [1800, 2600], DROP = 2600, SLIDE = 280;
  var DRIVE = [2800, 6800], ARRIVE = [6800, 7000], LOADED = [7400, 7680], RINGS = [2600, 2750, 2900], RINGD = 400, PULSE = 1500;
  // background truck periods are snapped to divisors of the loop (spec: 9,000 / 11,000 / 7,000 / 10,000 / 8,000) so each one is
  // at the same point at t = 0 and t = 12,000 and the seam stays clean; pp = ping-pong
  var BG = [['R2', 12000, 0], ['R2', 6000, 0], ['R3', 6000, 1], ['R3', 3000, 1], ['R1b', 6000, 1]].map(function (b) { return { road: b[0], P: b[1], pp: b[2], off: c.rng() }; });
  var CARDS = [['LOAD 7781', 'Leeds → Hull · 18 t'], ['LOAD 7782', 'York → Selby · 9 t'], ['LOAD 7790', 'Hull → Goole · 22 t']];

  // 2. map panel
  HA.el('rect', { x: 70, y: 72, width: 700, height: 420, rx: 12, fill: T.log, stroke: T.line }, L);
  HA.text(L, 94, 96, 'Live board', 'micro', T.dim);
  // 3. roads
  var RD = { R1: 'M100 420 L260 300 L420 320 L600 180 L740 120', R2: 'M110 140 L300 200 L420 320 L560 440 L740 460', R3: 'M260 300 L300 200 L480 110' };
  var roads = {}; for (var rk in RD) roads[rk] = HA.el('path', { d: RD[rk], fill: 'none', stroke: T.line, 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, L);
  roads.R1b = HA.el('path', { d: 'M600 180 L740 120', fill: 'none', stroke: 'none' }, L);
  var route = HA.el('path', { d: 'M260 300 L420 320 L600 180', fill: 'none', stroke: 'none' }, L);   // truck 14's leg of R1
  // 4. dead zone
  var hid = 'hatch-' + c.inst.id + Math.floor(c.rng() * 1e6), pat = HA.el('pattern', { id: hid, width: 6, height: 6, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, c.svg.querySelector('defs'));
  HA.el('line', { x1: 0, y1: 0, x2: 0, y2: 6, stroke: T.line, 'stroke-width': 1 }, pat);
  HA.el('rect', { x: ZONE[0], y: ZONE[1], width: 120, height: 120, fill: 'url(#' + hid + ')' }, L);
  HA.text(L, 476, 236, 'No coverage', 'micro', T.faint);
  // where the route enters and leaves the zone (point-in-rect test along the path, resolved to drive time)
  var P_IN = -1, P_OUT = -1; for (i = 0; i <= 800; i++) { var q = HA.at(route, i / 800), inz = q.x >= ZONE[0] && q.x <= ZONE[2] && q.y >= ZONE[1] && q.y <= ZONE[3]; if (inz && P_IN < 0) P_IN = i / 800; if (!inz && P_IN >= 0 && P_OUT < 0) P_OUT = i / 800; }
  var T_IN = DRIVE[0] + (DRIVE[1] - DRIVE[0]) * P_IN, T_OUT = DRIVE[0] + (DRIVE[1] - DRIVE[0]) * P_OUT, Q1 = T_IN + 300, Q2 = T_IN + 900;
  // 5. pickup marker
  var pick = HA.el('rect', { x: 594, y: 174, width: 12, height: 12, rx: 2, fill: T.lime, 'fill-opacity': 0, stroke: T.dim, 'stroke-width': 1.5 }, L);
  // 6. background trucks
  var bgT = BG.map(function () { var g = HA.g(L); HA.el('circle', { r: 9, fill: 'none', stroke: T.line, 'stroke-width': 1 }, g); HA.el('circle', { r: 5, fill: T.dim }, g); return g; });
  // the pickup labels sit above the background trucks: the R1 truck's road runs straight under the label text
  var plab0 = HA.text(L, 612, 168, 'Pickup · load 7781', 'micro', T.dim, { opacity: 0 }), plab1 = HA.text(L, 612, 168, 'Loaded 09:42', 'micro', T.lime, { opacity: 0 });
  var ptick = HA.tick(L, 714, 157, 1);
  // 7. truck 14: a lime trail with an amber overlay for the stretch inside the zone, the live truck, and a depot twin that fades in under the reset
  function trail(d, col) { return HA.el('path', { d: d, fill: 'none', stroke: col, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1 }, L); }
  var trailL = trail('M260 300 L420 320 L600 180', T.lime), zi = HA.at(route, P_IN), zo = HA.at(route, P_OUT), trailA = trail('M' + zi.x + ' ' + zi.y + ' L' + zo.x + ' ' + zo.y, T.amber);
  function truck14() { var g = HA.g(L); g.ring = HA.el('circle', { r: 12, fill: 'none', stroke: T.faint, 'stroke-width': 1.5 }, g); g.dot = HA.el('circle', { r: 7, fill: T.faint }, g); g.lbl = HA.text(g, 12, -8, '14', 'micro', T.dim); return g; }
  var tA = truck14(), tB = truck14(); HA.tf(tB, DEPOT[0], DEPOT[1]); HA.op(tB, 0);
  var rips = RINGS.map(function () { return HA.ripple(L); });
  // 8. loads panel; cards are groups centred on their own centre so card 1 can scale about it
  HA.el('rect', { x: 800, y: 72, width: 330, height: 260, rx: 12, fill: T.raised, stroke: T.line }, L);
  var h3 = HA.text(L, 824, 98, 'Unassigned · 3', 'micro', T.dim), h2 = HA.text(L, 824, 98, 'Unassigned · 2', 'micro', T.dim, { opacity: 0 });
  function loadCard(parent, n) { var g = HA.g(parent); g.rect = HA.el('rect', { x: -141, y: -24, width: 282, height: 48, rx: 8, fill: T.raised, stroke: T.line }, g);
    HA.text(g, -127, -6, CARDS[n][0], 'micro', T.dim); HA.text(g, -127, 14, CARDS[n][1], 'label', T.ink); return g; }
  var cards = [0, 1, 2].map(function (n) { return loadCard(L, n); });
  // 9. driver app
  HA.el('rect', { x: 800, y: 352, width: 330, height: 140, rx: 12, fill: T.raised, stroke: T.line }, L);
  HA.text(L, 824, 380, 'Driver app · truck 14', 'micro', T.dim);
  var bars = [4, 7, 10].map(function (h, j) { return HA.el('rect', { x: 1096 + 5 * j, y: 380 - h, width: 3, height: h, rx: 1, fill: T.dim }, L); });
  var slash = HA.el('line', { x1: 1094, y1: 383, x2: 1111, y2: 367, stroke: T.dim, 'stroke-width': 1.5, 'stroke-linecap': 'round', opacity: 0 }, L);
  var st0 = HA.text(L, 824, 412, 'Idle', 'label', T.dim), st1 = HA.text(L, 824, 412, '', 'label', T.lime, { opacity: 0 });
  var ev = [440, 464].map(function (y) { var g = HA.g(L, { opacity: 0 }); g.mk = HA.el('rect', { x: 816, y: y - 11, width: 3, height: 14, rx: 1.5, fill: T.lime }, g); g.tx = HA.text(g, 824, y, '', 'mono12', T.dim); return g; });
  // 10. ghost card and cursor
  var ghost = HA.g(L, { opacity: 0 }); var gc = loadCard(ghost, 0); gc.rect.setAttribute('stroke', T.lime);
  var cur = HA.cursor(L);

  function pulse(t) { return .55 - .25 * Math.cos(2 * Math.PI * t / PULSE); }   // ring opacity .3 → .8 → .3 every 1,500 ms (snapped from 1,600 so it divides the loop)
  return function update(t) {
    var k = t >= RESET ? 1 - HA.seg(t, RESET, LOOP, E.inOutCubic) : 1;   // reset crossfade: every lit quantity x k
    // background traffic, continuous; loop trucks fade over the first and last 6% of the road so the wrap is invisible
    for (i = 0; i < 5; i++) { var b = BG[i], u = (t / b.P + b.off) % (b.pp ? 2 : 1), p = b.pp ? (u < 1 ? u : 2 - u) : u, pt = HA.at(roads[b.road], p);
      HA.tf(bgT[i], pt.x, pt.y); HA.op(bgT[i], b.pp ? 1 : Math.min(1, p / .06, (1 - p) / .06)); }
    // dispatcher: cursor to card 1, press, drag the ghost to truck 14, drop
    var px = CUR[0][2][0], py = CUR[0][2][1];
    for (i = 0; i < 2; i++) if (t >= CUR[i][0]) { var cq = HA.seg(t, CUR[i][0], CUR[i][1], E.inOutCubic); px = HA.lerp(CUR[i][2][0], CUR[i][3][0], cq); py = HA.lerp(CUR[i][2][1], CUR[i][3][1], cq); }
    var sc = HA.between(t, PRESS[0], PRESS[1]) ? 1 - .12 * HA.pulse(t, PRESS[0], PRESS[1]) : 1;
    cur.at(px, py, sc); HA.op(cur, HA.seg(t, CUR[0][0], CUR[0][0] + 200) * (1 - HA.seg(t, DROP, DROP + 300)));
    var dropped = HA.seg(t, DROP, DROP + LIT), lift = HA.seg(t, PRESS[0], PRESS[1]) * (1 - dropped), slide = HA.seg(t, DROP, DROP + SLIDE) * k;
    HA.tf(cards[0], 965, 136, HA.lerp(1, 1.02, lift)); cards[0].rect.setAttribute('stroke', HA.mix(T.line, T.lime, lift)); HA.op(cards[0], 1 - dropped * k);
    HA.tf(cards[1], 965, 196 - 60 * slide); HA.tf(cards[2], 965, 256 - 60 * slide);
    var hd = dropped * k; HA.op(h3, 1 - hd); HA.op(h2, hd);
    var dq = HA.seg(t, DRAG[0], DRAG[1], E.inOutCubic); HA.tf(ghost, HA.lerp(965, DEPOT[0], dq), HA.lerp(136, DEPOT[1], dq), HA.lerp(1.02, .5, dq));
    HA.op(ghost, .85 * HA.seg(t, DRAG[0], DRAG[0] + 100) * (1 - dropped));
    for (i = 0; i < 3; i++) rips[i].show(DEPOT[0], DEPOT[1], HA.seg(t, RINGS[i], RINGS[i] + RINGD, E.linear), 6, 40);
    // truck 14: lit at the drop, drives the route linearly, fades out at the pickup under the reset while its depot twin fades in.
    // Its "14" tag would land exactly on the pickup label at (612, 168), so the tag fades out as the truck arrives.
    var lit = HA.seg(t, DROP, DROP + LIT), pd = HA.seg(t, DRIVE[0], DRIVE[1], E.linear), pos = HA.at(route, pd), pu = pulse(t);
    var ar = HA.seg(t, ARRIVE[0], ARRIVE[1]) * k, ld = HA.seg(t, LOADED[0], LOADED[1]) * k;
    HA.tf(tA, pos.x, pos.y); HA.op(tA, k); tA.dot.setAttribute('fill', HA.mix(T.faint, T.lime, lit)); tA.ring.setAttribute('stroke', HA.mix(T.faint, T.lime, lit));
    HA.op(tA.ring, HA.lerp(pu, 1, lit)); tA.lbl.setAttribute('fill', HA.mix(T.dim, T.ink, lit)); HA.op(tA.lbl, 1 - ar);
    HA.op(tB, 1 - k); HA.op(tB.ring, pu);
    trailL.setAttribute('stroke-dashoffset', 1 - pd); HA.op(trailL, k);
    trailA.setAttribute('stroke-dashoffset', 1 - HA.clamp((pd - P_IN) / (P_OUT - P_IN), 0, 1)); HA.op(trailA, k);
    // pickup
    pick.setAttribute('fill-opacity', ar); pick.setAttribute('stroke', HA.mix(T.dim, T.lime, ar));
    HA.op(plab0, dropped * (1 - HA.seg(t, LOADED[0], LOADED[1])) * k); HA.op(plab1, ld); ptick.draw(HA.seg(t, LOADED[0], LOADED[1])); HA.op(ptick, k);
    // driver app: offline while the truck is inside the zone (T_IN … T_OUT), events queue in amber and sync in lime
    var off = HA.seg(t, T_IN, T_IN + 280) * (1 - HA.seg(t, T_OUT, T_OUT + 280)), sync = HA.seg(t, T_OUT, T_OUT + 280);
    bars.forEach(function (bar) { bar.setAttribute('fill', HA.mix(T.dim, T.faint, off)); }); HA.op(slash, off);
    HA.setText(st1, t < T_IN ? 'Assigned · pickup Leeds' : t < T_OUT ? 'No signal' : t < ARRIVE[0] ? 'Online · 2 events synced' : 'At pickup · loading');
    st1.setAttribute('fill', HA.mix(T.lime, T.amber, off)); HA.op(st1, hd); HA.op(st0, 1 - hd);
    HA.setText(ev[0].tx, t < Q1 ? 'pushed over websocket · 120 ms' : t < T_OUT ? 'queued · checkpoint passed' : 'synced · checkpoint passed');
    ev[0].mk.setAttribute('fill', HA.mix(HA.mix(T.lime, T.amber, HA.seg(t, Q1, Q1 + LIT)), T.lime, sync)); HA.op(ev[0], hd);
    HA.setText(ev[1].tx, t < T_OUT ? 'queued · ETA 09:41' : 'synced · ETA 09:41');
    ev[1].mk.setAttribute('fill', HA.mix(T.amber, T.lime, sync)); HA.op(ev[1], HA.seg(t, Q2, Q2 + LIT) * k);
  };
} };
