// svc-mobile — "One codebase, two stores, works offline". 1200 x 560, loop 12,000 ms, seed 77.
// One code panel feeds two phones that build in sync, go offline, queue two taps in amber and sync to lime; a release train carries build 142 live.
HA.scenes['svc-mobile'] = { loop: 12000, seed: 77, resolved: 10000, w: 1200, h: 560, mode: 'loop', build: function (c) {
  var T = HA.T, E = HA.ease, L = HA.g(c.svg), i;
  var LOOP = 12000, RESET = 11300, PART = [1000, 1600], CODELIT = [1000, 1280], BUILD0 = 1600, STAG = 80, BDUR = 280, OFF = [3000, 3200], TAP = [3400, 4000], ON = [5000, 5200];
  var SYNC0 = 5000, SYNCGAP = 150, SYNCD = 280, SYNCED = 5600, OUT = [6000, 6200], TRAIN0 = 6200, LEG = 500, LEGGAP = 550, CF = [6200, 8400], LIT = 160;
  var PY = 64, PILLX = [450, 620, 790, 960], PCX = PILLX.map(function (x) { return x + 75; });

  // 2. code panel: keywords and the rest are tspans; all grey before the particle leaves, then ink / dim
  HA.el('rect', { x: 70, y: 96, width: 300, height: 348, rx: 12, fill: T.log, stroke: T.line }, L);
  HA.text(L, 94, 124, 'One codebase', 'micro', T.dim);
  var CODE = [[['export', 1], [' ', 0], ['function', 1], [' Cart() {', 0]], [['  ', 0], ['const', 1], [" items = useSync('cart')", 0]], [['  ', 0], ['const', 1], [' add = useQueue(addItem)', 0]], [['  ', 0], ['return', 1], [' <List items={items} />', 0]], [['}', 0]]];
  var code = CODE.map(function (ln, j) { var e = HA.text(L, 94, 160 + 22 * j, '', 'mono12', T.faint, { 'xml:space': 'preserve', style: 'white-space:pre' });
    e.sp = ln.map(function (tk) { var s = HA.el('tspan', { fill: T.faint }, e); s.textContent = tk[0]; s.kw = tk[1]; return s; }); return e; });
  // 3. fork: grey connectors, a lime trail drawn behind the particle (dashoffset), two particles that share the first 40 units
  var FA = 'M370 254 H450', FB = 'M370 254 H410 V464 H830 V444', LA = 80, LB = 690;
  var pathA = HA.connector(L, FA), pathB = HA.connector(L, FB);
  function trail(d) { return HA.el('path', { d: d, fill: 'none', stroke: T.lime, 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1 }, L); }
  var trailA = trail(FA), trailB = trail(FB);
  function dot(r) { var g = HA.g(L, { opacity: 0 }); HA.el('circle', { r: 8, fill: T.lime, opacity: .18 }, g); HA.el('circle', { r: r, fill: T.lime }, g); return g; }
  var dotA = dot(4), dotB = dot(4);
  // 4–6. phones with an identical UI in phone-local coordinates
  function phone(x, rx, android) {
    var g = HA.g(L);
    HA.el('rect', { x: x, y: PY, width: 220, height: 380, rx: rx, fill: T.raised, stroke: T.line, 'stroke-width': 1.5 }, g);
    HA.el('rect', { x: x + 10, y: PY + 10, width: 200, height: 360, rx: android ? 18 : 24, fill: T.log }, g);
    if (android) HA.el('circle', { cx: x + 110, cy: PY + 22, r: 5, fill: T.bg }, g); else HA.el('rect', { x: x + 78, y: PY + 13, width: 64, height: 14, rx: 7, fill: T.bg }, g);
    var u = HA.g(g); HA.tf(u, x, PY); var o = {};
    o.sig = HA.g(u, { opacity: 0 }); o.bars = [4, 7, 10].map(function (h, j) { return HA.el('rect', { x: 176 + 5 * j, y: 80 - h, width: 3, height: h, rx: 1, fill: T.dim }, o.sig); });
    o.slash = HA.el('line', { x1: 174, y1: 83, x2: 191, y2: 67, stroke: T.dim, 'stroke-width': 1.5, 'stroke-linecap': 'round', opacity: 0 }, o.sig);
    o.ban = HA.g(u, { opacity: 0 }); o.banR = HA.el('rect', { x: 10, y: 98, width: 200, height: 24, fill: T.amber, 'fill-opacity': .15 }, o.ban);
    o.banT = HA.text(o.ban, 22, 114, 'Offline', 'micro', T.amber); o.banK = HA.tick(o.ban, 184, 104, 10 / 14);
    o.title = HA.text(u, 24, 136, 'Cart', 'label', T.ink, { opacity: 0 });
    o.rows = [0, 1, 2, 3].map(function (n) { var y = 148 + 44 * n, rg = HA.g(u, { opacity: 0 });
      HA.el('rect', { x: 24, y: y, width: 172, height: 36, rx: 8, fill: T.raised, stroke: T.line }, rg);
      HA.el('rect', { x: 38, y: y + 9, width: 90, height: 6, rx: 3, fill: T.faint }, rg); HA.el('rect', { x: 38, y: y + 21, width: 54, height: 6, rx: 3, fill: T.faint }, rg);
      var row = { g: rg };
      if (n >= 2) { row.mk = HA.el('rect', { x: 24, y: y, width: 3, height: 36, rx: 1.5, fill: T.amber }, rg); row.lb = HA.text(rg, 148, y + 22, 'Queued', 'micro', T.amber); }
      return row; });
    o.add = HA.g(u, { opacity: 0 }); HA.el('rect', { x: 24, y: 328, width: 172, height: 32, rx: 16, fill: 'none', stroke: T.lime }, o.add);
    HA.text(o.add, 110, 348, 'Add item', 'micro', T.lime, { 'text-anchor': 'middle' });
    o.rip = HA.ripple(u);
    return o;
  }
  var phones = [phone(450, 32, false), phone(720, 26, true)];
  // 7. stats panel. "SESSIONS · 7 DAYS" is 135 px in micro and overflows the 118 px inner width, so it reads "7-DAY SESSIONS".
  // "Example figures" sits bottom-right: the top-right cannot hold the 119 px label beside CRASH-FREE without touching it.
  HA.el('rect', { x: 980, y: 64, width: 150, height: 380, rx: 12, fill: T.raised, stroke: T.line }, L);
  HA.text(L, 996, 92, 'Crash-free', 'micro', T.dim);
  var crash = HA.counter(L, 996, 130, 97.1, 'num', T.faint, { 'font-size': 28 });
  HA.text(L, 996, 150, '7-day sessions', 'micro', T.faint);
  HA.el('line', { x1: 996, y1: 172, x2: 1114, y2: 172, stroke: T.line }, L);
  HA.text(L, 996, 200, 'Offline queue', 'micro', T.dim);
  var queue = HA.text(L, 996, 238, '0', 'num', T.faint, { 'font-size': 28 });
  HA.el('line', { x1: 996, y1: 260, x2: 1114, y2: 260, stroke: T.line }, L);
  HA.text(L, 996, 288, 'Sync conflicts', 'micro', T.dim);
  HA.text(L, 996, 326, '0', 'num', T.faint, { 'font-size': 28 });
  HA.text(L, 1114, 428, 'Example figures', 'micro', T.faint, { 'text-anchor': 'end' });
  // 8. release train. The dot runs at the pills' centre line, so it is layered between the pill rects and their labels: it never hides a letter.
  var tconns = []; for (i = 0; i < 3; i++) tconns.push(HA.connector(L, 'M' + (PILLX[i] + 150) + ' 496 H ' + PILLX[i + 1]));
  var prects = PILLX.map(function (x) { return HA.el('rect', { x: x, y: 480, width: 150, height: 32, rx: 16, fill: T.lime, 'fill-opacity': 0, stroke: T.line }, L); });
  var train = dot(6);
  var plabels = PILLX.map(function (x, j) { return HA.text(L, x + 75, 500, ['Build 142', 'Beta tracks', 'Store review', 'Live'][j], 'micro', T.dim, { 'text-anchor': 'middle' }); });

  return function update(t) {
    var k = t >= RESET ? 1 - HA.seg(t, RESET, LOOP, E.inOutCubic) : 1;   // reset crossfade: every lit quantity x k
    // code lights as the particle leaves
    var cl = HA.seg(t, CODELIT[0], CODELIT[1]) * k;
    code.forEach(function (e) { e.sp.forEach(function (s) { s.setAttribute('fill', HA.mix(T.faint, s.kw ? T.ink : T.dim, cl)); }); });
    // fork particle: B runs the long path eased; A keeps pace to the junction, then spends the rest of the time on its last 40 units so both arrive at 1,600
    var u = HA.seg(t, PART[0], PART[1], E.inOutCubic), dB = LB * u, dA = dB < 40 ? dB : 40 + 40 * (dB - 40) / (LB - 40);
    var pa = HA.at(pathA, dA / LA), pb = HA.at(pathB, u); HA.tf(dotA, pa.x, pa.y); HA.tf(dotB, pb.x, pb.y);
    var dop = HA.seg(t, PART[0], PART[0] + 120) * (1 - HA.seg(t, PART[1], PART[1] + 160)); HA.op(dotA, dop); HA.op(dotB, dop);
    trailA.setAttribute('stroke-dashoffset', 1 - dA / LA); trailB.setAttribute('stroke-dashoffset', 1 - u); HA.op(trailA, k); HA.op(trailB, k);
    // phone UI (both phones identical)
    var off = HA.seg(t, OFF[0], OFF[1]) * (1 - HA.seg(t, ON[0], ON[1]));
    var bin = HA.seg(t, OFF[0], OFF[1], E.inOutCubic), bout = HA.seg(t, OUT[0], OUT[1], E.inOutCubic), lm = HA.seg(t, ON[0], ON[1]);
    var btxt = t < TAP[0] ? 'Offline' : t < TAP[1] ? 'Offline · 1 queued' : t < ON[0] ? 'Offline · 2 queued' : t < SYNCED ? 'Syncing…' : 'Synced';
    var sync = [0, 1].map(function (j) { return HA.seg(t, SYNC0 + SYNCGAP * j, SYNC0 + SYNCGAP * j + SYNCD); });
    var tapP = TAP.map(function (tp) { return HA.seg(t, tp, tp + BDUR); });
    var rp = 0; TAP.forEach(function (tp) { if (HA.between(t, tp, tp + 400)) rp = HA.seg(t, tp, tp + 400, E.linear); });
    var tk = HA.seg(t, SYNCED, SYNCED + 280);
    phones.forEach(function (o) {
      var items = [o.sig, o.title, o.rows[0].g, o.rows[1].g, o.add], j;
      for (j = 0; j < 5; j++) { var p = HA.seg(t, BUILD0 + STAG * j, BUILD0 + STAG * j + BDUR); HA.tf(items[j], 0, 8 * (1 - p)); HA.op(items[j], p * k); }
      o.bars.forEach(function (b) { b.setAttribute('fill', HA.mix(T.dim, T.faint, off)); }); HA.op(o.slash, off);
      HA.tf(o.ban, 0, -24 * (1 - bin) - 24 * bout); HA.op(o.ban, bin * (1 - bout));
      o.banR.setAttribute('fill', HA.mix(T.amber, T.lime, lm)); o.banT.setAttribute('fill', HA.mix(T.amber, T.lime, lm)); HA.setText(o.banT, btxt, true);
      o.banK.draw(tk); HA.op(o.banK, tk);
      for (j = 2; j < 4; j++) { var row = o.rows[j], q = tapP[j - 2], sy = sync[j - 2]; HA.tf(row.g, 0, 8 * (1 - q)); HA.op(row.g, q * k);
        row.mk.setAttribute('fill', HA.mix(T.amber, T.lime, sy)); row.lb.setAttribute('fill', HA.mix(T.amber, T.lime, sy)); HA.setText(row.lb, sy > .5 ? 'SYNCED' : 'QUEUED'); }
      o.rip.show(110, 344, rp, 4, 24);
    });
    // stats
    crash.set(97.1, 99.8, HA.seg(t, CF[0], CF[1]) * k, { dec: 1, suffix: '%' });
    var qn = (t >= TAP[0] ? 1 : 0) + (t >= TAP[1] ? 1 : 0) - (sync[0] > .5 ? 1 : 0) - (sync[1] > .5 ? 1 : 0);
    HA.setText(queue, qn); queue.setAttribute('fill', HA.mix(T.faint, T.amber, HA.seg(t, TAP[0], TAP[0] + LIT) * (1 - sync[1])));
    // release train: four legs of 500 ms, 50 ms apart; each pill fills when the dot reaches it
    var tx = 440; for (i = 0; i < 4; i++) { var s0 = TRAIN0 + LEGGAP * i; if (t >= s0) tx = HA.lerp(i ? PCX[i - 1] : 440, PCX[i], HA.seg(t, s0, s0 + LEG, E.inOutCubic)); }
    var tEnd = TRAIN0 + LEGGAP * 3 + LEG; HA.tf(train, tx, 496); HA.op(train, HA.seg(t, TRAIN0, TRAIN0 + LIT) * (1 - HA.seg(t, tEnd, tEnd + LIT)) * k);   // the LIVE pill's fill takes over from the dot
    for (i = 0; i < 4; i++) { var e0 = TRAIN0 + LEGGAP * i + LEG, lp = HA.seg(t, e0, e0 + LIT) * k;
      prects[i].setAttribute('fill-opacity', lp); prects[i].setAttribute('stroke', HA.mix(T.line, T.lime, lp)); plabels[i].setAttribute('fill', HA.mix(T.dim, T.bg, lp)); }
    for (i = 0; i < 3; i++) { var c0 = TRAIN0 + LEGGAP * (i + 1) + 150; tconns[i].setAttribute('stroke', HA.mix(T.line, T.lime, HA.seg(t, c0, c0 + 200) * k)); }
  };
} };
