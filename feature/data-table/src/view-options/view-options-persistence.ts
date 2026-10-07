import type { VisibilityState } from "@tanstack/react-table"
import type { StoredColumnPreferences } from "./view-options-types"

import {
  LOCKED_COLUMN_IDS,
  VIEW_OPTIONS_STORAGE_KEY_PREFIX,
  VIEW_OPTIONS_STORAGE_KEY_PREFIX_V1,
} from "./view-options-constants"
import { mergeColumnOrder } from "./view-options-utils"

export function getViewOptionsStorageKey(tableId: string): string {
  return `${VIEW_OPTIONS_STORAGE_KEY_PREFIX}${tableId}`
}

function getViewOptionsStorageKeyV1(tableId: string): string {
  return `${VIEW_OPTIONS_STORAGE_KEY_PREFIX_V1}${tableId}`
}

function isVisibilityState(value: unknown): value is VisibilityState {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false
  }

  for (const entry of Object.values(value)) {
    if (typeof entry !== "boolean") {
      return false
    }
  }

  return true
}

function parseStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined
  }

  return value.filter((entry): entry is string => typeof entry === "string" && entry.length > 0)
}

function parseStoredPreferences(raw: unknown): StoredColumnPreferences | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return null
  }

  const record = raw as Record<string, unknown>

  if (isVisibilityState(record)) {
    return { visibility: record }
  }

  if (!isVisibilityState(record["visibility"])) {
    return null
  }

  const preferences: StoredColumnPreferences = {
    visibility: record["visibility"] as VisibilityState,
  }

  const order = parseStringArray(record["order"])
  if (order !== undefined) {
    preferences.order = order
  }

  const pinnedLeft = parseStringArray(record["pinnedLeft"])
  if (pinnedLeft !== undefined) {
    preferences.pinnedLeft = pinnedLeft
  }

  return preferences
}

function readRawPreferences(tableId: string): StoredColumnPreferences | null {
  if (typeof window === "undefined" || !tableId) {
    return null
  }

  try {
    const v2Raw = localStorage.getItem(getViewOptionsStorageKey(tableId))
    if (v2Raw) {
      return parseStoredPreferences(JSON.parse(v2Raw))
    }

    const v1Raw = localStorage.getItem(getViewOptionsStorageKeyV1(tableId))
    if (!v1Raw) {
      return null
    }

    return parseStoredPreferences(JSON.parse(v1Raw))
  } catch {
    return null
  }
}

/**
 * Read stored column preferences for a table.
 * Returns `null` when missing, invalid, or storage is unavailable.
 */
export function readStoredColumnPreferences(tableId: string): StoredColumnPreferences | null {
  return readRawPreferences(tableId)
}

/** @deprecated Use `readStoredColumnPreferences`. */
export function readStoredColumnVisibility(tableId: string): VisibilityState | null {
  return readStoredColumnPreferences(tableId)?.visibility ?? null
}

/** Persist column preferences for a table. No-ops on failure. */
export function writeStoredColumnPreferences(tableId: string, preferences: StoredColumnPreferences): void {
  if (typeof window === "undefined" || !tableId) {
    return
  }

  try {
    localStorage.setItem(getViewOptionsStorageKey(tableId), JSON.stringify(preferences))
    localStorage.removeItem(getViewOptionsStorageKeyV1(tableId))
  } catch {
    // Quota exceeded, private browsing, or disabled storage.
  }
}

/** @deprecated Use `writeStoredColumnPreferences`. */
export function writeStoredColumnVisibility(tableId: string, visibility: VisibilityState): void {
  writeStoredColumnPreferences(tableId, { visibility })
}

/**
 * Keep only visibility entries for known column ids.
 * Unknown ids (removed columns) are dropped.
 */
export function mergeStoredVisibility(stored: VisibilityState | null, columnIds: readonly string[]): VisibilityState {
  if (!stored) {
    return {}
  }

  const allowed = new Set(columnIds)
  const result: VisibilityState = {}
  for (const [id, visible] of Object.entries(stored)) {
    if (allowed.has(id) && typeof visible === "boolean") {
      result[id] = visible
    }
  }
  return result
}

function getHideableColumnIds(columnIds: readonly string[]): string[] {
  return columnIds.filter((id) => !LOCKED_COLUMN_IDS.has(id))
}

/** Merge stored preferences with known column ids. */
export function mergeStoredPreferences(
  stored: StoredColumnPreferences | null,
  columnIds: readonly string[],
): StoredColumnPreferences {
  const hideableIds = getHideableColumnIds(columnIds)
  const visibility = mergeStoredVisibility(stored?.visibility ?? null, hideableIds)
  const order = mergeColumnOrder(hideableIds, stored?.order ?? hideableIds)
  const pinnedLeft = (stored?.pinnedLeft ?? []).filter((id) => hideableIds.includes(id) && order.includes(id))

  return { visibility, order, pinnedLeft }
}

/** Merge table defaults with stored visibility. Stored wins; defaults apply for columns missing from storage. */
export function mergeDefaultColumnVisibility(
  defaults: VisibilityState,
  stored: VisibilityState | null,
  columnIds: readonly string[],
): VisibilityState {
  const result: VisibilityState = {}

  for (const id of columnIds) {
    if (stored && id in stored) {
      const storedValue = stored[id]
      if (typeof storedValue === "boolean") {
        result[id] = storedValue
      }
      continue
    }

    if (id in defaults) {
      const defaultValue = defaults[id]
      if (typeof defaultValue === "boolean") {
        result[id] = defaultValue
      }
    }
  }

  return result
}

export type ResolvedColumnPreferences = {
  visibility: VisibilityState
  order: string[]
  pinnedLeft: string[]
}

export type ColumnPreferenceDefaults = {
  visibility?: VisibilityState
  pinnedLeft?: string[]
}

/** Resolve initial preferences from storage and defaults. Client-only — call after mount. */
export function resolveInitialColumnPreferences(
  tableId: string | undefined,
  columnIds: readonly string[],
  defaults: ColumnPreferenceDefaults = {},
): ResolvedColumnPreferences {
  const hideableIds = getHideableColumnIds(columnIds)
  const defaultPinnedLeft = (defaults.pinnedLeft ?? []).filter(
    (id) => hideableIds.includes(id) && !LOCKED_COLUMN_IDS.has(id),
  )

  if (!tableId) {
    return {
      visibility: defaults.visibility ?? {},
      order: hideableIds,
      pinnedLeft: defaultPinnedLeft,
    }
  }

  const rawStored = readStoredColumnPreferences(tableId)
  const stored = mergeStoredPreferences(rawStored, columnIds)
  const visibility = mergeDefaultColumnVisibility(defaults.visibility ?? {}, stored.visibility, hideableIds)
  const pinnedLeft = rawStored && "pinnedLeft" in rawStored ? (stored.pinnedLeft ?? []) : defaultPinnedLeft

  return {
    visibility,
    order: stored.order ?? hideableIds,
    pinnedLeft,
  }
}

/** @deprecated Use `resolveInitialColumnPreferences`. */
export function resolveInitialColumnVisibility(
  tableId: string | undefined,
  columnIds: readonly string[],
  defaults: VisibilityState = {},
): VisibilityState {
  return resolveInitialColumnPreferences(tableId, columnIds, { visibility: defaults }).visibility
}
