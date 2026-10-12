// The emails the forms send (lib/contact.ts): to the team, and a receipt to the person who sent the form.
// New copy (owner request 2026-10-11), drafted from the site's own confirmation lines. `{tokens}` are filled at send.
import type { Emails } from "./types";

export const emails = {
  footer: "Hopsig Technologies LLC · Wyoming, USA · Delivery Centre: Lahore, Pakistan",
  site: "hopsig.com",
  labels: {
    times: "Times that suit",
    timeZone: "Time zone",
    utc: "The same in UTC",
    name: "Name",
    email: "Email",
    company: "Company · team size",
    about: "About",
    problem: "The problem",
    when: "When it needs to exist",
    budget: "Rough budget",
    link: "Link",
  },
  aboutCase: "The case note “{title}”",
  noTimes: "No preference given",
  team: {
    booking: {
      subject: "Consult request from {who}",
      eyebrow: "Website · consult request",
      title: "A consult request.",
      text: "Send a calendar invite for one of the times below within one working day, or propose one if none is given; the visitor was told it would come. Reply to this email to reach them.",
    },
    brief: {
      subject: "Brief from {who}",
      eyebrow: "Website · brief",
      title: "A brief.",
      text: "The visitor was told a reply comes inside one working day. Reply to this email to reach them.",
    },
  },
  receipt: {
    sentLabel: "What you sent",
    booking: {
      subject: "Your consult request · Hopsig",
      eyebrow: "Consult request",
      title: "We have your request.",
      text: "A calendar invite for thirty minutes follows within one working day, for one of the times you picked, and the people who would do the work will be on the call. If none of them suits after all, reply to this email.",
      textNoTimes:
        "We will propose a time for a thirty-minute call within one working day, and the people who would do the work will be on it. If you would rather name a time, reply to this email.",
    },
    brief: {
      subject: "Your brief · Hopsig",
      eyebrow: "Brief",
      title: "We will read it today.",
      text: "A reply comes inside one working day. If we are not the right people, we will say who is.",
    },
  },
} satisfies Emails;
