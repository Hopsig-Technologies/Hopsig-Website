// home-agentic — the first band on the home page. 1200 x 560, loop 12,000 ms, seed 142.
// A story card moves through six agents; a person signs at three gates; the log narrates.
HA.scenes['home-agentic'] = { loop: 12000, seed: 142, resolved: 11000, w: 1200, h: 560, build: function (c) {
  var T = HA.T, E = HA.ease, L = HA.g(c.svg);
  var NX = [70, 254, 438, 622, 806, 990], NAMES = ['Plan', 'Stories', 'Build', 'Review', 'Document', 'Escalate'], CX = NX.map(function (x) { return x + 70; });
  var nodes = NX.map(function (x, i) { return HA.node(L, x, 252, 140, '0' + (i + 1), NAMES[i]); });
  var conns = [], flows = [];
  for (var i = 0; i < 5; i++) { var d = 'M' + (NX[i] + 140) + ' 280 H ' + NX[i + 1]; conns.push(HA.connector(L, d)); flows.push(HA.flow(L, d)); }
  // gates
  var g1 = HA.gate(L, 232, 280), l1 = HA.text(L, 232, 330, 'Plan signed', 'micro', T.dim, { 'text-anchor': 'middle' });
  var g2 = HA.gate(L, 784, 280), l2 = HA.text(L, 784, 330, 'Merge approved', 'micro', T.dim, { 'text-anchor': 'middle' });
  HA.connector(L, 'M1060 308 V 344', T.line);
  var pill = HA.pill(L, 1060, 360, 180, 'Waiting on a person'); pill.rect.setAttribute('stroke', T.faint);
  // build progress bar inside Build
  var bar = HA.el('rect', { x: NX[2] + 14, y: 252 + 48, width: 0, height: 2, fill: T.lime }, L);
  // log pane
  HA.el('rect', { x: 70, y: 400, width: 1060, height: 112, rx: 10, fill: T.log, stroke: T.line }, L);
  HA.text(L, 90, 424, 'Pipeline log', 'micro', T.faint);
  var clipId = 'logclip-' + c.inst.id + Math.floor(c.rng() * 1e6); var cp = HA.el('clipPath', { id: clipId }, c.svg.querySelector('defs')); HA.el('rect', { x: 70, y: 432, width: 1060, height: 80 }, cp);
  var logG = HA.g(L, { 'clip-path': 'url(#' + clipId + ')' }); var log = HA.log(logG, 90, 494, 3, 22);
  var EV = [[400, 'plan › 4 tasks, 2 risks, est. 3 days'], [2000, 'gate › plan signed by a person', 0], [2900, 'stories › 3 stories with acceptance criteria'], [4400, 'build › 14 files changed, 38 tests added'],
            [6300, 'review › 2 comments resolved, coverage 87%'], [7700, 'gate › merge approved by a person', 0], [8600, 'docs › README and runbook updated'], [9900, 'escalate › 1 question sent to a person'], [10400, 'escalate › answered on mobile']];
  // story card (132 x 40, centred at (cx, cy)); dashed link to the working node
  var link = HA.el('line', { x1: 0, y1: 0, x2: 0, y2: 0, stroke: T.faint, 'stroke-width': 1, 'stroke-dasharray': '4 4', opacity: 0 }, L);
  var card = HA.g(L, { opacity: 0 }); var cs = HA.sheet(card, -66, -20, 132, 40);
  var ct1 = HA.text(card, -54, -3, 'STORY-142', 'mono11', T.pink), ct2 = HA.text(card, -54, 11, 'Refund endpoint', 'sans12', T.pink);
  var ctk = HA.tick(card, 44, -6, 1, '#3F6B1F', 2);
  var cur = HA.cursor(L), rip = HA.ripple(L);
  // travel legs: [t0, t1, fromIndex, toIndex]
  var LEGS = [[2200, 2900, 0, 1], [3700, 4400, 1, 2], [5600, 6300, 2, 3], [7900, 8600, 3, 4], [9200, 9900, 4, 5]];
  var LIT = [400, 2900, 4400, 6300, 8600, 9900];            // node lit times
  var WORK = [[400, 2200], [2900, 3700], [4400, 5600], [6300, 7900], [8600, 9200], [9900, 10600]]; // dashed link shown
  var CONN = [2200, 3700, 5600, 7900, 9200];               // connector turns lime
  var CUR = [[1400, 2000, [1210, 540], [232, 280]], [7100, 7700, [232, 280], [784, 280]], [9900, 10400, [784, 280], [1060, 360]]];
  var CLICK = [2000, 7700, 10400];
  return function update(t) {
    var k = t >= 11300 ? 1 - HA.seg(t, 11300, 12000, E.inOutCubic) : 1;   // reset crossfade: every lit quantity x k
    // nodes, connectors
    for (var i = 0; i < 6; i++) nodes[i].lit(HA.seg(t, LIT[i], LIT[i] + 160) * k);
    for (i = 0; i < 5; i++) { var p = HA.seg(t, CONN[i], CONN[i] + 160) * k; conns[i].setAttribute('stroke', HA.mix(T.line, T.lime, p)); flows[i].run(t, p > .5); HA.op(flows[i], p); }
    bar.setAttribute('width', 112 * HA.seg(t, 4400, 5600, E.linear) * k);
    // gates: amber then resolved
    function gate(g, lab, ta, tr) { var pr = HA.seg(t, tr, tr + 280) * k; var pa = HA.seg(t, ta, ta + 160) * k; g.set(pa, pr); lab.setAttribute('fill', HA.mix(T.dim, T.ink, pr)); }
    gate(g1, l1, 1400, 2000); gate(g2, l2, 7100, 7700);
    var pa3 = HA.seg(t, 9900, 10060) * k, pr3 = HA.seg(t, 10400, 10680) * k;
    pill.rect.setAttribute('stroke', HA.mix(HA.mix(T.faint, T.amber, pa3), T.lime, pr3)); pill.rect.setAttribute('fill', T.lime); pill.rect.setAttribute('fill-opacity', pr3);
    pill.lbl.setAttribute('fill', HA.mix(HA.mix(T.dim, T.amber, pa3), T.bg, pr3)); pill.label(pr3 > .5 ? 'Decided by a person' : 'Waiting on a person');
    // card position
    var cx = CX[0], cy = HA.lerp(180, 188, HA.seg(t, 0, 400)); var cop = HA.seg(t, 0, 400) * k;
    for (i = 0; i < LEGS.length; i++) { var lg = LEGS[i]; if (t >= lg[0]) cx = HA.lerp(CX[lg[2]], CX[lg[3]], HA.seg(t, lg[0], lg[1], E.inOutCubic)); }
    HA.tf(card, cx, cy); HA.op(card, cop);
    var shipped = HA.seg(t, 10600, 10880) * k; HA.setText(ct2, shipped > .5 ? 'SHIPPED' : 'Refund endpoint'); ctk.draw(shipped); HA.op(ctk, shipped);
    var working = -1; for (i = 0; i < 6; i++) if (HA.between(t, WORK[i][0], WORK[i][1]) && Math.abs(cx - CX[i]) < 1) working = i;
    if (working >= 0 && t < 11300) { HA.set(link, { x1: cx, y1: cy + 20, x2: cx, y2: 252 }); HA.op(link, 1); } else HA.op(link, 0);
    // cursor and clicks
    var px = 1210, py = 540, cop2 = 0;
    for (i = 0; i < CUR.length; i++) { var cu = CUR[i]; if (t >= cu[0]) { var q = HA.seg(t, cu[0], cu[1], E.inOutCubic); px = HA.lerp(cu[2][0], cu[3][0], q); py = HA.lerp(cu[2][1], cu[3][1], q); } }
    cop2 = HA.seg(t, 1400, 1600) * (1 - HA.seg(t, 10600, 11300, E.inOutCubic));
    var sc = 1; for (i = 0; i < CLICK.length; i++) { if (HA.between(t, CLICK[i], CLICK[i] + 160)) sc = 1 - .12 * HA.pulse(t, CLICK[i], CLICK[i] + 160); }
    cur.at(px, py, sc); HA.op(cur, cop2 * k);
    var rp = 0, rx = 0, ry = 0; for (i = 0; i < CLICK.length; i++) if (HA.between(t, CLICK[i], CLICK[i] + 400)) { rp = HA.seg(t, CLICK[i], CLICK[i] + 400, E.linear); rx = CUR[i][3][0]; ry = CUR[i][3][1]; }
    rip.show(rx, ry, rp, 6, 22);
    // log
    log.render(EV, t < 11300 ? t : 11300, 40, k);
  };
} };
