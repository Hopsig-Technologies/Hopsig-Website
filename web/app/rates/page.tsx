import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { Closing } from "@/components/Closing";
import { EstimatorSection } from "@/components/EstimatorSection";
import { Rv } from "@/components/Reveal";
import { HeadRow, PageHero } from "@/components/blocks";
import { BulletList, FaqBlock } from "@/components/sections";
import { Surface } from "@/components/Surface";
import { ratesPage as page } from "@/content";
import { withMode } from "@/lib/mode";
import { getSettings } from "@/lib/site";
import { makeFill } from "@/lib/tokens";
import type { FetchMode } from "@/sanity/lib/live";

export const metadata: Metadata = { title: "Hopsig — Rates" };

async function RatesContent({ mode }: { mode: FetchMode }) {
  const settings = await getSettings(mode);
  const fill = makeFill(settings);
  return (
    <main>
      <Surface tone="d">
        <PageHero hero={page.hero} fill={fill} />
      </Surface>

      <Surface tone="l" seam>
        <div className="wrap" style={{ paddingTop: 100 }}>
          <div className="rate-grid">
            {page.cards.map((c) => (
              <Rv key={c.name} className={`rate${c.highlight ? " hi" : ""}`}>
                <div className={`lab${c.highlight ? " lab-acc" : ""}`}>{c.name}</div>
                <div className="big">
                  {fill(c.price)}
                  <br />
                  <small>{c.unit}</small>
                </div>
                <div className="rate-meta">{fill(c.meta)}</div>
                <div style={{ marginTop: 6 }}>
                  <BulletList items={c.items.map((x) => fill(x))} />
                </div>
                {c.button ? (
                  <div className="rate-btn">
                    <Button href={c.button.href} variant={c.button.variant === "lime" ? "lime" : "outline"}>
                      {c.button.label}
                    </Button>
                  </div>
                ) : null}
              </Rv>
            ))}
          </div>
          <EstimatorSection copy={page.estimator} fill={fill} rate={settings?.dayRate ?? null} />
          <div style={{ height: 120 }} />
        </div>
      </Surface>

      <Surface tone="d" seam>
        <div className="wrap">
          <section style={{ padding: "100px 0 0" }}>
            <HeadRow head={page.terms.head} fill={fill} style={{ marginBottom: 24 }} />
            <Rv className="terms">
              {page.terms.rows.map((r) => (
                <div key={r.label}>
                  <span>{fill(r.label)}</span>
                  <span>{fill(r.value)}</span>
                </div>
              ))}
            </Rv>
          </section>
          <FaqBlock faq={page.faq} fill={fill} />
          <div style={{ height: 140 }} />
        </div>
      </Surface>

      <Surface tone="l" seam>
        <Closing copy={page.closing} tone="l" fill={fill} />
      </Surface>
    </main>
  );
}

export default withMode(RatesContent);
