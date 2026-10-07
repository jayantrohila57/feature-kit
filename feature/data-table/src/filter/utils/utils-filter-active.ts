import type {
  DataTableFilterActiveState,
  DataTableFilterAppliedState,
  DataTableFilterDefinition,
  DataTableSortingEntry,
} from "../filter-types"

/** Current sort direction for a definition's column, or `null`. */
export function resolveDefinitionSortDirection(
  definition: Pick<DataTableFilterDefinition, "columnId" | "sort">,
  sorting: readonly DataTableSortingEntry[],
): "asc" | "desc" | null {
  if (!definition.sort || !definition.columnId) {
    return null
  }
  const entry = sorting.find((item) => item.id === definition.columnId)
  if (!entry) {
    return null
  }
  return entry.desc ? "desc" : "asc"
}

/** Header click cycle: unsorted → ascending → descending → unsorted. */
export function cycleSortDirection(current: "asc" | "desc" | null): "asc" | "desc" | null {
  if (current === null) {
    return "asc"
  }
  return current === "asc" ? "desc" : null
}

/** Which capabilities of a definition currently hold applied state (URL or local). */
export function resolveFilterActiveState(
  definition: DataTableFilterDefinition,
  applied: DataTableFilterAppliedState,
): DataTableFilterActiveState {
  const search = definition.search && (applied.columnSearch?.[definition.key]?.trim() ?? "") !== ""
  const sort = resolveDefinitionSortDirection(definition, applied.sorting) !== null
  const options = definition.options !== null && (applied.filters?.[definition.key]?.length ?? 0) > 0
  const count = Number(search) + Number(sort) + Number(options)

  return { search, sort, options, any: count > 0, count }
}

/** Option-capable definition keys that currently have applied values. */
export function getAppliedOptionFilterKeys(
  definitions: readonly DataTableFilterDefinition[],
  filters: Record<string, string[]> | undefined,
): string[] {
  if (!filters) {
    return []
  }
  return definitions
    .filter((definition) => definition.options !== null && (filters[definition.key]?.length ?? 0) > 0)
    .map((definition) => definition.key)
}

/**
 * Chip keys to show in the toolbar: user-added (localStorage) in stored order, then any applied
 * keys not yet listed. `pinnedKeys` does not force visibility — it only marks chips non-removable
 * when they appear via added or applied state.
 */
export function resolveVisibleFilterChipKeys(input: {
  definitions: readonly DataTableFilterDefinition[]
  addedKeys: readonly string[]
  appliedKeys: readonly string[]
  /** Accepted for API stability; ignored for visibility (see toolbar chip removable flag). */
  pinnedKeys?: readonly string[]
  /** Keys allowed as chips. Defaults to every option-capable definition. */
  candidateKeys?: readonly string[]
}): string[] {
  const optionKeys = new Set(
    input.candidateKeys ??
      input.definitions.filter((definition) => definition.options !== null).map((definition) => definition.key),
  )
  const result: string[] = []
  const seen = new Set<string>()

  for (const key of [...input.addedKeys, ...input.appliedKeys]) {
    if (!optionKeys.has(key) || seen.has(key)) {
      continue
    }
    seen.add(key)
    result.push(key)
  }

  return result
}
