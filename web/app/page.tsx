import type { Metadata } from "next";
import Link from "next/link";
import { stegaClean } from "next-sanity";
import { Fragment } from "react";
import { Button } from "@/components/Button";
import { Closing } from "@/components/Closing";
import { Lines } from "@/components/Lines";
import { Rich } from "@/components/Rich";
import { Rv } from "@/components/Reveal";
import { Eyebrow, H2, MoreLink } from "@/components/blocks";
import { CaseIndex, type CaseIndexRow } from "@/components/home/CaseIndex";
import { HomeHero } from "@/components/home/HomeHero";
import { ServiceFile } from "@/components/home/ServiceFile";
import { Capabilities } from "@/components/more";
import { Surface } from "@/components/Surface";
import { homePage as page, services } from "@/content";
import { withMode } from "@/lib/mode";
import { getFill } from "@/lib/site";
import { nn, tpl } from "@/lib/tpl";
import { cachedSanity, type FetchMode } from "@/sanity/lib/live";
import { CASE_COUNT_QUERY, CASES_FEATURED_QUERY, POSTS_QUERY } from "@/sanity/queries";

export const metadata: Metadata = { title: "Hopsig — Home" };

const TAB = 46;
const TOP = 88;

async function HomeContent({ mode }: { mode: FetchMode }) {
  const fill = await getFill(mode);
  const [{ data: featured }, { data: posts }, { data: caseCount }] = await Promise.all([
    cachedSanity({ query: CASES_FEATURED_QUERY, ...mode }),
    cachedSanity({ query: POSTS_QUERY, ...mode }),
    cachedSanity({ query: CASE_COUNT_QUERY, ...mode }),
  ]);
  const { hero, services: svc, caseIndex: ci, midCta, why, record, notes } = page;

  const rows: CaseIndexRow[] = featured.map((c) => ({
    id: c._id,
    title: fill(c.title),
    domain: fill(c.domain),
    shape: fill(c.shape),
    filter: stegaClean(c.filterDomain) ?? "",
    metric: c.metric?.value
      ? {
          value: fill(c.metric.value),
          label: fill(c.metric.label),
          before: c.metric.before ?? null,
          after: c.metric.after ?? null,
          beforeLabel: c.metric.beforeLabel ?? null,
          afterLabel: c.metric.afterLabel ?? null,
        }
      : null,
    problem: fill(c.problem),
    whatWeDid: fill(c.whatWeDid),
    measured: <Rich value={c.measured} fill={fill} inline />,
    stack: (c.stack ?? []).map((s) => fill(s)),
    link:
      c.hasPage && c.slug
        ? { href: `/work/${stegaClean(c.slug)}`, label: ci.pageLink }
        : { href: "/book", label: ci.askLink },
  }));
  const filters = ci.filters.map((f) => ({
    key: f.key,
    label: f.label,
    count: f.key === "all" ? rows.length : rows.filter((r) => r.filter === f.key).length,
  }));

  // The journal: the first note as the feature, the next five as the ledger. Unpublished notes link to /notes.
  const journal = posts.slice(0, 6).map((p) => ({
    ...p,
    href: p.published && p.slug ? `/notes/${stegaClean(p.slug)}` : "/notes",
  }));
  const [feat, ...ledger] = journal;
  const [ratePre, ratePost] = svc.fromLabel.split("[YOUR RATE]");

  return (
    <main>
      <Surface tone="d">
        <HomeHero beats={hero.beats.map((b) => ({ when: fill(b.when), title: fill(b.title), text: fill(b.text) }))} hint={hero.scrollHint}>
          <Eyebrow acc={false}>{fill(hero.eyebrow)}</Eyebrow>
          <h1 className="hero-h1">
            <Lines text={fill(hero.title)} />
          </h1>
          <p className="hero-sub">{fill(hero.sub)}</p>
          <div className="ph-btns">
            {hero.buttons.map((b) => (
              <Button key={b.label} href={b.href} variant={b.variant === "lime" ? "lime" : "outline"}>
                {b.label}
              </Button>
            ))}
          </div>
          <div className="hero-facts">
            {hero.facts.map((f, i) => (
              <Fragment key={f.value}>
                {i ? <i /> : null}
                <span>
                  <b>{fill(f.value)}</b> {fill(f.label)}
                </span>
              </Fragment>
            ))}
          </div>
        </HomeHero>
      </Surface>

      <Surface tone="l" seam>
        <section id="svc" className="wrap" style={{ padding: "120px 0 0" }}>
          <Rv className="home-head" style={{ marginBottom: 28 }}>
            <div className="home-head-l">
              <Eyebrow>{fill(svc.head.eyebrow)}</Eyebrow>
              <h2 className="h2" style={{ fontSize: 48, maxWidth: 820 }}>
                {fill(svc.head.title)}
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
              <MoreLink cta={svc.closingLinks[0]} />
              <span className="lab" style={{ letterSpacing: "0.12em" }}>
                {svc.scrollHint}
              </span>
            </div>
          </Rv>
          <ServiceFile count={services.length}>
            {services.map((s, i) => (
              <article key={s.id} className="sheet" style={{ top: TOP + i * TAB, zIndex: 10 + i }}>
                <div className="veil" aria-hidden="true" />
                <div className="tab" role="button" tabIndex={0} aria-label={`Open ${s.name}`}>
                  <span className="n">{nn(s.n)}</span>
                  <span className="t">{s.name}</span>
                  <span className="s">{fill(s.shape)}</span>
                  <Link className="m" href={`/services/${s.id}`}>
                    {svc.detailsLabel}
                  </Link>
                </div>
                <div className="sh">
                  <div className="big" aria-hidden="true">
                    {nn(s.n)}
                  </div>
                  <div>
                    <h3>{fill(s.oneLiner)}</h3>
                    <p>{fill(s.description)}</p>
                    <div className="get">
                      {s.tiles.map((t) => (
                        <div key={t.title}>
                          <b>{fill(t.title)}</b>
                          {fill(t.text)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="right">
                    <div>
                      <div className="lab">{svc.goodForLabel}</div>
                      <div className="good" style={{ marginTop: 8 }}>
                        {s.goodFor.map((g) => (
                          <div key={g}>— {fill(g)}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="lab">{svc.stackLabel}</div>
                      <div className="chips" style={{ marginTop: 10 }}>
                        {s.stack.map((c) => (
                          <span key={c} className="chip">
                            {fill(c)}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="fee">
                      <span>
                        {svc.engagementLabel} <b>{fill(s.shape)}</b>
                      </span>
                      <span>
                        {ratePre}
                        <b>{fill("[YOUR RATE]")}</b>
                        {ratePost}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
            <div className="sheet end" style={{ top: TOP + services.length * TAB, zIndex: 10 + services.length }}>
              <div className="endc">
                <span>{svc.closingLabel}</span>
                <span style={{ display: "flex", gap: 28 }}>
                  {svc.closingLinks.map((l) => (
                    <Link key={l.href} href={l.href}>
                      {l.label}
                    </Link>
                  ))}
                </span>
              </div>
            </div>
          </ServiceFile>
        </section>
      </Surface>

      <Surface tone="d" seam className="over">
        <CaseIndex
          rows={rows}
          filters={filters}
          labels={{ problem: ci.problemLabel, whatWeDid: ci.whatWeDidLabel, measured: ci.measuredLabel }}
          head={
            <div className="home-head-l">
              <Eyebrow>{fill(ci.head.eyebrow)}</Eyebrow>
              <h2 className="h2" style={{ fontSize: 48 }}>
                {fill(ci.head.title)}
              </h2>
              <div className="home-note">{fill(ci.head.aside)}</div>
            </div>
          }
          foot={
            <Rv className="foot">
              <MoreLink cta={{ ...ci.allLink, label: tpl(ci.allLink.label, { count: caseCount }) }} />
            </Rv>
          }
        />
        <section className="wrap" style={{ paddingBottom: 140 }}>
          <Rv className="mid-cta">
            <div className="mid-cta-t">{fill(midCta.text)}</div>
            <Button href={midCta.button.href}>{midCta.button.label}</Button>
          </Rv>
        </section>
      </Surface>

      <Surface tone="l" seam>
        <div style={{ height: 100 }} />
        <section style={{ paddingBottom: 140 }}>
          <Capabilities fill={fill} />
        </section>
        <section className="wrap" style={{ paddingBottom: 140 }}>
          <Rv>
            <H2>{fill(why.head.title)}</H2>
          </Rv>
          <div className="why">
            {why.items.map((it, i) => (
              // The reference marks the second tile with the accent rule.
              <Rv key={it.title} className="tile2" delay={i * 80} style={i === 1 ? { borderTopColor: "var(--acc)" } : undefined}>
                <div className="tile2-n">{nn(i + 1)}</div>
                <div className="tile2-t">{fill(it.title)}</div>
                <div className="tile2-x">{fill(it.text)}</div>
              </Rv>
            ))}
          </div>
        </section>
      </Surface>

      <Surface tone="d" seam>
        <section id="record" className="wrap" style={{ padding: "100px 0 120px" }}>
          <div className="record">
            <Rv className="record-l">
              <Eyebrow>{fill(record.head.eyebrow)}</Eyebrow>
              <H2>{fill(record.head.title)}</H2>
              <p className="body17">{fill(record.head.sub)}</p>
              <MoreLink cta={record.link} />
            </Rv>
            <div className="record-grid">
              {record.stats.map((s, i) => (
                <Rv key={s.value} className="tile2" delay={i * 80} style={i === 0 ? { borderTopColor: "var(--text)" } : undefined}>
                  <div className="tile2-v">{fill(s.value)}</div>
                  <div className="tile2-x">{fill(s.label)}</div>
                </Rv>
              ))}
            </div>
          </div>
          <Rv className="record-strip">
            {record.strip.map((x) => (
              <span key={x}>{fill(x)}</span>
            ))}
          </Rv>
        </section>
      </Surface>

      <Surface tone="l" seam>
        <section id="notes" className="notes wrap" style={{ padding: "120px 0 110px" }}>
          <Rv className="home-head">
            <div className="home-head-l">
              <Eyebrow>{fill(notes.head.eyebrow)}</Eyebrow>
              <h2 className="h2" style={{ fontSize: 44, maxWidth: 640 }}>
                {fill(notes.head.title)}
              </h2>
              <div className="home-note">{fill(notes.head.aside)}</div>
            </div>
            <div className="notes-count">{tpl(notes.countLine, { count: posts.length })}</div>
          </Rv>
          {feat ? (
            <div className="jn">
              <Rv>
                <Link className="feat" href={feat.href as never} aria-label={`Read: ${stegaClean(feat.title)}`}>
                  <div className="k">
                    <b>{notes.latestLabel}</b>
                    <span>{feat.category}</span>
                  </div>
                  <h3>{fill(feat.title)}</h3>
                  <p>{fill(feat.excerpt)}</p>
                  <span className="r">
                    {notes.readLabel.replace(/ →$/, "")} <i>→</i>
                  </span>
                </Link>
              </Rv>
              <Rv className="ledger" delay={60}>
                {ledger.map((p, i) => (
                  <Rv key={p._id} delay={80 + i * 70}>
                    <Link className="row" href={p.href as never} aria-label={`Read: ${stegaClean(p.title)}`}>
                      <span className="n">{nn(i + 2)}</span>
                      <span>
                        <span className="t" style={{ display: "inline-block" }}>
                          {fill(p.title)}
                        </span>
                        <span className="c">{p.category}</span>
                      </span>
                      <span className="r">
                        <i>→</i>
                      </span>
                    </Link>
                  </Rv>
                ))}
                <div className="all">
                  <span>{notes.moreTitle}</span>
                  <Link href={notes.allLink.href}>{notes.allLink.label}</Link>
                </div>
              </Rv>
            </div>
          ) : null}
        </section>
        <Closing copy={page.closing} tone="l" fill={fill} />
      </Surface>
    </main>
  );
}

export default withMode(HomeContent);
