/** Fill a template string from web/content/templates.ts: "Service {nn} · {name}" + { nn: "01", name: "…" }. */
export function tpl(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{([a-zA-Z]+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}

/** 1 → "01" (row indices, "Service 01"). */
export const nn = (i: number) => String(i).padStart(2, "0");
