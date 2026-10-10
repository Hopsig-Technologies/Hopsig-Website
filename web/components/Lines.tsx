import { Fragment } from "react";

/** Copy where "\n" is a line break (hero and closing titles): rendered with <br>, as the reference does. */
export function Lines({ text }: { text: string }) {
  const parts = text.split("\n");
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>
          {i > 0 ? <br /> : null}
          {p}
        </Fragment>
      ))}
    </>
  );
}
