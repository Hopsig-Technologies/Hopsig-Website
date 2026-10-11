"use client";

import { useEffect } from "react";
import type { HAInstance } from "./engine";
import { SCENES } from "./loaders";

/** Fired on window when a figure's scene is live, so page wiring (the AI transformation scroll scrub) can find it. */
export const MOUNT_EVENT = "ha:mount";
export type MountDetail = { id: string; inst: HAInstance };

/**
 * Loads the engine and one scene when the figure comes within 200px of the viewport, then mounts it over the
 * server-rendered static frame (same element, same size: no layout shift). Under prefers-reduced-motion, loop and
 * scrub scenes never load (the static frame is the resolved frame); below 768px the frame is hidden, so nothing
 * loads there either. Renders nothing itself.
 */
export function AnimMount({ id, mode }: { id: string; mode: "loop" | "state" | "scrub" }) {
  useEffect(() => {
    const fig = document.getElementById(`fig-${id}`);
    if (!fig || !SCENES[id]) return;
    if (window.matchMedia("(max-width: 767px)").matches) return;
    if (mode !== "state" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let engine: typeof import("./engine").default | null = null;
    const load = async () => {
      engine = (await import("./engine")).default;
      await SCENES[id]();
      if (cancelled) return;
      engine.start();
      const inst = engine.mount(fig);
      if (inst) window.dispatchEvent(new CustomEvent<MountDetail>(MOUNT_EVENT, { detail: { id, inst } }));
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          void load();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(fig);
    return () => {
      cancelled = true;
      io.disconnect();
      engine?.unmount(fig);
    };
  }, [id, mode]);
  return null;
}
