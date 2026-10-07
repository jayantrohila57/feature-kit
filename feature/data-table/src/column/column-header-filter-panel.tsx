"use client"

import type { ColumnFilterConfig } from "../view-options"

import { FilterOptionPanel } from "../filter"

type ColumnHeaderFilterPanelProps = {
  filter: ColumnFilterConfig
  /** Resolved column display title (already translated). */
  title?: string
  appliedValues: string[]
  menuOpen: boolean
  onApply: (values: string[]) => void
  onClear: () => void
}

/** @deprecated Use `FilterOptionPanel` from `data-table/filter`. Kept for legacy `{ urlKey, options }` callers. */
export function ColumnHeaderFilterPanel({ filter, ...props }: ColumnHeaderFilterPanelProps) {
  return (
    <FilterOptionPanel
      options={filter.options}
      multi={filter.multi !== false}
      {...(filter.matchesValue ? { matchesValue: filter.matchesValue } : {})}
      {...props}
    />
  )
}
