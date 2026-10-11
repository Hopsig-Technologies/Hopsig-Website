// svc-ai-ml — "Eval harness before the demo". 1200 x 560, loop 12,000 ms, seed 44.
// Eight golden questions run through an eval gate three times; a scoreboard fills with diff colours; the ship pill unlocks when the rule clears.
HA.scenes['svc-ai-ml'] = { loop: 12000, seed: 44, resolved: 10000, w: 1200, h: 560, mode: 'loop', build: function (c) {
  var T = HA.T, E = HA.ease, L = HA.g(c.svg), i, r;
  var LOOP = 12000, RESET = 11300, RUN = [800, 3200, 5600], RUNLEN = 2400, SHIP = 8000;
  var LEAVE = 150, TRAVEL = 300, THRU = 200, FLASH = 400, LIT = 160, REDHOLD = 1000, COUNT0 = 1500, COUNTD = 600, DOTRESET = 200;
  var Q = ['Refund window for EU orders?', 'Which plan includes SSO?', 'Prorated if cancelled mid-cycle?', 'Data kept after account deletion?', 'Price of the Enterprise Max plan?', 'VAT on UK invoices?', 'CSV export row limit?', 'Who founded your competitor?'];
  var PAT = [[1, 1, 0, 1, 0, 1, 1, 0], [1, 1, 1, 1, 0, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1]];
  var ROWS = [['v1 · baseline', 71, 64, 40, 1.9, .82], ['v2 · reranker', 86, 88, 70, 2.4, 1.10], ['v3 · eval-tuned prompt', 94, 97, 92, 1.6, .64]];
  // value columns sit right of the spec's (640 / 756 / 852 / 966 / 1052): "v3 · eval-tuned prompt" in node-label is ~185 px wide and would run under ACCURACY at 640
  var COLX = [544, 744, 832, 906, 998, 1062], HEAD = ['Version', 'Accuracy', 'Cited', 'Refused OK', 'P95', '$ / 1K'], RY = [176, 232, 288];
  var FMT = [{ suffix: '%' }, { suffix: '%' }, { suffix: '%' }, { dec: 1, suffix: ' s' }, { dec: 2, prefix: '$' }];

  // 2. golden set (all eight questions fit the row at 12 px mono, so none is truncated)
  HA.text(L, 70, 80, 'Golden set · 8 of 120 shown', 'micro', T.dim);
  var rows = [];
  for (i = 0; i < 8; i++) { var y = 96 + i * 40; HA.el('rect', { x: 70, y: y, width: 300, height: 32, rx: 6, fill: T.raised, stroke: T.line }, L); HA.text(L, 82, y + 21, Q[i], 'mono12', T.dim); rows.push({ y: y, cy: y + 16 }); }
  // 7. question particles sit under the result dots, so they emerge from the dot and return beneath it unseen
  for (i = 0; i < 8; i++) rows[i].pt = HA.el('circle', { cx: 386, cy: rows[i].cy, r: 4, fill: T.faint }, L);
  for (i = 0; i < 8; i++) rows[i].dot = HA.el('circle', { cx: 386, cy: rows[i].cy, r: 5, fill: T.faint }, L);
  // 3. eval gate with a lime and a red flash segment per row
  HA.el('rect', { x: 436, y: 96, width: 8, height: 312, rx: 4, fill: T.raised, stroke: T.line }, L);
  HA.text(L, 440, 84, 'Eval gate', 'micro', T.dim, { 'text-anchor': 'middle' });
  for (i = 0; i < 8; i++) { rows[i].gl = HA.el('rect', { x: 436, y: rows[i].y, width: 8, height: 32, rx: 2, fill: T.lime, opacity: 0 }, L); rows[i].gr = HA.el('rect', { x: 436, y: rows[i].y, width: 8, height: 32, rx: 2, fill: T.red, opacity: 0 }, L); }
  // 4. scoreboard
  HA.el('rect', { x: 520, y: 96, width: 610, height: 248, rx: 12, fill: T.raised, stroke: T.line }, L);
  for (i = 0; i < 6; i++) HA.text(L, COLX[i], 128, HEAD[i], 'micro', T.dim);
  [148, 204, 260].forEach(function (ly) { HA.el('line', { x1: 520, y1: ly, x2: 1130, y2: ly, stroke: T.line }, L); });
  // "Example figures" goes in the panel's empty bottom band: its header row has no room at the top right
  HA.text(L, 1114, 330, 'Example figures', 'micro', T.faint, { 'text-anchor': 'end' });
  var board = [];
  for (r = 0; r < 3; r++) { var R = ROWS[r], cells = [], lbl = HA.text(L, 544, RY[r], R[0], 'label', T.dim);
    for (i = 0; i < 5; i++) { var worse = r > 0 && (i < 3 ? R[i + 1] < ROWS[r - 1][i + 1] : R[i + 1] > ROWS[r - 1][i + 1]);
      var col = r === 0 ? T.ink : worse ? T.amber : T.lime, x = COLX[i + 1];
      var cell = { dash: HA.text(L, x, RY[r], '—', 'terminal', T.faint), val: HA.text(L, x, RY[r], '', 'terminal', col, { opacity: 0 }), col: col, pct: i < 3, v: R[i + 1], arrow: null };
      if (worse) cell.arrow = HA.el('path', { d: 'M5 9.5 V1.5 M1.5 5 L5 1.5 L8.5 5', fill: 'none', stroke: T.amber, 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', transform: 'translate(' + (x + 43) + ' ' + (RY[r] - 10) + ')', opacity: 0 }, L);
      cells.push(cell); }
    board.push({ lbl: lbl, cells: cells }); }
  // 5. ship rule and its tick
  HA.text(L, 520, 372, 'Ship rule: accuracy ≥ 90% and refusals ≥ 85%', 'micro', T.dim);
  var ruleTk = HA.tick(L, 892, 362);
  // 6. ship pill: padlock + BLOCKED, crossfading to tick + SHIP v3 on a lime fill. Labels are micro geometry without the uppercase so "v3" stays as written.
  var pillG = HA.g(L); var pr = HA.el('rect', { x: 990, y: 412, width: 140, height: 36, rx: 18, fill: T.lime, 'fill-opacity': 0, stroke: T.faint }, pillG);
  var lock = HA.padlock(pillG, 1029, 429, T.faint); HA.tf(lock, 1029, 429, 10 / 14);
  var ptk = HA.tick(pillG, 1024, 426, 10 / 14, T.bg, 2.8);
  var MICRO = { 'font-weight': 500, 'letter-spacing': '0.12em' };
  var pt0 = HA.text(pillG, 1042, 434, 'BLOCKED', 'mono11', T.faint, MICRO), pt1 = HA.text(pillG, 1042, 434, 'SHIP v3', 'mono11', T.bg, { 'font-weight': 500, 'letter-spacing': '0.12em', opacity: 0 });

  return function update(t) {
    var k = t >= RESET ? 1 - HA.seg(t, RESET, LOOP, E.inOutCubic) : 1;   // reset crossfade: every lit quantity x k
    // rows: each run contributes lime / red to the dot, a gate flash, and the particle's position; a run's dot state fades under the next run's reset
    for (i = 0; i < 8; i++) { var row = rows[i], lime = 0, red = 0, gl = 0, gr = 0, x = 386, op = 1, ui = LEAVE * i, hitT = ui + TRAVEL;
      for (r = 0; r < 3; r++) { var u = t - RUN[r], pass = PAT[r][i], hold = r < 2 ? 1 - HA.seg(u, RUNLEN, RUNLEN + DOTRESET) : k, hit = HA.seg(u, hitT, hitT + LIT);
        if (pass) { lime += hit * hold; gl += HA.pulse(u, hitT, hitT + FLASH); }
        else { red += hit * (1 - HA.seg(u, hitT + REDHOLD, hitT + REDHOLD + LIT)) * hold; gr += HA.pulse(u, hitT, hitT + FLASH); }
        if (u >= 0) { x = r > 0 && !PAT[r - 1][i] ? HA.lerp(400, 386, HA.seg(u, 0, DOTRESET, E.inOutCubic)) : 386; op = 1;
          if (u >= ui) x = HA.lerp(386, 440, HA.seg(u, ui, hitT, E.inOutCubic));
          if (u >= hitT) { var q = HA.seg(u, hitT, hitT + THRU); if (pass) { x = HA.lerp(440, 500, q); op = 1 - q; } else x = HA.lerp(440, 400, q); } } }
      row.dot.setAttribute('fill', HA.mix(HA.mix(T.faint, T.lime, HA.clamp(lime, 0, 1)), T.red, HA.clamp(red, 0, 1)));
      row.pt.setAttribute('cx', x); HA.op(row.pt, op); HA.op(row.gl, HA.clamp(gl, 0, 1)); HA.op(row.gr, HA.clamp(gr, 0, 1)); }
    // scoreboard: percentages count from 0 and colour over the last 20%, times and costs fade in; dashes crossfade back under the reset
    for (r = 0; r < 3; r++) { var u2 = t - RUN[r], B = board[r], cp = HA.seg(u2, COUNT0, COUNT0 + COUNTD), fo = HA.seg(u2, COUNT0, COUNT0 + LIT) * k, fi = cp * k;
      B.lbl.setAttribute('fill', HA.mix(T.dim, T.ink, fo));
      for (i = 0; i < 5; i++) { var C = B.cells[i]; HA.op(C.dash, 1 - fo);
        if (C.pct) { HA.setText(C.val, HA.fmt(HA.lerp(0, C.v, cp), FMT[i])); C.val.setAttribute('fill', HA.mix(T.faint, C.col, HA.clamp((cp - .8) / .2, 0, 1))); HA.op(C.val, fo); }
        else { HA.setText(C.val, HA.fmt(C.v, FMT[i])); HA.op(C.val, fi); }
        if (C.arrow) HA.op(C.arrow, fi); } }
    // ship: tick by the rule, pill snaps to scale 1, fills lime, padlock and label crossfade
    var ss = .95 + .05 * HA.seg(t, SHIP, SHIP + 400, E.snap) * k; HA.tf(pillG, 1060 * (1 - ss), 430 * (1 - ss), ss);
    var fp = HA.seg(t, SHIP + 120, SHIP + 280) * k; pr.setAttribute('fill-opacity', fp); pr.setAttribute('stroke', HA.mix(T.faint, T.lime, fp));
    HA.op(lock, 1 - fp); ptk.draw(fp); HA.op(ptk, fp); HA.op(pt0, 1 - fp); HA.op(pt1, fp);
    var rq = HA.seg(t, SHIP, SHIP + 280); ruleTk.draw(rq); HA.op(ruleTk, rq > 0 ? k : 0);
  };
} };
