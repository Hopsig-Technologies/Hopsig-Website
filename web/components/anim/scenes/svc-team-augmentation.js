// svc-team-augmentation (v3) — "In your standup in ten working days". 1200 x 560, loop 10,000 ms, seed 22.
// Profiles arrive, you interview one, the calendar counts ten working days, that engineer joins your standup and
// ships a ticket. v3 (2026-10-11, owner decision "no time zones or overlap"): the v2 overlap dial on the left is
// replaced by the profiles panel (docs/anim/spec/svc-team-augmentation-v3.md); the right half is v2 unchanged.
HA.scenes['svc-team-augmentation'] = { loop: 10000, seed: 22, resolved: 8600, w: 1200, h: 560, mode: 'loop', build: function (c) {
  var T = HA.T, E = HA.ease, L = HA.g(c.svg), i;
  var LOOP = 10000, RESET = 9300;
  var PROF = [1700, 1860, 2020], CHOSEN = 1, PICK = 2700, PTICK = 2900, REPL = 7900;   // profiles arrive; interview; replacement line
  var FILLN = [0, 1, 2, 3, 4, 7, 8, 9, 10, 11], FILL0 = 1200, FILLS = 500, FILLD = 160;  // weekday cells, one every 500 ms
  var WKND = { 5: 3370, 6: 3530, 12: 5870, 13: 6030 };                   // weekend strikes, drawn once the week before them is passed
  var PILL = [6200, 6900], TKT = 6600, MV1 = [6900, 7300], MV2 = [7400, 7800], TICK = 7800, COMMIT = 7900;
  var MS = [[0, 'Call'], [1, 'Profiles'], [3, 'Interview'], [8, 'Access'], [11, 'Standup']];

  // 2. profiles panel (replaces the v2 overlap dial): three role-only profiles over dashed slots; you choose one
  HA.el('rect', { x: 70, y: 72, width: 360, height: 400, rx: 12, fill: T.raised, stroke: T.line }, L);
  HA.text(L, 94, 104, 'Profiles, not a bench', 'micro', T.dim);
  var ROLES = [['Senior backend · Node.js', 'Owned a production system'], ['Senior backend · .NET', 'Owned a production system'], ['Senior data engineer', 'Pipelines that run without you']];
  var PY = [124, 200, 276], cards = [];
  for (i = 0; i < 3; i++) {
    HA.el('rect', { x: 94, y: PY[i], width: 312, height: 60, rx: 8, fill: 'none', stroke: T.faint, 'stroke-dasharray': '4 4' }, L);
    var cg = HA.g(L, { opacity: 0 }), cr = HA.el('rect', { x: 94, y: PY[i], width: 312, height: 60, rx: 8, fill: T.bg, stroke: T.line, 'stroke-width': 1 }, cg);
    HA.text(cg, 110, PY[i] + 26, ROLES[i][0], 'label', T.ink); HA.text(cg, 110, PY[i] + 46, ROLES[i][1], 'mono11', T.dim);
    cards.push({ g: cg, r: cr });
  }
  var ctick = HA.tick(L, 378, PY[CHOSEN] + 14, 1), chosenL = HA.text(L, 390, PY[CHOSEN] + 46, 'Interviewed', 'micro', T.lime, { opacity: 0, 'text-anchor': 'end' });
  var repl = HA.text(L, 94, 440, 'A replacement inside ten working days', 'micro', T.faint);

  // 3. standup board
  HA.el('rect', { x: 470, y: 72, width: 660, height: 260, rx: 12, fill: T.raised, stroke: T.line }, L);
  HA.text(L, 494, 104, 'Your standup', 'micro', T.dim);
  [['Product lead', 494, 124], ['Frontend', 626, 92], ['Frontend', 726, 92], ['QA', 826, 44]].forEach(function (p) { HA.pill(L, p[1] + p[2] / 2, 140, p[2], p[0]); });
  var slot = HA.el('rect', { x: 878, y: 124, width: 200, height: 32, rx: 16, fill: 'none', stroke: T.faint, 'stroke-dasharray': '4 4' }, L);
  var COLS = [494, 704, 914], HEADS = ['To do', 'Doing', 'Done'];
  for (i = 0; i < 3; i++) { HA.el('rect', { x: COLS[i], y: 180, width: 196, height: 128, rx: 8, fill: 'none', stroke: T.line }, L); HA.text(L, COLS[i] + 12, 200, HEADS[i], 'micro', T.dim);
    if (i) HA.el('rect', { x: COLS[i] + 12, y: 220, width: 172, height: 24, rx: 6, fill: T.line }, L); }
  var tkt = HA.g(L, { opacity: 0 }); HA.el('rect', { x: 0, y: 0, width: 172, height: 28, rx: 6, fill: T.paper }, tkt); HA.text(tkt, 10, 18, 'PAY-311', 'mono11', T.pink); var tk = HA.tick(tkt, 150, 8);
  var commit = HA.text(L, COLS[2] + 12, 300, 'First commit', 'micro', T.lime, { opacity: 0 });
  var pillG = HA.g(L, { opacity: 0 }); HA.el('rect', { x: 0, y: 0, width: 200, height: 32, rx: 16, fill: T.lime }, pillG); HA.text(pillG, 100, 20, 'Senior backend · .NET', 'micro', T.bg, { 'text-anchor': 'middle' });

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
    // profiles: arrive on the "Profiles" day; the interview lights the chosen one and dims the others
    for (i = 0; i < 3; i++) {
      var pa = HA.seg(t, PROF[i], PROF[i] + 280) * k, pk = HA.seg(t, PICK, PICK + 280) * k;
      HA.tf(cards[i].g, -6 * (1 - pa), 0); HA.op(cards[i].g, pa * (i === CHOSEN ? 1 : 1 - .55 * pk));
      if (i === CHOSEN) { cards[i].r.setAttribute('stroke', HA.mix(T.line, T.lime, pk)); cards[i].r.setAttribute('stroke-width', 1 + .5 * pk); }
    }
    ctick.draw(HA.seg(t, PTICK, PTICK + 280) * k); HA.op(chosenL, HA.seg(t, PTICK + 100, PTICK + 300) * k);
    repl.setAttribute('fill', HA.mix(T.faint, T.ink, HA.seg(t, REPL, REPL + 280) * k));
    // calendar
    var n = 0;
    for (i = 0; i < 14; i++) { var idx = FILLN.indexOf(i);
      if (idx >= 0) { var ft = FILL0 + idx * FILLS, p = HA.seg(t, ft, ft + FILLD) * k; if (t >= ft) n++; HA.op(cells[i].fill, p); cells[i].lbl.setAttribute('fill', HA.mix(T.dim, T.bg, p)); }
      else { strikes[i].setAttribute('stroke-dashoffset', 1 - HA.seg(t, WKND[i], WKND[i] + 160)); HA.op(strikes[i], k); } }
    var last = FILL0 + 9 * FILLS; HA.setText(dayL, 'Day ' + n + ' of 10'); dayL.setAttribute('fill', HA.mix(T.dim, T.ink, HA.seg(t, last, last + FILLD))); HA.op(dayL, k); HA.op(day0, 1 - k);
    for (i = 0; i < MS.length; i++) { var mt = FILL0 + FILLN.indexOf(MS[i][0]) * FILLS; msL[i].setAttribute('fill', HA.mix(T.faint, T.ink, HA.seg(t, mt, mt + FILLD) * k)); }
    // standup: pill slides in (snap), slot fades; ticket appears in TO DO, moves to DOING, then DONE with a tick and "FIRST COMMIT"
    // the chosen profile becomes the pill that travels into your standup (snap), and back under the reset fade
    var pp = HA.seg(t, PILL[0], PILL[1], E.snap) * k; HA.tf(pillG, HA.lerp(150, 878, pp), HA.lerp(PY[CHOSEN] + 14, 124, pp)); HA.op(pillG, HA.seg(t, PILL[0], PILL[0] + 120) * k); HA.op(slot, 1 - HA.seg(t, PILL[0], PILL[1]) * k);
    var tx = COLS[0] + 12; if (t >= MV1[0]) tx = HA.lerp(COLS[0] + 12, COLS[1] + 12, HA.seg(t, MV1[0], MV1[1], E.inOutCubic)); if (t >= MV2[0]) tx = HA.lerp(COLS[1] + 12, COLS[2] + 12, HA.seg(t, MV2[0], MV2[1], E.inOutCubic));
    HA.tf(tkt, tx, 256); HA.op(tkt, HA.seg(t, TKT, TKT + 200) * k);
    tk.draw(HA.seg(t, TICK, TICK + 280) * k); HA.op(commit, HA.seg(t, COMMIT, COMMIT + 200) * k);
  };
} };
