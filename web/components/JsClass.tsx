"use client";

import { useLayoutEffect } from "react";

/** The head script adds `js` to <html> before paint. In development React Strict Mode remounts <html> and drops
 *  attributes it does not manage, so set it again here (a no-op in production). */
export function JsClass() {
  useLayoutEffect(() => {
    document.documentElement.classList.add("js");
  }, []);
  return null;
}
