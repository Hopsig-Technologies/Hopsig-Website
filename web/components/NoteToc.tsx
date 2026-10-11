"use client";

import { useEffect, useState } from "react";

/**
 * "In this note": links to the note's h2s; the one whose section you are reading is marked (the last heading that
 * has passed 30% of the viewport). Without JS it is a plain list of links.
 */
export function NoteToc({ title, items }: { title: string; items: { id: string; label: string }[] }) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    const onScroll = () => {
      const line = window.innerHeight * 0.3;
      let cur: string | null = null;
      for (const e of els) if (e.getBoundingClientRect().top <= line) cur = e.id;
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);
  return (
    <div>
      <div className="lab">{title}</div>
      <nav className="note-toc" aria-label={title}>
        {items.map((i) => (
          <a key={i.id} href={`#${i.id}`} className={active === i.id ? "on" : undefined} aria-current={active === i.id ? "location" : undefined}>
            — {i.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
