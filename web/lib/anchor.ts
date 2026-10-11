import { stegaClean } from "next-sanity";

/** A stable id for a heading ("What goes in" -> "what-goes-in"), the same on the server and in the contents list. */
export const anchorId = (text: string) =>
  (stegaClean(text) ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
