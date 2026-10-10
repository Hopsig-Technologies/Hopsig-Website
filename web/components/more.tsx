import { site } from "@/content";
import type { Fill } from "./Filled";
import { Rv } from "./Reveal";
import { HeadRow } from "./blocks";
import { EngagementPanel } from "./EngagementPanel";

/**
 * "What we work in." (services index, home): two rows of capability chips scrolling in opposite directions
 * (40s loop; still under reduced motion). Each row is rendered twice so the loop is seamless; the copy is
 * aria-hidden so screen readers hear each chip once.
 */
export function Capabilities({ fill }: { fill: Fill }) {
  const c = site.capabilities;
  const row = (items: string[], reverse: boolean, first: boolean) => (
    <div className="mq" style={first ? undefined : { borderTop: 0 }}>
      <div className={`mq-row${reverse ? " r" : ""}`}>
        {items.map((x) => (
          <span key={x} className="mq-chip">
            {fill(x)}
          </span>
        ))}
        {items.map((x) => (
          <span key={`${x}-2`} className="mq-chip" aria-hidden="true">
            {fill(x)}
          </span>
        ))}
      </div>
    </div>
  );
  return (
    <>
      <HeadRow head={{ title: c.title, aside: c.aside }} fill={fill} style={{ marginBottom: 36 }} className="wrap" />
      {row(c.rowOne, false, true)}
      {row(c.rowTwo, true, false)}
      <div className="wrap" style={{ marginTop: 28, fontSize: 15, color: "var(--dim)" }}>
        {fill(c.note)}
      </div>
    </>
  );
}

/** The engagement panel in its revealed slot (services index, /work). */
export function EngagementPanelSlot({ phase, fill }: { phase: 0 | 1 | 2 | 3 | 4; fill: Fill }) {
  return (
    <Rv>
      <EngagementPanel phase={phase} fill={fill} />
    </Rv>
  );
}
