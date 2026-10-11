import Link from "next/link";
import { PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity";
import { anchorId } from "@/lib/anchor";
import type { Fill } from "./Filled";

const TOKEN = /(\[[A-Z][^\]\n<>"]{0,60}\])/g;

type Span = { _type: string; _key: string; text?: string; marks?: string[] };
type Block = PortableTextBlock & { children?: Span[] };

/**
 * Portable Text (Sanity content, or static rich strings converted by lib/portable.ts) with the site's marks:
 * bold, italic, links. Span text goes through `fill`, and any placeholder still bracketed gets the `mark` class
 * (phx = mono accent, as the reference shows "[ADD THE NUMBER]"; none = plain text). `inline` renders blocks without <p>.
 */
/** Any Portable Text array: Sanity query results (stega-typed) or lib/portable.ts output. */
type Value = ReadonlyArray<{ _type: string; _key?: string }> | null | undefined;

export function Rich({
  value,
  fill,
  mark = "phx",
  inline = false,
  anchors = false,
}: {
  value: Value;
  fill: Fill;
  mark?: "phx" | "tok" | "none";
  inline?: boolean;
  /** Give each h2 an id (lib/anchor.ts) so a contents list can link to it. */
  anchors?: boolean;
}) {
  if (!value?.length) return null;
  const prepared = (value as unknown as Block[]).map((b) => {
    if (b._type !== "block" || !b.children) return b;
    const children: Span[] = [];
    for (const c of b.children) {
      if (c._type !== "span") {
        children.push(c);
        continue;
      }
      // The site email becomes a mailto link; a placeholder still bracketed gets the `mark` class (unless "none",
      // where the text stays one node).
      const email = fill.email;
      const pieces: [string, string | null][] = [];
      (email ? fill(c.text ?? "").split(email) : [fill(c.text ?? "")]).forEach((seg, k) => {
        if (k && email) pieces.push([email, "__email"]);
        if (mark === "none") pieces.push([seg, null]);
        else seg.split(TOKEN).forEach((part, i) => pieces.push([part, i % 2 ? "__token" : null]));
      });
      pieces
        .filter(([text]) => text)
        .forEach(([text, extra], i) => {
          children.push({ ...c, _key: `${c._key}-${i}`, text, marks: extra ? [...(c.marks ?? []), extra] : c.marks });
        });
    }
    return { ...b, children };
  });
  const components: PortableTextComponents = {
    block: inline
      ? { normal: ({ children }) => <>{children}</> }
      : anchors
        ? {
            h2: ({ children, value: v }) => (
              <h2 id={anchorId(((v as Block).children ?? []).map((c) => c.text ?? "").join(""))}>{children}</h2>
            ),
          }
        : undefined,
    marks: {
      strong: ({ children }) => <b>{children}</b>,
      em: ({ children }) => <i>{children}</i>,
      link: ({ children, value: v }) => {
        const href = (v as { href?: string })?.href ?? "#";
        return href.startsWith("/") ? <Link href={href as never}>{children}</Link> : <a href={href}>{children}</a>;
      },
      __token: ({ children }) => (mark === "none" ? <>{children}</> : <span className={mark}>{children}</span>),
      __email: ({ children }) => <a href={`mailto:${fill.email}`}>{children}</a>,
    },
  };
  return <PortableText value={prepared as PortableTextBlock[]} components={components} />;
}
