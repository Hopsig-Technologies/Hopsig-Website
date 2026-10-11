import { Lines } from "./Lines";
import { Rich } from "./Rich";
import { Rv } from "./Reveal";
import { PageHero } from "./blocks";
import { Surface } from "./Surface";
import type { Fill } from "./Filled";
import type { LegalPage as LegalCopy } from "@/content/types";
import { legalToBlocks } from "@/lib/portable";

const anchor = (heading: string) => heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Privacy and terms: hero, then the sections beside a sticky contents list. No closing section. */
export function LegalPage({ page, fill, contentsTitle }: { page: LegalCopy; fill: Fill; contentsTitle: string }) {
  return (
    <main>
      <Surface tone="d">
        <PageHero hero={page.hero} fill={fill} />
      </Surface>
      <Surface tone="l" defer>
        <div className="wrap legal-body">
          <Rv as="article" className="legal">
            {page.sections.map((s) => (
              <section key={s.heading} id={anchor(s.heading)}>
                <h2>{s.heading}</h2>
                <Rich value={legalToBlocks(s.body)} fill={fill} />
              </section>
            ))}
          </Rv>
          {/* "Last updated" first (the page promises the date at the top), then the contents as links. */}
          <Rv as="aside" delay={90} className="legal-aside">
            <div className="legal-foot legal-foot-top">
              <Lines text={fill(page.footnote)} />
            </div>
            <div className="lab">{contentsTitle}</div>
            <nav className="legal-toc" aria-label={contentsTitle}>
              {page.sections.map((s) => (
                <a key={s.heading} href={`#${anchor(s.heading)}`}>
                  — {s.heading}
                </a>
              ))}
            </nav>
          </Rv>
        </div>
      </Surface>
    </main>
  );
}
