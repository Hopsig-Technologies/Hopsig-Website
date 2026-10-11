// ind-retail — "Find the leak, fix it, keep stock true". 1200 x 560, loop 10,000 ms, seed 102.
// Shoppers flow through a five-step funnel as particles and leak out at checkout in amber; a fix pill lands on Checkout, fewer fall,
// Paid and revenue climb; then three disagreeing stock counts snap to one number.
HA.scenes['ind-retail'] = { loop: 10000, seed: 102, resolved: 8000, w: 1200, h: 560, mode: 'loop', build: function (c) {
  var T = HA.T, E = HA.ease, L = HA.g(c.svg), i, j;
  var LOOP = 10000, RESET = 9300, SPAWN = 50, NSP = LOOP / SPAWN, NP = 80, SPEED = 280, X0 = 70, XEND = 780, LIFE = 2600, DROPD = 600, FADEIN = 150;
  var BX = [70, 220, 370, 520, 670], BH = [300, 198, 111, 78, 33], PAID1 = 51, RATIO = [.66, .56, .70, .42], RATIO_FIX = .65;
  var NAMES = ['Sessions', 'Product', 'Cart', 'Checkout', 'Paid'], COUNTS = ['10,000', '6,600', '3,700', '2,600', '1,100'];
  var PULSE = [2000, 2600], PILL = [2600, 3080], FIX = 3080, LEAK = [3080, 3280], GROW = [3080, 4400], DELTA = [4100, 4400], RING = [4400, 4900], STOCK = [4500, 5200];
  var STOCK0 = [14, 11, 17];
  // seeded per-spawn parameters: vertical offset (fraction of the band), four pass rolls, where inside its drop bar it lets go
  var P = []; for (i = 0; i < NSP; i++) P.push({ off: (c.rng() * 2 - 1) * .8, u: [c.rng(), c.rng(), c.rng(), c.rng()], dx: 10 + 40 * c.rng() });

  // 2. funnel bars
  var bars = BX.map(function (x, n) { return HA.el('rect', { x: x, y: 256 - BH[n] / 2, width: 100, height: BH[n], rx: 8, fill: T.raised, stroke: T.line }, L); });
  for (i = 0; i < 4; i++) HA.el('line', { x1: BX[i] + 100, y1: 256, x2: BX[i + 1], y2: 256, stroke: T.line, 'stroke-width': 1 }, L);
  var cnts = [];
  for (i = 0; i < 5; i++) { HA.text(L, BX[i] + 50, 428, NAMES[i], 'micro', T.dim, { 'text-anchor': 'middle' }); cnts.push(HA.text(L, BX[i] + 50, 450, COUNTS[i], 'terminal', T.dim, { 'text-anchor': 'middle' })); }
  // 3. particles (pool of NP; at most ~53 alive at once)
  var pg = HA.g(L), dots = [];
  for (i = 0; i < NP; i++) { var g = HA.g(pg, { opacity: 0 }); g.halo = HA.el('circle', { r: 8, fill: T.lime, opacity: 0 }, g); g.c = HA.el('circle', { r: 2.5, fill: T.faint }, g); dots.push(g); }
  // half-height of the funnel at x; eased between bars; hp = Paid bar growth 0..1
  function band(x, hp) { var B = [150, 99, 55.5, 39, HA.lerp(BH[4] / 2, PAID1 / 2, hp)];
    for (var n = 0; n < 5; n++) if (x <= BX[n] + 100) { if (n === 0 || x >= BX[n]) return B[n]; return HA.lerp(B[n - 1], B[n], HA.seg(x, BX[n - 1] + 100, BX[n], E.inOutCubic)); }
    return B[4]; }
  // 4. leak label and droplet
  var drop = HA.el('path', { d: 'M5 0 C5 0 0 7 0 9.5 A5 5 0 0 0 10 9.5 C10 7 5 0 5 0 Z', fill: T.amber, transform: 'translate(452 330)' }, L);
  var leak0 = HA.text(L, 470, 340, 'Leak · 58% abandon at payment', 'micro', T.amber), leak1 = HA.text(L, 470, 340, 'Abandon 35%', 'micro', T.lime, { opacity: 0 });
  // 5. fix pill (group origin = pill top centre)
  var pill = HA.g(L, { opacity: 0 }); HA.el('rect', { x: -110, y: 0, width: 220, height: 28, rx: 14, fill: T.lime }, pill);
  HA.text(pill, 0, 18, 'Guest checkout + wallets', 'micro', T.bg, { 'text-anchor': 'middle' });
  // 6. revenue tile. "Example figures" sits one micro line under the header: on the header line it would touch "REVENUE · THIS WEEK".
  HA.el('rect', { x: 810, y: 96, width: 320, height: 120, rx: 10, fill: T.raised, stroke: T.line }, L);
  HA.text(L, 834, 126, 'Revenue · this week', 'micro', T.dim); HA.text(L, 1106, 142, 'Example figures', 'micro', T.faint, { 'text-anchor': 'end' });
  var rev = HA.counter(L, 834, 176, 96800, 'num', T.faint, { 'font-size': 36 }); rev.set(96800, 149600, 0, { prefix: '£' });
  var delta = HA.g(L, { opacity: 0 }); HA.el('rect', { x: 1042, y: 158, width: 64, height: 22, rx: 11, fill: T.lime }, delta); HA.text(delta, 1074, 173, '+55%', 'micro', T.bg, { 'text-anchor': 'middle' });
  // 7. stock panel
  HA.el('rect', { x: 810, y: 236, width: 320, height: 180, rx: 10, fill: T.raised, stroke: T.line }, L);
  HA.text(L, 834, 266, 'Stock · SKU 1042', 'micro', T.dim); HA.text(L, 1106, 266, 'Example figures', 'micro', T.faint, { 'text-anchor': 'end' });
  var stock = ['Store', 'Warehouse', 'App'].map(function (s, n) { HA.text(L, 834, 300 + 40 * n, s, 'micro', T.dim); return HA.text(L, 1106, 300 + 40 * n, STOCK0[n], 'label', T.amber, { 'text-anchor': 'end' }); });
  var foot0 = HA.text(L, 834, 406, '3 different counts', 'micro', T.amber), foot1 = HA.text(L, 834, 406, 'One stock position · synced 2 s ago', 'micro', T.lime, { opacity: 0 });
  var clipId = 'stockclip-' + c.inst.id + Math.floor(c.rng() * 1e6); var cp = HA.el('clipPath', { id: clipId }, c.svg.querySelector('defs')); HA.el('rect', { x: 810, y: 236, width: 320, height: 180, rx: 10 }, cp);
  var ring = HA.el('circle', { cx: 810, cy: 326, r: 0, fill: 'none', stroke: T.lime, 'stroke-width': 2, opacity: 0 }, HA.g(L, { 'clip-path': 'url(#' + clipId + ')' }));

  return function update(t) {
    var k = t >= RESET ? 1 - HA.seg(t, RESET, LOOP, E.inOutCubic) : 1;   // reset crossfade: every lit quantity x k
    var hp = HA.seg(t, GROW[0], GROW[1]) * k;
    // particles: spawn n is at 50 n ms (n < 0 belongs to the previous loop, so the flow is continuous across the seam);
    // its parameters come from n mod 200 and its checkout ratio from the loop-time it spawned, so every frame is a pure function of t
    var e = 0, n0 = Math.ceil((t - LIFE) / SPAWN), n1 = Math.floor(t / SPAWN);
    for (var n = n0; n <= n1 && e < NP; n++) {
      var s = n * SPAWN, pr = P[((n % NSP) + NSP) % NSP], sl = ((s % LOOP) + LOOP) % LOOP, fixed = sl >= FIX && sl < RESET;
      var age = t - s, x = X0 + SPEED * age / 1000, d = 4;
      for (j = 0; j < 4; j++) if (pr.u[j] >= (j === 3 && fixed ? RATIO_FIX : RATIO[j])) { d = j; break; }
      var y, op = HA.seg(age, 0, FADEIN), fill = T.faint, r = 2.5, hl = 0;
      if (d < 4) { var xd = BX[d] + pr.dx;
        if (x >= xd) { var fp = (age - (xd - X0) / SPEED * 1000) / DROPD; if (fp >= 1) continue; var fe = E.inOutCubic(fp);
          x = xd + 24 * (1 - Math.pow(1 - fp, 3)); y = 256 + pr.off * band(xd, hp) + 60 * fe; op *= 1 - fe;   // a short decelerating drift so the stop is not abrupt
          if (d === 3) fill = HA.mix(T.faint, T.amber, HA.clamp(fp * 3, 0, 1)); }
        else y = 256 + pr.off * band(x, hp); }
      else { if (x >= XEND) continue; y = 256 + pr.off * band(x, hp); var lp = HA.seg(x, 650, 680); fill = HA.mix(T.faint, T.lime, lp); r = 2.5 + .5 * lp; hl = .18 * lp; op *= 1 - HA.seg(x, 750, XEND, E.linear); }
      var dot = dots[e++]; HA.tf(dot, x, y); HA.op(dot, c.reduced ? 0 : op); dot.c.setAttribute('fill', fill); dot.c.setAttribute('r', r); HA.op(dot.halo, hl);
    }
    for (; e < NP; e++) HA.op(dots[e], 0);
    // funnel: Paid bar grows centred, its count climbs
    var ph = HA.lerp(BH[4], PAID1, hp); HA.set(bars[4], { y: 256 - ph / 2, height: ph });
    cnts[4].setAttribute('fill', HA.mix(T.dim, T.lime, HA.clamp((hp - .8) / .2, 0, 1))); HA.setText(cnts[4], HA.fmt(HA.lerp(1100, 1700, hp)));
    // leak label: two dips to .5 over 600 ms, then crossfades to the fixed rate
    var pu = HA.between(t, PULSE[0], PULSE[1]) ? .75 + .25 * Math.cos(4 * Math.PI * (t - PULSE[0]) / (PULSE[1] - PULSE[0])) : 1, lk = HA.seg(t, LEAK[0], LEAK[1]) * k;
    HA.op(leak0, (1 - lk) * pu); HA.op(leak1, lk); drop.setAttribute('fill', HA.mix(T.amber, T.lime, lk));
    // fix pill: fades in and snaps from y 40 to y 186 (its top), fades out in place under the reset
    HA.tf(pill, 570, HA.lerp(40, 186, HA.seg(t, PILL[0], PILL[1], E.snap))); HA.op(pill, HA.seg(t, PILL[0], PILL[0] + 240) * k);
    // revenue and delta
    rev.set(96800, 149600, hp, { prefix: '£' });
    var ds = HA.seg(t, DELTA[0], DELTA[1], E.snap) * k; HA.tf(delta, 1074 * (1 - ds), 169 * (1 - ds), ds); HA.op(delta, HA.clamp(ds * 3, 0, 1));
    // stock: ring sweep, then counts converge on 12 and the footer crossfades
    var rp = HA.seg(t, RING[0], RING[1], E.linear); HA.set(ring, { r: 340 * rp, opacity: rp > 0 && rp < 1 ? .4 * (1 - rp) : 0 });
    var sp = HA.seg(t, STOCK[0], STOCK[1]) * k;
    for (i = 0; i < 3; i++) { HA.setText(stock[i], Math.round(HA.lerp(STOCK0[i], 12, sp))); stock[i].setAttribute('fill', HA.mix(T.amber, T.lime, sp)); }
    HA.op(foot0, 1 - sp); HA.op(foot1, sp);
  };
} };
