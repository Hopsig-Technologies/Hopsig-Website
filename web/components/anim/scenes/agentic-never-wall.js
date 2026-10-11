// agentic-never-wall — "What agents never do", under the simulator on /agentic-flow. 1200 x 320, state machine (mode 'state'), seed 9.
// Seven rules from the site, four on the first row and three on the second. Each is a real HTML button (keyboard, screen reader)
// drawn transparent over an SVG face, so the face can carry the padlock and the site's wrapped label; a click shakes it and the log explains.
HA.scenes['agentic-never-wall'] = { loop: 10000, seed: 9, resolved: 0, w: 1200, h: 320, mode: 'state', build: function (c) {
  var T = HA.T, L = HA.g(c.svg), RM = c.reduced;
  function D(ms) { return RM ? 0 : ms; }
  function sg(t, a, d, e) { return d <= 0 ? (t >= a ? 1 : 0) : HA.seg(t, a, a + d, e); }
  // the site's rules do not fit 248-wide buttons at node-label 15, so labels are sans13 and wrap to two lines
  var RULES = [['Merge to main'], ['Change the guardrails,', 'CI or branch rules'], ['Touch a production', 'environment or data'], ['Decide scope, or add to it'],
               ['Sign off an increment'], ['Spend money, open accounts', 'or talk to your users'], ['Carry on when a person', 'has said stop']];
  var SHORT = ['pre-merge hook', 'guardrail lock', 'environment policy', 'scope policy', 'sign-off policy', 'spend policy', 'stop signal'];
  var POS = [[70, 48], [336, 48], [602, 48], [868, 48], [70, 120], [336, 120], [602, 120]];
  var IDLE_LINE = 'guardrails › 7 rules active', HINT_AFTER = 4000, HINT_EACH = 1200, SHAKE = [0, -4, 4, -4, 0], LOCK_S = 12 / 14;
  var st = { name: 'idle', since: 0, idx: -1 }, now = 0, touched = false;
  var btns = POS.map(function (p, i) {
    var g = HA.g(L), r = HA.el('rect', { x: p[0], y: p[1], width: 248, height: 56, rx: 10, fill: T.raised, stroke: T.line, 'stroke-width': 1 }, g);
    var lock = HA.padlock(g, p[0] + 24, p[1] + 29, T.faint); HA.tf(lock, p[0] + 24, p[1] + 29, LOCK_S);
    RULES[i].forEach(function (s, j) { HA.text(g, p[0] + 44, p[1] + (RULES[i].length === 1 ? 33 : 24 + 17 * j), s, 'sans13', T.dim); });
    var b = HA.button(c, p[0], p[1], 248, 56, '', 'outline', function () { touched = true; st = { name: 'blocked', since: now, idx: i }; });
    b.setAttribute('aria-label', RULES[i].join(' ')); b.style.background = 'transparent'; b.style.border = '0'; b.style.borderRadius = '10px';
    b.addEventListener('focus', function () { touched = true; });
    return { g: g, r: r, lock: lock, x: p[0], y: p[1] };
  });
  HA.el('rect', { x: 70, y: 208, width: 1060, height: 64, rx: 10, fill: T.log, stroke: T.line }, L);
  var logT = HA.text(L, 94, 246, IDLE_LINE, 'terminal', T.dim);
  function shakeX(e) { if (e >= 240) return 0; var q = e / 60, j = Math.floor(q); return HA.lerp(SHAKE[j], SHAKE[j + 1], q - j); }   // x 0 -> -4 -> 4 -> -4 -> 0 over 240 ms
  return function update(t) {
    now = t; var e = t - st.since;
    // hint: after 4 s in view with no interaction, outline one button at a time, 1,200 ms each
    var hint = !touched && t >= HINT_AFTER ? Math.floor((t - HINT_AFTER) / HINT_EACH) % 7 : -1, he = (t - HINT_AFTER) % HINT_EACH;
    var ha = hint < 0 ? 0 : RM ? 1 : Math.min(HA.seg(he, 0, 160), 1 - HA.seg(he, HINT_EACH - 160, HINT_EACH));
    for (var i = 0; i < 7; i++) {
      var b = btns[i], mine = st.name === 'blocked' && st.idx === i, red = mine ? (e < 400 ? 1 : 1 - HA.seg(e, 400, 600)) : 0, hv = i === hint ? ha : 0;
      b.r.setAttribute('stroke', HA.mix(HA.mix(T.line, T.faint, hv), T.red, red)); b.r.setAttribute('stroke-width', 1 + .5 * Math.max(hv, red));
      HA.tf(b.g, mine && !RM ? shakeX(e) : 0, 0); HA.tf(b.lock, b.x + 24, b.y + 29, LOCK_S, mine ? -8 * (1 - sg(e, 0, D(280))) : 0);
    }
    var line = st.name === 'blocked' ? 'blocked › ' + SHORT[st.idx] + ' · needs a person' : IDLE_LINE;
    HA.setText(logT, st.name === 'blocked' && !RM ? HA.typed(line, e, 0, 80) : line);
  };
} };
