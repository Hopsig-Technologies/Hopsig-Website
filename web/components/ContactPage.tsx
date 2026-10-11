import type { ReactNode } from "react";
import type { TitleText } from "@/content/types";
import { inlineToBlocks } from "@/lib/portable";
import { RingCanvas } from "./canvas/RingCanvas";
import type { Fill } from "./Filled";
import { Lines } from "./Lines";
import { Rich } from "./Rich";
import { Rv } from "./Reveal";
import { Surface } from "./Surface";

/** /book and /brief: hero copy and three steps on the left, the form card on the right, then the mono strip.
 *  No closing section: the page is the closing. */
export function ContactPage({
  hero,
  steps,
  note,
  strip,
  fill,
  children,
}: {
  hero: { eyebrow: string; title: string; sub: string };
  steps: TitleText[];
  note: string;
  strip: string[];
  fill: Fill;
  children: ReactNode;
}) {
  return (
    <main>
      <Surface tone="d">
        <section className="ph">
          <RingCanvas variant="drift" tone="d" />
          <div className="wrap book">
            <div className="book-l">
              <h1 className="book-h1">
                <span className="lab lab-acc ph-kw">{fill(hero.eyebrow)}</span>
                <Lines text={fill(hero.title)} />
              </h1>
              <p className="ph-sub" style={{ maxWidth: 520 }}>
                {fill(hero.sub)}
              </p>
              <div className="book-steps">
                {steps.map((s, i) => (
                  <Rv key={s.title} className="book-step">
                    <div className="book-step-n">{String(i + 1).padStart(2, "0")}</div>
                    <div>
                      <div className="book-step-t">{fill(s.title)}</div>
                      <div className="book-step-x">{fill(s.text)}</div>
                    </div>
                  </Rv>
                ))}
              </div>
              <div className="book-note">
                <Rich value={inlineToBlocks(note)} fill={fill} inline mark="none" />
              </div>
            </div>
            {children}
          </div>
        </section>
      </Surface>
      <Surface tone="l" seam>
        <section className="wrap" style={{ padding: "120px 0 140px" }}>
          <Rv className="mono-strip">
            {strip.map((s) => (
              <span key={s}>{fill(s)}</span>
            ))}
          </Rv>
        </section>
      </Surface>
    </main>
  );
}
