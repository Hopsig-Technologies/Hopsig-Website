// svc-cloud-devops — "Deploys that are boring, a bill you can explain". 1200 x 560, loop 12,000 ms, seed 55.
// A CI run fails on a flaky test, a fix commit lands, the re-run goes green through terraform plan, and three fixes shrink the bill.
HA.scenes['svc-cloud-devops'] = { loop: 12000, seed: 55, resolved: 10000, w: 1200, h: 560, mode: 'loop', build: function (c) {
  var T = HA.T, E = HA.ease, L = HA.g(c.svg), i;
  var LOOP = 12000, RESET = 11300, LINT1 = [600, 1000], TEST1 = [1000, 1400], FAIL = 1400, CLEAR = 2400, COMMIT = 2400, RUN2 = 3000, STAGE = 350;
  var PASSED = 5450, FIX = [5600, 6400, 7200], FIXD = 480, LIT = 160, TICK = 280, PLAN0 = 4050, PLANCPS = 60, COMMITCPS = 92;
  var NX = [70, 250, 430, 610, 790, 970], NAMES = ['Lint', 'Test', 'Build', 'Plan', 'Deploy', 'Smoke'], NY = 96, BAR = 122;

  // 2. run label: one text per run, crossfaded at the run change and under the reset
  var runA = HA.text(L, 70, 80, 'Run #482', 'micro', T.dim), runB = HA.text(L, 70, 80, 'Run #483', 'micro', T.dim, { opacity: 0 });
  // 3. pipeline: nodes, 2 px progress bars, ticks (the status dot crossfades out as the tick draws over it), connectors with flow
  var nodes = [], bars = [], ticks = [], conns = [], flows = [];
  for (i = 0; i < 6; i++) { var nd = HA.node(L, NX[i], NY, 150, '0' + (i + 1), NAMES[i]); nodes.push(nd);
    bars.push(HA.el('rect', { x: NX[i] + 14, y: NY + 50, width: 0, height: 2, fill: T.lime }, nd.g));
    ticks.push(HA.tick(nd.g, NX[i] + 128, NY + 16));
    if (i < 5) { var d = 'M' + (NX[i] + 150) + ' ' + (NY + 28) + ' H ' + NX[i + 1]; conns.push(HA.connector(L, d)); flows.push(HA.flow(L, d)); } }
  var flaky = HA.text(L, NX[1] + 14, NY + 72, '1 flaky test', 'micro', T.red, { opacity: 0 });
  // 4. git log: hash and message are tspans so the two colours share one baseline
  HA.el('rect', { x: 70, y: 200, width: 520, height: 200, rx: 12, fill: T.log, stroke: T.line }, L);
  HA.text(L, 94, 228, 'Git log · main', 'micro', T.dim);
  function commit(y, hash, msg, col) { var e = HA.text(L, 94, y, '', 'terminal', T.dim); e.h = HA.el('tspan', { fill: T.faint }, e); e.h.textContent = hash; e.m = HA.el('tspan', { fill: col }, e); e.m.textContent = msg; return e; }
  var olds = [['a41f2c', '  feat: refund endpoint'], ['7d02e9', '  chore: bump deps'], ['c9a113', '  docs: runbook']].map(function (o, j) { return commit(260 + 24 * j, o[0], o[1], T.dim); });
  var fix = commit(260, '', '', T.lime), FIXLINE = '9be310  fix: deterministic clock in test';
  // 5. deploy counter (40 px display numerals; 11 and 12 crossfade inside a group that snaps from scale 1.15).
  // Label and counter sit 4 px below the spec (352 / 388): the fourth log line lands at 332, and 20 px to the label read as one block.
  HA.text(L, 94, 356, 'Deploys this week', 'micro', T.dim);
  var depG = HA.g(L), d11 = HA.text(depG, 94, 392, '11', 'num', T.faint, { 'font-size': 40 }), d12 = HA.text(depG, 94, 392, '12', 'num', T.lime, { 'font-size': 40, opacity: 0 });
  // 6. bill panel. "Example figures" sits under the total: the top-right corner itself holds the total.
  HA.el('rect', { x: 640, y: 200, width: 490, height: 200, rx: 12, fill: T.raised, stroke: T.line }, L);
  HA.text(L, 664, 228, 'AWS bill · monthly', 'micro', T.dim);
  var total = HA.text(L, 1106, 232, '$18,400', 'num', T.faint, { 'font-size': 24, 'text-anchor': 'end' });
  HA.text(L, 1106, 248, 'Example figures', 'micro', T.faint, { 'text-anchor': 'end' });
  var W0 = [173, 98, 62, 43, 66], W1 = [103, 52, 21, 43, 66], SEGFIX = [2, 0, 1, -1, -1], SEGN = ['Compute', 'DB', 'NAT', 'S3', 'Other'], segs = [], segl = [];
  for (i = 0; i < 5; i++) { segs.push(HA.el('rect', { x: 664, y: 256, width: W0[i], height: 20, rx: 4, fill: T.faint, 'fill-opacity': i % 2 ? .7 : 1 }, L)); segl.push(HA.text(L, 664, 296, SEGN[i], 'micro', T.dim)); }
  var fixl = [['− $1,900', '  idle read replica removed'], ['− $1,700', '  S3 traffic via VPC endpoint'], ['− $2,900', '  node pool right-sized']].map(function (f, j) {
    var e = HA.text(L, 664, 330 + 24 * j, '', 'mono12', T.dim, { opacity: 0 }); HA.el('tspan', { fill: T.lime }, e).textContent = f[0]; HA.el('tspan', { fill: T.dim }, e).textContent = f[1]; return e; });
  // 7. plan strip; line 2 is six coloured tspans typed as one string
  HA.el('rect', { x: 70, y: 424, width: 1060, height: 84, rx: 12, fill: T.log, stroke: T.line }, L);
  HA.text(L, 94, 456, '$ terraform plan', 'terminal', T.dim);
  var plan = HA.text(L, 94, 484, '', 'terminal', T.ink), PLAN = [['Plan: ', T.ink], ['3 to add', T.lime], [', ', T.ink], ['1 to change', T.amber], [', ', T.ink], ['0 to destroy.', T.faint]];
  var planT = PLAN.map(function (p) { return HA.el('tspan', { fill: p[1] }, plan); });

  return function update(t) {
    var k = t >= RESET ? 1 - HA.seg(t, RESET, LOOP, E.inOutCubic) : 1;   // reset crossfade: every lit quantity x k
    // texts that share a baseline swap in two halves under the reset (resolved one out, then the before one in) so the glyphs never overlap
    var k1 = 1 - HA.seg(t, RESET, RESET + 350, E.inOutCubic), k2 = 1 - HA.seg(t, RESET + 350, LOOP, E.inOutCubic);
    var r1 = t < RUN2, red = r1 ? HA.seg(t, FAIL, FAIL + LIT) * (1 - HA.seg(t, CLEAR, CLEAR + 280)) : 0;
    // run label
    HA.setText(runA, t >= FAIL && t < CLEAR ? 'RUN #482 FAILED' : 'RUN #482'); runA.setAttribute('fill', HA.mix(T.dim, T.red, red)); HA.op(runA, r1 ? 1 : 1 - k2);
    HA.setText(runB, t >= PASSED ? 'RUN #483 PASSED' : 'RUN #483'); runB.setAttribute('fill', HA.mix(T.dim, T.lime, HA.seg(t, PASSED, PASSED + 280) * k)); HA.op(runB, r1 ? 0 : k1);
    HA.op(flaky, red);
    // pipeline: run #482 (Lint passes, Test fails at 60%) is cut at 3,000 when run #483 starts; run #483 lights x k
    for (i = 0; i < 6; i++) { var n = nodes[i], s = RUN2 + STAGE * i, lime = 0, bw = 0, bop = 1, tk = 0, rd = 0, tkop = 1;
      if (r1) { if (i === 0) { bw = BAR * HA.seg(t, LINT1[0], LINT1[1], E.linear); lime = HA.seg(t, LINT1[1], LINT1[1] + LIT); tk = HA.seg(t, LINT1[1], LINT1[1] + TICK); }
        if (i === 1) { bw = .6 * BAR * HA.seg(t, TEST1[0], TEST1[1], E.linear); rd = red; bop = 1 - HA.seg(t, CLEAR, CLEAR + 280); } }
      else { bw = BAR * HA.seg(t, s, s + STAGE, E.linear) * k; lime = HA.seg(t, s + STAGE, s + STAGE + LIT) * k; tk = HA.seg(t, s + STAGE, s + STAGE + TICK); tkop = k; }
      n.rect.setAttribute('stroke', HA.mix(HA.mix(T.line, T.lime, lime), T.red, rd)); n.rect.setAttribute('stroke-width', 1 + .5 * Math.max(lime, rd));
      n.lbl.setAttribute('fill', HA.mix(T.dim, T.ink, Math.max(lime, rd))); n.dot.setAttribute('fill', HA.mix(HA.mix(T.faint, T.lime, lime), T.red, rd)); HA.op(n.dot, 1 - tk * tkop);
      bars[i].setAttribute('width', bw); bars[i].setAttribute('fill', HA.mix(T.lime, T.red, rd)); HA.op(bars[i], bop);
      ticks[i].draw(tk); HA.op(ticks[i], tkop); }
    for (i = 0; i < 5; i++) { var cp = r1 ? (i === 0 ? HA.seg(t, LINT1[1], LINT1[1] + LIT) : 0) : HA.seg(t, RUN2 + STAGE * (i + 1), RUN2 + STAGE * (i + 1) + LIT) * k;
      conns[i].setAttribute('stroke', HA.mix(T.line, T.lime, cp)); flows[i].run(t, cp > .5); HA.op(flows[i], cp); }
    // git log: the older lines shift down first (200 ms), then the fix commit types into the cleared top line by 3,000; both return under the reset
    var sh = HA.seg(t, COMMIT, COMMIT + 200, E.inOutCubic) * k; for (i = 0; i < 3; i++) olds[i].setAttribute('y', 260 + 24 * i + 24 * sh);
    var typed = HA.typed(FIXLINE, t, COMMIT + 160, COMMITCPS); HA.setText(fix.h, typed.slice(0, 6)); HA.setText(fix.m, typed.slice(6)); HA.op(fix, k);
    // deploy counter: 12 pops in at scale 1.15 and snaps to 1
    var dp = HA.seg(t, PASSED, PASSED + LIT), ds = t < PASSED ? 1 : 1.15 - .15 * HA.seg(t, PASSED, PASSED + 280, E.snap);
    HA.tf(depG, 94 * (1 - ds), 392 * (1 - ds), ds); HA.op(d11, 1 - dp * k2); HA.op(d12, dp * k1);
    // bill: segments shrink (later ones slide left), the total counts down, each fix line fades in; all return under the reset
    var pf = FIX.map(function (f) { return HA.seg(t, f, f + FIXD, E.inOutCubic) * k; }), pc = FIX.map(function (f) { return HA.seg(t, f, f + FIXD); }), x = 664;
    for (i = 0; i < 5; i++) { var w = SEGFIX[i] >= 0 ? HA.lerp(W0[i], W1[i], pf[SEGFIX[i]]) : W0[i];
      HA.set(segs[i], { x: x, width: w }); segl[i].setAttribute('x', x); HA.op(segl[i], HA.clamp((w - 36) / 4, 0, 1)); x += w + 2; }
    HA.setText(total, HA.fmt(18400 - (1900 * pc[0] + 1700 * pc[1] + 2900 * pc[2]) * k, { prefix: '$' }));
    total.setAttribute('fill', HA.mix(T.faint, T.lime, HA.clamp((pc[2] - .8) / .2, 0, 1) * k));
    for (i = 0; i < 3; i++) HA.op(fixl[i], HA.seg(t, FIX[i], FIX[i] + FIXD) * k);
    // plan line 2 types at 60 cps from 4,050 (done by 4,750)
    var nch = Math.floor(Math.max(0, t - PLAN0) * PLANCPS / 1000), cum = 0;
    for (i = 0; i < PLAN.length; i++) { var len = PLAN[i][0].length; HA.setText(planT[i], PLAN[i][0].slice(0, HA.clamp(nch - cum, 0, len))); cum += len; }
    HA.op(plan, k);
  };
} };
