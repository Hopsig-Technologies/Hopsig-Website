// Types for the parts of the animation engine (engine.js) the React wrapper uses.

export type HAInstance = {
  id: string;
  fig: Element;
  t: number;
  loop: number;
  mode: "loop" | "state" | "scrub";
  paused: boolean;
  visible: boolean;
  scrubT?: number;
  /** Scroll-scrub scenes: jump to t (the page replaces the default with a smooth scroll). */
  goto?: (t: number) => void;
};

declare const HA: {
  prefersReduced: boolean;
  inst: HAInstance[];
  /** Start the one animation clock (idempotent). */
  start(): void;
  /** Build the figure's scene into its frame; returns the instance (undefined if already mounted or unknown). */
  mount(fig: Element): HAInstance | undefined;
  /** Forget a figure (React unmount). */
  unmount(fig: Element): void;
  /** Scroll scrub: p 0..1 → t = p × loop. */
  scrub(inst: HAInstance, p: number): void;
  /** Test hook: freeze every instance (or one id) at t. */
  seek(t: number, id?: string): void;
};

export default HA;
