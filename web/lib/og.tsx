import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const font = (file: string) => readFile(join(process.cwd(), "lib", "og", file));

/**
 * The share image every page uses (opengraph-image files): the dark ground, the wordmark, the page's keyword as a
 * Lime eyebrow, its headline, and, where the page has one from the record, a single metric. Tokens only.
 */
export async function ogImage({ eyebrow, title, metric }: { eyebrow?: string; title: string; metric?: { value: string; label: string } }) {
  const [grotesk, mono] = await Promise.all([font("SpaceGrotesk-600.ttf"), font("IBMPlexMono-500.ttf")]);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", background: "#0E1116", color: "#E7ECEF", fontFamily: "Grotesk" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontSize: 40, letterSpacing: "-0.045em" }}>
            Hop<span style={{ color: "#C6F24E" }}>sig</span>
          </span>
          <span style={{ fontFamily: "Mono", fontSize: 18, letterSpacing: "0.12em", color: "#939A96" }}>TECHNOLOGIES</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {eyebrow ? (
            <div style={{ fontFamily: "Mono", fontSize: 22, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C6F24E" }}>{eyebrow}</div>
          ) : null}
          <div style={{ fontSize: title.length > 60 ? 56 : 72, lineHeight: 1.04, letterSpacing: "-0.045em", maxWidth: 1000 }}>{title}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid #262C34", paddingTop: 24 }}>
          {metric ? (
            <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
              <span style={{ fontSize: 44, letterSpacing: "-0.045em" }}>{metric.value}</span>
              <span style={{ fontFamily: "Mono", fontSize: 18, color: "#939A96", maxWidth: 640 }}>{metric.label}</span>
            </div>
          ) : (
            <span style={{ fontFamily: "Mono", fontSize: 18, letterSpacing: "0.12em", color: "#939A96" }}>YOU THINK IT. WE FINISH IT.</span>
          )}
          <span style={{ fontFamily: "Mono", fontSize: 18, color: "#939A96" }}>hopsig.com</span>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Grotesk", data: grotesk, weight: 600, style: "normal" },
        { name: "Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}
