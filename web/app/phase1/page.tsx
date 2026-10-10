// Throwaway check page for Phase 1 (delete in Phase 6): a dark and a light surface and both buttons, matched against
// the closing section of reference/site/approach.html. Copy comes from content/, never typed here.
import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { Surface } from "@/components/Surface";
import approach from "../../../content/pages/approachPage.json";

export const metadata: Metadata = { title: "Phase 1 — tokens", robots: { index: false } };

type Btn = { label: string; route: string; variant: string };
type Closing = { eyebrow: string; title: string; sub: string; buttons: Btn[]; emailLine: string };

const closing = approach.blocks.find((b) => b.kind === "closing") as unknown as Closing;
const hero = approach.blocks.find((b) => b.kind === "hero") as unknown as { eyebrow: string; title: string; sub: string };

export default function Phase1() {
  return (
    <main>
      <Surface tone="d">
        <section className="wrap flex flex-col gap-6 py-[120px]">
          <div className="lab" style={{ color: "var(--acc)" }}>{hero.eyebrow}</div>
          <h1 className="m-0 max-w-[900px] whitespace-pre-line text-[72px] font-semibold leading-[1.02] tracking-[-0.05em]">
            {hero.title}
          </h1>
          <p className="m-0 max-w-[640px] text-[19px] leading-[31px] text-sub">{hero.sub}</p>
          <div className="mt-1.5 flex items-center gap-3.5">
            <Button href="/book">Book a consult</Button>
            <Button href="/work" variant="outline">See our work</Button>
            <Button href="/book" size="sm">Book a consult</Button>
          </div>
        </section>
      </Surface>
      <Surface tone="l" seam>
        <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden text-center">
          <div className="relative flex flex-col items-center gap-[22px] px-[88px] py-[120px]">
            <div className="lab" style={{ color: "var(--acc)" }}>{closing.eyebrow}</div>
            <h2 className="m-0 max-w-[760px] text-[56px] font-semibold leading-[1.05] tracking-[-0.045em]">{closing.title}</h2>
            <p className="m-0 max-w-[560px] text-[17px] leading-[29px] text-sub">{closing.sub}</p>
            <div className="mt-2 flex items-center gap-3.5">
              {closing.buttons.map((b) => (
                <Button key={b.label} href={b.route} variant={b.variant === "lime" ? "lime" : "outline"} onBg>
                  {b.label}
                </Button>
              ))}
            </div>
            <span className="font-mono text-xs text-dim">{closing.emailLine}</span>
          </div>
        </section>
      </Surface>
    </main>
  );
}
