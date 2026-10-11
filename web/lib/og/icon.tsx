import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * The site icon (favicon, Apple touch icon): the wordmark's split in two letters, "H" in the text colour and "s" in
 * Lime, on an Ink rounded square. Derived from the wordmark (components/Wordmark.tsx); there is no separate logo mark.
 */
export async function siteIcon(px: number) {
  const grotesk = await readFile(join(process.cwd(), "lib", "og", "SpaceGrotesk-600.ttf"));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0E1116",
          borderRadius: px * 0.22,
          fontFamily: "Grotesk",
          fontSize: px * 0.62,
          letterSpacing: "-0.06em",
          lineHeight: 1,
          paddingBottom: px * 0.06,
        }}
      >
        <span style={{ color: "#E7ECEF" }}>H</span>
        <span style={{ color: "#C6F24E" }}>s</span>
      </div>
    ),
    { width: px, height: px, fonts: [{ name: "Grotesk", data: grotesk, weight: 600, style: "normal" }] },
  );
}
