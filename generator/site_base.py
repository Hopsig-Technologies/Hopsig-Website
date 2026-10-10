# Hopsig — "Command-style" homepage prototype. Same 11-slot structure, Mercury-style experience:
# drifting dot field that gathers into the engagement ring, scroll-jacked horizontal cards, accordion,
# sticky sequence, marquee, scroll reveals, ring again at the close. All original visuals/copy.
import sys
sys.path.insert(0, "/tmp/claude-0/-home-claude/79df7775-e2c1-5360-bab2-1eab226cf378/scratchpad")
from hero_anim import panel as anim_panel

OUT = "./out/PROTO_Command.dc.html"
MONO = "'IBM Plex Mono', monospace"
INK, PAPER, LIME, MOSS = "#0E1116", "#F7F8F4", "#C6F24E", "#3F6B1F"
TEXT, DIM, SUB, LINE, PANEL, HAIR = "#E7ECEF", "#939A96", "#B9BFB6", "#262C34", "#12161C", "#1C222B"

def lab(txt, color=DIM, size=11):
    return '<div style="font-family: ' + MONO + '; font-size: ' + str(size) + 'px; letter-spacing: 0.16em; text-transform: uppercase; color: ' + color + ';">' + txt + '</div>'
def h2(txt, size=44, color=TEXT, maxw=""):
    return '<h2 style="margin: 0; font-size: ' + str(size) + 'px; font-weight: 600; line-height: 1.1; letter-spacing: -0.04em; color: ' + color + ';' + (' max-width: ' + maxw + ';' if maxw else '') + '">' + txt + '</h2>'
def btn(txt, mode="lime", href="#book", extra=""):
    st = ('background: ' + LIME + '; color: ' + INK + ';') if mode == "lime" else (('background: ' + INK + '; color: ' + PAPER + ';') if mode == "ink" else ('background: transparent; color: ' + TEXT + '; box-shadow: inset 0 0 0 1px ' + LINE + ';'))
    return '<a href="' + href + '" ' + extra + ' style="text-decoration: none; font-family: ' + MONO + '; font-weight: 500; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; padding: 16px 24px; border-radius: 8px; white-space: nowrap; ' + st + '">' + txt + '</a>'

