import type { Metadata } from "next";
import { BriefForm } from "@/components/ContactForms";
import { ContactPage } from "@/components/ContactPage";
import { Rich } from "@/components/Rich";
import { inlineToBlocks } from "@/lib/portable";
import { briefPage as page } from "@/content";
import { withMode } from "@/lib/mode";
import { getFill } from "@/lib/site";
import type { FetchMode } from "@/sanity/lib/live";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/brief");

async function BriefContent({ mode }: { mode: FetchMode }) {
  const fill = await getFill(mode);
  const form = page.form;
  return (
    <ContactPage hero={page.hero} steps={page.steps} note={page.note} strip={page.strip} fill={fill}>
      <BriefForm copy={{ ...form, notConnected: fill(form.notConnected) }} captchaNote={<Rich value={inlineToBlocks(form.captchaNote)} fill={fill} inline />} />
    </ContactPage>
  );
}

export default withMode(BriefContent);
