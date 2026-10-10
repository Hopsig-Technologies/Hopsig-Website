import type { PortableTextBlock } from "next-sanity";
import type { LegalBlock, Rich } from "@/content/types";

/**
 * Static copy keeps a readable inline form — <b>, <i>, <a href="…">, "\n" for a line break — and is converted to
 * Portable Text here, so one renderer serves it and the Sanity content (notes, case "measured") alike.
 * A link in the output is `{_type: "link", href}`, the same shape as the Studio's link annotation.
 */

let n = 0;
const key = () => `s${(n++).toString(36)}`;

export function inlineToBlock(html: Rich, style = "normal", extra: Record<string, unknown> = {}): PortableTextBlock {
  const children: { _type: "span"; _key: string; text: string; marks: string[] }[] = [];
  const markDefs: { _type: "link"; _key: string; href: string }[] = [];
  const marks: string[] = [];
  const re = /<(\/?)(b|i|a)([^>]*)>/g;
  let last = 0;
  let m: RegExpExecArray | null;
  const push = (text: string) => {
    if (text) children.push({ _type: "span", _key: key(), text, marks: [...marks] });
  };
  while ((m = re.exec(html))) {
    push(html.slice(last, m.index));
    last = re.lastIndex;
    const [, close, tag, attrs] = m;
    if (close) marks.pop();
    else if (tag === "a") {
      const def = { _type: "link" as const, _key: key(), href: /href="([^"]*)"/.exec(attrs)?.[1] ?? "#" };
      markDefs.push(def);
      marks.push(def._key);
    } else marks.push(tag === "b" ? "strong" : "em");
  }
  push(html.slice(last));
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs,
    children: children.length ? children : [{ _type: "span", _key: key(), text: "", marks: [] }],
    ...extra,
  };
}

export const inlineToBlocks = (html: Rich): PortableTextBlock[] => [inlineToBlock(html)];

export function legalToBlocks(body: readonly LegalBlock[]): PortableTextBlock[] {
  return body.flatMap((b) => {
    if ("p" in b) return [inlineToBlock(b.p)];
    if ("ul" in b) return b.ul.map((item) => inlineToBlock(item, "normal", { listItem: "bullet", level: 1 }));
    return b.ol.map((item) => inlineToBlock(item, "normal", { listItem: "number", level: 1 }));
  });
}
