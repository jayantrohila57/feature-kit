"use client"
// Reads column visibility off the stable, in-place mutating TanStack table instance during render.
"use no memo"

import { useDataTableContext } from "../core"
import { findFilterDefinitionByKey, getAppliedOptionFilterKeys, resolveVisibleFilterChipKeys } from "../filter"
import { DataTableToolbarFilterChip } from "./toolbar-filter-chip"
import { DataTableToolbarFilterChipSkeleton } from "./toolbar-filter-chip-skeleton"
import { getToolbarFilterDefinitions } from "./utils"

/**
 * Toolbar chip row: user-added keys (localStorage), then keys with applied values, limited to
 * fields whose column is hidden (visible columns filter from their header). Pinned keys only
 * control removability, not visibility. Before preferences hydrate, applied keys render as
 * skeleton chips (same footprint).
 */
export function DataTableToolbarFilterChips<TData>() {
  const {
    table,
    filterDefinitions = [],
    filters,
    columnSearch,
    addedFilterKeys = [],
    pinnedFilterKeys = [],
    filtersMounted = true,
    headerFilters = true,
  } = useDataTableContext<TData>()

  const candidates = getToolbarFilterDefinitions(filterDefinitions, table, headerFilters)
  const candidateKeys = candidates.map((definition) => definition.key)
  const appliedSearchKeys = candidates
    .filter((definition) => definition.search && (columnSearch?.[definition.key]?.trim() ?? "") !== "")
    .map((definition) => definition.key)
  const appliedKeys = [...getAppliedOptionFilterKeys(filterDefinitions, filters), ...appliedSearchKeys]

  if (!filtersMounted) {
    const pendingKeys = resolveVisibleFilterChipKeys({
      definitions: filterDefinitions,
      addedKeys: [],
      appliedKeys,
      pinnedKeys: pinnedFilterKeys,
      candidateKeys,
    })
    if (pendingKeys.length === 0) {
      return null
    }
    return (
      <div className="flex h-10 shrink-0 items-center gap-2">
        {pendingKeys.map((key) => (
          <DataTableToolbarFilterChipSkeleton key={key} />
        ))}
      </div>
    )
  }

  const visibleKeys = resolveVisibleFilterChipKeys({
    definitions: filterDefinitions,
    addedKeys: addedFilterKeys,
    appliedKeys,
    pinnedKeys: pinnedFilterKeys,
    candidateKeys,
  })
  if (visibleKeys.length === 0) {
    return null
  }

  return (
    <div className="flex h-10 shrink-0 flex-wrap items-center gap-2">
      {visibleKeys.map((key) => {
        const definition = findFilterDefinitionByKey(filterDefinitions, key)
        if (!definition) {
          return null
        }
        return (
          <DataTableToolbarFilterChip
            key={key}
            definition={definition}
            removable={false}
          />
        )
      })}
    </div>
  )
}
