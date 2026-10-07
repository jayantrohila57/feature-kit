"use client"
// Reads column visibility off the stable, in-place mutating TanStack table instance during render.
"use no memo"

import { ButtonGroup } from "@/packages/ui/components/button-group"

import { useDataTableContext } from "../core"
import { DataTableToolbarAddFilterMenu } from "./toolbar-add-filter-menu"
import { DataTableAppliedFilters } from "./toolbar-applied-filters"
import { getToolbarFilterDefinitions } from "./utils"

/** Funnel (applied filters) + Add filter as one attached control group. */
export function DataTableToolbarFilterButtonGroup<TData>() {
  const { table, filterDefinitions = [], setAddedFilterKeys, headerFilters = true } = useDataTableContext<TData>()
  const hasOptionFilters =
    getToolbarFilterDefinitions(filterDefinitions, table, headerFilters).length > 0 && Boolean(setAddedFilterKeys)

  if (!hasOptionFilters) {
    return <DataTableAppliedFilters />
  }

  return (
    <div className="flex h-10 shrink-0 items-center">
      <ButtonGroup className="h-7">
        <DataTableAppliedFilters embedded />
        <DataTableToolbarAddFilterMenu embedded />
      </ButtonGroup>
    </div>
  )
}