CSS = '''
body{margin:0;font-family:"Space Grotesk",sans-serif;background:#0E1116;color:#E7ECEF}
a{color:#C6F24E}a:hover{color:#A9D437}
.wrap{max-width:1264px;margin:0 auto;padding:0 88px;box-sizing:content-box}
.hdr{position:sticky;top:0;z-index:20;background:rgba(14,17,22,.86);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border-bottom:1px solid #1C222B}
.hdr .cta{transition:background .35s,color .35s,box-shadow .35s}
.hdr.lit .cta{background:#C6F24E!important;color:#0E1116!important;box-shadow:none!important}
.hero{position:relative;height:240vh}
.hero .stick{position:sticky;top:0;height:100vh;overflow:hidden}
.hero canvas{position:absolute;inset:0;width:100%;height:100%}
.hero .copy{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:26px;padding:0 88px;will-change:transform,opacity}
.hero .cap{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;opacity:0;pointer-events:none}
.hero .cap .d{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#C6F24E}
.hero .cap .n{font-size:40px;font-weight:600;letter-spacing:-.04em;margin-top:8px}
.hero .cap .s{font-size:16px;color:#939A96;margin-top:10px;max-width:420px;margin-left:auto;margin-right:auto;line-height:1.5}
.hero .hint{position:absolute;bottom:32px;left:0;right:0;text-align:center;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#939A96}
.hdr nav a{padding:10px 0}
a.more{display:inline-block;padding:10px 0}
.hero .rail{position:absolute;bottom:32px;left:0;right:0;display:flex;justify-content:center;gap:6px;opacity:0}
.hero .rail i{display:block;width:44px;height:3px;border-radius:3px;background:#262C34}
.hero .rail i.on{background:#C6F24E}
.car{position:relative;height:260vh}
.car .stick{position:sticky;top:0;height:100vh;overflow:hidden;display:flex;flex-direction:column}
.car .head{padding-top:112px}
.car .track{display:flex;gap:32px;margin-top:40px;will-change:transform;padding-left:88px}
.card{flex:none;width:1120px;height:520px;border:1px solid #262C34;background:#12161C;border-radius:14px;display:flex;align-items:center;gap:48px;padding:40px;box-sizing:border-box;position:relative;overflow:hidden}
.card .ui{flex:none;transform:scale(.92);transform-origin:left center}
.card .cap{display:flex;flex-direction:column;gap:14px}
.card .cap h3{margin:0;font-size:32px;font-weight:600;letter-spacing:-.035em;line-height:1.15}
.card .cap p{margin:0;font-size:16px;line-height:1.6;color:#939A96;max-width:380px}
.card .k{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#C6F24E}
.pager{display:flex;align-items:center;gap:16px;margin-top:34px;font-family:'IBM Plex Mono',monospace;font-size:12px;color:#939A96}
.pager button{width:36px;height:36px;border-radius:8px;border:1px solid #262C34;background:transparent;color:#E7ECEF;cursor:pointer;font-size:14px}
.pager button:hover{border-color:#939A96}
.acc{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:start}
.acc .item{border-top:1px solid #262C34;padding:20px 0;cursor:pointer}
.acc .item .t{display:flex;justify-content:space-between;align-items:center;font-size:19px;font-weight:600;letter-spacing:-.02em;color:#939A96;transition:color .25s}
.acc .item.on .t{color:#E7ECEF}
.acc .item .b{max-height:0;overflow:hidden;transition:max-height .35s ease;color:#939A96;font-size:15px;line-height:1.6}
.acc .item.on .b{max-height:120px;padding-top:8px}
.acc .item .pl{width:22px;height:22px;border-radius:6px;border:1px solid #262C34;display:flex;align-items:center;justify-content:center;font-family:'IBM Plex Mono',monospace;font-size:13px;color:#939A96}
.acc .item.on .pl{border-color:#C6F24E;color:#C6F24E}
.acc .prev{position:sticky;top:112px;border:1px solid #262C34;background:#12161C;border-radius:14px;padding:32px;min-height:380px;display:flex;flex-direction:column;gap:14px}
.acc .prev .pv{display:none}.acc .prev .pv.on{display:flex;flex-direction:column;gap:14px}
.seq{display:grid;grid-template-columns:470px 1fr;gap:64px}
.seq .beat{min-height:58vh;display:flex;flex-direction:column;justify-content:center;gap:10px;opacity:.35;transition:opacity .4s}
.seq .beat.on{opacity:1}
.seq .beat .d{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#939A96}
.seq .beat.on .d{color:#C6F24E}
.seq .beat h3{margin:0;font-size:34px;font-weight:600;letter-spacing:-.035em;line-height:1.15}
.seq .beat p{margin:0;font-size:16px;line-height:1.6;color:#939A96;max-width:400px}
.seq .side{position:sticky;top:calc(50vh - 196px);height:392px;align-self:start}
.seq .side .st{position:absolute;inset:0;opacity:0;transform:translateY(10px);transition:opacity .4s,transform .4s;pointer-events:none}
.seq .side .st.on{opacity:1;transform:none}
.mq{overflow:hidden;position:relative;padding:22px 0;border-top:1px solid #1C222B;border-bottom:1px solid #1C222B}
.mq .row{display:flex;gap:14px;width:max-content;animation:mqa 40s linear infinite}
.mq .row.r{animation-direction:reverse}
.mq .chip{font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#B9BFB6;border:1px solid #262C34;border-radius:8px;padding:10px 14px;white-space:nowrap}
@keyframes mqa{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.rv{opacity:0;transform:translateY(14px);transition:opacity .6s ease,transform .6s ease}
.rv.in{opacity:1;transform:none}
.close{position:relative;min-height:90vh;overflow:hidden;display:flex;align-items:center;justify-content:center;text-align:center}
.close canvas{position:absolute;inset:0;width:100%;height:100%}
.close .c{position:relative;display:flex;flex-direction:column;align-items:center;gap:22px;padding:120px 88px}
@media (prefers-reduced-motion:reduce){.mq .row{animation:none}.rv{opacity:1;transform:none;transition:none}}
'''

