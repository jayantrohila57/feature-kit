"use client"

import type { SortingState, Table } from "@tanstack/react-table"
import type { ReactNode } from "react"
import type { DataTableFilterDefinition } from "../filter/filter-types"

import * as React from "react"

export interface DataTableContextValue<TData> {
  table: Table<TData>
  /** Column id for the toolbar search input (`table.getColumn`). May differ from a row field when `id` ≠ `accessorKey`. */
  displayKey: keyof TData | (string & {})
  /** Stable id for persisting column visibility (e.g. `"identity-users"`). */
  tableId?: string
  /** Stable key used for cross-page selection identity (default `"id"`). */
  selectionKey: keyof TData | ((row: TData) => string)
  /** Full row objects selected across all pages (Map-backed, not page-local). */
  selectedRows: TData[]
  /** Total selected rows across all pages. */
  selectedCount: number
  hasSelectedRows: boolean
  clearSelection: () => void

  // URL / local navigation state
  filters?: Record<string, string[]>
  setFilter?: (key: string, value: string | string[] | null) => void
  setSearch?: (q: string) => void
  clearFilters?: (keysToRemove?: string[]) => void
  setSorting?: (sortBy: string | null, sortDir: "asc" | "desc" | null) => void
  /** Current toolbar search value (URL `q` or local when `syncUrl` is false). */
  searchQuery?: string
  /** 1-based page setter used by pagination controls. */
  setPagination?: (page: number, limit: number) => void
  /** Current page size for pagination controls. */
  limit?: number
  /** When false, table navigation is local and must not touch the URL. */
  syncUrl?: boolean

  // Shared filter system (header funnel popovers + toolbar chips consume the same definitions)
  /** Resolved filter definitions for this table (column meta + explicit toolbar-only definitions). */
  filterDefinitions?: readonly DataTableFilterDefinition[]
  /** Applied column-specific text searches keyed by filter key (URL `cs.<key>` or local). */
  columnSearch?: Record<string, string>
  setColumnSearch?: (key: string, value: string | null) => void
  /** Current sorting state (URL-synced or local). */
  sorting?: SortingState
  /** Filter keys the user added to the toolbar chip row (localStorage-backed visibility). */
  addedFilterKeys?: readonly string[]
  addFilter?: (key: string) => void
  /** Removes the chip from the added list and clears its applied URL values. */
  removeFilter?: (key: string) => void
  /** Replace toolbar filter visibility preferences (`added` in localStorage). Does not change URL filters. */
  setAddedFilterKeys?: (keys: readonly string[]) => void
  /** Filter keys that cannot be removed from the chip row when shown (not persisted). */
  pinnedFilterKeys?: readonly string[]
  pinFilterKeys?: (keys: readonly string[]) => void
  /** False until localStorage filter preferences have been read on the client. */
  filtersMounted?: boolean
  /** True when column headers (and their filter funnels) are rendered — false for header-less tables. */
  headerFilters?: boolean

  rowCount?: number

  /** When true, the table toolbar shows a full-screen dialog toggle. */
  fullscreenEnabled?: boolean
  isFullscreenOpen?: boolean
  setFullscreenOpen?: (open: boolean) => void
  fullscreenTitle?: string

  /** Optional controls rendered after the column visibility toggle in the toolbar. */
  toolbarTrailing?: ReactNode
  /** Optional controls rendered before the search input in the toolbar. */
  toolbarLeading?: ReactNode
  /** Optional controls rendered after the search input and before applied filters. */
  toolbarAfterSearch?: ReactNode
  /** Search placeholder label when `displayKey` column is absent. */
  toolbarSearchLabelKey?: string
  /** Full search placeholder key (not wrapped in "Filter by …"). Wins over the label key. */
  toolbarSearchPlaceholderKey?: string
  /** When true, hide the column visibility / manager control in the toolbar. */
  hideViewOptions?: boolean
}

const DataTableContext = React.createContext<DataTableContextValue<unknown> | null>(null)

export function DataTableProvider<TData>({
  value,
  children,
}: {
  value: DataTableContextValue<TData>
  children: React.ReactNode
}) {
  return (
    <DataTableContext.Provider value={value as unknown as DataTableContextValue<unknown>}>
      {children}
    </DataTableContext.Provider>
  )
}

export function useDataTableContext<TData>() {
  const ctx = React.useContext(DataTableContext)
  if (!ctx) throw new Error("useDataTableContext must be used within <DataTableProvider />")
  return ctx as DataTableContextValue<TData>
}
