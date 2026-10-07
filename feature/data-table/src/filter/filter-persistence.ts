import type { StoredFilterPreferences } from "./filter-types"

import { FILTER_STORAGE_KEY_PREFIX } from "./filter-constants"

export function getFilterStorageKey(tableId: string): string {
  return `${FILTER_STORAGE_KEY_PREFIX}${tableId}`
}

function parseStoredFilterPreferences(raw: unknown): StoredFilterPreferences | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return null
  }

  const added = (raw as Record<string, unknown>)["added"]
  if (!Array.isArray(added)) {
    return null
  }

  return {
    added: added.filter((entry): entry is string => typeof entry === "string" && entry.length > 0),
  }
}

/**
 * Read stored filter visibility for a table.
 * Returns `null` when missing, invalid, or storage is unavailable. Client-only.
 */
export function readStoredFilterPreferences(tableId: string): StoredFilterPreferences | null {
  if (typeof window === "undefined" || !tableId) {
    return null
  }

  try {
    const raw = localStorage.getItem(getFilterStorageKey(tableId))
    if (!raw) {
      return null
    }
    return parseStoredFilterPreferences(JSON.parse(raw))
  } catch {
    return null
  }
}

/** Persist filter visibility for a table. No-ops on failure. Never stores applied values. */
export function writeStoredFilterPreferences(tableId: string, preferences: StoredFilterPreferences): void {
  if (typeof window === "undefined" || !tableId) {
    return
  }

  try {
    localStorage.setItem(getFilterStorageKey(tableId), JSON.stringify({ added: preferences.added }))
  } catch {
    // Quota exceeded, private browsing, or disabled storage.
  }
}

/** Keep only stored keys that still resolve to a definition (removed columns are dropped), preserving order. */
export function pruneStoredFilterKeys(added: readonly string[], knownKeys: readonly string[]): string[] {
  const known = new Set(knownKeys)
  const result: string[] = []
  for (const key of added) {
    if (known.has(key) && !result.includes(key)) {
      result.push(key)
    }
  }
  return result
}

/** Resolve initial added keys from storage, pruned to the current definitions. Client-only. */
export function resolveInitialAddedFilterKeys(tableId: string | undefined, knownKeys: readonly string[]): string[] {
  if (!tableId) {
    return []
  }
  const stored = readStoredFilterPreferences(tableId)
  return pruneStoredFilterKeys(stored?.added ?? [], knownKeys)
}

/** Build stored `added` keys in definition order from a checkbox selection. */
export function buildAddedFilterKeysFromSelection(
  selected: ReadonlySet<string>,
  knownKeysInOrder: readonly string[],
): string[] {
  return knownKeysInOrder.filter((key) => selected.has(key))
}
