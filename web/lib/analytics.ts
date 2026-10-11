"use client";

/**
 * Analytics (owner decision 2026-10-11): Google Analytics 4 for acquisition and Search Console, PostHog for funnels,
 * heatmaps and session recordings. Nothing loads, and no analytics cookie is set, until the visitor accepts in the
 * consent banner (components/Analytics.tsx).
 *
 * Every ID comes from the environment only (Vercel project settings; web/.env.local locally), never from the code.
 * NEXT_PUBLIC_* values are inlined at build time, so a change needs a redeploy. With none set, the banner does not
 * show and nothing loads.
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";
export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "";
export const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "";
/** True when at least one tool is configured: only then is there anything to ask consent for. */
export const ANALYTICS_CONFIGURED = Boolean(GA_ID || (POSTHOG_KEY && POSTHOG_HOST));

/** The site's key events (the review's names). */
export type AnalyticsEvent = "consult_booked" | "brief_sent" | "case_note_opened" | "email_clicked";

export type Consent = "granted" | "denied";
const KEY = "hopsig-consent";

export function readConsent(): Consent | null {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function writeConsent(v: Consent) {
  try {
    window.localStorage.setItem(KEY, v);
  } catch {
    /* private mode: the choice lasts for this page only */
  }
}

type Gtag = (...args: unknown[]) => void;
type PostHog = typeof import("posthog-js").default;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
    __hopsigPosthog?: PostHog;
    __hopsigQueue?: [AnalyticsEvent, Record<string, string | number | undefined>][];
  }
}

/** Send one event to whichever tools are running (none before consent). */
export function track(event: AnalyticsEvent, props: Record<string, string | number | undefined> = {}) {
  if (readConsent() !== "granted") return;
  window.gtag?.("event", event, props);
  // PostHog loads asynchronously after consent: hold the event until it is ready.
  if (window.__hopsigPosthog) window.__hopsigPosthog.capture(event, props);
  else (window.__hopsigQueue ??= []).push([event, props]);
}

/** Start GA4 (Consent Mode v2: ads signals stay denied) and PostHog. Called only after consent. */
export async function startAnalytics() {
  // Accepted again after a decline in this session: switch both back on.
  if (GA_ID) (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = false;
  window.gtag?.("consent", "update", { analytics_storage: "granted" });
  window.__hopsigPosthog?.opt_in_capturing();
  if (GA_ID && !window.gtag) {
    window.dataLayer = window.dataLayer || [];
    // gtag must push the `arguments` object itself, as Google's snippet does.
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "granted" });
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { send_page_view: false });
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);
  }
  if (POSTHOG_KEY && POSTHOG_HOST && !window.__hopsigPosthog) {
    const posthog = (await import("posthog-js")).default;
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: "identified_only",
      capture_pageview: "history_change",
      persistence: "localStorage+cookie",
      session_recording: { maskAllInputs: true, maskTextSelector: "input, textarea" },
    });
    window.__hopsigPosthog = posthog;
    for (const [event, props] of window.__hopsigQueue ?? []) posthog.capture(event, props);
    window.__hopsigQueue = [];
  }
}

/** Withdrawn consent: stop both tools and clear their identifiers. */
export function stopAnalytics() {
  if (GA_ID) (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = true;
  window.gtag?.("consent", "update", { analytics_storage: "denied" });
  window.__hopsigPosthog?.opt_out_capturing();
  window.__hopsigPosthog?.reset();
  for (const c of document.cookie.split(";")) {
    const name = c.split("=")[0].trim();
    if (name.startsWith("_ga") || name.startsWith("ph_")) document.cookie = `${name}=; Max-Age=0; path=/; domain=${location.hostname.replace(/^www\./, "")}`;
  }
}

/** Pageview for GA4 on client-side navigations (PostHog captures history changes itself). */
export function pageview(path: string) {
  window.gtag?.("event", "page_view", { page_path: path, page_location: window.location.href, page_title: document.title });
}
