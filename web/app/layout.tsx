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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${grotesk.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsClass }} />
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
