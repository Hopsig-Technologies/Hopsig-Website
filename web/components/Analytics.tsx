"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ANALYTICS_CONFIGURED, pageview, readConsent, startAnalytics, stopAnalytics, track, writeConsent, type Consent } from "@/lib/analytics";

export type ConsentCopy = { text: string; accept: string; decline: string; privacy: string };

/** Fired by the footer's "Cookie settings" button to reopen the banner. */
export const CONSENT_OPEN_EVENT = "hopsig:consent-open";

/**
 * The consent banner and the analytics it guards. Until the visitor chooses, nothing loads; "Accept" starts GA4 and
 * PostHog, "Decline" keeps them off; the choice is kept in localStorage and can be changed from "Cookie settings" in
 * the footer. Also sends the GA4 pageview on client-side navigation and `email_clicked` for mailto links.
 */
export function Analytics({ copy }: { copy: ConsentCopy }) {
  const pathname = usePathname();
  const [consent, setConsent] = useState<Consent | null | "unknown">("unknown");

  useEffect(() => {
    const c = readConsent();
    // Browser-only state (localStorage): read once after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(c);
    if (c === "granted") void startAnalytics();
    const reopen = () => setConsent(null);
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href^='mailto:']");
      if (a) track("email_clicked", { location: window.location.pathname });
    };
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
      document.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    if (consent === "granted") pageview(pathname);
  }, [pathname, consent]);

  const choose = (c: Consent) => {
    writeConsent(c);
    setConsent(c);
    if (c === "granted") void startAnalytics();
    else stopAnalytics();
  };

  // No analytics configured (no environment variables): nothing to ask about.
  if (!ANALYTICS_CONFIGURED || consent !== null) return null;
  return (
    <div className="consent" role="region" aria-label="Cookie consent">
      <p className="consent-t">
        {copy.text}{" "}
        <Link href="/privacy" className="consent-link">
          {copy.privacy}
        </Link>
      </p>
      <div className="consent-b">
        <button type="button" className="btn btn-outline btn-sm" onClick={() => choose("denied")}>
          {copy.decline}
        </button>
        <button type="button" className="btn btn-lime btn-sm" onClick={() => choose("granted")}>
          {copy.accept}
        </button>
      </div>
    </div>
  );
}

/** Footer link that reopens the banner (with its " · " separator); nothing when no analytics are configured. */
export function CookieSettingsButton({ label }: { label: string }) {
  if (!ANALYTICS_CONFIGURED) return null;
  return (
    <>
      {" · "}
      <button type="button" className="foot-cookie" onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}>
        {label}
      </button>
    </>
  );
}

/** Sends one event when a page is viewed (case notes: `case_note_opened`). */
export function TrackView({ event, slug }: { event: "case_note_opened"; slug: string }) {
  useEffect(() => {
    track(event, { slug });
  }, [event, slug]);
  return null;
}
