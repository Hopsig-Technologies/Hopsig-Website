// The emails the forms send (lib/contact.ts): to the team, and a receipt to the person who sent the form.
// New copy (owner request 2026-10-11), drafted from the site's own confirmation lines. `{tokens}` are filled at send.
import type { Emails } from "./types";

export const emails = {
  footer: "Hopsig Technologies LLC · Wyoming, USA · Delivery Centre: Lahore, Pakistan",
  site: "hopsig.com",
  labels: {
    slot: "Requested slot",
    timeZone: "Time zone",
    utc: "Same moment in UTC",
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
  team: {
    booking: {
      subject: "Consult request from {who}",
      eyebrow: "Website · consult request",
      title: "A consult request.",
      text: "Send the calendar invite within one working day; the visitor was told it would come. Reply to this email to reach them.",
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
      text: "You asked for {slot} ({timeZone}), thirty minutes. A calendar invite follows within one working day, and the people who would do the work will be on the call. If the time does not suit, reply to this email.",
    },
    brief: {
      subject: "Your brief · Hopsig",
      eyebrow: "Brief",
      title: "We will read it today.",
      text: "A reply comes inside one working day. If we are not the right people, we will say who is.",
    },
  },
} satisfies Emails;
