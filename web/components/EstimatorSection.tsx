import { Fragment } from "react";
import { templates, type Estimator as EstimatorCopy } from "@/content";
import { inlineToBlocks } from "@/lib/portable";
import { Estimator } from "./Estimator";
import type { Fill } from "./Filled";
import { Rich } from "./Rich";
import { Rv } from "./Reveal";

/** The estimator panel (#est) on /rates and /why-not-just-hire: the copy from the page module, the rate from
 *  Site settings (null until the founders set it). */
export function EstimatorSection({ copy, fill, rate }: { copy: EstimatorCopy; fill: Fill; rate: number | null }) {
  return (
    <Rv as="section" className="est" style={{ marginTop: 100 }}>
      <Estimator
        title={fill(copy.title)}
        sub={fill(copy.sub)}
        engineersLabel={copy.engineersLabel}
        monthsLabel={copy.monthsLabel}
        note={<Rich value={inlineToBlocks(copy.note)} fill={fill} inline mark="tok" />}
        daysLabel={copy.daysLabel}
        totalLabel={copy.totalLabel}
        footnotes={copy.footnotes.map((f, i) => (
          <Fragment key={f}>
            {i ? <br /> : null}
            {fill(f)}
          </Fragment>
        ))}
        words={templates.estimator}
        rate={rate}
      />
    </Rv>
  );
}
