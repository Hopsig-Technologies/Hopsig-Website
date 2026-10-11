import type { Metadata } from "next";
import { stegaClean } from "next-sanity";
import { Closing } from "@/components/Closing";
import { Rv } from "@/components/Reveal";
import { Eyebrow, H2, HeadRow, Ledger, PageHero, TwoCol } from "@/components/blocks";
import { FaqBlock } from "@/components/sections";
import { Surface } from "@/components/Surface";
import { joinPage as page } from "@/content";
import { withMode } from "@/lib/mode";
import { getFill } from "@/lib/site";
import { nn } from "@/lib/tpl";
import { cachedSanity, type FetchMode } from "@/sanity/lib/live";
import { JOBS_QUERY } from "@/sanity/queries";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/join");

async function JoinContent({ mode }: { mode: FetchMode }) {
  const fill = await getFill(mode);
  const { data: jobs } = await cachedSanity({ query: JOBS_QUERY, ...mode });
  const { work, vetting, roles } = page;
  return (
    <main>
      <Surface tone="d">
        <PageHero hero={page.hero} fill={fill} size={26} />
      </Surface>

      <Surface tone="l" seam>
        <div className="wrap sp-t100">
          <TwoCol
            className="sp-t100"
            left={
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Eyebrow>{fill(work.head.eyebrow)}</Eyebrow>
                <H2 size={40}>{fill(work.head.title)}</H2>
              </div>
            }
            right={<Ledger items={work.items} fill={fill} titleWidth={220} tone="sub" stagger={false} />}
          />
          <TwoCol
            className="sp-t100"
            left={
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Eyebrow>{fill(vetting.head.eyebrow)}</Eyebrow>
                <H2 size={40}>{fill(vetting.head.title)}</H2>
                <p className="body16">{fill(vetting.head.sub)}</p>
              </div>
            }
            right={<Ledger items={vetting.items} fill={fill} tone="sub" stagger={false} />}
          />
          <section className="sp-t100">
            <HeadRow head={roles.head} fill={fill} style={{ marginBottom: 24 }} />
            {/* Roles come from Sanity (jobListing, closed ones excluded); a role with no status shows [STATUS]. */}
            <Rv style={{ borderTop: "1px solid var(--line)" }}>
              {jobs.map((j, i) => {
                const status = stegaClean(j.status);
                return (
                  <div key={j._id} className="role-row">
                    <span className="ledger-n">{nn(i + 1)}</span>
                    <span className="role-t">{fill(j.title)}</span>
                    <span className="role-x">{fill(j.text)}</span>
                    <span className="role-s">
                      {status === "open" || status === "pipeline" ? roles.statusLabels[status] : roles.statusPlaceholder}
                    </span>
                  </div>
                );
              })}
            </Rv>
            <Rv className="mono-note" style={{ marginTop: 26 }}>
              {fill(roles.payLine)}
            </Rv>
          </section>
          <div style={{ height: 120 }} />
        </div>
      </Surface>

      <Surface tone="d" seam>
        <div className="wrap">
          <FaqBlock faq={page.faq} fill={fill} />
          <div style={{ height: 120 }} />
        </div>
      </Surface>

      <Surface tone="l" seam>
        <Closing copy={page.closing} tone="l" fill={fill} />
      </Surface>
    </main>
  );
}

export default withMode(JoinContent);
