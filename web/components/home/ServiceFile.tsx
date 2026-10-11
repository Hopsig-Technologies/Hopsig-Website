"use client";

import { useEffect, useRef, type ReactNode } from "react";

const TAB = 46;
const TOP = 88;

/**
 * The core-services "file": spec sheets that stick one tab lower each as you scroll, so the stack leaves every
 * tab visible. A covered sheet shrinks slightly and darkens; a stuck tab turns lime; the legend fills; clicking a
 * tab scrolls its sheet into place. Every sheet is sized to the tallest so the stack lines up, and the dark
 * surface that follows (`.over`) is pulled up over the dwell. Port of the reference's `#file` script.
 *
 * Without JS the sheets are a plain list (each still sticky at its own offset). Below 900px they are a plain list
 * too (home.css): the stack needs more height than a phone has, so this stands down and undoes what it wrote.
 */
export function ServiceFile({ count, children }: { count: number; children: ReactNode }) {
  const file = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = file.current!;
    const sheets = Array.from(root.querySelectorAll<HTMLElement>(":scope > .sheet"));
    const legend = Array.from(root.querySelectorAll<HTMLElement>(".legend i"));
    const dwell = root.querySelector<HTMLElement>(".dwell");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 899px)");
    const next = root.closest(".tone-l")?.nextElementSibling as HTMLElement | null;

    const size = () => {
      if (narrow.matches) {
        sheets.forEach((c) => {
          c.style.minHeight = "";
          c.style.transform = "";
          c.classList.remove("stacked");
        });
        if (next?.classList.contains("over")) next.style.marginTop = "";
        return;
      }
      let mx = 0;
      sheets.forEach((c, i) => {
        c.style.minHeight = "";
        mx = Math.max(mx, c.offsetHeight + i * TAB);
      });
      sheets.forEach((c, i) => (c.style.minHeight = `${mx - i * TAB}px`));
      const end = sheets[sheets.length - 1];
      if (next?.classList.contains("over") && dwell) next.style.marginTop = `-${end.offsetHeight + dwell.offsetHeight + 22 - 200}px`;
    };
    const tickNow = () => {
      if (narrow.matches) return;
      let active = 0;
      sheets.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        if (r.top <= TOP + i * TAB + 1) active = i;
        const nx = sheets[i + 1];
        const veil = c.querySelector<HTMLElement>(".veil");
        if (nx) {
          const nr = nx.getBoundingClientRect();
          const cover = Math.max(0, Math.min(1, (r.bottom - nr.top) / (r.height - TAB)));
          c.style.transform = reducedMotion ? "" : `scale(${1 - cover * 0.025})`;
          if (veil) veil.style.opacity = String(cover * 0.45);
          c.classList.toggle("stacked", nr.top <= TOP + (i + 1) * TAB + 1);
        } else {
          c.style.transform = "";
          c.classList.remove("stacked");
        }
      });
      legend.forEach((l, i) => l.classList.toggle("on", i <= active));
    };
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        tickNow();
      });
    };
    // Phones fire resize whenever the URL bar shows or hides; only a width change can change the sheets.
    let lastWidth = window.innerWidth;
    const onResize = (ev?: Event) => {
      if (ev && window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      size();
      onScroll();
    };
    const onClick = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement;
      if (target.closest("a")) return;
      const tab = target.closest<HTMLElement>(".tab");
      const sheet = tab?.parentElement;
      const i = sheet ? sheets.indexOf(sheet) : -1;
      if (i < 0 || narrow.matches) return;
      const y = sheet!.getBoundingClientRect().top + window.scrollY - (TOP + i * TAB);
      window.scrollTo({ top: y, behavior: reducedMotion ? "auto" : "smooth" });
    };
    const onKey = (ev: KeyboardEvent) => {
      if ((ev.key === "Enter" || ev.key === " ") && (ev.target as HTMLElement).classList.contains("tab")) {
        ev.preventDefault();
        (ev.target as HTMLElement).click();
      }
    };
    size();
    tickNow();
    // Web fonts change the sheet heights once they load.
    document.fonts?.ready.then(() => onResize());
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    root.addEventListener("click", onClick);
    root.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      root.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={file} id="file" className="file">
      <div className="legend" aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <i key={i} className={i === 0 ? "on" : undefined} />
        ))}
      </div>
      {children}
      <div className="dwell" aria-hidden="true" />
    </div>
  );
}
