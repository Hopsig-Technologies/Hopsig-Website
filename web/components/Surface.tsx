import { Suspense, type ReactNode } from "react";

type Tone = "d" | "l";

/** A tone wrapper: sets the --bg/--text/--acc… variables for everything inside. `seam` draws the dotted band
 *  that overlaps the top of this surface (used on every tone change except the first).
 *
 *  A seam surface is below the hero, so it is also its own Suspense boundary: that keeps the page's first
 *  boundary (the hero) small enough for React to send inline in the first chunk of HTML, so the hero paints with
 *  the first paint instead of after the whole page has streamed (PageSpeed LCP, 2026-10-11). Nothing suspends;
 *  the boundaries only change the order the static HTML is sent in. The footer waits off screen meanwhile
 *  (app/chrome.css). */
export function Surface({
  tone,
  seam = false,
  defer = seam,
  className = "",
  children,
}: {
  tone: Tone;
  seam?: boolean;
  /** Its own Suspense boundary (below). Defaults to `seam`; set it on a below-the-hero surface without a seam. */
  defer?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const surface = (
    <div className={`tone-${tone} ${className}`.trim()}>
      {seam ? <div className="seam" aria-hidden="true" /> : null}
      {children}
    </div>
  );
  return defer ? <Suspense fallback={null}>{surface}</Suspense> : surface;
}
