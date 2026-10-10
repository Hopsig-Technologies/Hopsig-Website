import { Lines } from "./Lines";
import { Rich } from "./Rich";
import { Rv } from "./Reveal";
import { PageHero } from "./blocks";
import { Surface } from "./Surface";
import type { Fill } from "./Filled";
import type { LegalPage as LegalCopy } from "@/content/types";
import { legalToBlocks } from "@/lib/portable";

/** Privacy and terms: hero, then the sections beside a sticky contents list. No closing section. */
export function LegalPage({ page, fill, contentsTitle }: { page: LegalCopy; fill: Fill; contentsTitle: string }) {
  return (
    <main>
      <Surface tone="d">
        <PageHero hero={page.hero} fill={fill} />
      </Surface>
      <Surface tone="l">
        <div className="wrap legal-body">
          <Rv as="article" className="legal">
            {page.sections.map((s) => (
              <section key={s.heading}>
                <h2>{s.heading}</h2>
                <Rich value={legalToBlocks(s.body)} fill={fill} />
              </section>
            ))}
          </Rv>
          <Rv as="aside" delay={90} className="legal-aside">
            <div className="lab">{contentsTitle}</div>
            <div className="legal-toc">
              {page.sections.map((s) => (
                <div key={s.heading}>— {s.heading}</div>
              ))}
            </div>
            <div className="legal-foot">
              <Lines text={fill(page.footnote)} />
            </div>
          </Rv>
        </div>
      </Surface>
    </main>
  );
}
