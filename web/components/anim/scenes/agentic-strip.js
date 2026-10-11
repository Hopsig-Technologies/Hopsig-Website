// agentic-strip — slim band on every service page, the whole strip is a link to /agentic-flow. 1200 x 120, loop 5,200 ms.
HA.scenes['agentic-strip'] = { loop: 5200, seed: 3, resolved: 3900, w: 1200, h: 120, nopause: true, build: function (c) {
  var T = HA.T, E = HA.ease, L = HA.g(c.svg);
  HA.text(L, 40, 46, 'Delivered on our agentic pipeline', 'micro', T.lime);
  HA.text(L, 40, 78, 'Six agents. A person at every gate.', 'label', T.ink);
  var arrow = HA.text(L, 1160, 66, 'See the pipeline →', 'label', T.dim, { 'text-anchor': 'end' });
  var NAMES = ['Plan', 'Stories', 'Build', 'Review', 'Docs', 'Escalate'], SX = [], sq = [];
  for (var i = 0; i < 6; i++) { var x = 520 + 64 * i; SX.push(x + 20); if (i < 5) HA.connector(L, 'M' + (x + 40) + ' 60 H ' + (x + 64)); }
  var gx = [572, 764], gates = gx.map(function (g) { return HA.gate(L, g, 60, 10); });
  gates.forEach(function (g) { g.set(1, 0); });
  for (i = 0; i < 6; i++) { var x2 = 520 + 64 * i; var r = HA.el('rect', { x: x2, y: 40, width: 40, height: 40, rx: 8, fill: T.raised, stroke: T.line }, L); sq.push(r); HA.text(L, x2 + 20, 100, NAMES[i], 'micro', T.faint, { 'text-anchor': 'middle' }); }
  var dot = HA.g(L); HA.el('circle', { r: 10, fill: T.lime, opacity: .18 }, dot); HA.el('circle', { r: 4, fill: T.lime }, dot);
  // travel: x 540 -> 860 over 3,400 ms linear, pausing 300 ms at each gate (total 4,000), then 1,200 ms rest
  var X0 = 540, X1 = 860, TRAVEL = 3400, PAUSE = 300; var gateT = gx.map(function (g) { return (g - X0) / (X1 - X0) * TRAVEL; }); // arrival times before pauses
  function posAt(t) { var tt = t, paused = 0; for (var j = 0; j < gateT.length; j++) { var arrive = gateT[j] + j * PAUSE; if (tt > arrive) { var inPause = Math.min(tt - arrive, PAUSE); paused += inPause; } } var m = HA.clamp(tt - paused, 0, TRAVEL); return X0 + (X1 - X0) * m / TRAVEL; }
  var passT = SX.map(function (sx) { var raw = (sx - X0) / (X1 - X0) * TRAVEL; var add = 0; for (var j = 0; j < gx.length; j++) if (sx > gx[j]) add += PAUSE; return raw + add + 120; });
  return function update(t) {
    if (c.reduced) { sq.forEach(function (r) { r.setAttribute('stroke', T.lime); }); gates.forEach(function (g) { g.set(0, 1); }); HA.op(dot, 0); return; }
    var x = posAt(t), moving = t < 4000; HA.tf(dot, x, 60); HA.op(dot, moving ? HA.seg(t, 0, 200) : 1 - HA.seg(t, 4000, 4300));
    for (var i = 0; i < 6; i++) { var since = t - passT[i]; var p = since < 0 ? 0 : 1 - HA.seg(since, 0, 400, E.linear); sq[i].setAttribute('stroke', HA.mix(T.line, T.lime, p)); }
    for (i = 0; i < 2; i++) { var arrive = gateT[i] + i * PAUSE, leave = arrive + PAUSE; var pr = t < arrive ? 0 : t < leave ? HA.seg(t, arrive, arrive + 160) : 1 - HA.seg(t, leave, leave + 400); gates[i].set(1, pr); }
  };
} };