JS = r'''
class Component extends DCLogic {
  componentDidMount() {
    var self = this;
    var q = function (s) { return document.querySelector(s); };
    var qa = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
    var rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.rm = rm;

    // ---------- dot field → engagement ring ----------
    var PT = { x: -9999, y: -9999 };
    window.addEventListener('mousemove', function (e) { PT.x = e.clientX; PT.y = e.clientY; }, { passive: true });
    window.addEventListener('touchmove', function (e) { if (e.touches && e.touches[0]) { PT.x = e.touches[0].clientX; PT.y = e.touches[0].clientY; } }, { passive: true });
    window.addEventListener('touchend', function () { PT.x = -9999; PT.y = -9999; });
    document.addEventListener('mouseleave', function () { PT.x = -9999; PT.y = -9999; });
    function Field(canvas, opts) {
      this.c = canvas; this.ctx = canvas.getContext('2d'); this.o = opts; this.dots = []; this.p = opts.p || 0; this.rot = 0; this.active = 0; this.last = 0;
      this.light = canvas.getAttribute('data-tone') === 'l'; this.dotRGB = this.light ? '110,117,121' : '147,154,150'; this.accRGB = this.light ? '63,107,31' : '198,242,78';
      this.R = rm ? 0 : 170; // antigravity radius
      this.resize();
    }
    Field.prototype.resize = function () {
      var r = this.c.getBoundingClientRect(); var dpr = Math.min(2, window.devicePixelRatio || 1);
      this.w = Math.max(320, r.width); this.h = Math.max(320, r.height);
      this.c.width = this.w * dpr; this.c.height = this.h * dpr; this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var g = 22, cols = Math.ceil(this.w / g) + 1, rows = Math.ceil(this.h / g) + 1, n = cols * rows, i;
      this.dots = [];
      var seed = 7;
      var rnd = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      for (i = 0; i < n; i++) {
        var gx = (i % cols) * g, gy = Math.floor(i / cols) * g;
        this.dots.push({ hx: gx, hy: gy, a: rnd() * 6.283, sp: .3 + rnd() * .5, d: rnd() * .25, th: rnd() * 6.283, row: Math.floor(rnd() * 5) - 2, keep: rnd() < .22, ox: 0, oy: 0, vx: 0, vy: 0 });
      }
      this.cx = this.w / 2; this.cy = this.h * (this.o.cy || .5); this.rx = Math.min(430, this.w * .31); this.ry = this.rx * .34;
    };
    Field.prototype.draw = function (t) {
      var ctx = this.ctx, w = this.w, h = this.h, p = this.p, dots = this.dots, i, n = dots.length;
      var dt = this.last ? Math.min(.05, (t - this.last) / 1000) : 0; this.last = t;
      if (!rm) this.rot += dt * .22;
      ctx.clearRect(0, 0, w, h);
      var cx = this.cx, cy = this.cy, rx = this.rx, ry = this.ry, rot = this.rot;
      var rc = this.c.getBoundingClientRect(), px = PT.x - rc.left, py = PT.y - rc.top, R = this.R, R2 = R * R;
      var near = px > -R && px < w + R && py > -R && py < h + R;
      var aR = this.light ? [63, 107, 31] : [198, 242, 78], gR = this.light ? [110, 117, 121] : [147, 154, 150];
      for (i = 0; i < n; i++) {
        var d = dots[i];
        var e = Math.max(0, Math.min(1, (p - d.d) / (1 - d.d)));
        e = e * e * (3 - 2 * e);
        var drift = rm ? 0 : 1;
        var hx = d.hx + Math.cos(t * .0004 * d.sp + d.a) * 5 * drift, hy = d.hy + Math.sin(t * .0005 * d.sp + d.a) * 5 * drift;
        var th = d.th + rot, rs = 1 + d.row * .035;
        var tx = cx + Math.cos(th) * rx * rs, ty = cy + Math.sin(th) * ry * rs + d.row * 7;
        var depth = (Math.sin(th) + 1) / 2;
        if (d.keep) { tx = hx; ty = hy; }
        var bx = hx + (tx - hx) * e, by = hy + (ty - hy) * e;
        // antigravity: the pointer pushes dots away with a slight swirl; a spring brings them home
        if (near) {
          var ddx = bx + d.ox - px, ddy = by + d.oy - py, d2 = ddx * ddx + ddy * ddy;
          if (d2 < R2 && d2 > .01) {
            var dist = Math.sqrt(d2), f = 1 - dist / R; f = f * f * 2.1;
            var nx = ddx / dist, ny = ddy / dist;
            d.vx += nx * f - ny * f * .5; d.vy += ny * f + nx * f * .5;
          }
        }
        if (d.ox || d.oy || d.vx || d.vy) {
          d.vx += -d.ox * .05; d.vy += -d.oy * .05; d.vx *= .88; d.vy *= .88; d.ox += d.vx; d.oy += d.vy;
          if (Math.abs(d.ox) < .02 && Math.abs(d.oy) < .02 && Math.abs(d.vx) < .02 && Math.abs(d.vy) < .02) { d.ox = d.oy = d.vx = d.vy = 0; }
        }
        var x = bx + d.ox, y = by + d.oy;
        var alpha = d.keep ? (.55 - .35 * p) : (.6 + .4 * e * depth);
        var s = d.keep ? 1.2 : 1.3 + 1.1 * e * depth;
        var spd = Math.abs(d.vx) + Math.abs(d.vy);
        if (spd > .5) {
          var k = Math.min(1, spd / 7);
          var r = (gR[0] + (aR[0] - gR[0]) * k) | 0, g = (gR[1] + (aR[1] - gR[1]) * k) | 0, bb = (gR[2] + (aR[2] - gR[2]) * k) | 0;
          ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + bb + ',' + Math.min(1, alpha + k * .5).toFixed(3) + ')';
          ctx.lineWidth = s; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(x - d.vx * 2.0, y - d.vy * 2.0); ctx.lineTo(x, y); ctx.stroke();
        } else {
          ctx.fillStyle = 'rgba(' + this.dotRGB + ',' + alpha.toFixed(3) + ')';
          ctx.fillRect(x - s / 2, y - s / 2, s, s);
        }
      }
      // five nodes on the ring
      if (p > .6) {
        var k, na = Math.min(1, (p - .6) / .2);
        for (k = 0; k < 5; k++) {
          var ang = -Math.PI / 2 + k * 1.2566 + rot, nx = cx + Math.cos(ang) * rx, ny = cy + Math.sin(ang) * ry;
          var on = (k === this.active);
          ctx.beginPath(); ctx.arc(nx, ny, on ? 5 : 3.2, 0, 6.283);
          ctx.fillStyle = on ? 'rgba(198,242,78,' + na + ')' : 'rgba(198,242,78,' + (na * .55) + ')'; ctx.fill();
          if (on) { ctx.beginPath(); ctx.arc(nx, ny, 11, 0, 6.283); ctx.strokeStyle = 'rgba(198,242,78,' + (na * .6) + ')'; ctx.lineWidth = 1; ctx.stroke(); }
        }
      }
    };

    var heroC = q('#heroCanvas'), closeC = q('#closeCanvas');
    var hero = new Field(heroC, { cy: .5, p: 0 });
    var close = new Field(closeC, { cy: .5, p: 1 }); close.p = 1; close.rot = .6;
    var heroSec = q('#hero'), copy = q('#heroCopy'), hint = q('#heroHint'), rail = q('#heroRail');
    var caps = qa('#hero .cap'), rails = qa('#heroRail i'), hdr = q('#hdr');
    var car = q('#car'), track = q('#track'), pager = q('#pagerN'), cards = qa('#track .card');
    var vh = function () { return window.innerHeight; };
    var absTop = function (el) { return el.getBoundingClientRect().top + (window.scrollY || window.pageYOffset); };

    function onScroll() {
      var y = window.scrollY || window.pageYOffset;
      var H = heroSec.offsetHeight - vh();
      var p = Math.max(0, Math.min(1, (y - absTop(heroSec)) / H));
      // copy: hold, then rise and fade
      var cp = Math.max(0, Math.min(1, (p - .12) / .2));
      copy.style.opacity = String(1 - cp); copy.style.transform = 'translateY(' + (-60 * cp) + 'px)';
      hint.style.opacity = String(1 - Math.min(1, p / .1));
      // ring forms between .2 and .6
      hero.p = Math.max(0, Math.min(1, (p - .18) / .4));
      // captions cycle between .55 and 1
      var ci = -1;
      if (p > .6) { ci = Math.min(4, Math.floor((p - .6) / .08)); }
      hero.active = ci < 0 ? 0 : ci;
      caps.forEach(function (el, i) { el.style.opacity = (i === ci) ? '1' : '0'; el.style.transform = 'translateY(' + (i === ci ? -50 : (i < ci ? -56 : -44)) + '%)'; el.style.transition = 'opacity .35s, transform .35s'; });
      rail.style.opacity = ci >= 0 ? '1' : '0';
      rails.forEach(function (el, i) { el.className = (i <= ci) ? 'on' : ''; });
      // header button lights once the hero CTA is gone
      if (p > .3) hdr.classList.add('lit'); else hdr.classList.remove('lit');
      // carousel
      if (car) {
        var top = absTop(car), ch = car.offsetHeight - vh();
        var cpg = Math.max(0, Math.min(1, (y - top) / ch));
        var idx = cpg * (cards.length - 1);
        var step = cards[0].offsetWidth + 32;
        track.style.transform = 'translateX(' + (-idx * step) + 'px)';
        var n = Math.min(cards.length, Math.floor(idx + .5) + 1);
        pager.textContent = n + ' / ' + cards.length;
        cards.forEach(function (c, i) { var dd = Math.abs(i - idx); c.style.opacity = String(1 - Math.min(.55, dd * .55)); });
      }
    }
    this.onScroll = function () { if (!self.tick) { self.tick = true; requestAnimationFrame(function () { self.tick = false; onScroll(); }); } };
    window.addEventListener('scroll', this.onScroll, { passive: true });
    this.onResize = function () { hero.resize(); close.resize(); onScroll(); };
    window.addEventListener('resize', this.onResize);

    // arrows
    qa('[data-go]').forEach(function (b) {
      b.addEventListener('click', function () {
        var dir = parseInt(b.getAttribute('data-go'), 10);
        var y = window.scrollY || window.pageYOffset, top = absTop(car), ch = car.offsetHeight - vh();
        var cur = Math.round(Math.max(0, Math.min(1, (y - top) / ch)) * (cards.length - 1));
        var nx = Math.max(0, Math.min(cards.length - 1, cur + dir));
        window.scrollTo({ top: top + nx / (cards.length - 1) * ch, behavior: rm ? 'auto' : 'smooth' });
      });
    });

    // accordion
    var items = qa('#acc .item'), pvs = qa('#acc .pv');
    items.forEach(function (it, i) {
      it.addEventListener('click', function () {
        items.forEach(function (o, j) { o.classList.toggle('on', j === i); });
        pvs.forEach(function (o, j) { o.classList.toggle('on', j === i); });
      });
    });

    // sticky sequence + reveals
    var beats = qa('#seq .beat'), sts = qa('#seq .st');
    if (window.IntersectionObserver) {
      this.io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            var i = parseInt(en.target.getAttribute('data-beat'), 10);
            beats.forEach(function (b, j) { b.classList.toggle('on', j === i); });
            sts.forEach(function (s, j) { s.classList.toggle('on', j === i); });
          }
        });
      }, { threshold: .5 });
      beats.forEach(function (b) { self.io.observe(b); });
      this.io2 = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); self.io2.unobserve(en.target); } });
      }, { threshold: .15 });
      qa('.rv').forEach(function (el) { self.io2.observe(el); });
    } else {
      beats[0].classList.add('on'); sts[0].classList.add('on'); qa('.rv').forEach(function (el) { el.classList.add('in'); });
    }

    // render loop
    var loop = function (t) {
      var y = window.scrollY || window.pageYOffset;
      if (y < absTop(heroSec) + heroSec.offsetHeight) hero.draw(t);
      var r = closeC.getBoundingClientRect();
      if (r.top < vh() && r.bottom > 0) close.draw(t);
      self.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
    onScroll();
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll); window.removeEventListener('resize', this.onResize);
    if (this.io) this.io.disconnect(); if (this.io2) this.io2.disconnect(); if (this.raf) cancelAnimationFrame(this.raf);
  }
  renderVals() { return {}; }
}
'''

