// Converted once from the approved prototype (reference/site) by scripts/convert_content.mjs on 2026-10-10.
// This file is now the source of truth for this copy: edit it by hand. Bracketed [PLACEHOLDERS] stay until the
// founders replace them (CLAUDE.md rule 1). Run `pnpm check:content` after editing.
import type { LegalPage } from "../types";

export const privacyPage = {
  hero: {
    title: "Privacy.\nShort, because there is not much to say.",
    eyebrow: "Draft for counsel’s review",
    sub: "We collect what you give us when you ask to talk, and the usual logs. Nothing is sold, nothing is shared for advertising, and the analytics are off until you say yes.",
  },
  sections: [
    {
      heading: "Who we are",
      body: [
        {
          p: "Hopsig Technologies, [LEGAL FORM], registered in Pakistan under [COMPANY REG NO.], registered office [ADDRESS]. For the purposes of UK and EU data protection law we are the controller of the personal data described on this page. Contact: [HELLO@HOPSIG.COM].",
        },
      ],
    },
    {
      heading: "What we collect, and why",
      body: [
        {
          p: "When you book a call or send a brief we collect your name, work email, company, team size and whatever you write about the problem. We use it to reply to you and, if we work together, to scope the engagement. Lawful basis: our legitimate interest in responding to an enquiry you made, and performance of a contract once there is one.",
        },
        {
          p: "When you browse the site we collect the usual server logs (IP address, browser, pages requested) and, if you accept them, analytics cookies from [ANALYTICS TOOL]. Lawful basis: legitimate interest for logs; consent for analytics.",
        },
        {
          p: "We do not buy lists, we do not run advertising pixels, and we do not sell or share your data with anyone for their own purposes.",
        },
      ],
    },
    {
      heading: "Cookies",
      body: [
        {
          p: "Essential cookies keep the site working and remember a choice you made. Analytics cookies are off until you accept them, and you can withdraw at any time from the cookie notice in the footer. The full list: [COOKIE TABLE].",
        },
      ],
    },
    {
      heading: "Who sees it",
      body: [
        {
          p: "The people at Hopsig who would do the work. Our processors: [HOSTING PROVIDER] (hosting), [CMS PROVIDER] (content and form storage), [EMAIL PROVIDER] (email), [BOOKING TOOL] (scheduling), [ANALYTICS TOOL] (analytics, with consent). Each is bound by a data-processing agreement.",
        },
      ],
    },
    {
      heading: "Where it goes",
      body: [
        {
          p: "We are in Pakistan; our processors are in [REGIONS]. Transfers from the UK and EU rely on [IDTA / SCCs / ADEQUACY], and we will provide the documentation on request.",
        },
      ],
    },
    {
      heading: "How long we keep it",
      body: [
        {
          p: "Enquiries and briefs: [RETENTION PERIOD] from the last contact, then deleted. Client engagement records: for the term of the contract plus [PERIOD] for tax and legal reasons. Server logs: [PERIOD]. Analytics: per the tool's setting, [PERIOD].",
        },
      ],
    },
    {
      heading: "Your rights",
      body: [
        {
          ul: [
            "Access the personal data we hold about you",
            "Correct it",
            "Have it erased, where we no longer need it",
            "Object to processing based on legitimate interest",
            "Restrict processing while a dispute is resolved",
            "Receive it in a portable format",
            "Withdraw consent for analytics at any time",
          ],
        },
        {
          p: "Write to [HELLO@HOPSIG.COM]. We reply within one month. You can also complain to your supervisory authority; in the UK that is the Information Commissioner’s Office.",
        },
      ],
    },
    {
      heading: "Changes",
      body: [
        {
          p: "We will update this page when the facts change and put the date at the top. We will not change the lawful basis for data we already hold without telling you.",
        },
      ],
    },
  ],
  footnote: "Last updated [DATE]\nQuestions: [HELLO@HOPSIG.COM]",
} satisfies LegalPage;
