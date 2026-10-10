import type { ReactNode } from "react";

type Tone = "d" | "l";

/** A tone wrapper: sets the --bg/--text/--acc… variables for everything inside. `seam` draws the dotted band
 *  that overlaps the top of this surface (used on every tone change except the first). */
export function Surface({
  tone,
  seam = false,
  className = "",
  children,
}: {
  tone: Tone;
  seam?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`tone-${tone} ${className}`.trim()}>
      {seam ? <div className="seam" aria-hidden="true" /> : null}
      {children}
    </div>
  );
}
