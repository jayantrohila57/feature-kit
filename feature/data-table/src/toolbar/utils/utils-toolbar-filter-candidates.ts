import type { Table } from "@tanstack/react-table"
import type { DataTableFilterDefinition } from "../../filter"
import type { DataTableColumnMeta } from "../../view-options"

/**
 * True when the definition is already reachable from a visible column header funnel, so the
 * toolbar should not offer it again. Header-less tables and filter-only cells never count.
 */
export function isFilterInVisibleHeader<TData>(
  definition: DataTableFilterDefinition,
  table: Table<TData>,
  headerFilters: boolean,
): boolean {
  if (!headerFilters || !definition.columnId) {
    return false
  }
  const column = table.getAllLeafColumns().find((entry) => entry.id === definition.columnId)
  if (!column?.getIsVisible()) {
    return false
  }
  const meta = column.columnDef.meta as DataTableColumnMeta | undefined
  return !meta?.filterOnlyCell
}

/**
 * Filters the toolbar ("Add filter" + chips) may offer: any search or value filter whose column
 * is hidden (or has no header), so every field stays filterable without duplicating header funnels.
 */
export function getToolbarFilterDefinitions<TData>(
  definitions: readonly DataTableFilterDefinition[],
  table: Table<TData>,
  headerFilters: boolean,
): DataTableFilterDefinition[] {
  return definitions.filter(
    (definition) =>
      (definition.options !== null || definition.search) && !isFilterInVisibleHeader(definition, table, headerFilters),
  )
}
