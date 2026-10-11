import type { Metadata } from "next";
import Link from "next/link";
import { stegaClean } from "next-sanity";
import { Closing } from "@/components/Closing";
import { Rv } from "@/components/Reveal";
import { H2, PageHero } from "@/components/blocks";
import { Surface } from "@/components/Surface";
import { notesIndexPage as page, templates } from "@/content";
import { withMode } from "@/lib/mode";
import { getFill } from "@/lib/site";
import { cachedSanity, type FetchMode } from "@/sanity/lib/live";
import { POSTS_QUERY } from "@/sanity/queries";
import { pageMeta } from "@/lib/seo";
import { longDate } from "@/lib/date";
import { nn, tpl } from "@/lib/tpl";

export const metadata: Metadata = {
  ...pageMeta("/notes"),
  alternates: { canonical: "/notes", types: { "application/rss+xml": "/notes/rss.xml" } },
};

async function NotesContent({ mode }: { mode: FetchMode }) {
  const fill = await getFill(mode);
  const { data: posts } = await cachedSanity({ query: POSTS_QUERY, ...mode });
  const categories = [...new Set(posts.map((p) => stegaClean(p.category)).filter((c) => c !== null))].sort();
  const { list } = page;
  return (
    <main>
      <Surface tone="d">
        <PageHero hero={page.hero} fill={fill} />
      </Surface>

      <Surface tone="l" seam>
        <div className="wrap sp-t100 sp-b120">
          <Rv className="head-row" style={{ marginBottom: 28, gap: 40 }}>
            <H2>{fill(list.head.title)}</H2>
            <div className="ncats">
              {categories.map((c) => (
                <span key={c} className="ncat">
                  {c}
                </span>
              ))}
            </div>
          </Rv>
          <div className="ilist">
            {posts.map((p, i) => {
              const row = (
                <>
                  <span className="n">{nn(i + 1)}</span>
                  <span>
                    <span className="t">{fill(p.title)}</span>
                    <span className="s">{fill(p.excerpt)}</span>
                  </span>
                  <span className="m">{tpl(templates.notePage.rowMeta, { category: p.category ?? "", date: longDate(p.publishedAt) })}</span>
                  <span className="c">{p.published ? list.readLabel : list.draftLabel}</span>
                  <span className="r">{p.published ? "→" : "…"}</span>
                </>
              );
              // A note without a publish date is a title only: an inert row, never a link to a missing page.
              return (
                <Rv key={p._id} delay={i * 60}>
                  {p.published && p.slug ? (
                    <Link href={`/notes/${stegaClean(p.slug)}`} className="irow note-row">
                      {row}
                    </Link>
                  ) : (
                    <div className="irow note-row draft">{row}</div>
                  )}
                </Rv>
              );
            })}
          </div>
        </div>
      </Surface>

      <Surface tone="l" seam>
        <Closing copy={page.closing} tone="l" fill={fill} />
      </Surface>
    </main>
  );
}

export default withMode(NotesContent);
