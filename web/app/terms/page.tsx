import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { termsPage as page, templates } from "@/content";
import { withMode } from "@/lib/mode";
import { getFill } from "@/lib/site";
import type { FetchMode } from "@/sanity/lib/live";

export const metadata: Metadata = { title: "Hopsig — Terms" };

async function Content({ mode }: { mode: FetchMode }) {
  return <LegalPage page={page} fill={await getFill(mode)} contentsTitle={templates.legalPage.contentsTitle} />;
}

export default withMode(Content);
