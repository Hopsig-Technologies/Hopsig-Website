"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Scroll reveal (`.rv` → `.rv.in`: opacity 0→1, translateY 14→0, .6s). React owns the class, so revealing an element
 * before the page has hydrated causes no mismatch. One shared IntersectionObserver, plus the reference's sweep
 * fallback for rows a fast scroll skips. Without JS nothing is hidden (rule 10): the hiding CSS needs `html.js`.
 */

type Entry = { el: Element; show: () => void };
let io: IntersectionObserver | null = null;
const pending = new Set<Entry>();

function sweep() {
  const line = window.innerHeight * 0.85;
  for (const e of pending) {
    if (e.el.getBoundingClientRect().top < line) {
      e.show();
      pending.delete(e);
      io?.unobserve(e.el);
    }
  }
}

function watch(entry: Entry) {
  if (!("IntersectionObserver" in window)) {
    entry.show();
    return () => {};
  }
  if (!io) {
    io = new IntersectionObserver(
      (records) =>
        records.forEach((r) => {
          if (!r.isIntersecting) return;
          for (const e of pending) {
            if (e.el === r.target) {
              e.show();
              pending.delete(e);
              io?.unobserve(r.target);
            }
          }
        }),
      { threshold: 0.15 },
    );
    window.addEventListener("scroll", sweep, { passive: true });
  }
  pending.add(entry);
  io.observe(entry.el);
  window.setTimeout(sweep, 300);
  return () => {
    pending.delete(entry);
    io?.unobserve(entry.el);
  };
}

export function Rv({
  as: Tag = "div",
  className = "",
  style,
  delay,
  onMouseEnter,
  children,
}: {
  as?: "div" | "section" | "span" | "article" | "aside";
  className?: string;
  style?: CSSProperties;
  /** Stagger in ms (transition-delay), as the reference does for rows and cards. */
  delay?: number;
  onMouseEnter?: () => void;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    return watch({ el: ref.current, show: () => setShown(true) });
  }, []);
  return (
    <Tag
      ref={ref as never}
      className={`rv${shown ? " in" : ""}${className ? " " + className : ""}`}
      style={delay !== undefined ? { transitionDelay: `${delay}ms`, ...style } : style}
      onMouseEnter={onMouseEnter}
    >
      {children}
    </Tag>
  );
}
