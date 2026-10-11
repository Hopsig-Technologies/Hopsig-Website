const LONG = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** "22 July 2026": the date style on Notes (rule 7, amended 2026-10-11). Rendered on the server only. */
export const longDate = (iso: string | null | undefined) => (iso ? LONG.format(new Date(iso)) : "");
