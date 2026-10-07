import type { Column, Table, VisibilityState } from "@tanstack/react-table"
import type { DataTableColumnMeta, TranslateFn, ViewOptionsColumnItem, ViewOptionsDraft } from "./view-options-types"

import { STICKY_COLUMN_IDS } from "../column"
import { LOCKED_COLUMN_IDS } from "./view-options-constants"

/** Turn `userEmail` / `user_email` into a readable fallback label. */
export function humanizeColumnId(id: string): string {
  const spaced = id
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
  if (!spaced) {
    return id
  }
  return spaced.replace(/\b\w/g, (char) => char.toUpperCase())
}

function readColumnMeta(column: Column<unknown, unknown>): DataTableColumnMeta | undefined {
  return column.columnDef.meta as DataTableColumnMeta | undefined
}

/**
 * Resolve a display label for View Options.
 * Prefers `meta.labelKey` (translated), then `meta.label`, string header, then humanized id.
 */
export function resolveColumnLabel(column: Column<unknown, unknown>, t: TranslateFn): string {
  const meta = readColumnMeta(column)

  if (meta?.labelKey) {
    if (t.has?.(meta.labelKey)) {
      return t(meta.labelKey)
    }
    if (!t.has) {
      try {
        return t(meta.labelKey)
      } catch {
        // Missing translation key — fall through.
      }
    }
  }

  if (meta?.label) {
    return meta.label
  }

  const header = column.columnDef.header
  if (typeof header === "string" && header.trim()) {
    return header
  }

  return humanizeColumnId(column.id)
}

/** Leaf columns that participate in the view-options checklist. */
export function getViewOptionsColumns<TData>(
  table: Table<TData>,
  t: TranslateFn,
): { alwaysOn: ViewOptionsColumnItem[]; optional: ViewOptionsColumnItem[] } {
  const alwaysOn: ViewOptionsColumnItem[] = []
  const optional: ViewOptionsColumnItem[] = []

  for (const column of table.getAllLeafColumns()) {
    if (!column.id) {
      continue
    }

    const item: ViewOptionsColumnItem = {
      id: column.id,
      label: resolveColumnLabel(column as Column<unknown, unknown>, t),
      canHide: column.getCanHide(),
    }

    if (item.canHide) {
      optional.push(item)
    } else {
      alwaysOn.push(item)
    }
  }

  return { alwaysOn, optional }
}

function getHideableColumnIds<TData>(table: Table<TData>): string[] {
  return table
    .getAllLeafColumns()
    .filter((column) => column.id && column.getCanHide())
    .map((column) => column.id)
}

/** Merge stored order with current hideable columns (append new, drop removed). */
export function mergeColumnOrder(knownIds: readonly string[], storedOrder: readonly string[]): string[] {
  const known = new Set(knownIds)
  const result: string[] = []

  for (const id of storedOrder) {
    if (known.has(id)) {
      result.push(id)
    }
  }

  for (const id of knownIds) {
    if (!result.includes(id)) {
      result.push(id)
    }
  }

  return result
}

/**
 * Hideable column ids that are pinned, in table pinning order.
 * Do not use {@link mergeColumnOrder} here — that helper appends every known id and would
 * mark every column as pinned when only a subset is pinned.
 */
export function extractPinnedHideableIds(
  pinningLeft: readonly string[] | undefined,
  hideableIds: readonly string[],
): string[] {
  const hideable = new Set(hideableIds)
  return (pinningLeft ?? []).filter((id) => hideable.has(id))
}

/**
 * Reconstruct the column-manager order from TanStack physical `columnOrder`.
 * Pinned hideable columns are rendered before unpinned ones; this merges those groups
 * back into a single hideable sequence (user interleaving is restored from storage).
 */
export function extractHideableOrderFromTable(
  columnOrder: readonly string[],
  hideableIds: readonly string[],
  pinnedLeft: readonly string[],
): string[] {
  if (columnOrder.length === 0) {
    return [...hideableIds]
  }

  const pinnedSet = new Set(pinnedLeft)
  const physicalHideable = columnOrder.filter((id) => hideableIds.includes(id))
  const pinned = physicalHideable.filter((id) => pinnedSet.has(id))
  const unpinned = physicalHideable.filter((id) => !pinnedSet.has(id))

  return mergeColumnOrder(hideableIds, [...pinned, ...unpinned])
}