BEATS = [("Day 0", "The call", "You describe the problem. We say on the call whether we are right for it, and what it would cost."),
         ("Day 3", "The scope", "A two-page SOW: what is in, what is out, what it costs. Before you pay anything."),
         ("Day 10", "People in", "Access, first commit. You meet the engineers before they start, and they are in your standup from day one."),
         ("Week 6", "First increment live", "Working software in your environment, measured before we claim it improved."),
         ("Fortnightly", "The review", "Shipped, slipped, cost against plan. Continue, or hand over. Your call, every fortnight.")]

def header():
    return ('<header id="hdr" class="hdr"><div class="wrap" style="height: 72px; display: flex; align-items: center; justify-content: space-between;">'
            '<div style="font-size: 22px; font-weight: 600; letter-spacing: -0.045em; line-height: 1;"><span style="color: ' + TEXT + ';">Hop</span><span style="color: ' + LIME + ';">sig</span></div>'
            '<nav style="display: flex; align-items: center; gap: 30px;">' + ''.join('<a href="#' + h + '" style="text-decoration: none; font-family: ' + MONO + '; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ' + DIM + ';">' + n + '</a>' for n, h in [("Services", "car"), ("Team", "team"), ("Rates", "book")]) +
            '<a href="#book" class="cta" style="text-decoration: none; font-family: ' + MONO + '; font-weight: 500; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; padding: 12px 17px; border-radius: 8px; background: transparent; color: ' + TEXT + '; box-shadow: inset 0 0 0 1px ' + LINE + ';">Book a call</a></nav></div></header>')

