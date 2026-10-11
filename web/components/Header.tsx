"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Navigation } from "@/content/types";
import { Wordmark } from "./Wordmark";

/**
 * The sticky header: wordmark, three dropdown menus (Services wide two-column, Industries, Company), two plain
 * links and the CTA. Menus open on hover and focus-within (CSS); on touch the first tap opens a menu instead of
 * following the link; Esc and a click outside close it. The current page is marked `.on` in its menu and its
 * section. Below 900px the nav folds into a "Menu" panel (not in the reference, which is desktop only).
 *
 * Receives only the navigation strings as props (no placeholders), so nothing from web/content is bundled.
 */
export function Header({ nav }: { nav: Navigation }) {
  const pathname = usePathname();
  // Menu state belongs to the page it was opened on: navigating closes everything without an effect.
  const [state, setState] = useState<{ path: string; open: number | null; mobile: boolean }>({ path: pathname, open: null, mobile: false });
  const current = state.path === pathname ? state : { path: pathname, open: null, mobile: false };
  const { open, mobile } = current;
  const setOpen = (i: number | null) => setState({ ...current, open: i });
  const setMobile = (m: boolean) => setState({ ...current, mobile: m });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setState((s) => ({ ...s, open: null, mobile: false }));
    };
    const onClick = (e: MouseEvent) => {
      if (!(e.target as Element).closest?.(".hdr .dd")) setState((s) => ({ ...s, open: null }));
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  const isHome = pathname === "/";
  const inSection = (href: string, children?: { href: string }[]) =>
    pathname === href || (href !== "/" && pathname.startsWith(href + "/")) || !!children?.some((c) => c.href === pathname);

  return (
    <header id="hdr" className={`hdr${isHome ? "" : " always"}`}>
      <div className="wrap hdr-row">
        <Link href="/" className="hdr-wm" aria-label="Hopsig Technologies, home">
          <Wordmark size={26} />
        </Link>
        <nav className="hdr-nav" aria-label="Main">
          {nav.primary.map((item, i) =>
            item.children ? (
              <div key={item.label} className={`dd${open === i ? " open" : ""}`}>
                <Link
                  href={item.href}
                  className={`nl${inSection(item.href, item.children) ? " on" : ""}`}
                  aria-haspopup="true"
                  aria-expanded={open === i}
                  onClick={(e) => {
                    if (window.matchMedia("(hover: none)").matches && open !== i) {
                      e.preventDefault();
                      setOpen(i);
                    }
                  }}
                >
                  {item.label}
                  <span className="crt" aria-hidden="true">
                    ▾
                  </span>
                </Link>
                <div className={`menu${item.children.length > 7 ? " wide" : ""}`}>
                  <div className="pnl">
                    {item.children.map((c, j) => (
                      <Link key={c.href} href={c.href} className={`mi${pathname === c.href ? " on" : ""}`}>
                        <span className="n">{String(j + 1).padStart(2, "0")}</span>
                        <span>
                          <b>{c.label}</b>
                          {c.desc ? <span className="d">{c.desc}</span> : null}
                        </span>
                      </Link>
                    ))}
                    {item.menuFooter ? (
                      <div className="mf">
                        {item.menuFooter.map((m) => (
                          <Link key={m.href} href={m.href}>
                            {m.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : item.group === "ai" ? (
              // v2: consecutive AI links share one Lime capsule; the first renders it, the rest are inside.
              nav.primary[i - 1]?.group === "ai" ? null : (
                <span key={item.label} className="ai" aria-label={nav.aiGroupLabel}>
                  {nav.primary.slice(i).filter((x, j, rest) => rest.slice(0, j + 1).every((y) => y.group === "ai")).map((x) => (
                    <Link key={x.label} href={x.href} className={`nl${pathname === x.href ? " on" : ""}`}>
                      {x.label}
                    </Link>
                  ))}
                </span>
              )
            ) : (
              <Link key={item.label} href={item.href} className={`nl${pathname === item.href ? " on" : ""}`}>
                {item.label}
              </Link>
            ),
          )}
          {/* Not on the page it points to (the reference's /book has no header CTA). */}
          {pathname === nav.cta.href ? null : (
            <Link href={nav.cta.href} className="cta">
              {nav.cta.label}
            </Link>
          )}
        </nav>
        <button type="button" className="hdr-burger" aria-expanded={mobile} aria-controls="hdr-mobile" onClick={() => setMobile(!mobile)}>
          {mobile ? "Close" : "Menu"}
        </button>
      </div>
      {mobile ? (
        <div id="hdr-mobile" className="hdr-mobile">
          <div className="wrap">
            {nav.primary.map((item) => (
              <div key={item.label} className="hm-group">
                <Link href={item.href} className="hm-top">
                  {item.label}
                </Link>
                {item.children?.map((c) => (
                  <Link key={c.href} href={c.href} className={`hm-item${pathname === c.href ? " on" : ""}`}>
                    {c.label}
                  </Link>
                ))}
              </div>
            ))}
            <Link href={nav.cta.href} className="btn btn-lime">
              {nav.cta.label}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
