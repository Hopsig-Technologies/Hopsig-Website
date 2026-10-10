import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { Suspense } from "react";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { DisableDraftMode } from "@/components/DisableDraftMode";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsClass } from "@/components/JsClass";
import { navigation } from "@/content";
import { SanityLive } from "@/sanity/lib/live";
import "./globals.css";
import "./chrome.css";
import "./blocks.css";
import "./sections.css";
import "./home.css";
import "./pages.css";
import "./contact.css";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-grotesk",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  // Plex Mono has no arrows (→); without the metric-matched fallback they fall back to the system monospace,
  // as in the reference. (The adjusted fallback covers all of Unicode and draws a long ⟶ instead.)
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Hopsig — You think it. We finish it.",
};

// Marks <html class="js"> before paint so reveal styles only hide content when JS will reveal it (rule 10).
const jsClass = `document.documentElement.classList.add('js')`;

// Without JS (rule 10). React streams a large finished Suspense boundary out of order, even in a static
// prerender: once a boundary passes ~12.8 KB (`progressiveChunkSize`, which Next does not expose) its HTML goes
// into <div hidden id="S:n"> at the end of <body>, and an inline script moves it into place. Every big page's
// <main> is such a boundary (Next wraps each page segment in one). With JS off that script never runs, so this
// shows the segments and orders them between the page chrome: header, then the segments, then the footer.
const noJs = `<style>
body { display: flex; flex-direction: column; }
.pg { display: contents; }
.pg > footer { order: 2; }
/* In Tailwind's base layer, where the preflight's [hidden] { display: none !important } lives: a layered
   !important beats an unlayered one, so the override has to sit in the same layer and win on specificity. */
@layer base { body > div[hidden][id^="S:"] { display: block !important; order: 1; } }
</style>`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${grotesk.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsClass }} />
        <noscript dangerouslySetInnerHTML={{ __html: noJs }} />
      </head>
      <body>
        <JsClass />
        <div className="pg tone-d">
          <Header nav={navigation} />
          {children}
          <Footer />
        </div>
        <Suspense fallback={null}>
          <SanityTools />
        </Suspense>
      </body>
    </html>
  );
}

/** Live updates for everyone; click-to-edit overlays and an exit link only in draft mode. */
async function SanityTools() {
  const { isEnabled } = await draftMode();
  return (
    <>
      <SanityLive includeDrafts={isEnabled} />
      {isEnabled ? (
        <>
          <VisualEditing />
          <DisableDraftMode />
        </>
      ) : null}
    </>
  );
}
