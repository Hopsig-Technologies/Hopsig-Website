import type {PortableTextBlock} from 'sanity'

/** Bracketed placeholder tokens, e.g. [YOUR RATE], [INSURER · COVER AMOUNT], [ADD p95 AND VOLUME]. Same pattern as
 *  scripts/check_bundle.py and the deploy check in CLAUDE.md. */
export const PLACEHOLDER = /\[[A-Z][^\]\n<>"]{0,60}\]/g

export function findPlaceholders(text: string): string[] {
  return text.match(PLACEHOLDER) ?? []
}

/** Plain text of a string or a Portable Text value (only span text, which is where tokens live). */
export function toPlain(value: unknown): string {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    return (value as PortableTextBlock[])
      .map((block) =>
        Array.isArray((block as {children?: unknown[]}).children)
          ? ((block as {children: {text?: string}[]}).children.map((c) => c.text ?? '').join(''))
          : '',
      )
      .join('\n')
  }
  return ''
}

/** Rule 1 ("never invent proof"): a field that still holds a placeholder gets a warning, never an error,
 *  because placeholders are meant to ship until the founders replace them. */
export function placeholderWarning(value: unknown): true | string {
  const tokens = findPlaceholders(toPlain(value))
  if (!tokens.length) return true
  return `Placeholder ${[...new Set(tokens)].join(', ')} — leave it until the real value is known. Never fill it from a guess.`
}
