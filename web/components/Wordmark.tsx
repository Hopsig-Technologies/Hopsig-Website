/** "Hopsig" + mono "Technologies", the lockup from generator/lockup.py. `size` is the wordmark's font size;
 *  the mono part and the gap scale with it (header 26, footer 20). */
export function Wordmark({ size }: { size: number }) {
  return (
    <span className="wm" style={{ display: "inline-flex", alignItems: "baseline", gap: size * 0.38, lineHeight: 1, whiteSpace: "nowrap" }}>
      <span style={{ fontSize: size, fontWeight: 600, letterSpacing: "-0.045em", lineHeight: 1 }}>
        <span style={{ color: "var(--text)" }}>Hop</span>
        <span style={{ color: "var(--acc)" }}>sig</span>
      </span>
      <span
        className="wm-t"
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 500,
          fontSize: size * 0.54,
          letterSpacing: "0.06em",
          lineHeight: 1,
          textTransform: "uppercase",
          color: "var(--text)",
        }}
      >
        Technologies
      </span>
    </span>
  );
}
