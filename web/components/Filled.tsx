import { Fragment } from "react";

const TOKEN = /(\[[A-Z][^\]\n<>"]{0,60}\])/g;

export type Fill = (s: string | null | undefined) => string;

/**
 * Copy after site-wide substitution, with any placeholder that is still bracketed set apart the way the reference
 * marks it: `tok` (text colour, as on /approach) or `phx` (mono accent, as on /working-with-us).
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
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}
