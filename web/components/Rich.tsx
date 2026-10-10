import Link from "next/link";
import { PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity";
import type { Fill } from "./Filled";

const TOKEN = /(\[[A-Z][^\]\n<>"]{0,60}\])/g;

type Span = { _type: string; _key: string; text?: string; marks?: string[] };
type Block = PortableTextBlock & { children?: Span[] };

/**
 * Portable Text (Sanity content, or static rich strings converted by lib/portable.ts) with the site's marks:
 * bold, italic, links. Span text goes through `fill`, and any placeholder still bracketed gets the `mark` class
 * (phx = mono accent, as the reference shows "[ADD THE NUMBER]"). `inline` renders blocks without <p>.
 */
/** Any Portable Text array: Sanity query results (stega-typed) or lib/portable.ts output. */
type Value = ReadonlyArray<{ _type: string; _key: string }> | null | undefined;

export function Rich({ value, fill, mark = "phx", inline = false }: { value: Value; fill: Fill; mark?: "phx" | "tok"; inline?: boolean }) {
  if (!value?.length) return null;
  const prepared = (value as unknown as Block[]).map((b) => {
    if (b._type !== "block" || !b.children) return b;
    const children: Span[] = [];
    for (const c of b.children) {
      if (c._type !== "span") {
        children.push(c);
        continue;
      }
      fill(c.text ?? "")
        .split(TOKEN)
        .forEach((part, i) => {
          if (!part) return;
          children.push({ ...c, _key: `${c._key}-${i}`, text: part, marks: i % 2 ? [...(c.marks ?? []), "__token"] : c.marks });
        });
    }
    return { ...b, children };
  });
  const components: PortableTextComponents = {
    block: inline ? { normal: ({ children }) => <>{children}</> } : undefined,
    marks: {
      strong: ({ children }) => <b>{children}</b>,
      em: ({ children }) => <i>{children}</i>,
      link: ({ children, value: v }) => {
        const href = (v as { href?: string })?.href ?? "#";
        return href.startsWith("/") ? <Link href={href as never}>{children}</Link> : <a href={href}>{children}</a>;
      },
      __token: ({ children }) => <span className={mark}>{children}</span>,
    },
  };
  return <PortableText value={prepared as PortableTextBlock[]} components={components} />;
}
