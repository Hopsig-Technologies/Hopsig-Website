"use client";

import { useEffect, useState } from "react";

type Option = { id: string; label: string };

export type WorkFilterCopy = {
  all: string;
  industry: string;
  service: string;
  numbered: string;
  showing: string;
  none: string;
};

/**
 * Filters for /work (design & SEO review): one industry, one service, and "with a number", combined. The case
 * cards and rows stay server-rendered; each sits in a `.wf-item` with `data-ind`, `data-svc` and `data-num`, and
 * this toggles their `hidden` attribute (a section heading hides when none of its items is left). Without JS,
 * every case shows and the chips do nothing.
 */
export function WorkFilter({
  industries,
  services,
  copy,
}: {
  industries: Option[];
  services: Option[];
  copy: WorkFilterCopy;
}) {
  const [ind, setInd] = useState<string | null>(null);
  const [svc, setSvc] = useState<string | null>(null);
  const [num, setNum] = useState(false);
  const [count, setCount] = useState<[number, number] | null>(null);

  useEffect(() => {
    const items = Array.from(
      document.querySelectorAll<HTMLElement>(".wf-item"),
    );
    let shown = 0;
    for (const el of items) {
      const ok =
        (!ind || (el.dataset.ind ?? "").split(" ").includes(ind)) &&
        (!svc || (el.dataset.svc ?? "").split(" ").includes(svc)) &&
        (!num || el.dataset.num === "1");
      el.hidden = !ok;
      if (ok) shown++;
    }
    for (const group of Array.from(
      document.querySelectorAll<HTMLElement>(".wf-group"),
    )) {
      group.hidden = !group.querySelector(".wf-item:not([hidden])");
    }
    // DOM-driven count of what the filters left visible.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCount([shown, items.length]);
  }, [ind, svc, num]);

  const chip = (
    on: boolean,
    label: string,
    onClick: () => void,
    key: string,
  ) => (
    <button
      key={key}
      type="button"
      className={on ? "on" : undefined}
      aria-pressed={on}
      onClick={onClick}
    >
      {label}
    </button>
  );
  return (
    <div
      className="wf"
      role="group"
      aria-label={`${copy.industry} · ${copy.service}`}
    >
      <div className="wf-row">
        <span className="lab">{copy.industry}</span>
        <div className="wf-chips">
          {chip(!ind, copy.all, () => setInd(null), "all")}
          {industries.map((o) =>
            chip(
              ind === o.id,
              o.label,
              () => setInd(ind === o.id ? null : o.id),
              o.id,
            ),
          )}
        </div>
      </div>
      <div className="wf-row">
        <span className="lab">{copy.service}</span>
        <div className="wf-chips">
          {chip(!svc, copy.all, () => setSvc(null), "all")}
          {services.map((o) =>
            chip(
              svc === o.id,
              o.label,
              () => setSvc(svc === o.id ? null : o.id),
              o.id,
            ),
          )}
        </div>
      </div>
      <div className="wf-row">
        <span />
        <div className="wf-chips">
          {chip(num, copy.numbered, () => setNum(!num), "num")}
          {count ? (
            <span className="wf-count" aria-live="polite">
              {count[0]
                ? copy.showing
                    .replace("{n}", String(count[0]))
                    .replace("{total}", String(count[1]))
                : copy.none}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
