// ind-fintech — "Payments that clear. Books that balance." 1200 x 560, loop 12,000 ms, seed 101.
// A tokenised £120 payment walks authorise → capture → settle → reconcile; a double-entry ledger posts as it goes and lands on
// difference 0.00; switching tokenisation on shrinks the card-data scope box from four systems to the PSP vault.
HA.scenes['ind-fintech'] = { loop: 12000, seed: 101, resolved: 10000, w: 1200, h: 560, mode: 'loop', build: function (c) {
  var T = HA.T, E = HA.ease, L = HA.g(c.svg), i;
  var LOOP = 12000, RESET = 11300;
  var NX = [70, 360, 650, 940], CX = [170, 460, 750, 1040], NAMES = ['Authorise', 'Capture', 'Settle', 'Reconcile'];
  var LIT = [1000, 2300, 3600, 4900], CONN = [1600, 2900, 4200], LEGS = [[1600, 2300, 0, 1], [2900, 3600, 1, 2], [4200, 4900, 2, 3]];
  var TOK = [1000, 1400], ROWT = [1200, 2300, 2450, 2600, 3600, 3750, 4900], ROWD = 280, TYPE0 = 1200, CPS = 80;
  var CNT1 = [2300, 2750], CNT2 = [3600, 3900], TICK7 = [4920, 5200], DIFF = [5200, 5700], FLASH = [5200, 5450, 5700], TOG = [6000, 6200], SCOPE = [6200, 6900];
  var BOX0 = [802, 248, 316, 172], BOX1 = [962, 360, 144, 60];
  var ROWS = [['AUTH', 'Customer funds held (no posting)', '—', '—'], ['CAPTURE', 'Receivable · PSP', '120.00', ''], ['CAPTURE', 'Payable · merchant', '', '116.40'],
              ['CAPTURE', 'Fee revenue', '', '3.60'], ['SETTLE', 'Bank', '120.00', ''], ['SETTLE', 'Receivable · PSP', '', '120.00'], ['RECONCILE', 'Bank statement line matched', '', '']];

  // 2. lifecycle rail
  var nodes = NX.map(function (x, j) { return HA.node(L, x, 96, 200, '0' + (j + 1), NAMES[j]); });
  var conns = [], flows = [];
  for (i = 0; i < 3; i++) { var d = 'M' + (NX[i] + 200) + ' 124 H ' + NX[i + 1]; conns.push(HA.connector(L, d)); flows.push(HA.flow(L, d)); }
  // 3. payment token (104 x 36 sheet, group centred on the token's centre)
  var card = HA.g(L, { opacity: 0 }); HA.sheet(card, -52, -18, 104, 36);
  HA.text(card, -42, -3, 'tok_8f2a', 'mono11', T.pink); HA.text(card, -42, 12, '£120.00', 'sans13', T.pink);
  // 4. ledger panel
  HA.el('rect', { x: 70, y: 200, width: 680, height: 300, rx: 12, fill: T.log, stroke: T.line }, L);
  var flash = HA.el('rect', { x: 70, y: 200, width: 680, height: 300, rx: 12, fill: 'none', stroke: T.lime, 'stroke-width': 1.5, opacity: 0 }, L);
  // the ledger carries the worked example's figures; the label sits one micro line above the header (the header line is full)
  HA.text(L, 726, 216, 'Example figures', 'micro', T.faint, { 'text-anchor': 'end' });
  HA.text(L, 94, 232, 'Stage', 'micro', T.faint); HA.text(L, 214, 232, 'Account', 'micro', T.faint);
  HA.text(L, 590, 232, 'Debit', 'micro', T.faint, { 'text-anchor': 'end' }); HA.text(L, 726, 232, 'Credit', 'micro', T.faint, { 'text-anchor': 'end' });
  var rowG = [], acc0, tick7;
  for (i = 0; i < 7; i++) { var g = HA.g(L, { opacity: 0 }), y = 264 + 24 * i, r = ROWS[i], first = i === 0, numC = first ? T.faint : T.ink;
    HA.text(g, 94, y, r[0], 'terminal', T.faint); var a = HA.text(g, 214, y, first ? '' : r[1], 'terminal', first ? T.faint : T.dim); if (first) acc0 = a;
    HA.text(g, 590, y, r[2], 'terminal', numC, { 'text-anchor': 'end' }); HA.text(g, 726, y, r[3], 'terminal', numC, { 'text-anchor': 'end' });
    if (i === 6) tick7 = HA.tick(g, 712, y - 11, 1);
    rowG.push(g); }
  HA.el('line', { x1: 70, y1: 428, x2: 750, y2: 428, stroke: T.line }, L);
  HA.text(L, 94, 452, 'Total', 'micro', T.dim);
  var deb = HA.text(L, 590, 452, '0.00', 'terminal', T.faint, { 'text-anchor': 'end' }), cred = HA.text(L, 726, 452, '0.00', 'terminal', T.faint, { 'text-anchor': 'end' });
  var diffG = HA.g(L, { opacity: 0 }); HA.text(diffG, 94, 484, 'Difference', 'micro', T.dim); HA.text(diffG, 214, 484, '0.00', 'terminal', T.lime);
  var dtick = HA.tick(diffG, 254, 473, 1);
  // 5. scope panel
  HA.el('rect', { x: 790, y: 200, width: 340, height: 300, rx: 12, fill: T.raised, stroke: T.line }, L);
  HA.text(L, 814, 232, 'Card data scope', 'micro', T.dim);
  HA.text(L, 1062, 232, 'Tokenised', 'micro', T.dim, { 'text-anchor': 'end' });
  var track = HA.el('rect', { x: 1070, y: 218, width: 36, height: 20, rx: 10, fill: T.line }, L), knob = HA.el('circle', { cx: 1080, cy: 228, r: 8, fill: T.dim }, L);
  function sys(x, y, label) { var g2 = HA.g(L); HA.el('rect', { x: x, y: y, width: 120, height: 36, rx: 8, fill: T.raised, stroke: T.line }, g2); HA.text(g2, x + 14, y + 23, label, 'sans13', T.dim); return g2; }
  var sysA = sys(814, 260, 'App'), sysB = sys(974, 260, 'API'), sysC = sys(814, 316, 'Ledger'); sys(974, 372, 'PSP vault');
  var box = HA.el('rect', { x: BOX0[0], y: BOX0[1], width: BOX0[2], height: BOX0[3], rx: 6, fill: 'none', stroke: T.amber, 'stroke-width': 1.5, 'stroke-dasharray': '5 4' }, L);
  var lab0 = HA.text(L, 814, 450, 'In scope: 4 systems', 'micro', T.amber), lab1 = HA.text(L, 814, 450, 'In scope: PSP vault only', 'micro', T.lime, { opacity: 0 });
  HA.text(L, 814, 478, 'Built to keep PCI DSS scope small', 'micro', T.faint);

  return function update(t) {
    var k = t >= RESET ? 1 - HA.seg(t, RESET, LOOP, E.inOutCubic) : 1;   // reset crossfade: every lit quantity x k
    // rail
    for (i = 0; i < 4; i++) nodes[i].lit(HA.seg(t, LIT[i], LIT[i] + 160) * k);
    for (i = 0; i < 3; i++) { var p = HA.seg(t, CONN[i], CONN[i] + 160) * k; conns[i].setAttribute('stroke', HA.mix(T.line, T.lime, p)); flows[i].run(t, p > .5); HA.op(flows[i], p); }
    // token: fades in over Authorise (centre y 54 -> 62), travels node to node, fades out in place under the reset
    var tp = HA.seg(t, TOK[0], TOK[1]), cx = CX[0];
    for (i = 0; i < LEGS.length; i++) { var lg = LEGS[i]; if (t >= lg[0]) cx = HA.lerp(CX[lg[2]], CX[lg[3]], HA.seg(t, lg[0], lg[1], E.inOutCubic)); }
    HA.tf(card, cx, HA.lerp(54, 62, tp)); HA.op(card, tp * k);
    // ledger rows: opacity 0 -> 1, x -6 -> 0. Row 1 types its account at 80 cps so the 32 characters finish inside the spec's 400 ms window.
    for (i = 0; i < 7; i++) { var a = HA.seg(t, ROWT[i], ROWT[i] + ROWD); HA.tf(rowG[i], -6 * (1 - a), 0); HA.op(rowG[i], a * k); }
    HA.setText(acc0, HA.typed(ROWS[0][1], t, TYPE0, CPS));
    tick7.draw(HA.seg(t, TICK7[0], TICK7[1]));
    // totals: 0 -> 120 at capture, -> 240 at settle; faint -> ink on the first posting
    var v = (120 * HA.seg(t, CNT1[0], CNT1[1]) + 120 * HA.seg(t, CNT2[0], CNT2[1])) * k, vc = HA.mix(T.faint, T.ink, HA.seg(t, CNT1[0], CNT1[1]) * k);
    HA.setText(deb, HA.fmt(v, { dec: 2 })); HA.setText(cred, HA.fmt(v, { dec: 2 })); deb.setAttribute('fill', vc); cred.setAttribute('fill', vc);
    HA.op(diffG, HA.seg(t, DIFF[0], DIFF[1]) * k); dtick.draw(HA.seg(t, DIFF[0], DIFF[0] + 280));
    HA.op(flash, (HA.seg(t, FLASH[0], FLASH[1]) - .6 * HA.seg(t, FLASH[1], FLASH[2])) * k);   // 0 -> 1 -> .4, held at .4
    // toggle
    var tg = HA.seg(t, TOG[0], TOG[1], E.snap) * k;
    knob.setAttribute('cx', HA.lerp(1080, 1096, tg)); track.setAttribute('fill', HA.mix(T.line, T.lime, tg)); knob.setAttribute('fill', HA.mix(T.dim, T.bg, tg));
    // scope box: the one permitted size animation; grows back to the before rect under the reset
    var sp = HA.seg(t, SCOPE[0], SCOPE[1], E.inOutCubic) * k;
    HA.set(box, { x: HA.lerp(BOX0[0], BOX1[0], sp), y: HA.lerp(BOX0[1], BOX1[1], sp), width: HA.lerp(BOX0[2], BOX1[2], sp), height: HA.lerp(BOX0[3], BOX1[3], sp), stroke: HA.mix(T.amber, T.lime, sp) });
    HA.op(sysA, 1 - .5 * sp); HA.op(sysB, 1 - .5 * sp); HA.op(sysC, 1 - .5 * sp);
    HA.op(lab0, 1 - sp); HA.op(lab1, sp);
  };
} };
