import { Fragment } from "react";

const TOKEN = /(\[[A-Z][^\]\n<>"]{0,60}\])/g;

/** Site-wide token substitution (lib/tokens.ts makeFill); `email` is the Site settings email once set. */
export type Fill = ((s: string | null | undefined) => string) & { email?: string | null };

/** Plain text with the site email, wherever it appears, as a mailto link. */
export function EmailLinked({ text, email }: { text: string; email?: string | null }) {
  if (!email || !text.includes(email)) return <>{text}</>;
  const parts = text.split(email);
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>
          {i ? <a href={`mailto:${email}`}>{email}</a> : null}
          {p}
        </Fragment>
      ))}
    </>
  );
}

/**
 * Copy after site-wide substitution, with any placeholder that is still bracketed set apart the way the reference
 * marks it: `tok` (text colour, as on /approach) or `phx` (mono accent, as on /working-with-us). The site email
 * becomes a mailto link.
 */
export function Filled({ text, fill, mark = "tok" }: { text: string; fill: Fill; mark?: "tok" | "phx" }) {
  const parts = fill(text).split(TOKEN);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 ? (
          <span key={i} className={mark}>
            {p}
          </span>
        ) : (
          <EmailLinked key={i} text={p} email={fill.email} />
        ),
      )}
    </>
  );
}
