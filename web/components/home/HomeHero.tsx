"use client";

import { useEffect, useRef } from "react";
import { Field } from "../canvas/field";

type Beat = { when: string; title: string; text: string };

/**
 * The home hero: 240vh with a sticky stage. As it scrolls, the copy holds then rises and fades, the dot field
 * gathers into the engagement ring, and the five beats caption the ring in turn while the rail fills; the header
 * CTA lights once the hero's own CTA is gone. Port of the reference's `onScroll` (reference/site/index.html).
 *
 * Server-rendered copy is visible without JS; the captions stay hidden, as in the reference.
 */
export function HomeHero({ beats, hint, children }: { beats: Beat[]; hint: string; children: React.ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const hintEl = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = section.current!;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const field = new Field(canvas.current!, { cy: 0.5, p: 0, reducedMotion });
    const caps = Array.from(sec.querySelectorAll<HTMLElement>(".cap"));
    const rails = Array.from(rail.current!.children) as HTMLElement[];
    const hdr = document.getElementById("hdr");
    const absTop = () => sec.getBoundingClientRect().top + window.scrollY;

    const onScroll = () => {
      const H = sec.offsetHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, (window.scrollY - absTop()) / H));
      // copy: hold, then rise and fade
      const cp = Math.max(0, Math.min(1, (p - 0.12) / 0.2));
      copy.current!.style.opacity = String(1 - cp);
      copy.current!.style.transform = `translateY(${-60 * cp}px)`;
      hintEl.current!.style.opacity = String(1 - Math.min(1, p / 0.1));
      // the ring forms between .18 and .58; the captions cycle after .6
      field.p = Math.max(0, Math.min(1, (p - 0.18) / 0.4));
      const ci = p > 0.6 ? Math.min(4, Math.floor((p - 0.6) / 0.08)) : -1;
      field.active = Math.max(0, ci);
      caps.forEach((el, i) => {
        el.style.opacity = i === ci ? "1" : "0";
        el.style.transform = `translateY(${i === ci ? -50 : i < ci ? -56 : -44}%)`;
        el.style.transition = "opacity .35s, transform .35s";
      });
      rail.current!.style.opacity = ci >= 0 ? "1" : "0";
      rails.forEach((el, i) => (el.className = i <= ci ? "on" : ""));
      // the header CTA lights once the hero CTA is gone
      hdr?.classList.toggle("lit", p > 0.3);
    };
    let tick = false;
    const onScrollRaf = () => {
      if (tick) return;
      tick = true;
      requestAnimationFrame(() => {
        tick = false;
        onScroll();
      });
    };
    // Phones fire resize whenever the URL bar shows or hides; rebuild the dot field only when the width changes.
    let lastWidth = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        field.resize();
      }
      onScroll();
    };
    let raf = 0;
    const loop = (t: number) => {
      if (window.scrollY < absTop() + sec.offsetHeight) field.draw(t);
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("scroll", onScrollRaf, { passive: true });
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(loop);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScrollRaf);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      hdr?.classList.remove("lit");
    };
  }, []);

  return (
    <section ref={section} id="hero" className="hero">
      <div className="stick">
        <canvas ref={canvas} aria-hidden="true" />
        <div ref={copy} id="heroCopy" className="copy">
          {children}
        </div>
        {beats.map((b) => (
          <div key={b.when} className="cap">
            <div className="d">{b.when}</div>
            <div className="n">{b.title}</div>
            <div className="s">{b.text}</div>
          </div>
        ))}
        <div ref={hintEl} className="hint">
          {hint}
        </div>
        <div ref={rail} className="rail">
          {beats.map((b) => (
            <i key={b.when} />
          ))}
        </div>
      </div>
    </section>
  );
}