def hero():
    caps = ''.join('<div class="cap"><div class="d">' + d + '</div><div class="n">' + n + '</div><div class="s">' + s + '</div></div>' for d, n, s in BEATS)
    return ('<section id="hero" class="hero"><div class="stick"><canvas id="heroCanvas" aria-hidden="true"></canvas>'
            '<div id="heroCopy" class="copy">' + lab("Engineering &amp; data teams &#183; UK, US, EU", DIM) +
            '<h1 style="margin: 0; font-size: 84px; font-weight: 600; line-height: 1; letter-spacing: -0.05em; color: ' + TEXT + ';">You think it.<br>We finish it.</h1>'
            '<p style="margin: 0; max-width: 640px; font-size: 19px; line-height: 31px; color: ' + SUB + ';">Senior engineers and data/AI people who join your team, or take the build end to end. Two founders, ten years each, and nobody junior on your account.</p>'
            '<div style="display: flex; align-items: center; gap: 14px; margin-top: 6px;"><div style="display: flex; align-items: center; border: 1px solid ' + LINE + '; border-radius: 8px; padding: 0 0 0 16px; background: ' + PANEL + ';"><span style="font-family: ' + MONO + '; font-size: 12px; color: ' + DIM + '; width: 220px; text-align: left;">Your work email</span>' + btn("Book a 30-minute call") + '</div>' + btn("See rates", "outline", "#book") + '</div></div>'
            + caps + '<div id="heroHint" class="hint">Scroll &#8595; &#160; the engagement, in five beats</div><div id="heroRail" class="rail"><i></i><i></i><i></i><i></i><i></i></div></div></section>')

