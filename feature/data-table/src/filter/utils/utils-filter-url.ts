import type { DataTableFilterDefinition } from "../filter-types"

import { DATA_TABLE_CLEAR_FILTER_URL_KEYS } from "../../constants"
import { FILTER_COLUMN_SEARCH_PARAM_PREFIX, FILTER_RESERVED_URL_KEYS } from "../filter-constants"

type SearchParamReader = Pick<URLSearchParams, "get">

/** `cs.<key>` — URL param carrying a column-specific text search. */
export function columnSearchParamKey(key: string): string {
  return `${FILTER_COLUMN_SEARCH_PARAM_PREFIX}${key}`
}

/** Inverse of {@link columnSearchParamKey}; `null` when the param is not a column search. */
export function filterKeyFromColumnSearchParam(param: string): string | null {
  if (!param.startsWith(FILTER_COLUMN_SEARCH_PARAM_PREFIX)) {
    return null
  }
  const key = param.slice(FILTER_COLUMN_SEARCH_PARAM_PREFIX.length)
  return key.length > 0 ? key : null
}

/** Read non-empty `cs.<key>` values for the given keys. */
export function readColumnSearchFromSearchParams(
  searchParams: SearchParamReader,
  keys: readonly string[],
): Record<string, string> {
  const result: Record<string, string> = {}
  for (const key of keys) {
    const value = searchParams.get(columnSearchParamKey(key))?.trim()
    if (value) {
      result[key] = value
    }
  }
  return result
}

/** Keys of definitions that expose column search. */
export function getColumnSearchKeysFromDefinitions(definitions: readonly DataTableFilterDefinition[]): string[] {
  return definitions.filter((definition) => definition.search).map((definition) => definition.key)
}

/** Sort keys are only cleared when explicitly requested. */
const SORT_URL_KEYS = new Set<string>(["sortBy", "sortDir"])

/**
 * Every URL key "Clear filters" removes for a table: definition keys, their `cs.*` params,
 * global `q`, and the legacy shared list (minus sort unless `includeSort`).
 */
export function collectClearableFilterKeys(
  definitions: readonly DataTableFilterDefinition[],
  options: { includeSort?: boolean; extraKeys?: readonly string[] } = {},
): string[] {
  const keys = new Set<string>()

  for (const definition of definitions) {
    if (definition.options !== null) {
      keys.add(definition.key)
    }
    if (definition.search) {
      keys.add(columnSearchParamKey(definition.key))
    }
  }

  keys.add("q")

  for (const key of DATA_TABLE_CLEAR_FILTER_URL_KEYS) {
    keys.add(key)
  }

  for (const key of options.extraKeys ?? []) {
    keys.add(key)
  }

  for (const key of FILTER_RESERVED_URL_KEYS) {
    if (key === "q") {
      continue
    }
    if (SORT_URL_KEYS.has(key) && options.includeSort) {
      continue
    }
    keys.delete(key)
  }

  return Array.from(keys)
}
