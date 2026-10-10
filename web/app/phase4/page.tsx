// Throwaway check page for Phase 4 (delete in Phase 5): content from Sanity, static when published, live in draft
// mode. Edit approachPage / siteSettings in the Studio and watch this page in the Presentation tool.
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { Suspense } from "react";
import { Surface } from "@/components/Surface";
import { makeFill } from "@/lib/tokens";
import { PHASE4_QUERY } from "@/sanity/queries";
import { cachedSanity, getFetchMode, PUBLISHED, type FetchMode } from "@/sanity/lib/live";

export const metadata: Metadata = { title: "Phase 4 — Sanity", robots: { index: false } };

export default async function Phase4() {
  if ((await draftMode()).isEnabled) {
    return (
      <Suspense fallback={null}>
        <Draft />
      </Suspense>
    );
  }
  return <Content mode={PUBLISHED} />;
}

async function Draft() {
  return <Content mode={await getFetchMode()} />;
}

async function Content({ mode }: { mode: FetchMode }) {
  const { data } = await cachedSanity({ query: PHASE4_QUERY, ...mode });
  const fill = makeFill(data.settings);
  return (
    <main>
      <Surface tone="d">
        <section className="wrap flex flex-col gap-6 py-[96px]">
          <div className="lab" style={{ color: "var(--acc)" }}>{fill(data.approach?.hero?.eyebrow)}</div>
          <h1 className="m-0 max-w-[900px] whitespace-pre-line text-[72px] font-semibold leading-[1.02] tracking-[-0.05em]">
            {fill(data.approach?.hero?.title)}
          </h1>
          <p className="m-0 max-w-[640px] text-[19px] leading-[31px] text-sub">{fill(data.approach?.hero?.sub)}</p>
          <p className="lab">Perspective: {mode.perspective.toString()} · stega: {String(mode.stega)}</p>
        </section>
      </Surface>
      <Surface tone="l" seam>
        <section className="wrap flex flex-col gap-4 py-[96px]">
          <div className="lab">Home case index, in Studio order</div>
          <ol className="m-0 flex flex-col gap-2 pl-5 text-[17px]">
            {(data.cases ?? []).map((c) => (
              <li key={c._id}>
                <span className="font-mono text-xs text-dim">{c.source}</span> {fill(c.title)}
              </li>
            ))}
          </ol>
          <p className="font-mono text-xs text-dim">{fill(data.settings?.footer?.legalLeft)} · {fill(data.settings?.footer?.legalRight)}</p>
        </section>
      </Surface>
    </main>
  );
}