def carousel():
    cards = [("01 &#8212; Embedded", "Engineers inside your team", "Your standups, your board, your repo, your definition of done. We manage the person; you direct the work. Monthly, per engineer.", 2),
             ("02 &#8212; Built", "A product, scoped and shipped", "A written scope, a fixed first increment, working software inside six weeks. Then we keep going or we hand it over.", 1),
             ("03 &#8212; Data &amp; AI", "Systems that stay correct", "Pipelines, warehouses, retrieval and evaluation harnesses. We measure the thing before we claim it improved.", 3)]
    html = '<section id="car" class="car"><div class="stick"><div class="wrap head" style="display: flex; align-items: flex-end; justify-content: space-between;">' + h2("Three ways we work.", 52) + '<div class="pager"><span id="pagerN">1 / 3</span><button data-go="-1" aria-label="Previous">&#8592;</button><button data-go="1" aria-label="Next">&#8594;</button></div></div><div id="track" class="track">'
    for k, t, p, ph in cards:
        html += '<div class="card"><div class="ui">' + anim_panel(dark=True, mode="static", static_phase=ph, w=568, h=392, prefix="c" + str(ph)) + '</div><div class="cap"><div class="k">' + k + '</div><h3>' + t + '</h3><p>' + p + '</p></div></div>'
    html += '</div></div></section>'
    return html

def accordion():
    doms = [("E-commerce &amp; marketplaces", "[What a founder shipped here &#8212; the system, the scale, the outcome.]"), ("Real-estate &amp; CRM platforms", "[What a founder shipped here.]"), ("Data pipelines &amp; analytics", "[What a founder shipped here.]"), ("Marketing &amp; conversion tracking", "[What a founder shipped here.]"), ("Internal tools &amp; back-office", "[What a founder shipped here.]"), ("[DOMAIN 6]", "[What a founder shipped here.]")]
    left = ''.join('<div class="item' + (' on' if i == 0 else '') + '"><div class="t"><span>' + a + '</span><span class="pl">' + ('&#8722;' if i == 0 else '+') + '</span></div><div class="b">' + b + '</div></div>' for i, (a, b) in enumerate(doms))
    right = ''.join('<div class="pv' + (' on' if i == 0 else '') + '">' + lab("0" + str(i + 1) + " &#183; Domain", LIME) + '<div style="font-size: 26px; font-weight: 600; letter-spacing: -0.03em; line-height: 1.2;">' + a + '</div><div style="height: 180px; border: 1px dashed ' + DIM + '; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-family: ' + MONO + '; font-size: 12px; color: ' + DIM + '; text-align: center; line-height: 1.6;">[ONE SCREENSHOT OR CHART<br>FROM THE REAL SYSTEM]</div><div style="font-family: ' + MONO + '; font-size: 12px; line-height: 1.7; color: ' + SUB + ';">Who: [ROLE] at [COMPANY TYPE]<br>Scale: [USERS / ROWS / &#163;]<br>Founder: [NAME]</div></div>' for i, (a, b) in enumerate(doms))
    return ('<section id="acc" class="wrap" style="padding-top: 140px; padding-bottom: 140px;"><div class="rv" style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 44px;">' + h2("Where we have done this before.", 44) + lab("Only domains a founder has shipped in") + '</div>'
            '<div class="acc"><div>' + left + '<div style="border-top: 1px solid ' + LINE + ';"></div></div><div class="prev">' + right + '</div></div></section>')

