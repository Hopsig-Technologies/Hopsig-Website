// ind-healthcare — "Built for audit, data stays in your cloud". 1200 x 560, loop 12,000 ms, seed 103.
// A study record walks upload → model → clinician review → sign-off inside the client's cloud boundary; every step appends a
// hash-chained audit row. The delivery team outside requests time-boxed access that is approved, counts down and closes itself.
HA.scenes['ind-healthcare'] = { loop: 12000, seed: 103, resolved: 10000, w: 1200, h: 560, mode: 'loop', build: function (c) {
  var T = HA.T, E = HA.ease, L = HA.g(c.svg), i;
  var LOOP = 12000, RESET = 11300, LIT = 160;
  var NX = [100, 290, 480, 670], CX = [175, 365, 555, 745], NAMES = ['Upload', 'Model', 'Clinician review', 'Sign-off'];
  var NLIT = [800, 2000, 3400, 4800], LEGS = [[1400, 2000, 0, 1], [2800, 3400, 1, 2], [4200, 4800, 2, 3]], CONN = [1400, 2800, 4200];
  var CARD = [800, 1200], EDIT = 3400, SIGN = 4800, ROWT = [800, 2000, 3400, 4800, 6600], TYPE = 500, CPS = 70, LINK = 280;
  var REQ = [6000, 6200], APPR = [6600, 6880], TIMER = [6880, 7400], CLOSE = [7400, 7680], TICK0 = 7600, TSTAG = 150, TDUR = 280, BOUND = [7600, 8200];
  var ROWS = [['09:14:02', 'uploader', 'study uploaded', '3f9a…c21'], ['09:14:09', 'model v2.3', 'findings drafted, confidence 0.91', '8b02…7de'],
              ['09:31:44', 'clinician', 'findings amended (1 edit)', 'c47e…a10'], ['09:33:10', 'supervisor', 'signed off', 'e9d1…5bb'],
              ['09:40:12', 'engineer', 'access granted, 60 min, ticket 482', '2a6c…f03']];
  // two of the lines are wider than the 206 units between x 924 and the panel edge in micro, so they wrap onto a second line 14 below
  var LIST = [['BAA / DPA [TO CONFIRM]'], ['DATA STAYS IN YOUR', 'CLOUD ACCOUNT'], ['AUDIT LOG APPEND-ONLY'], ['ACCESS TIME-BOXED', 'AND LOGGED']], LY = [300, 336, 372, 408];
  // amber and lime are too light to read on paper, so the card tag colours are the tokens pulled 40% towards paper-ink
  var PAMBER = HA.mix(T.amber, T.pink, .4), PLIME = HA.mix(T.lime, T.pink, .4);

  // 2. cloud boundary
  var bound = HA.el('rect', { x: 70, y: 72, width: 760, height: 420, rx: 16, fill: 'none', stroke: T.faint, 'stroke-width': 1.5, 'stroke-dasharray': '6 4' }, L);
  HA.text(L, 94, 96, 'Your cloud account · your region', 'micro', T.dim);
  // 3. steps
  var nodes = NX.map(function (x, j) { return HA.node(L, x, 156, 150, '0' + (j + 1), NAMES[j]); });
  var conns = [], flows = [];
  for (i = 0; i < 3; i++) { var d = 'M' + (NX[i] + 150) + ' 184 H ' + NX[i + 1]; conns.push(HA.connector(L, d)); flows.push(HA.flow(L, d)); }
  // 4. record card (group centred on the card centre; card y 110–146)
  var card = HA.g(L, { opacity: 0 }); HA.sheet(card, -52, -18, 104, 36);
  HA.text(card, -42, -3, 'STUDY 0381', 'mono11', T.pink);
  var tagE = HA.text(card, -42, 11, '1 edit', 'micro', PAMBER, { opacity: 0 }), tagS = HA.text(card, -42, 11, 'Signed', 'micro', PLIME, { opacity: 0 });
  var ctk = HA.tick(card, 12, 2, 10 / 14, PLIME, 2);
  // 5. audit table (the spec names the columns but gives no header baseline, so the title line stands alone and rows start at 288)
  HA.el('rect', { x: 100, y: 228, width: 700, height: 236, rx: 12, fill: T.log, stroke: T.line }, L);
  HA.text(L, 124, 256, 'Audit trail · append-only', 'micro', T.faint);
  function chainLink(y0) { var g = HA.g(L), rs = [5, 9].map(function (dy) { return HA.el('rect', { x: 758, y: y0 + dy, width: 4, height: 6, rx: 2, fill: 'none', stroke: T.lime, 'stroke-width': 1, pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1 }, g); });
    g.draw = function (p) { rs.forEach(function (r) { r.setAttribute('stroke-dashoffset', 1 - HA.clamp(p, 0, 1)); }); }; return g; }
  var rows = [], links = [];
  for (i = 0; i < 5; i++) { var y = 288 + 28 * i, r = ROWS[i], g = HA.g(L, { opacity: 0 });
    HA.text(g, 124, y, r[0], 'terminal', T.faint); HA.text(g, 214, y, r[1], 'terminal', T.dim);
    var act = HA.text(g, 354, y, '', 'terminal', T.ink), hs = HA.text(g, 776, y, r[3], 'terminal', T.dim, { 'text-anchor': 'end', opacity: 0 });
    rows.push({ g: g, act: act, hash: hs }); if (i > 0) links.push(chainLink(y - 28)); }
  // 6. delivery panel
  HA.el('rect', { x: 880, y: 72, width: 250, height: 420, rx: 12, fill: T.raised, stroke: T.line }, L);
  HA.node(L, 904, 104, 202, 'Delivery team', 'Lahore');
  // the access line is drawn as two runs so it does not cross the padlock body
  var line = HA.el('path', { d: 'M904 132 H861 M839 132 H830', fill: 'none', stroke: T.faint, 'stroke-width': 1, 'stroke-dasharray': '4 4' }, L);
  var lock = HA.padlock(L, 850, 132, T.dim);
  var pill = HA.pill(L, 1005, 190, 202, 'Access request · 60 min', 28); HA.op(pill.g, 0);
  var ticks = [];
  for (i = 0; i < 4; i++) { ticks.push(HA.tick(L, 904, LY[i] - 11, 1)); var e = HA.text(L, 924, LY[i], LIST[i][0], 'micro', T.dim);
    if (LIST[i][1]) { var sp = HA.el('tspan', { x: 924, dy: 14 }, e); sp.textContent = LIST[i][1]; } }
  var foot = HA.text(L, 904, 464, 'No standing access to', 'micro', T.faint); var fsp = HA.el('tspan', { x: 904, dy: 14 }, foot); fsp.textContent = 'PATIENT DATA';
  function mmss(s) { var m = Math.floor(s / 60), r = s % 60; return (m < 10 ? '0' : '') + m + ':' + (r < 10 ? '0' : '') + r; }

  return function update(t) {
    var k = t >= RESET ? 1 - HA.seg(t, RESET, LOOP, E.inOutCubic) : 1;   // reset crossfade: every lit quantity x k
    // steps and connectors
    for (i = 0; i < 4; i++) nodes[i].lit(HA.seg(t, NLIT[i], NLIT[i] + LIT) * k);
    for (i = 0; i < 3; i++) { var p = HA.seg(t, CONN[i], CONN[i] + LIT) * k; conns[i].setAttribute('stroke', HA.mix(T.line, T.lime, p)); flows[i].run(t, p > .5); HA.op(flows[i], p); }
    // record card: fades in over Upload (settling 8 down onto y 128), travels node to node, fades out in place under the reset
    var cx = CX[0]; for (i = 0; i < 3; i++) { var lg = LEGS[i]; if (t >= lg[0]) cx = HA.lerp(CX[lg[2]], CX[lg[3]], HA.seg(t, lg[0], lg[1], E.inOutCubic)); }
    var cp = HA.seg(t, CARD[0], CARD[1]); HA.tf(card, cx, HA.lerp(120, 128, cp)); HA.op(card, cp * k);
    var ed = HA.seg(t, EDIT, EDIT + LIT), sg = HA.seg(t, SIGN, SIGN + LIT); HA.op(tagE, ed * (1 - sg)); HA.op(tagS, sg); ctk.draw(HA.seg(t, SIGN, SIGN + 280));
    // audit rows: time and actor appear, the action types at 70 cps, the hash appears at the end of the 500 ms typing window, then the chain link draws
    for (i = 0; i < 5; i++) { var w = ROWT[i], rw = rows[i]; HA.op(rw.g, HA.seg(t, w, w + LIT) * k); HA.setText(rw.act, HA.typed(ROWS[i][2], t, w, CPS)); HA.op(rw.hash, HA.seg(t, w + TYPE, w + TYPE + LIT));
      if (i > 0) { links[i - 1].draw(HA.seg(t, w + TYPE, w + TYPE + LINK)); HA.op(links[i - 1], k); } }
    // access request: line and padlock go faint → amber → lime → faint; the shackle opens while approved; the pill fills lime and counts down
    var rq = HA.seg(t, REQ[0], REQ[1]), ap = HA.seg(t, APPR[0], APPR[1]), cl = HA.seg(t, CLOSE[0], CLOSE[1]);
    line.setAttribute('stroke', HA.mix(HA.mix(HA.mix(T.faint, T.amber, rq), T.lime, ap), T.faint, cl));
    lock.tone(HA.mix(HA.mix(HA.mix(T.dim, T.amber, rq), T.lime, ap), T.dim, cl)); lock.open(ap * (1 - cl));
    HA.op(pill.g, rq * k); pill.rect.setAttribute('fill', T.lime); pill.rect.setAttribute('fill-opacity', ap * (1 - cl));
    pill.rect.setAttribute('stroke', HA.mix(HA.mix(T.amber, T.lime, ap), T.line, cl)); pill.lbl.setAttribute('fill', HA.mix(HA.mix(T.amber, T.bg, ap), T.dim, cl));
    var secs = Math.round(3600 * (1 - HA.seg(t, TIMER[0], TIMER[1], E.linear)));
    pill.label(cl > .5 ? 'Closed · logged' : ap > .5 ? 'Approved · ' + mmss(secs) : 'Access request · 60 min');
    // compliance ticks and the boundary
    for (i = 0; i < 4; i++) { ticks[i].draw(HA.seg(t, TICK0 + TSTAG * i, TICK0 + TSTAG * i + TDUR)); HA.op(ticks[i], k); }
    var bp = HA.seg(t, BOUND[0], BOUND[1]) * k; bound.setAttribute('stroke', HA.mix(T.faint, T.lime, bp)); bound.setAttribute('stroke-opacity', HA.lerp(1, .6, bp));
  };
} };
