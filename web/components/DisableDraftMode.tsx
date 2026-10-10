"use client";

import { useIsPresentationTool } from "next-sanity/hooks";

/** A way out of draft mode when the site is opened outside the Studio's Presentation tool. */
export function DisableDraftMode() {
  const isPresentationTool = useIsPresentationTool();
  if (isPresentationTool !== false) return null;
  return (
    <a
      href="/api/draft-mode/disable"
      className="btn btn-lime btn-sm"
      style={{ position: "fixed", right: 16, bottom: 16, zIndex: 50 }}
    >
      Exit draft mode
    </a>
  );
}
