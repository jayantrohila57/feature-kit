import type { ColumnDef } from "@tanstack/react-table"
import type { DataTableColumnMeta } from "../view-options"

import { normalizeColumnFilterMeta, readColumnDefId } from "../filter/utils/utils-filter-definitions"

/**
 * Collect option-filter URL keys declared on column meta (legacy `urlKey` or new `filter.key`).
 * Prefer `resolveFilterDefinitions` + `getFilterUrlKeysFromDefinitions` from `../filter`.
 */
export function getFilterUrlKeysFromDefs<TData, TValue>(columns: ColumnDef<TData, TValue>[]): string[] {
  const keys = new Set<string>()

  for (const column of columns) {
    const meta = column.meta as DataTableColumnMeta | undefined
    const filterMeta = normalizeColumnFilterMeta(meta?.filter)
    if (!filterMeta?.options) {
      continue
    }
    const key = filterMeta.key ?? readColumnDefId(column)
    if (key) {
      keys.add(key)
    }
  }

  return Array.from(keys)
}

export function isMultiColumnFilter(meta: DataTableColumnMeta | undefined): boolean {
  return normalizeColumnFilterMeta(meta?.filter)?.multi !== false
}

type SearchParamReader = Pick<URLSearchParams, "get" | "getAll">

/** Read filter values from URL search params (repeated keys or a single value). */
export function readFilterValuesFromSearchParams(searchParams: SearchParamReader, key: string): string[] {
  const values = searchParams
    .getAll(key)
    .map((value) => value.trim())
    .filter(Boolean)
  if (values.length > 0) {
    return values
  }

  const single = searchParams.get(key)?.trim()
  return single ? [single] : []
}

export function normalizeFilterParamValue(value: string | string[] | null | undefined): string[] {
  if (value == null) {
    return []
  }

  if (Array.isArray(value)) {
    return value.map((entry) => entry.trim()).filter(Boolean)
  }

  const trimmed = value.trim()
  return trimmed ? [trimmed] : []
}

export function haveSameFilterValues(left: string[], right: string[]): boolean {
  if (left.length !== right.length) {
    return false
  }

  const leftSorted = [...left].sort()
  const rightSorted = [...right].sort()
  return leftSorted.every((value, index) => value === rightSorted[index])
}
