import { normalizeFilterParamValue } from "../column/column-filter-utils"
import {
  DATA_TABLE_MAX_PAGE_SIZE,
  DATA_TABLE_MIN_PAGE_SIZE,
  type DataTablePageSize,
  DEFAULT_DATA_TABLE_PAGE_SIZE,
  isDataTablePageSize,
} from "../constants"
import { columnSearchParamKey } from "../filter/utils/utils-filter-url"

export function parsePageFromSearchParams(searchParams: URLSearchParams): number | null {
  const raw = searchParams.get("page")
  if (raw === null) {
    return null
  }

  const parsed = Number.parseInt(raw, 10)
  if (!Number.isFinite(parsed) || parsed < 1) {
    return null
  }

  return parsed
}

export function parseLimitFromSearchParams(searchParams: URLSearchParams): DataTablePageSize | null {
  const raw = searchParams.get("limit")
  if (raw === null) {
    return null
  }

  const parsed = Number.parseInt(raw, 10)
  if (!Number.isFinite(parsed) || parsed < DATA_TABLE_MIN_PAGE_SIZE || parsed > DATA_TABLE_MAX_PAGE_SIZE) {
    return null
  }

  return isDataTablePageSize(parsed) ? parsed : null
}

export function resolveTablePage(searchParams: URLSearchParams, fallbackPage: number): number {
  return Math.max(1, parsePageFromSearchParams(searchParams) ?? fallbackPage)
}

export function resolveTableLimit(
  searchParams: URLSearchParams,
  fallbackLimit: DataTablePageSize | null | undefined,
): DataTablePageSize {
  return parseLimitFromSearchParams(searchParams) ?? fallbackLimit ?? DEFAULT_DATA_TABLE_PAGE_SIZE
}

/** Apply a column/tab filter write and reset pagination to page 1. */
export function mutateTableFilter(
  params: URLSearchParams,
  key: string,
  value: string | string[] | null | undefined,
): void {
  const values = normalizeFilterParamValue(value)
  params.delete(key)
  for (const entry of values) {
    params.append(key, entry)
  }
  params.set("page", "1")
}

/** Apply pagination without clearing unrelated query keys. */
export function mutateTablePagination(params: URLSearchParams, page: number, limit: number): void {
  params.set("page", String(Math.max(1, page)))
  params.set("limit", String(limit))
}

/** Apply toolbar search and reset pagination to page 1. */
export function mutateTableSearch(params: URLSearchParams, q: string): void {
  const next = q.trim()
  if (next === "") {
    params.delete("q")
  } else {
    params.set("q", next)
  }
  params.set("page", "1")
}

/** Apply a column-specific text search (`cs.<key>`) and reset pagination to page 1. */
export function mutateTableColumnSearch(params: URLSearchParams, key: string, value: string | null | undefined): void {
  const paramKey = columnSearchParamKey(key)
  const next = value?.trim() ?? ""
  if (next === "") {
    params.delete(paramKey)
  } else {
    params.set(paramKey, next)
  }
  params.set("page", "1")
}

/** Apply sort keys and reset pagination to page 1. */
export function mutateTableSorting(
  params: URLSearchParams,
  sortBy: string | null | undefined,
  sortDir: "asc" | "desc" | null | undefined,
): void {
  if (sortBy) {
    params.set("sortBy", sortBy)
  } else {
    params.delete("sortBy")
  }

  if (sortDir) {
    params.set("sortDir", sortDir)
  } else {
    params.delete("sortDir")
  }

  params.set("page", "1")
}
