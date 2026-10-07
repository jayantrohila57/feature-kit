export type JsonParseResult = { ok: true; data: unknown } | { ok: false; error: string; isEmpty: boolean }

export function parseJsonTreeValue(value: string | object | null | undefined): JsonParseResult {
  if (value == null) {
    return { ok: false, error: "empty", isEmpty: true }
  }

  if (typeof value === "object") {
    return { ok: true, data: value }
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return { ok: false, error: "empty", isEmpty: true }
  }

  try {
    return { ok: true, data: JSON.parse(trimmed) as unknown }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON"
    return { ok: false, error: message, isEmpty: false }
  }
}

export function formatJsonTreePrimitive(value: unknown): string {
  if (value === null) return "null"
  if (value === undefined) return "undefined"
  if (typeof value === "string") return JSON.stringify(value)
  return String(value)
}

export function jsonTreeChildCount(value: unknown): number | null {
  if (Array.isArray(value)) return value.length
  if (value !== null && typeof value === "object") return Object.keys(value).length
  return null
}
