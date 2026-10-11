// agentic-flow-sim — the interactive simulator on /agentic-flow. 1200 x 600, state machine (mode 'state'), seed 7.
// A story runs through six agents; the visitor signs every gate. State is { name, since }; every quantity is derived
// from absolute timestamps recorded at each transition, so a harness seek to any t renders the right frame.
HA.scenes['agentic-flow-sim'] = { loop: 20000, seed: 7, resolved: 0, w: 1200, h: 600, mode: 'state', build: function (c) {
  var T = HA.T, E = HA.ease, L = HA.g(c.svg), RM = c.reduced;
  function D(ms) { return RM ? 0 : ms; }                                                   // reduced motion: jump instead of travel
  function sg(t, a, d, e) { return a < 0 ? 0 : d <= 0 ? (t >= a ? 1 : 0) : HA.seg(t, a, a + d, e); }
  var NX = [70, 254, 438, 622, 806, 990], NAMES = ['Plan', 'Stories', 'Build', 'Review', 'Document', 'Escalate'], CX = NX.map(function (x) { return x + 70; });
  var RUN = { S1: 2000, V1: 1400, S2: 1800, S3: 2400, S4: 2000, V2: 1400, S5: 1600, S6: 1200, S7: 1000, RESET: 700 };   // S6/S7 only time the progress line
  var NEXT = { S1: 'G1', V1: 'G1', S2: 'S3', S3: 'S4', S4: 'G2', V2: 'S4', S5: 'S6', RESET: 'S1' };   // V = revising after a rejection
  var STAGE = { S1: 0, S2: 1, S3: 2, S4: 3, S5: 4, S6: 5 }, IDLE = { S0: 1, S1: 1, S2: 1, S3: 1, S4: 1, S5: 1, V1: 1, V2: 1 };   // gate pane shows "no decision"
  var TRAVEL = D(700), TYPE0 = { S1: 200, S2: 400, S3: 400, S4: 400, S5: 400, S6: 400 };
  var NAME = { S1: 'Plan', V1: 'Plan', S2: 'Stories', S3: 'Build', S4: 'Review', S4b: 'Review', V2: 'Review', S5: 'Document', S6: 'Escalate', S7: 'Shipped' };
  var INP = { S1: 'Ticket: refunds for partially captured payments', S2: 'Plan v1 · 4 tasks, 1 risk', S3: '3 stories · 11 acceptance criteria', S4: 'branch feat/refunds · 14 files, 38 tests',
              S5: 'PR #318 · merged by a person', S6: 'Refunds over £10,000 · no rule in the plan', S7: 'STORY-142 · Add refund endpoint' };
  var OUT = { S1: ['4 tasks · touches payments/refunds', 'risk: duplicate refunds (idempotency)', 'estimate: 3 days'], S2: ['3 stories', '11 acceptance criteria', 'linked to plan v1'],
    S3: ['branch feat/refunds', '14 files changed', '38 tests added', 'CI: green'], S4: ['2 comments: missing currency check; unclear name', 'fixed in 2 commits', 'coverage 81% → 87%'],
    S4b: ['re-review after changes', '0 open comments', 'coverage 87%'], S5: ['README › Refunds', 'runbook › failed refunds', 'changelog entry'], S6: ['1 question needs a person', 'sent › mobile notification'] };
  var WHY1 = ['Scope too large', 'Missing a case', 'Wrong approach'], FIX1 = ['cut: ledger export → STORY-143', 'added: refund above captured amount → 422', 'changed: ledger reversal, not a negative charge'];
  var WHY2 = ['Needs a test', 'Naming', 'Split the PR'], FIX2 = ['added: test for refund above captured amount', 'renamed: RefundSvc → RefundService', 'split: ledger reversal → PR #319'];
  var PLAN = ['Add POST /refunds', 'Idempotency key per refund', 'Ledger reversal entry', 'Tests: partial, full, duplicate'];
  // ---- pipeline row
  var nodes = NX.map(function (x, i) { return HA.node(L, x, 64, 140, '0' + (i + 1), NAMES[i]); });
  var conns = [], flows = []; for (var i = 0; i < 5; i++) { var d = 'M' + (NX[i] + 140) + ' 92 H ' + NX[i + 1]; conns.push(HA.connector(L, d)); flows.push(HA.flow(L, d)); }
  HA.connector(L, 'M1060 120 V 146');
  var gates = [HA.gate(L, 232, 92), HA.gate(L, 784, 92), HA.gate(L, 1060, 156)], rings = [HA.ripple(L), HA.ripple(L), HA.ripple(L)];
  var bar = HA.el('rect', { x: NX[2] + 14, y: 112, width: 0, height: 2, fill: T.lime }, L);
  // ---- agent pane
  var cid = 'simclip-' + Math.floor(c.rng() * 1e6), cp = HA.el('clipPath', { id: cid }, c.svg.querySelector('defs'));
  HA.el('rect', { x: 70, y: 200, width: 640, height: 340, rx: 12, fill: T.log, stroke: T.line }, L); HA.el('rect', { x: 70, y: 200, width: 640, height: 340, rx: 12 }, cp);
  var prog = HA.el('rect', { x: 70, y: 538, width: 0, height: 2, fill: T.lime, 'clip-path': 'url(#' + cid + ')' }, L);
  var pressRun = HA.text(L, 390, 374, 'Press run', 'micro', T.faint, { 'text-anchor': 'middle' });
  var paneG = HA.g(L); HA.text(paneG, 94, 232, 'Agent', 'micro', T.faint); var stageT = HA.text(paneG, 160, 232, '', 'label', T.ink);
  HA.text(paneG, 94, 272, 'Input', 'micro', T.faint); var inT = HA.text(paneG, 94, 296, '', 'terminal', T.dim);
  HA.text(paneG, 94, 360, 'Output', 'micro', T.faint); var outT = []; for (i = 0; i < 6; i++) outT.push(HA.text(paneG, 94, 384 + 22 * i, '', 'terminal', T.ink));
  // ---- gate pane: idle text, plan list, "why?", pull request, phone notification
  HA.el('rect', { x: 734, y: 200, width: 396, height: 340, rx: 12, fill: T.raised, stroke: T.line }, L);
  var idleT = HA.text(L, 932, 374, 'No decision needed yet', 'micro', T.faint, { 'text-anchor': 'middle' });
  var planG = HA.g(L, { opacity: 0 }); var planTitle = HA.text(planG, 758, 236, '', 'micro', T.dim);
  PLAN.forEach(function (s, j) { HA.text(planG, 758, 284 + 34 * j, '0' + (j + 1), 'micro', T.faint); HA.text(planG, 790, 284 + 34 * j, s, 'label', T.ink); });
  var whyG = HA.g(L, { opacity: 0 }); HA.text(whyG, 758, 236, 'Why?', 'micro', T.dim);
  var prG = HA.g(L, { opacity: 0 }); HA.text(prG, 758, 236, 'Pull request', 'micro', T.dim); HA.text(prG, 758, 284, '+412 −37 · 14 files', 'label', T.ink); HA.text(prG, 758, 318, 'CI green · coverage 87%', 'label', T.ink);
  HA.el('rect', { x: 758, y: 352, width: 348, height: 36, rx: 6, fill: 'none', stroke: T.lime }, prG); HA.text(prG, 932, 374, 'Agents cannot merge to main', 'micro', T.lime, { 'text-anchor': 'middle' });
  var phoneG = HA.g(L, { opacity: 0 }); HA.el('rect', { x: 782, y: 255, width: 300, height: 150, rx: 18, fill: T.paper, stroke: HA.mix(T.paper, T.pink, .2) }, phoneG);
  HA.text(phoneG, 798, 282, 'Hopsig pipeline · now', 'micro', HA.mix(T.paper, T.pink, .55)); HA.text(phoneG, 798, 310, 'Refunds over £10,000:', 'label', T.pink); HA.text(phoneG, 798, 332, 'require finance sign-off?', 'label', T.pink);
  var ansT = HA.text(phoneG, 798, 376, '', 'micro', T.pink);
  // ---- story card (160 x 40, centred at (cx, 30))
  var card = HA.g(L, { opacity: 0 }); HA.sheet(card, -80, -20, 160, 40);
  HA.text(card, -68, -3, 'STORY-142', 'mono11', T.pink); var ct2 = HA.text(card, -68, 11, 'Add refund endpoint', 'sans12', T.pink); var ctk = HA.tick(card, 58, -6, 1, HA.mix(T.lime, T.pink, .45), 2);
  // ---- state
  var st = { name: 'S0', since: 0 }, now = 0, M; fresh();
  function fresh() { M = { litAt: [-1, -1, -1, -1, -1, -1], connAt: [-1, -1, -1, -1, -1], amberAt: [-1, -1, -1], resAt: [-1, -1, -1], cardAt: -1, travel: [0, 0, -1], barAt: -1, pane: null, paneAt: -1, idleAt: -1,
                      rev: 0, rev2: 0, reason: '', fix: '', reason2: '', fix2: '', decisions: 0, answer: '', shipAt: -1 }; }
  function go(name, at) {
    var prev = st.name, i = STAGE[name]; st = { name: name, since: at };
    if (name === 'S1') { fresh(); M.cardAt = at; M.litAt[0] = at; }
    if (i > 0 && !(name === 'S4' && prev === 'V2')) { M.travel = [i - 1, i, at]; M.connAt[i - 1] = at; M.litAt[i] = at + TRAVEL; }   // the card travels, the connector lights
    if (name === 'S2') M.resAt[0] = at; if (name === 'S3') M.barAt = at + TRAVEL; if (name === 'S5') M.resAt[1] = at; if (name === 'S6') M.amberAt[2] = at + TRAVEL;
    if (name === 'S7') { M.resAt[2] = at; M.shipAt = at; }
    if (name === 'G1' && M.amberAt[0] < 0) M.amberAt[0] = at; if (name === 'G2' && M.amberAt[1] < 0) M.amberAt[1] = at;
    if (name === 'V1') M.rev++; if (name === 'V2') M.rev2++;
    if (NAME[name]) { M.pane = name === 'S4' && M.rev2 ? 'S4b' : name; M.paneAt = at; }
    if (IDLE[name] && !IDLE[prev] && prev !== 'RESET') M.idleAt = at;
  }
  // ---- HTML controls
  function lab(b, s) { if (b.textContent !== s) b.textContent = s; }
  var runB = HA.button(c, 500, 550, 200, 44, 'Run a story', 'lime', function () { if (st.name === 'S0') go('S1', now); else if (st.name === 'S7') go('RESET', now); });
  var okB = HA.button(c, 754, 476, 164, 40, 'Approve plan', 'lime', function () { if (st.name === 'G1') { M.decisions++; go('S2', now); } else if (st.name === 'G2') { M.decisions++; go('S5', now); } });
  var noB = HA.button(c, 946, 476, 164, 40, 'Reject', 'outline', function () { if (st.name === 'G1') go('R1', now); else if (st.name === 'G2') go('R2', now); });
  var pills = [0, 1, 2].map(function (j) { return HA.button(c, 754, 272 + 48 * j, 356, 36, WHY1[j], 'pillb', function () {
    if (st.name === 'R1') { M.reason = WHY1[j]; M.fix = FIX1[j]; M.decisions++; go('V1', now); } else if (st.name === 'R2') { M.reason2 = WHY2[j]; M.fix2 = FIX2[j]; M.decisions++; go('V2', now); } }); });
  function answer(a) { if (st.name === 'S6') { M.answer = a; M.decisions++; go('S7', now); } }
  var yesB = HA.button(c, 800, 352, 120, 36, 'Yes', 'lime', function () { answer('Yes'); }), nopeB = HA.button(c, 936, 352, 120, 36, 'No', 'outline', function () { answer('No'); });
  nopeB.style.color = T.pink; nopeB.style.borderColor = HA.mix(T.paper, T.pink, .35);   // it sits on the paper phone, where the outline style's light ink would vanish
  // ---- agent pane content for the pane key: [text, colour, absolute typing start (-1 = already there)]
  function content(pk) {
    var base = OUT[pk === 'V1' ? 'S1' : pk === 'V2' ? (M.rev2 > 1 ? 'S4b' : 'S4') : pk] || [], extra = [], lines = [], cur = M.paneAt + (TYPE0[pk] || 0);
    if (pk === 'V1') extra = [['revising › ' + M.reason, T.amber], [M.fix, T.ink]]; if (pk === 'V2') extra = [['revising › ' + M.reason2, T.amber], [M.fix2, T.ink]];
    if (pk === 'S7') extra = [['done › ' + M.decisions + ' decisions made by a person, 0 merges by an agent', T.lime]];
    base.forEach(function (sl, j) { if (pk === 'S2' && j === 2) sl = 'linked to plan v' + (M.rev + 1); if (extra.length) lines.push([sl, T.ink, -1]); else { lines.push([sl, T.ink, cur]); cur += sl.length / 60 * 1000 + 120; } });
    extra.forEach(function (x) { lines.push([x[0], x[1], cur]); cur += x[0].length / 60 * 1000 + 120; });
    return lines;
  }
  function typed(str, t0) { return now < t0 ? '' : RM ? str : HA.typed(str, now, t0, 60); }
  return function update(t) {
    now = t;
    for (var n = 0; n < 16; n++) { var nx = NEXT[st.name]; if (nx && t - st.since >= RUN[st.name]) go(nx, st.since + RUN[st.name]); else break; }   // auto-advance from elapsed time
    var s = st.name, e = Math.max(0, t - st.since), k = s === 'RESET' ? 1 - sg(t, st.since, D(700), E.inOutCubic) : 1;   // reset crossfade: every lit quantity x k
    // row
    for (var i = 0; i < 6; i++) nodes[i].lit(sg(t, M.litAt[i], D(160)) * k);
    for (i = 0; i < 5; i++) { var p = sg(t, M.connAt[i], D(160)) * k, on = p > .5 && !RM; conns[i].setAttribute('stroke', HA.mix(T.line, T.lime, p)); flows[i].run(t, on); if (on) HA.op(flows[i], p); }
    bar.setAttribute('width', 112 * sg(t, M.barAt, RUN.S3 - TRAVEL, E.linear) * k);
    for (i = 0; i < 3; i++) { var g = gates[i], pa = sg(t, M.amberAt[i], D(160)), pr = sg(t, M.resAt[i], D(280)); g.set(pa * k, pr * k);
      HA.tf(g, g.cx, g.cy, pa > 0 && pr <= 0 && !RM && s !== 'RESET' ? 1 + .15 * Math.sin(Math.PI * ((t - M.amberAt[i]) % 1200) / 1200) : 1);
      rings[i].show(g.cx, g.cy, M.resAt[i] < 0 || RM ? 0 : HA.seg(t, M.resAt[i], M.resAt[i] + 400, E.linear), 10, 28); }
    // card
    var cf = sg(t, M.cardAt, D(400)), cx = CX[0]; if (M.travel[2] >= 0) cx = HA.lerp(CX[M.travel[0]], CX[M.travel[1]], sg(t, M.travel[2], TRAVEL, E.inOutCubic));
    var shake = (s === 'V1' || s === 'V2') && !RM && e < 240 ? 4 * Math.sin(e / 240 * Math.PI * 6) : 0;
    HA.tf(card, cx + shake, HA.lerp(24, 30, cf)); HA.op(card, cf * k);
    var ship = sg(t, M.shipAt, D(280)); HA.setText(ct2, M.shipAt >= 0 ? 'SHIPPED' : 'Add refund endpoint'); ctk.draw(ship); HA.op(ctk, ship);
    // agent pane
    var pk = M.pane; HA.op(pressRun, pk ? 0 : 1); HA.op(paneG, pk ? k : 0);
    if (pk) { var bk = pk === 'V1' ? 'S1' : pk === 'V2' || pk === 'S4b' ? 'S4' : pk; HA.setText(stageT, NAME[pk]); HA.setText(inT, pk === 'S2' ? 'Plan v' + (M.rev + 1) + ' · 4 tasks, 1 risk' : INP[bk]);
      var lines = content(pk); for (i = 0; i < 6; i++) { var ln = lines[i]; HA.setText(outT[i], ln ? (ln[2] < 0 ? ln[0] : typed(ln[0], ln[2])) : ''); if (ln) outT[i].setAttribute('fill', ln[1]); }
      prog.setAttribute('width', 640 * sg(t, M.paneAt, RUN[pk === 'S4b' ? 'S4' : pk], E.linear) * k); } else prog.setAttribute('width', 0);
    // gate pane
    var gp = { G1: planG, R1: whyG, G2: prG, R2: whyG, S6: phoneG, S7: phoneG }[s];
    [planG, whyG, prG, phoneG].forEach(function (gg) { HA.op(gg, gg === gp ? (s === 'S7' ? 1 : sg(t, st.since, D(280))) : s === 'RESET' && gg === phoneG ? k : 0); });
    HA.setText(planTitle, (M.rev ? 'Plan v' + (M.rev + 1) : 'Plan') + ' for your sign-off', true);
    HA.op(idleT, IDLE[s] ? (M.idleAt < 0 ? 1 : sg(t, M.idleAt, D(280))) : s === 'RESET' ? 1 - k : 0);
    HA.setText(ansT, s === 'S7' ? 'Answered › ' + M.answer + ' · by a person' : '', true); HA.op(ansT, s === 'S7' ? sg(t, st.since, D(280)) : 1);
    // controls
    runB.show(s === 'S0' || s === 'S7'); lab(runB, s === 'S7' ? 'Run another story' : 'Run a story');
    okB.show(s === 'G1' || s === 'G2'); lab(okB, s === 'G2' ? 'Approve merge' : 'Approve plan'); noB.show(s === 'G1' || s === 'G2'); lab(noB, s === 'G2' ? 'Request changes' : 'Reject');
    pills.forEach(function (b, j) { b.show(s === 'R1' || s === 'R2'); lab(b, (s === 'R2' ? WHY2 : WHY1)[j]); });
    yesB.show(s === 'S6'); nopeB.show(s === 'S6');
  };
} };
