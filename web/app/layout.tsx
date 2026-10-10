import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { Suspense } from "react";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { DisableDraftMode } from "@/components/DisableDraftMode";
import { JsClass } from "@/components/JsClass";
import { SanityLive } from "@/sanity/lib/live";
import "./globals.css";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-grotesk",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
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
        {children}
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
