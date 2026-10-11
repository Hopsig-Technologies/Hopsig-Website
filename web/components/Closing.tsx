import { site, type Closing as ClosingCopy } from "@/content";
import { Button } from "./Button";
import { Filled } from "./Filled";
import { Lines } from "./Lines";
import { RingCanvas } from "./canvas/RingCanvas";

/**
 * The closing section on every page: the finished ring behind an eyebrow, a headline, the intro, the buttons and
 * the email line. `fill` substitutes the site-wide tokens (the email) from Site settings.
 *
 * The 404 uses it as the whole page: `heading="h1"`, full viewport height, narrower intro, unfilled outline buttons.
 */
export function Closing({
  copy,
  tone,
  fill,
  heading = "h2",
}: {
  copy: ClosingCopy;
  tone: "d" | "l";
  fill: (s: string | null | undefined) => string;
  heading?: "h1" | "h2";
}) {
  const H = heading;
  const page = heading === "h1";
  return (
    <section className={`close${page ? " close-page" : ""}`}>
      <RingCanvas variant="closing" tone={tone} />
      <div className="c">
        {copy.eyebrow ? <div className="lab lab-acc">{fill(copy.eyebrow)}</div> : null}
        <H className={page ? "close-h1" : "close-h2"}>
          <Lines text={fill(copy.title)} />
        </H>
        <p className={page ? "close-p close-p-narrow" : "close-p"}>{fill(copy.sub ?? site.defaultClosing.sub)}</p>
        {copy.buttons?.length ? (
          <div className="close-btns">
            {copy.buttons.map((b) => (
              <Button key={b.label} href={b.href} variant={b.variant === "lime" ? "lime" : "outline"} onBg={!page}>
                {b.label}
              </Button>
            ))}
          </div>
        ) : null}
        {copy.showEmail ? (
          <span className="close-mail">
            <Filled text={site.defaultClosing.emailLine} fill={fill} />
          </span>
        ) : null}
      </div>
    </section>
  );
}
