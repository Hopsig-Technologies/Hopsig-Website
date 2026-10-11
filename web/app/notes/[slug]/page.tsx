import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stegaClean } from "next-sanity";
import { Button } from "@/components/Button";
import { Closing } from "@/components/Closing";
import { Rich } from "@/components/Rich";
import { Rv } from "@/components/Reveal";
import { Ledger, MoreLink, PageHero } from "@/components/blocks";
import { Surface } from "@/components/Surface";
import { seoTemplates, templates } from "@/content";
import { withMode } from "@/lib/mode";
import { getFill } from "@/lib/site";
import { tpl } from "@/lib/tpl";
import { cachedSanity, PUBLISHED, type FetchMode } from "@/sanity/lib/live";
import { POST_BY_SLUG_QUERY, POST_SLUGS_QUERY, POSTS_QUERY } from "@/sanity/queries";
import { meta, SITE_URL } from "@/lib/seo";
import { breadcrumbsLd, JsonLd, orgRef } from "@/components/JsonLd";
import { longDate } from "@/lib/date";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const { data } = await cachedSanity({ query: POST_SLUGS_QUERY, ...PUBLISHED });
  return data.filter(Boolean).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await cachedSanity({ query: POST_BY_SLUG_QUERY, params: { slug }, ...PUBLISHED });
  if (!data) return {};
  const t = seoTemplates.note;
  return meta(
    `/notes/${slug}`,
    stegaClean(data.seo?.title) || tpl(t.title, { title: stegaClean(data.title) ?? "" }),
    stegaClean(data.seo?.description) || tpl(t.description, { excerpt: stegaClean(data.excerpt) ?? "" }),
    "article",
  );
}

type Span = { _type: string; text?: string };
const plainText = (children: unknown) =>
  ((children as Span[] | undefined) ?? []).map((c) => (c._type === "span" ? (c.text ?? "") : "")).join("");

async function NoteContent({ mode, params }: { mode: FetchMode; params: Params }) {
  const { slug } = await params;
  const t = templates.notePage;
  const fill = await getFill(mode);
  const [{ data: p }, { data: all }] = await Promise.all([
    cachedSanity({ query: POST_BY_SLUG_QUERY, params: { slug }, ...mode }),
    cachedSanity({ query: POSTS_QUERY, ...mode }),
  ]);
  if (!p) notFound();

  const toc = (p.body ?? []).filter((b) => b._type === "block" && "style" in b && b.style === "h2").map((b) => plainText("children" in b ? b.children : []));
  // Next notes (generator note_page): the two after this one in list order, wrapping round; unpublished ones are
  // titles only.
  const idx = all.findIndex((q) => q._id === p._id);
  const next = [...all.slice(idx + 1), ...all.slice(0, Math.max(idx, 0))].slice(0, 2);
  const title = p.title ?? "";
  const offer = p.offer;
  return (
    <main>
      <JsonLd
        data={{
          "@type": "BlogPosting",
          headline: stegaClean(p.title),
          articleSection: stegaClean(p.category),
          datePublished: stegaClean(p.publishedAt),
          dateModified: stegaClean(p.updatedAt ?? p.publishedAt),
          author: orgRef,
          publisher: orgRef,
          mainEntityOfPage: `${SITE_URL}/notes/${slug}`,
        }}
      />
      <JsonLd data={breadcrumbsLd([[t.crumb, "/notes"], [stegaClean(p.title) ?? "", `/notes/${slug}`]])} />
      <Surface tone="d">
        {/* The reference breaks the title after its first full stop. */}
        <PageHero fill={fill} hero={{ eyebrow: tpl(t.heroEyebrow, { category: p.category ?? "", date: longDate(p.publishedAt) }), title: title.replace(". ", ".\n"), sub: p.excerpt ?? "" }} />
      </Surface>

      <Surface tone="l" seam>
        <div className="wrap note-body">
          <Rv as="article" className="art">
            <Rich value={p.body} fill={fill} />
            <div className="note-byline">
              {t.byline} {p.updatedAt ? `${tpl(t.updated, { date: longDate(p.updatedAt) })} ` : null}
              <MoreLink cta={t.allLink} />
            </div>
          </Rv>
          <Rv as="aside" delay={90}>
            <div className="note-aside">
              {toc.length ? (
                <div>
                  <div className="lab">{t.tocTitle}</div>
                  <div className="note-toc">
                    {toc.map((h) => (
                      <div key={h}>— {fill(h)}</div>
                    ))}
                  </div>
                </div>
              ) : null}
              {offer?.title ? (
                <div className="note-offer">
                  <div className="lab">{t.offerTitle}</div>
                  <div className="note-offer-t">{fill(offer.title)}</div>
                  {offer.text ? <div className="note-offer-x">{fill(offer.text)}</div> : null}
                  {offer.href ? <MoreLink cta={{ label: `${fill(offer.cta ?? "")} →`, href: stegaClean(offer.href) as never, variant: "link" }} /> : null}
                </div>
              ) : null}
              <div className="note-book">
                <Button href={t.bookButton.href}>{t.bookButton.label}</Button>
              </div>
            </div>
          </Rv>
        </div>
      </Surface>

      {next.length ? (
        <Surface tone="d" seam>
          <div className="wrap">
            <section className="sp-t100 sp-b120">
              <Rv className="head-row" style={{ marginBottom: 20 }}>
                <h2 className="h2" style={{ fontSize: 32 }}>
                  {t.nextTitle}
                </h2>
                <MoreLink cta={t.allLink} />
              </Rv>
              <Rv>
                <Ledger
                  fill={fill}
                  tone="sub"
                  stagger={false}
                  items={next.map((q) => ({
                    title: q.title ?? "",
                    text: q.excerpt ?? "",
                    href: q.published && q.slug ? `/notes/${stegaClean(q.slug)}` : undefined,
                  }))}
                />
              </Rv>
            </section>
          </div>
        </Surface>
      ) : null}

      <Surface tone="l" seam>
        <Closing fill={fill} tone="l" copy={{ eyebrow: t.closingEyebrow, title: p.closing ?? "", buttons: t.buttons, showEmail: true }} />
      </Surface>
    </main>
  );
}

export default withMode(NoteContent);
