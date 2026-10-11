import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { privacyPage as page, templates } from "@/content";
import { withMode } from "@/lib/mode";
import { getFill } from "@/lib/site";
import type { FetchMode } from "@/sanity/lib/live";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/privacy");

async function Content({ mode }: { mode: FetchMode }) {
  return <LegalPage page={page} fill={await getFill(mode)} contentsTitle={templates.legalPage.contentsTitle} />;
}

export default withMode(Content);
