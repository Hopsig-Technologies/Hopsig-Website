"use client";

import dynamic from "next/dynamic";
import type { DraftToolsConfig } from "./DraftToolsClient";

// Code-split on the client: the chunk is fetched only when draft mode renders this.
const Tools = dynamic(() => import("./DraftToolsClient"), { ssr: false });

export function DraftToolsLoader({ config }: { config: DraftToolsConfig }) {
  return <Tools config={config} />;
}
