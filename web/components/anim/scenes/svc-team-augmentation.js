// svc-team-augmentation — "In your standup in ten working days". 1200 x 560, loop 10,000 ms, seed 22.
// Two time-zone rings turn into alignment, a calendar counts ten working days, a senior engineer's pill joins the standup and ships a ticket.
HA.scenes['svc-team-augmentation'] = { loop: 10000, seed: 22, resolved: 8600, w: 1200, h: 560, mode: 'loop', build: function (c) {
  var T = HA.T, E = HA.ease, L = HA.g(c.svg), i;
  var LOOP = 10000, RESET = 9300, RES = 8600, CX = 250, CY = 262;
  var ROT = [1000, 2200], OVL = [2200, 2700];                            // inner ring turns; overlap + counter
  var FILLN = [0, 1, 2, 3, 4, 7, 8, 9, 10, 11], FILL0 = 1200, FILLS = 500, FILLD = 160;  // weekday cells, one every 500 ms
  var WKND = { 5: 3370, 6: 3530, 12: 5870, 13: 6030 };                   // weekend strikes, drawn once the week before them is passed
  var PILL = [6200, 6900], TKT = 6600, MV1 = [6900, 7300], MV2 = [7400, 7800], TICK = 7800, COMMIT = 7900;
  var MS = [[0, 'Call'], [1, 'Profiles'], [3, 'Interview'], [8, 'Access'], [11, 'Standup']];

  // 2. overlap dial — 24 h GMT, 0:00 at the top, clockwise, 15 deg per hour
  function pt(r, a) { var q = a * Math.PI / 180; return [CX + r * Math.sin(q), CY - r * Math.cos(q)]; }
  function arc(r, a0, a1, sweep) { var p0 = pt(r, a0), p1 = pt(r, a1); return 'M' + p0[0] + ' ' + p0[1] + ' A' + r + ' ' + r + ' 0 ' + (Math.abs(a1 - a0) > 180 ? 1 : 0) + ' ' + (sweep == null ? 1 : sweep) + ' ' + p1[0] + ' ' + p1[1]; }
  function ring(parent, r, a0, a1) { HA.el('circle', { cx: CX, cy: CY, r: r, fill: 'none', stroke: T.line, 'stroke-width': 10 }, parent); HA.el('path', { d: arc(r, a0, a1), fill: 'none', stroke: T.faint, 'stroke-width': 10, 'stroke-linecap': 'round' }, parent); }
  ring(L, 150, 135, 262.5);                                               // London 09:00–17:30
  var inner = HA.g(L); ring(inner, 118, 60, 195);                         // Lahore 09:00–18:00 PKT = 04:00–13:00 GMT
  var wedge = HA.el('path', { d: arc(118, 135, 195) + ' L' + pt(150, 195).join(' ') + ' ' + arc(150, 195, 135, 0).replace('M', 'L') + ' Z', fill: T.lime, opacity: 0 }, L);
  var ovO = HA.el('path', { d: arc(150, 135, 195), fill: 'none', stroke: T.lime, 'stroke-width': 10, 'stroke-linecap': 'round', opacity: 0 }, L);
  var ovI = HA.el('path', { d: arc(118, 135, 195), fill: 'none', stroke: T.lime, 'stroke-width': 10, 'stroke-linecap': 'round', opacity: 0 }, L);
  for (i = 0; i < 24; i++) { var a = pt(160, i * 15), b = pt(166, i * 15); HA.el('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: T.line }, L); }
  ['00', '06', '12', '18'].forEach(function (s, j) { var p = pt(180, j * 90); HA.text(L, p[0], p[1] + 4, s, 'micro', T.dim, { 'text-anchor': 'middle' }); });
  var hand = HA.el('line', { x1: CX, y1: CY, x2: CX, y2: CY - 100, stroke: T.dim, 'stroke-width': 1.5, 'stroke-linecap': 'round' }, L);
  var cnt = HA.counter(L, CX, CY, 0, 'num', T.faint, { 'text-anchor': 'middle' });
  var cnt0 = HA.text(L, CX, CY, '0h', 'num', T.faint, { 'text-anchor': 'middle', opacity: 0 });   // "before" value, crossfaded in under the reset
  HA.text(L, CX, 292, 'Daily overlap', 'micro', T.dim, { 'text-anchor': 'middle' });
  // legend rows at y 468 / 488 rather than the spec's 448 / 468: the "12" hour label at r 180 sits on y 442 and would collide
  [['London 09:00–17:30', 468], ['Lahore 09:00–18:00 PKT', 488]].forEach(function (r) { HA.el('rect', { x: 132, y: r[1] - 6, width: 10, height: 4, rx: 2, fill: T.faint }, L); HA.text(L, 148, r[1], r[0], 'micro', T.dim); });

  // 3. standup board
  HA.el('rect', { x: 470, y: 72, width: 660, height: 260, rx: 12, fill: T.raised, stroke: T.line }, L);
  HA.text(L, 494, 104, 'Your standup · 09:30', 'micro', T.dim);
  [['Product lead', 494, 124], ['Frontend', 626, 92], ['Frontend', 726, 92], ['QA', 826, 44]].forEach(function (p) { HA.pill(L, p[1] + p[2] / 2, 140, p[2], p[0]); });
  var slot = HA.el('rect', { x: 878, y: 124, width: 200, height: 32, rx: 16, fill: 'none', stroke: T.faint, 'stroke-dasharray': '4 4' }, L);
  var COLS = [494, 704, 914], HEADS = ['To do', 'Doing', 'Done'];
  for (i = 0; i < 3; i++) { HA.el('rect', { x: COLS[i], y: 180, width: 196, height: 128, rx: 8, fill: 'none', stroke: T.line }, L); HA.text(L, COLS[i] + 12, 200, HEADS[i], 'micro', T.dim);
    if (i) HA.el('rect', { x: COLS[i] + 12, y: 220, width: 172, height: 24, rx: 6, fill: T.line }, L); }
  var tkt = HA.g(L, { opacity: 0 }); HA.el('rect', { x: 0, y: 0, width: 172, height: 28, rx: 6, fill: T.paper }, tkt); HA.text(tkt, 10, 18, 'PAY-311', 'mono11', T.pink); var tk = HA.tick(tkt, 150, 8);
  var commit = HA.text(L, COLS[2] + 12, 300, 'First commit', 'micro', T.lime, { opacity: 0 });
  var pillG = HA.g(L); HA.el('rect', { x: 0, y: 124, width: 200, height: 32, rx: 16, fill: T.lime }, pillG); HA.text(pillG, 100, 144, 'Senior backend · .NET', 'micro', T.bg, { 'text-anchor': 'middle' });

  // 4. calendar
  HA.el('rect', { x: 470, y: 360, width: 660, height: 112, rx: 12, fill: T.raised, stroke: T.line }, L);
  HA.text(L, 494, 384, 'Working days from the call', 'micro', T.dim);
  var dayL = HA.text(L, 1106, 384, 'Day 0 of 10', 'label', T.dim, { 'text-anchor': 'end' }), day0 = HA.text(L, 1106, 384, 'Day 0 of 10', 'label', T.dim, { 'text-anchor': 'end', opacity: 0 });
  var LET = 'MTWTFSS', cells = [], strikes = {};
  for (i = 0; i < 14; i++) { var x = 494 + i * 42, we = i % 7 >= 5, g = HA.g(L);
    HA.el('rect', { x: x, y: 398, width: 36, height: 36, rx: 6, fill: 'none', stroke: we ? T.faint : T.line, 'stroke-dasharray': we ? '4 4' : null }, g);
    var f = HA.el('rect', { x: x, y: 398, width: 36, height: 36, rx: 6, fill: T.lime, opacity: 0 }, g);
    var l = HA.text(g, x + 18, 420, LET[i % 7], 'micro', we ? T.faint : T.dim, { 'text-anchor': 'middle' });
    if (we) strikes[i] = HA.el('line', { x1: x + 9, y1: 407, x2: x + 27, y2: 425, stroke: T.faint, 'stroke-width': 1.5, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1 }, g);
    cells.push({ fill: f, lbl: l }); }
  // milestone labels start at their cell's left edge rather than centred under it: centred, CALL and PROFILES (adjacent cells) run into each other
  var msL = MS.map(function (m) { return HA.text(L, 494 + m[0] * 42, 452, m[1], 'micro', T.faint); });

  return function update(t) {
    var k = t >= RESET ? 1 - HA.seg(t, RESET, LOOP, E.inOutCubic) : 1;   // reset crossfade: every lit quantity x k
    // dial: inner ring turns -90 -> 0 (and back under the reset); overlap lights; counter counts
    var rot = HA.seg(t, ROT[0], ROT[1], E.inOutCubic) * k; inner.setAttribute('transform', 'rotate(' + (-90 + 90 * rot) + ' ' + CX + ' ' + CY + ')');
    var ov = HA.seg(t, OVL[0], OVL[1]) * k; HA.op(ovO, ov); HA.op(ovI, ov); HA.op(wedge, .18 * ov);
    cnt.set(0, 4, HA.seg(t, OVL[0], OVL[1]), { suffix: 'h' }); HA.op(cnt, k); HA.op(cnt0, 1 - k);
    // "now" hand: one turn per loop so the seam closes (the spec's 60 s turn cannot), phased to read 11:00 at the resolved frame
    hand.setAttribute('transform', 'rotate(' + (165 + 360 * (t - RES) / LOOP) + ' ' + CX + ' ' + CY + ')');
    // calendar
    var n = 0;
    for (i = 0; i < 14; i++) { var idx = FILLN.indexOf(i);
      if (idx >= 0) { var ft = FILL0 + idx * FILLS, p = HA.seg(t, ft, ft + FILLD) * k; if (t >= ft) n++; HA.op(cells[i].fill, p); cells[i].lbl.setAttribute('fill', HA.mix(T.dim, T.bg, p)); }
      else { strikes[i].setAttribute('stroke-dashoffset', 1 - HA.seg(t, WKND[i], WKND[i] + 160)); HA.op(strikes[i], k); } }
    var last = FILL0 + 9 * FILLS; HA.setText(dayL, 'Day ' + n + ' of 10'); dayL.setAttribute('fill', HA.mix(T.dim, T.ink, HA.seg(t, last, last + FILLD))); HA.op(dayL, k); HA.op(day0, 1 - k);
    for (i = 0; i < MS.length; i++) { var mt = FILL0 + FILLN.indexOf(MS[i][0]) * FILLS; msL[i].setAttribute('fill', HA.mix(T.faint, T.ink, HA.seg(t, mt, mt + FILLD) * k)); }
    // standup: pill slides in (snap), slot fades; ticket appears in TO DO, moves to DOING, then DONE with a tick and "FIRST COMMIT"
    var pp = HA.seg(t, PILL[0], PILL[1], E.snap) * k; HA.tf(pillG, HA.lerp(1220, 878, pp), 0); HA.op(slot, 1 - HA.seg(t, PILL[0], PILL[1]) * k);
    var tx = COLS[0] + 12; if (t >= MV1[0]) tx = HA.lerp(COLS[0] + 12, COLS[1] + 12, HA.seg(t, MV1[0], MV1[1], E.inOutCubic)); if (t >= MV2[0]) tx = HA.lerp(COLS[1] + 12, COLS[2] + 12, HA.seg(t, MV2[0], MV2[1], E.inOutCubic));
    HA.tf(tkt, tx, 256); HA.op(tkt, HA.seg(t, TKT, TKT + 200) * k);
    tk.draw(HA.seg(t, TICK, TICK + 280) * k); HA.op(commit, HA.seg(t, COMMIT, COMMIT + 200) * k);
  };
} };
