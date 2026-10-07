import type { ColumnFilterConfig, ColumnFilterOption } from "../view-options/view-options-types"

/** Independent capabilities a table filter definition can expose. */
export type DataTableFilterKind = "search" | "sort" | "options"

/**
 * Column-declared filter capabilities (`meta.filter`).
 *
 * Each capability is independent: a description column may enable `search` + `sort`
 * only, while an enum column enables `options` (distinct values) + `sort`.
 */
export type DataTableColumnFilterMeta = {
  /** URL key for option filters and column search (`cs.<key>`). Defaults to the column id. */
  key?: string
  /** Column-specific text search (`cs.<key>` URL param). */
  search?: boolean
  /** Sort asc/desc controls (`sortBy=<columnId>&sortDir=asc|desc`). */
  sort?: boolean
  /** Checkbox list of distinct values. Options come from `DataTable filterOptions[key]` or `staticOptions`. */
  options?: boolean
  /** When true (default), multiple values are stored as repeated URL params. */
  multi?: boolean
  /** Match applied URL values to option values (defaults to strict equality). */
  matchesValue?: (appliedValue: string, optionValue: string) => boolean
  /** Options declared inline when the table has no `filterOptions` record for this key. */
  staticOptions?: ColumnFilterOption[]
}

/** Accepted `meta.filter` shapes — the new capability meta or the legacy `{ urlKey, options }` config. */
export type DataTableColumnFilterInput = DataTableColumnFilterMeta | ColumnFilterConfig

/** Resolved, ready-to-render filter definition shared by header popovers and toolbar chips. */
export type DataTableFilterDefinition = {
  /** URL key (also the `filterOptions` record key). */
  key: string
  /** Owning column id, or `null` for toolbar-only definitions. */
  columnId: string | null
  /** Translated display label. */
  label: string
  search: boolean
  sort: boolean
  /** Distinct option list, or `null` when the definition does not expose an option filter. */
  options: ColumnFilterOption[] | null
  multi: boolean
  matchesValue?: (appliedValue: string, optionValue: string) => boolean
}

/** Which capabilities of a definition currently have applied state. */
export type DataTableFilterActiveState = {
  search: boolean
  sort: boolean
  options: boolean
  any: boolean
  /** Number of active capabilities (for accessible labels). */
  count: number
}

/** Persisted per-table filter visibility. Applied values never live here — only the URL owns them. */
export type StoredFilterPreferences = {
  /** Filter keys the user added to the toolbar chip row, in display order. */
  added: string[]
}

/** Sorting entry as exposed by TanStack (`{ id, desc }`). */
export type DataTableSortingEntry = { id: string; desc: boolean }

/** Applied state a filter renderer reads from the table context. */
export type DataTableFilterAppliedState = {
  filters: Record<string, string[]> | undefined
  columnSearch: Record<string, string> | undefined
  sorting: readonly DataTableSortingEntry[]
}
