import type { Metadata } from "next";
import { BookCalendar } from "@/components/ContactForms";
import { ContactPage } from "@/components/ContactPage";
import { bookPage as page } from "@/content";
import { withMode } from "@/lib/mode";
import { getSettings } from "@/lib/site";
import { makeFill } from "@/lib/tokens";
import type { FetchMode } from "@/sanity/lib/live";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/book");

async function BookContent({ mode }: { mode: FetchMode }) {
  const settings = await getSettings(mode);
  const fill = makeFill(settings);
  const cal = page.calendar;
  return (
    <ContactPage hero={page.hero} steps={page.steps} note={page.note} strip={page.strip} fill={fill}>
      <BookCalendar copy={{ ...cal, notConnected: fill(cal.notConnected) }} />
    </ContactPage>
  );
}

export default withMode(BookContent);
