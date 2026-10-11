"use client";

import { useEffect } from "react";
import { MOUNT_EVENT, type MountDetail } from "./AnimMount";
import type { HAInstance } from "./engine";

/**
 * Scroll-scrub wiring for a `mode: 'scrub'` figure inside `.scrub > .stick` (port of docs/anim/page-wiring.js):
 * progress p through (section height − sticky height) sets t = p × loop; `inst.goto(t)` (the scene's week ticks)
 * smooth-scrolls to the matching y. Under reduced motion the scene never loads (AnimMount), so the static frame,
 * pinned at the end of the timeline, stays and nothing listens to scroll. Renders nothing.
 */
export function ScrubWiring({ id }: { id: string }) {
  useEffect(() => {
    const sec = document.querySelector<HTMLElement>(".scrub");
    const stick = sec?.querySelector<HTMLElement>(".stick");
    if (!sec || !stick) return;
    let detach = () => {};

    const wire = async (inst: HAInstance) => {
      const HA = (await import("./engine")).default;
      const range = () => ({ top: sec.getBoundingClientRect().top + window.scrollY, len: sec.offsetHeight - stick.offsetHeight });
      const onScroll = () => {
        const r = range();
        HA.scrub(inst, r.len > 0 ? (window.scrollY - r.top) / r.len : 1);
      };
      inst.goto = (t) => {
        const r = range();
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: r.top + (t / inst.loop) * r.len, behavior: reduced ? "auto" : "smooth" });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      onScroll();
      detach = () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    };

    const onMount = (e: Event) => {
      const { id: mounted, inst } = (e as CustomEvent<MountDetail>).detail;
      if (mounted === id) void wire(inst);
    };
    window.addEventListener(MOUNT_EVENT, onMount);
    return () => {
      window.removeEventListener(MOUNT_EVENT, onMount);
      detach();
    };
  }, [id]);
  return null;
}
