import Link from "next/link";
import type { ReactNode } from "react";
import { templates, type FaqSection, type Step } from "@/content";
import type { casesByKey } from "@/lib/cases";
import { nn, tpl } from "@/lib/tpl";
import { Faq } from "./Faq";
import type { Fill } from "./Filled";
import { Rv } from "./Reveal";
import { Rich } from "./Rich";
import { H2, Tags } from "./blocks";

/** Larger reference blocks: bullet list, steps, case-study card, FAQ section. */

/** The `.list` of the reference: a small accent square, then the text, hairlines between. */
export function BulletList({ items, nolime = false }: { items: ReactNode[]; nolime?: boolean }) {
  return (
    <div className={`list${nolime ? " nolime" : ""}`}>
      {items.map((it, i) => (
        <div key={i}>
          <i />
          <span>{it}</span>
        </div>
      ))}
    </div>
  );
}

/** Five engagement beats under a 2px rule; `on` marks one (the reference marks the second, "Day 3"). */
export function Steps({ steps, fill, on = 1 }: { steps: Step[]; fill: Fill; on?: number }) {
  return (
    <Rv className="steps">
      {steps.map((s, i) => (
        <div key={s.when} className={i === on ? "on" : ""}>
          <div className={`lab${i === on ? " lab-acc" : ""}`}>{fill(s.when)}</div>
          <div className="steps-t">{fill(s.title)}</div>
          <div className="steps-x">{fill(s.text)}</div>
        </div>
      ))}
    </Rv>
  );
}

type CaseRow = Awaited<ReturnType<typeof casesByKey>>[number];

/** A case-study card ("From the record"): eyebrow with its number, shape, title, problem / what we did /
 *  measured, stack, and the client line with a link to the case note (or "Ask about this"). */
export function CaseCard({ c, n, fill, delay }: { c: CaseRow; n: number; fill: Fill; delay?: number }) {
  const t = templates.caseCard;
  return (
    <Rv className="case-card" delay={delay}>
      <div className="case-top">
        <div className="lab lab-acc">{tpl(t.eyebrow, { nn: nn(n), domain: fill(c.domain) })}</div>
        <div className="lab">{fill(c.shape)}</div>
      </div>
      <div className="case-title">{fill(c.title)}</div>
      <BulletList
        items={[
          <>
            <span className="dimc">{t.problemLabel} </span>
            {fill(c.problem)}
          </>,
          <>
            <span className="dimc">{t.whatWeDidLabel} </span>
            {fill(c.whatWeDid)}
          </>,
          <>
            <span className="dimc">{t.measuredLabel} </span>
            <Rich value={c.measured} fill={fill} inline />
          </>,
        ]}
      />
      {c.stack?.length ? <Tags items={c.stack.map((s) => fill(s))} /> : null}
      <div className="case-foot">
        <span>{t.clientLine}</span>
        {c.hasPage && c.slug ? (
          <Link href={`/work/${c.slug}`} className="more">
            {t.pageLink}
          </Link>
        ) : (
          <Link href="/book" className="more">
            {t.askLink}
          </Link>
        )}
      </div>
    </Rv>
  );
}

export function FaqBlock({ faq, fill, title }: { faq?: FaqSection; fill: Fill; title?: string }) {
  const items = faq?.items ?? [];
  return (
    <section className="faq" style={{ padding: "100px 0 0" }}>
      <Rv>
        <H2>{fill(title ?? faq?.title)}</H2>
      </Rv>
      <div style={{ marginTop: 32, maxWidth: 800 }}>
        <Faq items={items.map((i) => ({ question: fill(i.question), answer: fill(i.answer) }))} />
        <div style={{ borderTop: "1px solid var(--line)" }} />
      </div>
    </section>
  );
}
