"use client";

import { useEffect, useRef } from "react";
import { Field } from "./field";

/**
 * The dot-field canvas behind a hero or a closing. Decorative (`aria-hidden`); draws only while on screen;
 * with `prefers-reduced-motion` the dots hold still and the pointer does not move them.
 *
 * - `closing`: the finished ring (p = 1), rounder ellipse, as in every closing section.
 * - `drift`: the loose grid drifting (p = 0), as in the page heroes.
 */
export function RingCanvas({ variant, tone }: { variant: "closing" | "drift"; tone: "d" | "l" }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const field = new Field(
      canvas,
      variant === "closing"
        ? { cy: 0.5, p: 1, ryk: 0.56, rot: 0.6, light: tone === "l", reducedMotion }
        : { cy: 0.5, p: 0, light: tone === "l", reducedMotion },
    );
    let raf = 0;
    let visible = false;
    const loop = (t: number) => {
      field.draw(t);
      raf = visible ? requestAnimationFrame(loop) : 0;
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    // Phones fire resize whenever the URL bar shows or hides; rebuild the dot field only when the width changes.
    let lastWidth = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      field.resize();
    };
    window.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [variant, tone]);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
