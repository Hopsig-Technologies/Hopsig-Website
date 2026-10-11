import type { Metadata } from "next";
import { Closing } from "@/components/Closing";
import { Surface } from "@/components/Surface";
import { notFoundPage, seoTemplates } from "@/content";
import { withMode } from "@/lib/mode";
import { getFill } from "@/lib/site";
import type { FetchMode } from "@/sanity/lib/live";

export const metadata: Metadata = { title: { absolute: seoTemplates.notFound.title }, robots: { index: false } };

async function NotFoundContent({ mode }: { mode: FetchMode }) {
  const fill = await getFill(mode);
  return (
    <main>
      <Surface tone="d">
        <Closing copy={notFoundPage.closing} tone="d" fill={fill} heading="h1" />
      </Surface>
    </main>
  );
}

export default withMode(NotFoundContent);