def sequence():
    left = ''.join('<div class="beat' + (' on' if i == 0 else '') + '" data-beat="' + str(i) + '"><div class="d">' + d + '</div><h3>' + n + '</h3><p>' + s + '</p></div>' for i, (d, n, s) in enumerate(BEATS))
    right = ''.join('<div class="st' + (' on' if i == 0 else '') + '">' + anim_panel(dark=True, mode="static", static_phase=i, w=568, h=392, prefix="s" + str(i)) + '</div>' for i in range(5))
    return ('<section id="how" class="wrap" style="padding-top: 60px; padding-bottom: 80px;"><div class="rv">' + lab("How an engagement runs", LIME) + '<div style="height: 14px;"></div>' + h2("This exists three days after the call. Before you pay anything.", 44, TEXT, "760px") + '</div>'
            '<div id="seq" class="seq" style="margin-top: 20px;"><div>' + left + '</div><div class="side">' + right + '</div></div></section>')

def midcta():
    return ('<section class="wrap" style="padding-bottom: 140px;"><div class="rv" style="display: flex; align-items: center; justify-content: space-between; gap: 40px; border: 1px solid ' + LINE + '; background: ' + PANEL + '; border-radius: 14px; padding: 32px 36px;">'
            '<div style="font-size: 26px; font-weight: 600; letter-spacing: -0.03em; line-height: 1.2; max-width: 660px;">Start a new build, or put senior people on one that is already running.</div>' + btn("Book a 30-minute call") + '</div></section>')

def marquee():
    a = ["Backend services", "Frontend", "Data pipelines", "Warehousing", "Retrieval", "Evaluation harnesses", "Platform &amp; CI", "Observability", "Payments", "Auth &amp; SSO", "Search", "Migrations"]
    b = ["Event streaming", "Batch &#8594; incremental", "API design", "Mobile", "Reporting", "Model serving", "Cost control", "On-call runbooks", "Data quality", "Integrations", "Access control", "Load &amp; scale"]
    row = lambda xs, cls: '<div class="row ' + cls + '">' + ''.join('<span class="chip">' + x + '</span>' for x in xs + xs) + '</div>'
    return ('<section style="padding-bottom: 140px;"><div class="wrap rv" style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 36px;">' + h2("What we work in.", 44) + lab("Only what a founder has shipped to production") + '</div>'
            '<div class="mq">' + row(a, '') + '</div><div class="mq" style="border-top: 0;">' + row(b, 'r') + '</div>'
            '<div class="wrap" style="margin-top: 28px; font-size: 15px; color: ' + DIM + ';">Not on the list? We will say so on the call, rather than learn it on your time.</div></section>')

def why():
    items = [("Senior only", "Ten years each. No juniors on your account, ever."), ("Scope before money", "A written SOW three days after the call, before you pay."), ("Overlap that works", "Four hours with GMT, every working day."), ("Easy to leave", "Thirty days&#8217; notice, either side, no argument."), ("Measured", "We measure it before we claim it improved.")]
    return ('<section class="wrap" style="padding-bottom: 140px;"><div class="rv">' + h2("Why Hopsig.", 44) + '</div><div style="display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 18px; margin-top: 40px;">' +
            ''.join('<div class="rv" style="transition-delay: ' + str(i * 80) + 'ms; border-top: 2px solid ' + (LIME if i == 1 else LINE) + '; padding-top: 16px; display: flex; flex-direction: column; gap: 8px;"><div style="font-family: ' + MONO + '; font-size: 11px; color: ' + DIM + ';">0' + str(i + 1) + '</div><div style="font-size: 19px; font-weight: 600; letter-spacing: -0.02em;">' + a + '</div><div style="font-size: 14px; line-height: 22px; color: ' + DIM + ';">' + b + '</div></div>' for i, (a, b) in enumerate(items)) + '</div></section>')

