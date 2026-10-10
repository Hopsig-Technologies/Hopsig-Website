/**
 * Site-wide tokens (CLAUDE.md, "Site-wide tokens are substituted at render"). Mirrors SITE_TOKENS in
 * studio/schemaTypes/singletons/site.ts. A token is replaced only when its Site settings field is filled; an empty
 * field leaves the bracketed placeholder visible (rule 1). No other token is ever substituted.
 */
export const SITE_TOKENS = {
  companyRegNo: "[COMPANY REG NO.]",
  year: "[YEAR]",
  email: "[HELLO@HOPSIG.COM]",
  legalForm: "[LEGAL FORM]",
  address: "[ADDRESS]",
  vatStatus: "[VAT / TAX STATUS]",
  bankCountry: "[BANK COUNTRY]",
  dayRate: "[YOUR RATE]",
  monthlyRetainer: "[MONTHLY]",
  agencyDiscount: "[AGENCY DISCOUNT]",
  insurance: "[INSURER · COVER AMOUNT]",
} as const;

export type SiteValues = Partial<Record<keyof typeof SITE_TOKENS, string | number | null>>;

/** Build the substitution function once per request from the Site settings document. */
export function makeFill(values: SiteValues | null | undefined) {
  const pairs: [string, string][] = [];
  for (const k of Object.keys(SITE_TOKENS) as (keyof typeof SITE_TOKENS)[]) {
    const v = values?.[k];
    if (v === null || v === undefined || v === "") continue;
    pairs.push([SITE_TOKENS[k], typeof v === "number" ? v.toLocaleString("en-GB") : v]);
  }
  return function fill(text: string | null | undefined): string {
    if (!text) return "";
    let out = text;
    for (const [token, v] of pairs) out = out.split(token).join(v);
    return out;
  };
}
