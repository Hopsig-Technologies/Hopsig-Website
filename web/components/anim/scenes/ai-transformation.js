// ai-transformation — "Six weeks in your repo", under the AI Transformation hero. 1200 x 560, scroll-scrubbed (mode 'scrub'), timeline 7,000 ms, seed 6.
// The pipeline installs itself into the client's repo, their team takes it over, and five metrics move from a week-0 baseline to week 6.
// update(t) just renders t in 0…7000: no reset phase, no loop seam. W6 (6,000–7,000) is the end state.
HA.scenes['ai-transformation'] = { loop: 7000, seed: 6, resolved: 7000, w: 1200, h: 560, mode: 'scrub', build: function (c) {
  var T = HA.T, E = HA.ease, L = HA.g(c.svg), i;
  c.inst.goto = c.inst.goto || function (t) { c.inst.scrubT = t; };   // default; the page replaces it with a smooth scroll
  var WEEK = 1000, CAPS = ['Baseline measured on your repo', 'Pipeline installed on one service', 'First stories shipped through the gates', 'Your engineers run it; we review', 'Rolled out to a second service', 'Guardrails and evals tuned', 'Measured against week 0'];
  var FILES = [['src/', 0], ['tests/', 0], ['.github/workflows/ci.yml', 0], ['package.json', 0], ['CLAUDE.md', 1000], ['.claude/agents/', 1120], ['hooks/pre-merge', 1240], ['docs/runbook.md', 3000], ['services/billing/', 4000]];
  var CHIPS = ['Plan', 'Stories', 'Build', 'Review', 'Document', 'Escalate'], CHIP_T0 = 1000, CHIP_ST = 100, CHIP_D = 480, GATE_T = [1820, 1980], GATES = [160, 304];
  // a run is 900 ms in all: 660 ms of travel split by distance plus the two 120 ms gate pauses (900 + 240 would spill into the next week)
  var RUNS = [2000, 3000, 4000, 4300], RUN_D = 900, LEGS = [[136, 160, 0, 66], [160, 304, 186, 582], [304, 376, 702, 900]], PAUSES = [[66, 186], [582, 702]];
  var ROWS = [['Lead time', 6, 2.5, { dec: 1, suffix: ' days' }, '−58%'], ['PR cycle time', 30, 9, { suffix: ' h' }, '−70%'], ['Review turnaround', 18, 4, { suffix: ' h' }, '−78%'], ['Test coverage', 61, 82, { suffix: '%' }, '+21 pts'], ['Change-fail rate', 14, 7, { suffix: '%' }, '−50%']];
  var TICKX = [70, 247, 423, 600, 777, 953, 1130], RED = [5000, 5400], HOOK_TICK = 5400, COUNT = [1500, 6300], LIME = [6000, 6400], PILL_T = 3000, POP = 6000;
  // particle y along the connector at tau ms into a run, and the first tau at which it reaches y (monotone, so bisect)
  function runY(tau) { if (tau <= 0) return 136; for (var j = 0; j < 3; j++) { var g = LEGS[j]; if (tau < g[2]) return g[0]; if (tau < g[3]) return HA.lerp(g[0], g[1], E.inOutCubic((tau - g[2]) / (g[3] - g[2]))); } return 376; }
  function runT(y) { if (y <= 136) return 0; if (y >= 376) return RUN_D; var lo = 0, hi = RUN_D; for (var n = 0; n < 40; n++) { var m = (lo + hi) / 2; if (runY(m) < y) lo = m; else hi = m; } return hi; }
  var CHIP_IN = [], CHIP_OUT = []; for (i = 0; i < 6; i++) { CHIP_IN.push(runT(120 + 48 * i)); CHIP_OUT.push(runT(152 + 48 * i)); }
  function chipLit(t, j) { var m = 0; for (var r = 0; r < RUNS.length; r++) { var a = RUNS[r] + CHIP_IN[j], b = RUNS[r] + CHIP_OUT[j]; m = Math.max(m, Math.min(HA.seg(t, a, a + 80), 1 - HA.seg(t, b, b + 300))); } return m; }
  function gateFlash(t, j) { var m = 0; for (var r = 0; r < RUNS.length; r++) { var a = RUNS[r] + PAUSES[j][0], b = RUNS[r] + PAUSES[j][1]; m = Math.max(m, Math.min(HA.seg(t, a, a + 60), 1 - HA.seg(t, b, b + 200))); } return m; }
  // 2. repo window
  HA.el('rect', { x: 70, y: 64, width: 620, height: 400, rx: 12, fill: T.log, stroke: T.line }, L);
  HA.el('line', { x1: 70, y1: 100, x2: 690, y2: 100, stroke: T.line }, L);
  [92, 106, 120].forEach(function (x) { HA.el('circle', { cx: x, cy: 82, r: 4, fill: T.faint }, L); });
  HA.text(L, 140, 86, 'your-org / payments-api', 'micro', T.dim);
  HA.el('line', { x1: 300, y1: 100, x2: 300, y2: 464, stroke: T.line }, L);
  var files = FILES.map(function (f, r) { var g = HA.g(L), e = HA.text(g, 90, 132 + 24 * r, f[1] ? '' : f[0], 'terminal', T.dim), nm = null;
    if (f[1]) { var pl = HA.el('tspan', { fill: T.lime }, e); pl.textContent = '+ '; nm = HA.el('tspan', { fill: T.ink }, e); nm.textContent = f[0]; } return { g: g, t0: f[1], name: nm }; });
  var hookTick = HA.tick(L, 90 + 17 * 7.8 + 10, 265, 1);   // right end of "+ hooks/pre-merge" (17 mono chars at 13 px)
  var conn = HA.el('path', { d: 'M410 136 V376', fill: 'none', stroke: T.line, 'stroke-width': 1.5, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1 }, L);
  var chips = CHIPS.map(function (n, j) { var g = HA.g(L), y = 120 + 48 * j; var r = HA.el('rect', { x: 330, y: y, width: 160, height: 32, rx: 8, fill: T.raised, stroke: T.line }, g); var l = HA.text(g, 344, y + 21, n, 'sans13', T.dim); return { g: g, r: r, l: l }; });
  var gates = GATES.map(function (y) { var g = HA.g(L); var r = HA.el('rect', { x: -5, y: -5, width: 10, height: 10, rx: 1, fill: T.log, stroke: T.amber, 'stroke-width': 1.5, transform: 'rotate(45)' }, g); HA.tf(g, 410, y); return { g: g, r: r }; });
  var parts = RUNS.map(function () { var p = HA.particle(L, 410, 136); p.lit(1); HA.op(p, 0); return p; });
  var pillW = HA.g(L), pill = HA.pill(pillW, 590, 140, 164, 'Run by your team', 28); pill.tone(T.lime);
  // 3. metrics panel
  HA.el('rect', { x: 730, y: 64, width: 400, height: 400, rx: 12, fill: T.raised, stroke: T.line }, L);
  HA.text(L, 754, 96, 'Measured on your repo', 'micro', T.dim); HA.text(L, 1106, 96, 'Example figures', 'micro', T.faint, { 'text-anchor': 'end' });
  var rows = ROWS.map(function (R, j) { var y0 = 124 + 64 * j; HA.text(L, 754, y0 + 14, R[0], 'micro', T.dim);
    var before = HA.text(L, 754, y0 + 40, HA.fmt(R[1], R[3]), 'terminal', T.faint); HA.text(L, 826, y0 + 40, '→', 'terminal', T.faint);
    var dash = HA.text(L, 850, y0 + 40, '—', 'label', T.faint), val = HA.text(L, 850, y0 + 40, '', 'label', T.ink);
    HA.el('rect', { x: 754, y: y0 + 50, width: 352, height: 4, rx: 2, fill: T.line }, L); var bar = HA.el('rect', { x: 754, y: y0 + 50, width: 352, height: 4, rx: 2, fill: T.faint }, L);
    var pg = HA.g(L); HA.el('rect', { x: -32, y: -11, width: 64, height: 22, rx: 11, fill: T.lime }, pg); HA.text(pg, 0, 4, R[4], 'micro', T.bg, { 'text-anchor': 'middle' }); HA.tf(pg, 1074, y0 + 35, .8); HA.op(pg, 0);
    return { before: before, dash: dash, val: val, bar: bar, pill: pg, cy: y0 + 35, R: R }; });
  // 4–6. week rail, playhead, caption
  HA.el('line', { x1: 70, y1: 512, x2: 1130, y2: 512, stroke: T.line, 'stroke-width': 1.5 }, L);
  var railLit = HA.el('line', { x1: 70, y1: 512, x2: 70, y2: 512, stroke: T.lime, 'stroke-width': 1.5 }, L);
  var ticks = TICKX.map(function (x, j) { var cc = HA.el('circle', { cx: x, cy: 512, r: 5, fill: T.bg, stroke: T.faint }, L); HA.text(L, x, 532, 'W' + j, 'micro', T.dim, { 'text-anchor': 'middle' });
    var b = HA.button(c, x - 14, 500, 28, 28, 'W' + j, 'outline', function () { c.inst.goto(j * WEEK); });
    b.setAttribute('aria-label', 'Week ' + j); b.style.background = 'transparent'; b.style.border = '0'; b.style.color = 'transparent'; b.style.borderRadius = '14px'; return cc; });
  var ph = HA.g(L); HA.el('circle', { cx: 0, cy: 512, r: 16, fill: T.lime, opacity: .18 }, ph); HA.el('circle', { cx: 0, cy: 512, r: 7, fill: T.lime }, ph);
  var caps = CAPS.map(function (s, j) { var e = HA.text(L, 600, 488, '', 'label', T.ink, { 'text-anchor': 'middle' }); var a = HA.el('tspan', { fill: T.dim }, e); a.textContent = 'W' + j + ' · '; var b2 = HA.el('tspan', {}, e); b2.textContent = s; return e; });
  return function update(t) {
    t = HA.clamp(t, 0, 7000);
    // files: W1 trio, runbook (W3), billing (W4); pre-merge hook flashes red in W5 then earns a tick
    for (i = 0; i < files.length; i++) { var f = files[i], fp = f.t0 ? HA.seg(t, f.t0, f.t0 + 280) : 1; HA.tf(f.g, -8 * (1 - fp), 0); HA.op(f.g, fp); }
    var red = Math.min(HA.seg(t, RED[0], RED[0] + 80), 1 - HA.seg(t, RED[1] - 160, RED[1])); files[6].name.setAttribute('fill', HA.mix(T.ink, T.red, red)); hookTick.draw(HA.seg(t, HOOK_TICK, HOOK_TICK + 280));
    // chips fly in from x + 40 with the connector drawing behind them; gates appear last
    HA.op(conn, HA.seg(t, CHIP_T0, CHIP_T0 + 100)); conn.setAttribute('stroke-dashoffset', 1 - HA.seg(t, CHIP_T0 + 100, CHIP_T0 + 800, E.linear));
    for (i = 0; i < 6; i++) { var ch = chips[i], q = HA.seg(t, CHIP_T0 + CHIP_ST * i, CHIP_T0 + CHIP_ST * i + CHIP_D), lit = chipLit(t, i); HA.tf(ch.g, 40 * (1 - q), 0); HA.op(ch.g, q); ch.r.setAttribute('stroke', HA.mix(T.line, T.lime, lit)); ch.r.setAttribute('stroke-width', 1 + .5 * lit); ch.l.setAttribute('fill', HA.mix(T.dim, T.ink, lit)); }
    for (i = 0; i < 2; i++) { var fl = gateFlash(t, i); HA.op(gates[i].g, HA.seg(t, GATE_T[0], GATE_T[1])); gates[i].r.setAttribute('stroke', HA.mix(T.amber, T.lime, fl)); gates[i].r.setAttribute('fill', HA.mix(T.log, T.lime, fl)); }
    for (i = 0; i < RUNS.length; i++) { var tau = t - RUNS[i], pt = HA.at(conn, (runY(tau) - 136) / 240); parts[i].move(pt.x, pt.y); HA.op(parts[i], HA.seg(tau, 0, 100) * (1 - HA.seg(tau, RUN_D, RUN_D + 200))); }
    var ps = .9 + .1 * HA.seg(t, PILL_T, PILL_T + 400, E.snap); pillW.setAttribute('transform', 'translate(590 140) scale(' + ps + ') translate(-590 -140)'); HA.op(pillW, HA.seg(t, PILL_T, PILL_T + 200));
    // metrics: before values pulse once at 400; after values count from 1,500 and turn lime at W6 with the bars; delta pills pop in
    var cq = HA.seg(t, COUNT[0], COUNT[1]), lime = HA.seg(t, LIME[0], LIME[1]), bop = 1 - .6 * HA.pulse(t, 400, 800), sw = HA.seg(t, COUNT[0], COUNT[0] + 200);
    for (i = 0; i < 5; i++) { var r = rows[i], R = r.R, v = HA.lerp(R[1], R[2], cq); HA.op(r.before, bop); HA.op(r.dash, 1 - sw); HA.op(r.val, sw); HA.setText(r.val, HA.fmt(v, R[3])); r.val.setAttribute('fill', HA.mix(T.ink, T.lime, lime));
      r.bar.setAttribute('width', 352 * (i === 3 ? v / 100 : v / R[1])); r.bar.setAttribute('fill', HA.mix(T.faint, T.lime, lime));
      var pk = HA.seg(t, POP + 80 * i, POP + 400 + 80 * i, E.snap); HA.tf(r.pill, 1074, r.cy, .8 + .2 * pk); HA.op(r.pill, HA.seg(t, POP + 80 * i, POP + 100 + 80 * i)); }
    // rail: lime up to the playhead, passed ticks fill lime. Captions swap in the 200 ms before each boundary (out 100, then in 100) so a tick
    // click lands on its own caption and a scroll parked mid-swap never shows two centred captions blended together
    var hx = 70 + Math.min(t / 6000, 1) * 1060; railLit.setAttribute('x2', hx); HA.tf(ph, hx, 0);
    for (i = 0; i < 7; i++) ticks[i].setAttribute('fill', HA.mix(T.bg, T.lime, HA.seg(t, i * WEEK, i * WEEK + 120)));
    for (i = 0; i < 7; i++) { var B = i * WEEK, N = B + WEEK; HA.op(caps[i], (i ? HA.seg(t, B - 100, B, E.linear) : 1) * (i < 6 ? 1 - HA.seg(t, N - 200, N - 100, E.linear) : 1)); }
  };
} };
