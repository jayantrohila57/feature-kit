"use client"
// Reads columns off the stable, in-place mutating TanStack table instance during render.
"use no memo"

import type { Column, Table } from "@tanstack/react-table"

import { Search, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useCallback, useEffect, useRef, useState } from "react"

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/packages/ui/components/input-group"
import Spinner from "@/packages/ui/components/spinner"

import { DATA_TABLE_SEARCH_DEBOUNCE_MS } from "../constants"
import { useDataTableContext } from "../core"
import { DataTableFullscreenToggle } from "../fullscreen"
import { DataTableExpandAllToggle } from "../row"
import { useDebouncedCallback } from "../utils"
import { DataTableViewOptions, resolveColumnLabel } from "../view-options"
import { DataTableActiveFilterBar } from "./toolbar-active-filter-bar"
import { toUrlSearchValue } from "./toolbar-data-table-toolbar.utils"
import { DataTableToolbarFilterButtonGroup } from "./toolbar-filter-button-group"
import { DataTableToolbarFilterChips } from "./toolbar-filter-chips"

type ToolbarSearchInputProps<TData> = {
  column: Column<TData, unknown> | null
  setSearch: ((q: string) => void) | undefined
  labelKey?: string | undefined
  /** Full placeholder key; wins over the "Filter by {field}" form. */
  placeholderKey?: string | undefined
}

function ToolbarSearchInput<TData>({ column, setSearch, labelKey, placeholderKey }: ToolbarSearchInputProps<TData>) {
  const t = useTranslations()
  const { searchQuery = "" } = useDataTableContext<TData>()
  const [draftSearch, setDraftSearch] = useState(searchQuery)
  const fieldLabel = labelKey
    ? t(labelKey)
    : column
      ? resolveColumnLabel(column as Column<unknown, unknown>, t)
      : t("dataTable.filter.search")

  // Last value this input wrote, used to tell our own echo from an external change.
  const committedSearchRef = useRef(searchQuery)

  const commitSearch = useCallback(
    (value: string) => {
      committedSearchRef.current = toUrlSearchValue(value)
      setSearch?.(value)
    },
    [setSearch],
  )

  const debouncedCommitSearch = useDebouncedCallback(commitSearch, DATA_TABLE_SEARCH_DEBOUNCE_MS)

  // Adopt search only when it changes outside this input (clear filters, back/forward, local reset).
  useEffect(() => {
    if (searchQuery === committedSearchRef.current) {
      return
    }
    committedSearchRef.current = searchQuery
    debouncedCommitSearch.cancel()
    setDraftSearch(searchQuery)
  }, [debouncedCommitSearch, searchQuery])

  // Spinner covers the debounce wait plus the commit, and clears once search lands.
  const isSearchLoading = toUrlSearchValue(draftSearch) !== searchQuery

  const clearSearch = () => {
    debouncedCommitSearch.cancel()
    setDraftSearch("")
    commitSearch("")
  }

  return (
    <div className="flex h-10 shrink-0 items-center justify-center">
      <InputGroup className="w-full max-w-xl bg-surface shadow-xs">
        <InputGroupAddon align="inline-start">
          <span className="flex size-3.5 shrink-0 items-center justify-center">
            {isSearchLoading ? <Spinner className="size-3.5" /> : <Search className="size-3.5" />}
          </span>
        </InputGroupAddon>
        <InputGroupInput
          value={draftSearch}
          aria-busy={isSearchLoading}
          onChange={(event) => {
            const value = event.target.value
            setDraftSearch(value)
            debouncedCommitSearch(value)
          }}
          placeholder={placeholderKey ? t(placeholderKey) : t("dataTable.filter.filterBy", { field: fieldLabel })}
        />
        {draftSearch !== "" ? (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label={t("dataTable.filter.clearSearchAria")}
              onClick={clearSearch}>
              <X />
            </InputGroupButton>
          </InputGroupAddon>
        ) : null}
      </InputGroup>
    </div>
  )
}

function resolveDisplayColumn<TData>(table: Table<TData>, displayKey: string | number | symbol) {
  const columnId = String(displayKey)
  return table.getAllLeafColumns().find((column) => column.id === columnId) ?? null
}

export function DataTableToolbar<TData>() {
  const {
    table,
    displayKey,
    setSearch,
    toolbarTrailing,
    toolbarLeading,
    toolbarAfterSearch,
    toolbarSearchLabelKey,
    toolbarSearchPlaceholderKey,
    hideViewOptions = false,
  } = useDataTableContext<TData>()
  const column = toolbarSearchLabelKey ? null : resolveDisplayColumn(table, displayKey)
  const showSearch = Boolean(setSearch && (column || toolbarSearchLabelKey || toolbarSearchPlaceholderKey))

  // Layout: search | [filter icon + add filter group] | chips | afterSearch | ---gap--- | view options | expand | fullscreen | trailing
  // Second row (only when something is applied): active-filter chips + Clear all.
  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          {toolbarLeading}
          {showSearch ? (
            <ToolbarSearchInput
              column={column}
              setSearch={setSearch}
              {...(toolbarSearchLabelKey ? { labelKey: toolbarSearchLabelKey } : {})}
              {...(toolbarSearchPlaceholderKey ? { placeholderKey: toolbarSearchPlaceholderKey } : {})}
            />
          ) : null}
          <DataTableToolbarFilterButtonGroup />
          <DataTableToolbarFilterChips />
          {toolbarAfterSearch}
        </div>
        <div className="flex h-10 shrink-0 items-center">
          <div className="flex h-full items-center justify-center gap-2">
            {hideViewOptions ? null : <DataTableViewOptions />}
            <DataTableExpandAllToggle />
            <DataTableFullscreenToggle />
            {toolbarTrailing}
          </div>
        </div>
      </div>
      <DataTableActiveFilterBar />
    </div>
  )
}
