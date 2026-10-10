import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Cta, Fact, PageHero as PageHeroCopy, SectionHead, TitleText } from "@/content/types";
import { Button } from "./Button";
import { RingCanvas } from "./canvas/RingCanvas";
import { Filled, type Fill } from "./Filled";
import { Lines } from "./Lines";
import { Rv } from "./Reveal";

/** The shared page blocks of the reference (approach, working-with-us, services, industries …). Sizes are the
 *  reference's inline styles; colours come from the tone variables. */

const idx = (i: number) => String(i + 1).padStart(2, "0");

export function Eyebrow({ children, acc = true }: { children: ReactNode; acc?: boolean }) {
  return <div className={`lab${acc ? " lab-acc" : ""}`}>{children}</div>;
}

export function H2({ children, size = 44 }: { children: ReactNode; size?: 44 | 40 | 32 }) {
  return (
    <h2 className="h2" style={{ fontSize: size }}>
      {children}
    </h2>
  );
}

/** A link styled as a mono accent label ("The flow →"). */
export function MoreLink({ cta }: { cta: Cta }) {
  return (
    <Link href={cta.href} className="more">
      {cta.label}
    </Link>
  );
}

/** Page hero: drifting dot field, eyebrow, 72px title, intro, then buttons or chips and the facts row. */
export function PageHero({ hero, fill }: { hero: PageHeroCopy; fill: Fill }) {
  const buttons = hero.buttons?.filter((b) => b.variant !== "chip") ?? [];
  const chips = hero.buttons?.filter((b) => b.variant === "chip") ?? [];
  return (
    <section className="ph">
      <RingCanvas variant="drift" tone="d" />
      <div className="wrap ph-c">
        {hero.eyebrow ? <Eyebrow>{fill(hero.eyebrow)}</Eyebrow> : null}
        <h1 className="ph-h1">
          <Lines text={fill(hero.title)} />
        </h1>
        {hero.sub ? <p className="ph-sub">{fill(hero.sub)}</p> : null}
        {chips.length ? (
          <div className="chips">
            {chips.map((c) => (
              <Link key={c.href} className="chip2" href={c.href}>
                {c.label}
              </Link>
            ))}
          </div>
        ) : null}
        {buttons.length ? (
          <div className="ph-btns">
            {buttons.map((b) => (
              <Button key={b.label} href={b.href} variant={b.variant === "lime" ? "lime" : "outline"}>
                {b.label}
              </Button>
            ))}
          </div>
        ) : null}
        {hero.facts?.length ? <FactsRow facts={hero.facts} fill={fill} /> : null}
      </div>
    </section>
  );
}

export function FactsRow({ facts, fill, size = 22 }: { facts: Fact[]; fill: Fill; size?: 22 | 26 }) {
  return (
    <div className="facts">
      {facts.map((f) => (
        <div key={f.value + f.label}>
          <div className="facts-v" style={{ fontSize: size }}>
            {fill(f.value)}
          </div>
          <div className="facts-l">{fill(f.label)}</div>
        </div>
      ))}
    </div>
  );
}

/** Title row: h2 on the left, a mono note on the right (e.g. "All times GMT"). */
export function HeadRow({
  head,
  fill,
  size = 44,
  style,
  className = "",
}: {
  head: SectionHead;
  fill: Fill;
  size?: 44 | 40 | 32;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <Rv className={`head-row ${className}`.trim()} style={style}>
      <H2 size={size}>{fill(head.title)}</H2>
      {head.aside ? <Eyebrow acc={false}>{fill(head.aside)}</Eyebrow> : null}
    </Rv>
  );
}

/** Three cards under a 2px rule; the first rule is the accent. */
export function Cards({ items, fill }: { items: TitleText[]; fill: Fill }) {
  return (
    <div className="cards3">
      {items.map((it, i) => (
        <Rv key={it.title} className={`card3${i === 0 ? " first" : ""}`} delay={i * 90}>
          <div className="card3-t">{fill(it.title)}</div>
          {it.text ? (
            <div className="card3-x">
              <Filled text={it.text} fill={fill} />
            </div>
          ) : null}
        </Rv>
      ))}
    </div>
  );
}

/** Numbered rows: mono index, title, text, hairline dividers. `titleWidth` is the reference's middle column. */
export function Ledger({
  items,
  fill,
  titleWidth = 260,
  tone = "dim",
  stagger = true,
  mark = "tok",
  pad = 22,
}: {
  items: TitleText[];
  fill: Fill;
  titleWidth?: number;
  tone?: "dim" | "sub";
  stagger?: boolean;
  mark?: "tok" | "phx";
  pad?: number;
}) {
  return (
    <div className="ledger">
      {items.map((it, i) => {
        const row = (
          <>
            <span className="ledger-n">{idx(i)}</span>
            <span className="ledger-t">{fill(it.title)}</span>
            <span className="ledger-x" style={{ color: `var(--${tone})` }}>
              {it.text ? <Filled text={it.text} fill={fill} mark={mark} /> : null}
            </span>
          </>
        );
        const style = { gridTemplateColumns: `44px ${titleWidth}px 1fr`, padding: `${pad}px 0` };
        return stagger ? (
          <Rv key={it.title} className="ledger-row" style={style} delay={i * 60}>
            {row}
          </Rv>
        ) : (
          <div key={it.title} className="ledger-row" style={style}>
            {row}
          </div>
        );
      })}
    </div>
  );
}

/** Two columns: a sticky heading block on the left, content on the right. */
export function TwoCol({
  left,
  right,
  ratio = "1fr 1.3fr",
  gap = 72,
  style,
}: {
  left: ReactNode;
  right: ReactNode;
  ratio?: string;
  gap?: number;
  style?: CSSProperties;
}) {
  return (
    <section className="twocol" style={{ gridTemplateColumns: ratio, gap, ...style }}>
      <Rv className="twocol-l">{left}</Rv>
      <Rv delay={90}>{right}</Rv>
    </section>
  );
}

export function Tags({ items }: { items: string[] }) {
  return (
    <div className="tags">
      {items.map((t) => (
        <span key={t}>{t}</span>
      ))}
    </div>
  );
}
