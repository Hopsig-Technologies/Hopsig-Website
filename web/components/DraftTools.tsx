import { draftMode } from "next/headers";
import { client } from "@/sanity/lib/client";
import { DraftToolsLoader } from "./DraftToolsLoader";

/**
 * Draft mode only (Presentation tool): live draft updates, click-to-edit overlays and an exit link. Visitors get
 * none of it; published changes reach the site through the publish webhook (/api/revalidate).
 *
 * The tools' client code (the visual-editing kit, ~570 KB) loads through a client-side dynamic import
 * (DraftToolsLoader), because anything the root layout reaches on the server side, even through next/dynamic,
 * lands in every page's scripts (PageSpeed, 2026-10-11). Same props as next-sanity's server wrappers pass.
 */
export async function DraftTools() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;
  const { projectId, dataset, apiHost, apiVersion, useProjectHostname, requestTagPrefix } = client.config();
  // As defineLive builds it; the viewer token reaches the browser only in draft mode, as its browserToken did.
  const config = {
    projectId,
    dataset,
    apiHost: apiHost === "https://api.sanity.io" ? undefined : apiHost,
    apiVersion,
    useProjectHostname: useProjectHostname ? undefined : useProjectHostname,
    requestTagPrefix,
    token: process.env.SANITY_API_READ_TOKEN,
  };
  return <DraftToolsLoader config={config} />;
}
