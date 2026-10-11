// svc-qa — "Flakes fixed, not retried". 1200 x 560, loop 12,000 ms, seed 88.
// A 20 x 30 heatmap speckled red scrolls in new runs; four flaky rows are fixed at the cause, clean runs come in lime, suite time drops, a load test holds p95, the merge button goes lime.
HA.scenes['svc-qa'] = { loop: 12000, seed: 88, resolved: 10000, w: 1200, h: 560, mode: 'loop', build: function (c) {
  var T = HA.T, E = HA.ease, L = HA.g(c.svg), i, j, r;
  var LOOP = 12000, RESET = 11300, SH = [50, 300, 550, 800, 1050, 1300, 3700, 3950, 4200, 4450, 4700, 4950], SHD = 200, COLS = 30, ROWS = 20, NCOL = 42, NEW0 = 36, FIXS = 6;
  // flaky rows are the ones the fix messages name (search, invoice, upload, notify = 3, 6, 11, 15); the spec's 7 and 16 would be export and report
  var FLAKY = [3, 6, 11, 15], FIX0 = 1500, FIXD = 500, FIXCPS = 80, CNT = [2000, 5200], VU = [5200, 6100], P95 = [6100, 7000], P95L = [7000, 7200], TICK0 = 7200, TICKGAP = 150, TICKD = 280, MERGE = [7800, 8000];
  // cell states as opaque colours (fail = red at 80%, fixed-era pass = lime at 30%, both over the background) so every transition is one HA.mix
  var C_PASS = T.line, C_FAIL = HA.mix(T.bg, T.red, .8), C_FIX = HA.mix(T.bg, T.lime, .3);
  var NAMES = ['checkout', 'cart', 'auth', 'search', 'refund', 'profile', 'invoice', 'export', 'webhook', 'admin', 'billing', 'upload', 'i18n', 'roles', 'sso', 'notify', 'report', 'api', 'rate-limit', 'health'];
  var MSG = ['fixed › search.spec: wait for network idle', 'fixed › invoice.spec: frozen clock', 'fixed › upload.spec: isolated temp dir', 'fixed › notify.spec: no shared fixtures'];
  // seeded results: 42 columns (30 visible + 12 scrolled in); columns from NEW0 on are the clean era
  var data = []; for (var d = 0; d < NCOL; d++) { var col = []; for (r = 0; r < ROWS; r++) col.push(d < NEW0 && c.rng() < (FLAKY.indexOf(r) >= 0 ? .22 : .01)); data.push(col); }

  // 2. heatmap: 31 cells per row (one incoming), the group translates -19 per shift; clipped to the grid so the outgoing column never crosses the labels
  HA.text(L, 230, 96, 'Last 30 runs', 'micro', T.dim);
  for (r = 0; r < ROWS; r++) HA.text(L, 218, 122 + 15 * r, NAMES[r] + '.spec', 'mono11', T.faint, { 'text-anchor': 'end' });
  var clipId = 'hmclip-' + c.inst.id + Math.floor(c.rng() * 1e6); var cp = HA.el('clipPath', { id: clipId }, c.svg.querySelector('defs')); HA.el('rect', { x: 230, y: 100, width: 567, height: 320 }, cp);
  var gridT = HA.g(HA.g(L, { 'clip-path': 'url(#' + clipId + ')' }));
  var cells = []; for (r = 0; r < ROWS; r++) { var row = []; for (j = 0; j <= COLS; j++) row.push(HA.el('rect', { x: 230 + 19 * j, y: 112 + 15 * r, width: 16, height: 12, rx: 2, fill: C_PASS }, gridT)); cells.push(row); }
  var outlines = FLAKY.map(function (fr) { return HA.el('rect', { x: 228, y: 110 + 15 * fr, width: 571, height: 16, rx: 3, fill: 'none', stroke: T.amber, 'stroke-width': 1.5, opacity: 0 }, L); });
  // 3. fix line
  var fixl = HA.text(L, 230, 436, '', 'mono12', T.dim);
  // 4. suite time panel. "Example figures" sits one micro line under the header, right-aligned: on the header line it would touch "SUITE TIME IN CI".
  HA.el('rect', { x: 830, y: 112, width: 300, height: 140, rx: 12, fill: T.raised, stroke: T.line }, L);
  HA.text(L, 854, 140, 'Suite time in CI', 'micro', T.dim);
  HA.text(L, 1106, 156, 'Example figures', 'micro', T.faint, { 'text-anchor': 'end' });
  var suite = HA.counter(L, 854, 204, 41, 'num', T.faint, { 'font-size': 48 });
  HA.text(L, 854, 232, 'Flake rate', 'micro', T.dim);
  var flake = HA.counter(L, 1106, 232, 4.1, 'terminal', T.faint, { 'text-anchor': 'end' });
  // 5. load panel: SLO dashed lime, VU and p95 lines drawn by dashoffset
  HA.el('rect', { x: 830, y: 272, width: 300, height: 140, rx: 12, fill: T.raised, stroke: T.line }, L);
  HA.text(L, 854, 296, 'k6 · Load test', 'micro', T.dim);
  HA.el('line', { x1: 856, y1: 330, x2: 1106, y2: 330, stroke: T.lime, 'stroke-width': 1, 'stroke-dasharray': '4 4', opacity: .6 }, L);
  HA.text(L, 1106, 324, 'SLO 300 ms', 'micro', T.faint, { 'text-anchor': 'end' });
  function drawn(d, color) { return HA.el('path', { d: d, fill: 'none', stroke: color, 'stroke-width': 1.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1 }, L); }
  var vu = drawn('M856 392 L1031 304 L1106 304', T.dim);
  var pts = []; for (i = 0; i < 26; i++) pts.push((856 + 10 * i) + ' ' + (338 + 18 * c.rng()).toFixed(1));
  var p95 = drawn('M' + pts.join(' L'), T.lime);
  var p95l = HA.text(L, 854, 404, 'P95 238 ms @ 5,000 VUs', 'micro', T.lime, { opacity: 0 });
  // 6. checks strip: four pills with a ring that becomes a tick, and the merge button
  HA.el('rect', { x: 70, y: 456, width: 1060, height: 52, rx: 12, fill: T.raised, stroke: T.line }, L);
  var checks = [[94, 'Unit'], [256, 'Integration'], [418, 'E2E'], [580, 'Load']].map(function (ch) { var g = HA.g(L), o = { g: g };
    o.rect = HA.el('rect', { x: ch[0], y: 466, width: 150, height: 32, rx: 16, fill: 'none', stroke: T.line }, g);
    o.ring = HA.el('circle', { cx: ch[0] + 20, cy: 482, r: 6, fill: 'none', stroke: T.faint, 'stroke-width': 1.5 }, g);
    o.tk = HA.tick(g, ch[0] + 13, 476, 1); o.lbl = HA.text(g, ch[0] + 34, 486, ch[1], 'micro', T.dim); return o; });
  var mg = HA.g(L), mrect = HA.el('rect', { x: 886, y: 466, width: 220, height: 32, rx: 6, fill: T.line }, mg), mtxt = HA.text(mg, 996, 486, 'Merge pull request', 'sans13', T.faint, { 'text-anchor': 'middle' });

  return function update(t) {
    var k = t >= RESET ? 1 - HA.seg(t, RESET, LOOP, E.inOutCubic) : 1;   // reset crossfade: every lit quantity x k
    // heatmap: s shifts completed, f = progress of the one in flight; visible column j shows data[s + j]
    var s = 0; while (s < SH.length && t >= SH[s] + SHD) s++;
    var f = s < SH.length ? HA.seg(t, SH[s], SH[s] + SHD, E.inOutCubic) : 0;
    HA.tf(gridT, -19 * f, 0);
    for (r = 0; r < ROWS; r++) { var fi = FLAKY.indexOf(r), F = FIX0 + FIXD * fi;
      for (j = 0; j <= COLS; j++) { var dd = s + j, cur;
        if (dd >= NEW0) cur = C_FIX;
        else if (!data[dd][r]) cur = C_PASS;
        else if (fi >= 0) cur = HA.mix(C_FAIL, C_PASS, HA.seg(t, F + 160 + 10 * (dd - FIXS), F + 260 + 10 * (dd - FIXS)));   // fixes sweep left to right while s = FIXS
        else cur = C_FAIL;
        var bef = data[j][r] ? C_FAIL : C_PASS;   // what this position shows at t = 0; the reset mixes back to it
        cells[r][j].setAttribute('fill', k < 1 ? HA.mix(bef, cur, k) : cur);
        HA.op(cells[r][j], j === 0 ? 1 - f : j === COLS ? f : 1); } }
    for (i = 0; i < 4; i++) { var F2 = FIX0 + FIXD * i, a = HA.seg(t, F2, F2 + 160), lm = HA.seg(t, F2 + 440, F2 + 540), fd = HA.seg(t, F2 + 560, F2 + 800);
      outlines[i].setAttribute('stroke', HA.mix(T.amber, T.lime, lm)); HA.op(outlines[i], a * (1 - fd) * k); }
    // fix line: one message per fix, typed at 80 cps so each finishes inside its 500 ms fix (40 cps would show 20 characters before the next fix starts)
    var m = HA.clamp(Math.floor((t - FIX0) / FIXD), 0, 3); HA.setText(fixl, t >= FIX0 ? HA.typed(MSG[m], t, FIX0 + FIXD * m, FIXCPS) : ''); HA.op(fixl, k);
    // counters
    var cpn = HA.seg(t, CNT[0], CNT[1]) * k; suite.set(41, 6, cpn, { suffix: 'm' }); flake.set(4.1, .2, cpn, { dec: 1, suffix: '%' });
    // load panel
    vu.setAttribute('stroke-dashoffset', 1 - HA.seg(t, VU[0], VU[1], E.linear)); HA.op(vu, k);
    p95.setAttribute('stroke-dashoffset', 1 - HA.seg(t, P95[0], P95[1], E.linear)); HA.op(p95, k);
    HA.op(p95l, HA.seg(t, P95L[0], P95L[1]) * k);
    // checks and merge
    for (i = 0; i < 4; i++) { var t0 = TICK0 + TICKGAP * i, p = HA.seg(t, t0, t0 + TICKD) * k, ch = checks[i];
      ch.rect.setAttribute('stroke', HA.mix(T.line, T.lime, p)); HA.op(ch.ring, 1 - p); ch.tk.draw(HA.seg(t, t0, t0 + TICKD)); HA.op(ch.tk, k); ch.lbl.setAttribute('fill', HA.mix(T.dim, T.ink, p)); }
    var mp = HA.seg(t, MERGE[0], MERGE[1]) * k, sc = t < MERGE[0] ? 1 : HA.lerp(.95, 1, HA.seg(t, MERGE[0], MERGE[1], E.snap));
    mrect.setAttribute('fill', HA.mix(T.line, T.lime, mp)); mtxt.setAttribute('fill', HA.mix(T.faint, T.bg, mp)); HA.tf(mg, 996 * (1 - sc), 482 * (1 - sc), sc);
  };
} };