def founders():
    photo = '<div class="rv" style="height: 250px; background: ' + PANEL + '; border: 1px dashed ' + DIM + '; border-radius: 12px; display: flex; align-items: center; justify-content: center; text-align: center;"><div style="font-family: ' + MONO + '; font-size: 12px; line-height: 19px; color: ' + DIM + ';">[FOUNDER PHOTO]<br>4:5, natural light</div></div>'
    bio = '<div class="rv" style="border-top: 2px solid ' + TEXT + '; padding-top: 14px;"><div style="font-size: 19px; font-weight: 600; letter-spacing: -0.02em;">[FOUNDER NAME]</div><div style="margin-top: 6px;">' + lab("[DISCIPLINE]") + '</div><div style="font-size: 15px; line-height: 24px; color: ' + DIM + '; margin-top: 8px;">[One line: the hardest thing they have shipped, with the company or the scale.]</div></div>'
    return ('<section id="team" class="wrap" style="padding: 100px 0 120px;"><div style="display: flex; gap: 64px; align-items: flex-start;"><div class="rv" style="width: 440px; display: flex; flex-direction: column; gap: 20px;">' + lab("Who you will work with") + h2("Two founders. You will work with both.", 44) +
            '<p style="margin: 0; font-size: 17px; line-height: 29px; color: ' + SUB + ';">No account manager, no bench, no handover to a team you have not met. The people who scope your work are the people who do it.</p></div>'
            '<div style="flex-grow: 1; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px 26px;">' + photo + photo + bio + bio + '</div></div>'
            '<div class="rv" style="margin-top: 80px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid ' + LINE + '; border-bottom: 1px solid ' + LINE + '; padding: 22px 0; font-family: ' + MONO + '; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: ' + DIM + ';">' + ''.join('<span>' + s + '</span>' for s in ["Established [YEAR]", "Karachi, Pakistan", "Two founders &#183; ten years each", "Built for teams in the UK, US and EU", "[COMPANY REG NO.]"]) + '</div></section>')

def closing():
    return ('<section id="book" class="close"><canvas id="closeCanvas" aria-hidden="true"></canvas><div class="c">' + lab("Fortnightly &#183; your call", LIME) +
            '<h2 style="margin: 0; font-size: 56px; font-weight: 600; line-height: 1.05; letter-spacing: -0.045em; max-width: 760px;">Thirty minutes, and you will know whether we can help.</h2>'
            '<p style="margin: 0; max-width: 560px; font-size: 17px; line-height: 29px; color: ' + SUB + ';">Bring the problem, not a brief. If it is outside what we do well, we will say which of our contacts to call instead.</p>'
            '<div style="display: flex; align-items: center; gap: 14px; margin-top: 8px;">' + btn("Book a 30-minute call") + '<span style="font-family: ' + MONO + '; font-size: 12px; color: ' + DIM + ';">Or email [HELLO@HOPSIG.COM] &#8212; reply within one working day.</span></div></div></section>')

def footer():
    return ('<footer style="border-top: 1px solid ' + HAIR + ';"><div class="wrap" style="padding-top: 36px; padding-bottom: 36px; display: flex; align-items: center; justify-content: space-between;"><div style="display: flex; align-items: center; gap: 12px;"><div style="font-size: 17px; font-weight: 600; letter-spacing: -0.045em; line-height: 1;"><span style="color: ' + TEXT + ';">Hop</span><span style="color: ' + LIME + ';">sig</span></div><div style="width: 1px; height: 13px; background: ' + LINE + ';"></div>' + lab("Technologies") + '</div><div style="font-family: ' + MONO + '; font-size: 11px; color: ' + DIM + ';">Karachi, Pakistan &#183; [COMPANY REG NO.] &#183; hopsig.com</div></div></footer>')

def page():
    body = header() + hero() + carousel() + accordion() + sequence() + midcta() + marquee() + why() + founders() + closing() + footer()
    return ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Prototype — Command-style experience</title>\n<script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n<helmet>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap">\n<style>' + CSS + '</style>\n</helmet>\n'
            '<div style="width: 100%; min-height: 100vh; background: ' + INK + '; color: ' + TEXT + '; position: relative;">' + body + '</div>\n</x-dc>\n<script type="text/x-dc" data-dc-script data-props=\'{"$preview":{"width":1440,"height":900}}\'>' + JS + '</script>\n</body>\n</html>\n')

