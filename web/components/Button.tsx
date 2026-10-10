import Link from "next/link";
import type { ReactNode } from "react";

export type ButtonVariant = "lime" | "outline";

/** The two button styles. Colours come from the surrounding tone, so `lime` is Lime/Ink on dark and Ink/Paper on light. */
export function Button({
  href,
  variant = "lime",
  size = "md",
  onBg = false,
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  size?: "md" | "sm";
  /** Outline button filled with --bg (closing section, over the ring canvas). */
  onBg?: boolean;
  children: ReactNode;
}) {
  const cls = ["btn", `btn-${variant}`, size === "sm" ? "btn-sm" : "", onBg ? "on-bg" : ""].filter(Boolean).join(" ");
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
