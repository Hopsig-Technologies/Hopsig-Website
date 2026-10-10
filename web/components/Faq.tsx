"use client";

import { useId, useState } from "react";
import { Rv } from "./Reveal";

/** Disclosure rows, one open at a time (reference: .faq .item). Answers are in the HTML, so they are readable with
 *  JS off once expanded by CSS fallback (`.no-js` users see all answers: see .faq .b in blocks.css). */
export function Faq({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const id = useId();
  return (
    <>
      {items.map((it, i) => (
        <Rv key={it.question} className={`item${open === i ? " on" : ""}`}>
          <button
            type="button"
            className="t"
            aria-expanded={open === i}
            aria-controls={`${id}-${i}`}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span>{it.question}</span>
            <span className="pl" aria-hidden="true">
              +
            </span>
          </button>
          <div className="b" id={`${id}-${i}`}>
            {it.answer}
          </div>
        </Rv>
      ))}
    </>
  );
}
