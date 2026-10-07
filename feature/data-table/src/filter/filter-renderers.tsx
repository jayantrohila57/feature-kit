"use client"

import type { ComponentType } from "react"
import type { DataTableFilterDefinition, DataTableFilterKind } from "./filter-types"

import { useDataTableContext } from "../core"
import { FilterOptionPanel } from "./filter-option-panel"
import { FilterSearchPanel } from "./filter-search-panel"
import { FilterSortPanel } from "./filter-sort-panel"
import { resolveDefinitionSortDirection } from "./utils"

/** Props every capability renderer receives. Applied state and setters come from the table context. */
export type FilterPanelProps = {
  definition: DataTableFilterDefinition
  menuOpen: boolean
  /** Close the hosting popover (Enter in search, or a sort pick). Filters apply live and keep it open. */
  onClose: () => void
}

function FilterSearchRenderer({ definition, menuOpen, onClose }: FilterPanelProps) {
  const { columnSearch, setColumnSearch } = useDataTableContext()
  const appliedValue = columnSearch?.[definition.key] ?? ""

  return (
    <FilterSearchPanel
      appliedValue={appliedValue}
      menuOpen={menuOpen}
      onApply={(value) => {
        setColumnSearch?.(definition.key, value)
      }}
      onClear={() => {
        setColumnSearch?.(definition.key, "")
      }}
      onDone={onClose}
    />
  )
}

function FilterSortRenderer({ definition, onClose }: FilterPanelProps) {
  const { sorting = [], setSorting } = useDataTableContext()
  const direction = resolveDefinitionSortDirection(definition, sorting)

  return (
    <FilterSortPanel
      direction={direction}
      onSort={(next) => {
        if (definition.columnId) {
          setSorting?.(definition.columnId, next)
        }
        onClose()
      }}
      onClear={() => {
        setSorting?.(null, null)
        onClose()
      }}
    />
  )
}

function FilterOptionsRenderer({ definition, menuOpen }: FilterPanelProps) {
  const { filters, setFilter } = useDataTableContext()
  const appliedValues = filters?.[definition.key] ?? []

  return (
    <FilterOptionPanel
      options={definition.options ?? []}
      multi={definition.multi}
      {...(definition.matchesValue ? { matchesValue: definition.matchesValue } : {})}
      title={definition.label}
      appliedValues={appliedValues}
      menuOpen={menuOpen}
      onApply={(values) => {
        setFilter?.(definition.key, values.length > 0 ? values : null)
      }}
      onClear={() => {
        setFilter?.(definition.key, null)
      }}
    />
  )
}

/**
 * Capability → renderer. Adding a new filter type means adding a kind here (and to
 * `DataTableFilterKind`), not a new per-table component.
 */
export const filterRenderers: Record<DataTableFilterKind, ComponentType<FilterPanelProps>> = {
  search: FilterSearchRenderer,
  sort: FilterSortRenderer,
  options: FilterOptionsRenderer,
}