/** Snapshot hideable visibility, order, and pins into draft state. */
export function createViewOptionsDraft<TData>(table: Table<TData>): ViewOptionsDraft {
  const hideableIds = getHideableColumnIds(table)
  const visibility: Record<string, boolean> = {}

  for (const column of table.getAllLeafColumns()) {
    if (!column.getCanHide()) {
      continue
    }
    visibility[column.id] = column.getIsVisible()
  }

  const { columnOrder, columnPinning } = table.getState()
  const pinnedLeft = extractPinnedHideableIds(columnPinning.left, hideableIds)
  const order = extractHideableOrderFromTable(columnOrder, hideableIds, pinnedLeft)

  return { visibility, order, pinnedLeft }
}

/** All hideable columns visible with default order and no pins. */
export function createDefaultViewOptionsDraft(optionalIds: readonly string[]): ViewOptionsDraft {
  const visibility: Record<string, boolean> = {}
  for (const id of optionalIds) {
    visibility[id] = true
  }
  return { visibility, order: [...optionalIds], pinnedLeft: [] }
}

/** Convert draft visibility → VisibilityState for table + storage. */
export function draftToVisibilityState(draft: ViewOptionsDraft): VisibilityState {
  const visibility: VisibilityState = {}
  for (const [id, visible] of Object.entries(draft.visibility)) {
    visibility[id] = visible
  }
  return visibility
}

export function countVisibleInDraft(draft: ViewOptionsDraft): { visible: number; total: number } {
  const ids = Object.keys(draft.visibility)
  const visible = ids.filter((id) => draft.visibility[id]).length
  return { visible, total: ids.length }
}

export function filterOptionalColumns(
  columns: readonly ViewOptionsColumnItem[],
  query: string,
): ViewOptionsColumnItem[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return [...columns]
  }
  return columns.filter((column) => column.label.toLowerCase().includes(normalized))
}

/** Order optional columns according to the draft order. */
export function orderOptionalColumns(
  columns: readonly ViewOptionsColumnItem[],
  order: readonly string[],
): ViewOptionsColumnItem[] {
  const byId = new Map(columns.map((column) => [column.id, column]))
  const ordered: ViewOptionsColumnItem[] = []

  for (const id of order) {
    const column = byId.get(id)
    if (column) {
      ordered.push(column)
      byId.delete(id)
    }
  }

  for (const column of byId.values()) {
    ordered.push(column)
  }

  return ordered
}

/** Build TanStack `columnOrder` from preferences and known column ids. */
export function buildColumnOrder(
  columnIds: readonly string[],
  preferences: Pick<ViewOptionsDraft, "order" | "pinnedLeft">,
  fixedAfterSelectIds: readonly string[] = [],
): string[] {
  const fixedAfterSelect = fixedAfterSelectIds.filter((id) => columnIds.includes(id))
  const fixedAfterSelectSet = new Set(fixedAfterSelect)
  const fixedLeft = [STICKY_COLUMN_IDS.SELECT, STICKY_COLUMN_IDS.EXPAND, ...fixedAfterSelect].filter((id) =>
    columnIds.includes(id),
  )
  const fixedRight = [STICKY_COLUMN_IDS.ACTIONS].filter((id) => columnIds.includes(id))
  const hideableIds = columnIds.filter((id) => !LOCKED_COLUMN_IDS.has(id) && !fixedAfterSelectSet.has(id))
  const orderedMiddle = mergeColumnOrder(hideableIds, preferences.order)
  const pinnedSet = new Set(preferences.pinnedLeft)
  const pinned = orderedMiddle.filter((id) => pinnedSet.has(id))
  const unpinned = orderedMiddle.filter((id) => !pinnedSet.has(id))

  return [...fixedLeft, ...pinned, ...unpinned, ...fixedRight]
}

