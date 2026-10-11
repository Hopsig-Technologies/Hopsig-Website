"use client";

import { SanityLive } from "next-sanity/live/client-components";
import { VisualEditing } from "next-sanity/visual-editing/client-component";
import { perspectiveChangeAction, variantChangeAction } from "next-sanity/visual-editing/server-actions";
import { DisableDraftMode } from "./DisableDraftMode";

export type DraftToolsConfig = React.ComponentProps<typeof SanityLive>["config"];

/**
 * The draft-mode tools, rendered the way next-sanity's server components render them (`defineLive` with
 * `includeDrafts`, `<VisualEditing />`). `SanityLive` here is next-sanity's client component, which it marks as
 * internal: check this file when upgrading next-sanity.
 */
export default function DraftToolsClient({ config }: { config: DraftToolsConfig }) {
  return (
    <>
      <SanityLive
        config={config}
        includeDrafts
        requestTag="next-loader.live"
        waitFor={undefined}
        action="refresh"
        onError={undefined}
        onWelcome={undefined}
        onReconnect={undefined}
        onRestart={undefined}
        onGoAway={undefined}
      />
      <VisualEditing onPerspectiveChange={perspectiveChangeAction} onVariantChange={variantChangeAction} />
      <DisableDraftMode />
    </>
  );
}
