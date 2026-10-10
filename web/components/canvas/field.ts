/**
 * The dot field behind every hero and closing: a 22px grid of dots that drift, gather into a tilted ellipse
 * (the "engagement ring") as `p` goes 0 → 1, rotate slowly, and are pushed away by the pointer with a slight
 * swirl and a spring back. Port of `Field` from the reference JS (reference/site/*.html, generator/hero_anim.py);
 * the numbers are the reference's.
 */

const pointer = { x: -9999, y: -9999 };
let pointerBound = false;

function bindPointer() {
  if (pointerBound) return;
  pointerBound = true;
  const set = (x: number, y: number) => {
    pointer.x = x;
    pointer.y = y;
  };
  window.addEventListener("mousemove", (e) => set(e.clientX, e.clientY), { passive: true });
  window.addEventListener("touchmove", (e) => e.touches[0] && set(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
  window.addEventListener("touchend", () => set(-9999, -9999));
  document.addEventListener("mouseleave", () => set(-9999, -9999));
}

type Dot = {
  hx: number;
  hy: number;
  a: number;
  sp: number;
  d: number;
  th: number;
  row: number;
  keep: boolean;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
};

export type FieldOptions = {
  /** Ring centre as a fraction of the height. */
  cy?: number;
  /** Ring formation 0 (loose grid) → 1 (ring). */
  p?: number;
  /** Ellipse height as a fraction of its width (hero .34, closing .56). */
  ryk?: number;
  /** Starting rotation. */
  rot?: number;
  light?: boolean;
  reducedMotion?: boolean;
};

export class Field {
  p: number;
  active = 0;
  private ctx: CanvasRenderingContext2D;
  private dots: Dot[] = [];
  private rot: number;
  private last = 0;
  private w = 0;
  private h = 0;
  private cx = 0;
  private cy = 0;
  private rx = 0;
  private ry = 0;
  private readonly R: number;
  private readonly dotRGB: string;
  private readonly accRGB: string;
  private readonly aR: number[];
  private readonly gR: number[];

  constructor(
    private canvas: HTMLCanvasElement,
    private o: FieldOptions,
  ) {
    bindPointer();
    this.ctx = canvas.getContext("2d")!;
    this.p = o.p ?? 0;
    this.rot = o.rot ?? 0;
    this.R = o.reducedMotion ? 0 : 170; // antigravity radius
    this.dotRGB = o.light ? "110,117,121" : "147,154,150";
    this.accRGB = o.light ? "63,107,31" : "198,242,78";
    this.aR = o.light ? [63, 107, 31] : [198, 242, 78];
    this.gR = o.light ? [110, 117, 121] : [147, 154, 150];
    this.resize();
  }

  resize() {
    const r = this.canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    this.w = Math.max(320, r.width);
    this.h = Math.max(320, r.height);
    this.canvas.width = this.w * dpr;
    this.canvas.height = this.h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const g = 22;
    const cols = Math.ceil(this.w / g) + 1;
    const rows = Math.ceil(this.h / g) + 1;
    let seed = 7;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    this.dots = [];
    for (let i = 0; i < cols * rows; i++) {
      this.dots.push({
        hx: (i % cols) * g,
        hy: Math.floor(i / cols) * g,
        a: rnd() * 6.283,
        sp: 0.3 + rnd() * 0.5,
        d: rnd() * 0.25,
        th: rnd() * 6.283,
        row: Math.floor(rnd() * 5) - 2,
        keep: rnd() < 0.22,
        ox: 0,
        oy: 0,
        vx: 0,
        vy: 0,
      });
    }
    this.cx = this.w / 2;
    this.cy = this.h * (this.o.cy ?? 0.5);
    this.rx = Math.min(430, this.w * 0.31);
    this.ry = this.rx * (this.o.ryk ?? 0.34);
  }

  draw(t: number) {
    const { ctx, w, h, p, dots, cx, cy, rx, ry, R } = this;
    const rm = this.o.reducedMotion;
    const dt = this.last ? Math.min(0.05, (t - this.last) / 1000) : 0;
    this.last = t;
    if (!rm) this.rot += dt * 0.22;
    const rot = this.rot;
    ctx.clearRect(0, 0, w, h);
    const rc = this.canvas.getBoundingClientRect();
    const px = pointer.x - rc.left;
    const py = pointer.y - rc.top;
    const R2 = R * R;
    const near = px > -R && px < w + R && py > -R && py < h + R;
    const drift = rm ? 0 : 1;

    for (const d of dots) {
      let e = Math.max(0, Math.min(1, (p - d.d) / (1 - d.d)));
      e = e * e * (3 - 2 * e);
      const hx = d.hx + Math.cos(t * 0.0004 * d.sp + d.a) * 5 * drift;
      const hy = d.hy + Math.sin(t * 0.0005 * d.sp + d.a) * 5 * drift;
      const th = d.th + rot;
      const rs = 1 + d.row * 0.035;
      let tx = cx + Math.cos(th) * rx * rs;
      let ty = cy + Math.sin(th) * ry * rs + d.row * 7;
      const depth = (Math.sin(th) + 1) / 2;
      if (d.keep) {
        tx = hx;
        ty = hy;
      }
      const bx = hx + (tx - hx) * e;
      const by = hy + (ty - hy) * e;
      // antigravity: the pointer pushes dots away with a slight swirl; a spring brings them home
      if (near) {
        const ddx = bx + d.ox - px;
        const ddy = by + d.oy - py;
        const d2 = ddx * ddx + ddy * ddy;
        if (d2 < R2 && d2 > 0.01) {
          const dist = Math.sqrt(d2);
          let f = 1 - dist / R;
          f = f * f * 2.1;
          const nx = ddx / dist;
          const ny = ddy / dist;
          d.vx += nx * f - ny * f * 0.5;
          d.vy += ny * f + nx * f * 0.5;
        }
      }
      if (d.ox || d.oy || d.vx || d.vy) {
        d.vx += -d.ox * 0.05;
        d.vy += -d.oy * 0.05;
        d.vx *= 0.88;
        d.vy *= 0.88;
        d.ox += d.vx;
        d.oy += d.vy;
        if (Math.abs(d.ox) < 0.02 && Math.abs(d.oy) < 0.02 && Math.abs(d.vx) < 0.02 && Math.abs(d.vy) < 0.02) d.ox = d.oy = d.vx = d.vy = 0;
      }
      const x = bx + d.ox;
      const y = by + d.oy;
      const alpha = d.keep ? 0.55 - 0.35 * p : 0.6 + 0.4 * e * depth;
      const s = d.keep ? 1.2 : 1.3 + 1.1 * e * depth;
      const spd = Math.abs(d.vx) + Math.abs(d.vy);
      if (spd > 0.5) {
        const k = Math.min(1, spd / 7);
        const [r, g, b] = [0, 1, 2].map((i) => (this.gR[i] + (this.aR[i] - this.gR[i]) * k) | 0);
        ctx.strokeStyle = `rgba(${r},${g},${b},${Math.min(1, alpha + k * 0.5).toFixed(3)})`;
        ctx.lineWidth = s;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x - d.vx * 2, y - d.vy * 2);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else {
        ctx.fillStyle = `rgba(${this.dotRGB},${alpha.toFixed(3)})`;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }
    }

    // five nodes on the ring
    if (p > 0.6) {
      const na = Math.min(1, (p - 0.6) / 0.2);
      for (let k = 0; k < 5; k++) {
        const ang = -Math.PI / 2 + k * 1.2566 + rot;
        const nx = cx + Math.cos(ang) * rx;
        const ny = cy + Math.sin(ang) * ry;
        const on = k === this.active;
        ctx.beginPath();
        ctx.arc(nx, ny, on ? 5 : 3.2, 0, 6.283);
        ctx.fillStyle = `rgba(${this.accRGB},${on ? na : na * 0.55})`;
        ctx.fill();
        if (on) {
          ctx.beginPath();
          ctx.arc(nx, ny, 11, 0, 6.283);
          ctx.strokeStyle = `rgba(${this.accRGB},${na * 0.6})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }
}
