import type { FieldErrors, FieldValues } from "react-hook-form"

function collectErrorPaths(errors: FieldErrors<FieldValues>, prefix = ""): string[] {
  const paths: string[] = []
  for (const [key, value] of Object.entries(errors)) {
    if (!value || typeof value !== "object") continue
    const path = prefix ? `${prefix}.${key}` : key
    if ("message" in value && value.message) {
      paths.push(path)
      continue
    }
    paths.push(...collectErrorPaths(value as FieldErrors<FieldValues>, path))
  }
  return paths
}

/** Focus the first invalid control by name attribute / id convention. */
export function focusFirstError(errors: FieldErrors<FieldValues>): void {
  const paths = collectErrorPaths(errors)
  const first = paths[0]
  if (!first) return

  const escaped = CSS.escape(first)
  const el =
    (document.querySelector(`[name="${escaped}"]`) as HTMLElement | null) ??
    (document.getElementById(first) as HTMLElement | null) ??
    (document.querySelector(`[data-field-name="${escaped}"]`) as HTMLElement | null)

  if (!el) return
  el.scrollIntoView({ block: "center", behavior: "smooth" })
  if (typeof el.focus === "function") {
    el.focus({ preventScroll: true })
  }
}