/** Build TanStack `columnPinning` from preferences and known column ids. */
export function buildColumnPinning(
  columnIds: readonly string[],
  preferences: Pick<ViewOptionsDraft, "pinnedLeft">,
  fixedAfterSelectIds: readonly string[] = [],
): { left: string[]; right: string[] } {
  const fixedAfterSelect = fixedAfterSelectIds.filter((id) => columnIds.includes(id))
  const fixedAfterSelectSet = new Set(fixedAfterSelect)
  const fixedLeft = [STICKY_COLUMN_IDS.SELECT, STICKY_COLUMN_IDS.EXPAND, ...fixedAfterSelect].filter((id) =>
    columnIds.includes(id),
  )
  const fixedRight = [STICKY_COLUMN_IDS.ACTIONS].filter((id) => columnIds.includes(id))
  const pinnedData = preferences.pinnedLeft.filter(
    (id) => columnIds.includes(id) && !LOCKED_COLUMN_IDS.has(id) && !fixedAfterSelectSet.has(id),
  )

  return {
    left: [...fixedLeft, ...pinnedData],
    right: fixedRight,
  }
}

/** Collect non-hideable column ids that are not system-locked (e.g. master code columns). */
export function getFixedAfterSelectColumnIds(
  columns: readonly { id?: unknown; accessorKey?: unknown; enableHiding?: boolean }[],
): string[] {
  const ids: string[] = []

  for (const column of columns) {
    if (column.enableHiding !== false) {
      continue
    }

    const id =
      typeof column.id === "string" && column.id
        ? column.id
        : typeof column.accessorKey === "string" && column.accessorKey
          ? column.accessorKey
          : null

    if (id && !LOCKED_COLUMN_IDS.has(id) && !ids.includes(id)) {
      ids.push(id)
    }
  }

  return ids
}

/** Same as {@link getFixedAfterSelectColumnIds} from a live table instance. */
export function getFixedAfterSelectColumnIdsFromTable<TData>(table: Table<TData>): string[] {
  return table
    .getAllLeafColumns()
    .filter((column) => column.id && !column.getCanHide() && !LOCKED_COLUMN_IDS.has(column.id))
    .map((column) => column.id)
}

/** Stable column ids from column defs (for storage merge before table exists). */
export function getColumnIdsFromDefs(columns: readonly { id?: unknown; accessorKey?: unknown }[]): string[] {
  const ids: string[] = []
  for (const column of columns) {
    if (typeof column.id === "string" && column.id) {
      ids.push(column.id)
      continue
    }
    if (typeof column.accessorKey === "string" && column.accessorKey) {
      ids.push(column.accessorKey)
    }
  }
  return ids
}

function readColumnDefMeta(column: { meta?: unknown }): DataTableColumnMeta | undefined {
  return column.meta as DataTableColumnMeta | undefined
}

/** Collect column ids marked with `meta.pinnedByDefault` in definition order. */
export function getInitialPinnedLeftFromDefs(
  columns: readonly { id?: unknown; accessorKey?: unknown; meta?: unknown }[],
): string[] {
  const pinnedLeft: string[] = []

  for (const column of columns) {
    const meta = readColumnDefMeta(column)
    if (!meta?.pinnedByDefault) {
      continue
    }

    const id =
      typeof column.id === "string" && column.id
        ? column.id
        : typeof column.accessorKey === "string" && column.accessorKey
          ? column.accessorKey
          : null

    if (id && !LOCKED_COLUMN_IDS.has(id) && !pinnedLeft.includes(id)) {
      pinnedLeft.push(id)
    }
  }

  return pinnedLeft
}

/** Resolve default pinned columns from an explicit prop or column meta. */
export function resolveInitialPinnedLeft(
  columns: readonly { id?: unknown; accessorKey?: unknown; meta?: unknown }[],
  columnIds: readonly string[],
  initialPinnedLeft?: string[],
): string[] {
  const hideableIds = new Set(columnIds.filter((id) => !LOCKED_COLUMN_IDS.has(id)))
  const source = initialPinnedLeft ?? getInitialPinnedLeftFromDefs(columns)

  return source.filter((id) => hideableIds.has(id))
}
