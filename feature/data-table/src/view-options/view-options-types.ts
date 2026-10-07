import type { VisibilityState } from "@tanstack/react-table"
import type { ComponentType, ReactNode } from "react"
import type { DataTableColumnFilterInput } from "../filter/filter-types"

export type ColumnFilterOption = {
  label: string
  value: string
  /** Text used by filter search; defaults to `label`. */
  searchText?: string
  color?: string
  icon?: ComponentType<{ className?: string }>
  /** Cell-matching presentation shown in the filter dropdown. */
  content?: ReactNode
}

/**
 * @deprecated Legacy per-column faceted filter `{ urlKey, options }`. Still accepted by `meta.filter`
 * (normalised to `{ key, options: true, staticOptions }`); prefer `DataTableColumnFilterMeta`.
 */
export type ColumnFilterConfig = {
  urlKey: string
  options: ColumnFilterOption[]
  /** When true (default), multiple values are stored as repeated URL params. */
  multi?: boolean
  /** Match applied URL values to option values (defaults to strict equality). */
  matchesValue?: (appliedValue: string, optionValue: string) => boolean
}

/** Optional column meta used by View Options for translated labels. */
export type DataTableColumnMeta = {
  labelKey?: string
  label?: string
  sticky?: "left" | "right"
  /**
   * Filter capabilities for this column (`{ key, search, sort, options }`), consumed by the header
   * funnel popover and the toolbar "Add filter" chips. Legacy `{ urlKey, options }` is still accepted.
   */
  filter?: DataTableColumnFilterInput
  /** @deprecated Use `filter.search`. Column search is opt-in (`cs.<key>` URL param). */
  search?: boolean
  /** @deprecated Use `filter.sort`. Defaults to the column's `enableSorting`. */
  sort?: boolean
  /** When false, omit the select-column header cell (row checkboxes only). Default true. */
  showSelectAllHeader?: boolean
  /** Pin this column to the left by default (before user preferences are saved). */
  pinnedByDefault?: boolean
  /** Card listing detail column — grow/shrink with the table viewport (checkbox + filters). */
  fluidCell?: boolean
  /** Toolbar-filter column with no visible cell — zero width when `fillTableWidth` is set. */
  filterOnlyCell?: boolean
}

/** Column manager draft: visibility, order, and left pins for hideable columns. */
export type ViewOptionsDraft = {
  /** Hideable column visibility (`true` = visible). */
  visibility: Record<string, boolean>
  /** User-defined order of hideable columns. */
  order: string[]
  /** Hideable columns pinned to the left (after fixed icon columns). */
  pinnedLeft: string[]
}

/** Persisted column preferences for a table. */
export type StoredColumnPreferences = {
  visibility: VisibilityState
  order?: string[]
  pinnedLeft?: string[]
}

/** @deprecated Use `StoredColumnPreferences`. */
export type StoredColumnVisibility = VisibilityState

/** next-intl `useTranslations()` — supports optional `has` for safe key resolution. */
export type TranslateFn = ((key: string) => string) & {
  has?: (key: string) => boolean
}

export type ViewOptionsColumnItem = {
  id: string
  label: string
  canHide: boolean
}
