import Link from "next/link";
import { navigation, site } from "@/content";
import { withMode } from "@/lib/mode";
import { getFill } from "@/lib/site";
import type { FetchMode } from "@/sanity/lib/live";
import { Button } from "./Button";
import { Filled } from "./Filled";
import { Wordmark } from "./Wordmark";

/** The four-column footer. The legal line carries site-wide values (year, email) from Site settings; the email is a link. */
async function FooterContent({ mode }: { mode: FetchMode }) {
  const fill = await getFill(mode);
  return (
    <footer id="foot" className="tone-d foot">
      <div className="wrap foot-in">
        <div className="foot-grid">
          <div className="foot-brand">
            <Wordmark size={20} />
            <div className="foot-tag">{site.footer.tagline}</div>
            <Button href={navigation.cta.href} variant="outline">
              {navigation.cta.label}
            </Button>
          </div>
          {navigation.footer.map((col) => (
            <div key={col.title}>
              <div className="foot-h">{col.title}</div>
              {col.links.map((l) => (
                <Link key={l.href} className="fl" href={l.href}>
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="foot-legal">
          <span>
            <Filled text={site.footer.legalLeft} fill={fill} />
          </span>
          <span>
            <Filled text={site.footer.legalRight} fill={fill} />
          </span>
        </div>
      </div>
    </footer>
  );
}

export const Footer = withMode(FooterContent);
