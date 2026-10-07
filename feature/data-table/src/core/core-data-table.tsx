"use client"
// `useReactTable` returns one stable instance that mutates in place, so React Compiler
// would cache `table.getRowModel()` / `getHeaderGroups()` forever and freeze the rows.
"use no memo"

import {
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnPinningState,
  type ExpandedState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  type PaginationState,
  type Row,
  type SortingState,
  type Updater,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import { ConfirmationDialogProvider } from "layout/confirmation-dialog"
import { useTranslations } from "next-intl"
import { type ReactNode, Suspense, type UIEvent, useCallback, useEffect, useMemo, useRef, useState } from "react"

import { Card, CardContent, CardFooter } from "@/packages/ui/components/card"
import { Table, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/packages/ui/components/table"
import { cn } from "@/packages/ui/lib/utils"

import {
  DATA_TABLE_COLUMN_ID_ATTR,
  DATA_TABLE_HEAD_PADDING_X_CLASS,
  getHeaderCellStyle,
  getScrollingHeaderClassName,
  getStickyCellClassName,
  getStickyCellStyle,
  getStickyColumnSide,
  getStickyColumnWidthPx,
  getStickyHeaderClassName,
  getStickyHeaderRowClassName,
  getStickyHeaderStyle,
  readFilterValuesFromSearchParams,
  resolveLeftStickyColumnIds,
  STICKY_COLUMN_IDS,
} from "../column"
import { useMeasuredLeftStickyOffsets } from "../column/use-column-sticky-offsets"
import { DATA_TABLE_TOOLBAR_PANEL_CLASS, type DataTablePageSize, isDataTablePageSize } from "../constants"
import {
  collectClearableFilterKeys,
  type DataTableFilterDefinition,
  getColumnSearchKeysFromDefinitions,
  getFilterUrlKeysFromDefinitions,
  readColumnSearchFromSearchParams,
  resolveFilterDefinitions,
  useAddedFilters,
} from "../filter"
import { DataTableFullscreenDialog, DataTableFullscreenPlaceholder } from "../fullscreen"
import { DataTablePagination } from "../pagination"
import {
  DATA_TABLE_EXPAND_COLUMN_ID,
  DataTableBody,
  type DataTableEmptyState,
  type DataTableGetRowCanExpand,
  type DataTableGetRowClassName,
  type DataTableRenderExpanded,
  expandColumn,
} from "../row"
import { DEFAULT_SELECTION_KEY, type SelectionKey, useCrossPageSelection } from "../selection"
import { DataTableToolbar } from "../toolbar"
import {
  readStoredDataTablePageSize,
  useEffectiveSearchParams,
  useTableUrlCanonicalize,
  useTableUrlSync,
} from "../utils"
import {
  buildColumnOrder,
  buildColumnPinning,
  type ColumnFilterOption,
  type DataTableColumnMeta,
  getColumnIdsFromDefs,
  getFixedAfterSelectColumnIds,
  LOCKED_COLUMN_IDS,
  resolveInitialColumnPreferences,
  resolveInitialPinnedLeft,
} from "../view-options"
import { nextPinnedFilterKeysIfChanged } from "./core-data-table.utils"
import { DataTableBodySkeleton, type DataTableBodySkeletonVariant } from "./core-data-table-body-skeleton"
import { DataTableProvider } from "./core-data-table-context"
import { DataTableLoading } from "./core-data-table-loading"

export type DataTableFullscreenOptions = {
  title?: string
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  /** Stable id used to persist column visibility in localStorage. */
  tableId?: string
  /** Column id for the toolbar search input (`table.getColumn`). May differ from a row field when `id` ≠ `accessorKey`. */
  displayKey: keyof TData | (string & {})
  selectionKey?: SelectionKey<TData>
  /**
   * When false, disables row selection APIs (omit `selectColumn` to hide checkboxes). A function decides
   * per row: rows it rejects show a disabled checkbox and are skipped by select-all. Default true.
   */
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean)
  /** Compound bulk action bar (`BulkActionBar` + action components). */
  bulkActions?: ReactNode
  pageCount?: number
  rowCount?: number
  initialPageIndex?: number
  initialPageSize?: number
  initialSortBy?: string
  initialSortDir?: "asc" | "desc"
  /**
   * Distinct option lists keyed by filter key (`meta.filter.key`, defaults to column id).
   * Resolved by the page from the full dataset (unscoped distinct), not from the current rows.
   */
  filterOptions?: Record<string, ColumnFilterOption[]>
  /** Filter keys that stay on the toolbar when visible (not removable). Does not force chip visibility. */
  pinnedFilterKeys?: readonly string[]
  /** Toolbar-only filter definitions for tables whose columns do not declare them. */
  filterDefinitions?: DataTableFilterDefinition[]
  /**
   * When true (default), pagination/search/sort sync to the URL via shallow updates.
   * Client listing queries read the URL with `useEffectiveSearchParams`; server-driven
   * listings pass `urlServerRefresh` on `DataTable` and `serverRefresh` on tab filters.
   * Set false for embedded tables (e.g. audit on a detail page).
   */
  syncUrl?: boolean
  /**
   * When true with `syncUrl`, URL updates are shallow (no RSC refetch). Default true for
   * listing tables; client queries refetch from the URL via `useEffectiveSearchParams`.
   */
  urlShallow?: boolean
  /**
   * When true with `syncUrl` and `urlShallow`, re-fetch server components after URL writes.
   * Use on server-driven listing pages (IAM catalog).
   */
  urlServerRefresh?: boolean
  /**
   * When false, skip writing missing `page`/`limit` into the URL on mount.
   * Use on slow list pages where that extra RSC navigation would race sidebar clicks.
   */
  canonicalizeUrl?: boolean
  /** Called when local pagination changes (`syncUrl={false}`). `pageIndex` is 0-based. */
  onPaginationChange?: (pageIndex: number, pageSize: number) => void
  emptyState?: DataTableEmptyState
  /** Optional summary row rendered at the end of the table body when rows are present. */
  listFooter?: ReactNode
  /** When set, shows a toolbar control that opens the table in a full-screen dialog. */
  fullscreen?: boolean | DataTableFullscreenOptions
  /** Optional controls rendered after the column visibility toggle in the toolbar. */
  toolbarTrailing?: ReactNode
  /** Optional controls rendered before the search input in the toolbar. */
  toolbarLeading?: ReactNode
  /** Optional controls rendered after the search input and before applied filters. */
  toolbarAfterSearch?: ReactNode
  /** i18n key for search placeholder when the `displayKey` column is not in the table. */
  toolbarSearchLabelKey?: string
  /**
   * i18n key for the whole search placeholder (not wrapped in "Filter by …"). Use when the search
   * spans several fields, e.g. a server-side global search.
   */
  toolbarSearchPlaceholderKey?: string
  /** When true, omit the table header row (column labels). */
  hideTableHeader?: boolean
  /** When true, hide the column visibility / manager control in the toolbar. */
  hideViewOptions?: boolean
  /** When true, skip row-hover background changes on body cells. */
  disableRowHover?: boolean
  /** Default column visibility before user preferences (e.g. hide optional audit columns). */
  initialColumnVisibility?: VisibilityState
  /** Default left-pinned columns before user preferences. Overrides `meta.pinnedByDefault` when set. */
  initialPinnedLeft?: string[]
  /**
   * Opt-in expandable detail panel under a parent row.
   * Prepends an expand control column unless columns already include `id: "expand"`.
   */
  renderExpanded?: DataTableRenderExpanded<TData>
  /** Limit which rows can expand. Defaults to all rows when `renderExpanded` is set. */
  getRowCanExpand?: DataTableGetRowCanExpand<TData>
  /** Optional per-row className for the parent row (e.g. highlight matched rows on comparison pages). */
  getRowClassName?: DataTableGetRowClassName<TData>
  /**
   * When false, hide the per-row chevron. Expand/collapse stays on the toolbar
   * button. Rows start expanded unless `initialExpanded` is set. Default true.
   */
  showExpandColumn?: boolean
  /** Initial expand state. Pass `true` to expand every row. Defaults to all expanded when the chevron column is hidden. */
  initialExpanded?: ExpandedState
  /** Override the scroll-body height (default fits a single full-width listing table). */
  bodyHeightClassName?: string
  /** Override the outer table shell classes (default includes listing top margin). */
  shellClassName?: string
  /** Override bordered toolbar panel classes. */
  toolbarPanelClassName?: string
  /** Override bordered scroll-body panel classes. */
  bodyPanelClassName?: string
  /** Override pagination footer panel classes. */
  footerPanelClassName?: string
  /** When true, replace body rows with skeleton placeholders during background refetch. */
  isFetching?: boolean
  /** When true with no rows yet, replace body rows with skeleton placeholders (initial client fetch). */
  isPending?: boolean
  /** Skeleton row shape — use `card` for tall card-style listing rows. */
  skeletonVariant?: DataTableBodySkeletonVariant
  /** Optional per-row className applied to skeleton table rows. */
  skeletonRowClassName?: string
  /**
   * Card listings: table width follows the scroll container (not content `w-max`).
   * Use with `meta.fluidCell` on the detail column so compare cards shrink when zoomed.
   */
  fillTableWidth?: boolean
}

const EMPTY_PINNED_FILTER_KEYS: readonly string[] = []

export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
  return (
    <Suspense
      fallback={
        <DataTableLoading
          {...(props.shellClassName ? { shellClassName: props.shellClassName } : {})}
          {...(props.bodyHeightClassName ? { bodyHeightClassName: props.bodyHeightClassName } : {})}
        />
      }>
      <DataTableReady {...props} />
    </Suspense>
  )
}

function DataTableReady<TData, TValue>({
  columns,
  data,
  tableId,
  displayKey,
  selectionKey = DEFAULT_SELECTION_KEY as SelectionKey<TData>,
  enableRowSelection = true,
  bulkActions,
  pageCount,
  rowCount,
  initialPageIndex = 0,
  initialPageSize,
  initialSortBy,
  initialSortDir,
  filterOptions,
  pinnedFilterKeys: pinnedFilterKeysProp = EMPTY_PINNED_FILTER_KEYS,
  filterDefinitions: explicitFilterDefinitions,
  syncUrl = true,
  urlShallow: urlShallowProp = true,
  urlServerRefresh = false,
  canonicalizeUrl = true,
  onPaginationChange: onPaginationChangeProp,
  emptyState,
  listFooter,
  fullscreen,
  toolbarTrailing,
  toolbarLeading,
  toolbarAfterSearch,
  toolbarSearchLabelKey,
  toolbarSearchPlaceholderKey,
  hideTableHeader = false,
  hideViewOptions = false,
  disableRowHover = false,
  initialColumnVisibility,
  initialPinnedLeft,
  renderExpanded,
  getRowCanExpand,
  getRowClassName,
  showExpandColumn = true,
  initialExpanded,
  bodyHeightClassName,
  shellClassName,
  toolbarPanelClassName,
  bodyPanelClassName,
  footerPanelClassName,
  isFetching = false,
  isPending = false,
  skeletonVariant,
  skeletonRowClassName,
  fillTableWidth = false,
}: DataTableProps<TData, TValue>) {
  const t = useTranslations()
  /** Server-driven listings must not shallow-write — App Router params must update before refresh. */
  const urlShallow = urlServerRefresh ? false : urlShallowProp
  const fullscreenOptions = typeof fullscreen === "object" ? fullscreen : fullscreen ? {} : null
  const fullscreenEnabled = Boolean(fullscreenOptions)
  const fullscreenTitle = fullscreenOptions?.title ?? t("dataTable.fullscreen.title")
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false)
  const crossPageSelection = useCrossPageSelection({ selectionKey, data })
  const { rowSelection, onRowSelectionChange, getRowId, selectedRows, selectedCount, clearSelection } =
    crossPageSelection
  const resolvedColumns = useMemo(() => {
    if (!renderExpanded) {
      return columns
    }
    if (!showExpandColumn) {
      return columns.filter((column) => column.id !== DATA_TABLE_EXPAND_COLUMN_ID)
    }
    const hasExpandColumn = columns.some((column) => column.id === DATA_TABLE_EXPAND_COLUMN_ID)
    if (hasExpandColumn) {
      return columns
    }
    return [...expandColumn<TData>(), ...columns] as ColumnDef<TData, TValue>[]
  }, [columns, renderExpanded, showExpandColumn])
  const columnIds = useMemo(() => getColumnIdsFromDefs(resolvedColumns), [resolvedColumns])
  const fixedAfterSelectIds = useMemo(() => getFixedAfterSelectColumnIds(resolvedColumns), [resolvedColumns])
  const hideableIds = useMemo(
    () => columnIds.filter((id) => !LOCKED_COLUMN_IDS.has(id) && !fixedAfterSelectIds.includes(id)),
    [columnIds, fixedAfterSelectIds],
  )
  const defaultPinnedLeft = useMemo(
    () => resolveInitialPinnedLeft(resolvedColumns, columnIds, initialPinnedLeft),
    [columnIds, initialPinnedLeft, resolvedColumns],
  )
  const defaultPreferences = useMemo(
    () => ({
      visibility: initialColumnVisibility ?? {},
      order: hideableIds,
      pinnedLeft: defaultPinnedLeft,
    }),
    [defaultPinnedLeft, hideableIds, initialColumnVisibility],
  )
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => defaultPreferences.visibility)
  const [columnOrder, setColumnOrder] = useState<string[]>(() =>
    buildColumnOrder(columnIds, defaultPreferences, fixedAfterSelectIds),
  )
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(() =>
    buildColumnPinning(columnIds, defaultPreferences, fixedAfterSelectIds),
  )
  const pinnedLeft = useMemo(
    () => (columnPinning.left ?? []).filter((id) => !LOCKED_COLUMN_IDS.has(id) && !fixedAfterSelectIds.includes(id)),
    [columnPinning.left, fixedAfterSelectIds],
  )

  useEffect(() => {
    if (!tableId) {
      return
    }
    const resolved = resolveInitialColumnPreferences(tableId, columnIds, {
      visibility: initialColumnVisibility ?? {},
      pinnedLeft: defaultPinnedLeft,
    })
    setColumnVisibility(resolved.visibility)
    setColumnOrder(buildColumnOrder(columnIds, resolved, fixedAfterSelectIds))
    setColumnPinning(buildColumnPinning(columnIds, resolved, fixedAfterSelectIds))
  }, [tableId, columnIds, defaultPinnedLeft, fixedAfterSelectIds, initialColumnVisibility])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [expanded, setExpanded] = useState<ExpandedState>(() => initialExpanded ?? (showExpandColumn ? {} : true))
  const [sorting, setSortingState] = useState<SortingState>(() => {
    if (!initialSortBy || !initialSortDir) {
      return []
    }
    const ids = getColumnIdsFromDefs(resolvedColumns)
    if (!ids.includes(initialSortBy)) {
      return []
    }
    return [{ id: initialSortBy, desc: initialSortDir === "desc" }]
  })

  const sanitizeSorting = useCallback(
    (state: SortingState): SortingState => {
      const validIds = new Set(columnIds)
      return state.filter((entry) => validIds.has(entry.id))
    },
    [columnIds],
  )

  const onSortingChange = useCallback(
    (updater: Updater<SortingState>) => {
      setSortingState((previous) => {
        const next = typeof updater === "function" ? updater(previous) : updater
        return sanitizeSorting(next)
      })
    },
    [sanitizeSorting],
  )

  const tableUrlSyncOptions = useMemo(() => {
    if (!syncUrl) {
      return { shallow: false, serverRefresh: false } as const
    }
    if (urlServerRefresh) {
      return { mode: "serverRsc" as const }
    }
    if (urlShallow) {
      return { mode: "clientQuery" as const }
    }
    return { shallow: false, serverRefresh: urlServerRefresh } as const
  }, [syncUrl, urlServerRefresh, urlShallow])

  const {
    pageIndex: urlPageIndex,
    limit: urlLimit,
    setFilter: urlSetFilter,
    setSearch: urlSetSearch,
    setColumnSearch: urlSetColumnSearch,
    clearFilters: urlClearFilters,
    setSorting: urlSetSorting,
    setPagination: urlSetPagination,
  } = useTableUrlSync(tableUrlSyncOptions)
  const searchParams = useEffectiveSearchParams()
  useTableUrlCanonicalize({ enabled: syncUrl && canonicalizeUrl })

  // One definition per filter key, consumed by header funnels, toolbar chips, and clear-all.
  const filterDefinitions = useMemo(
    () =>
      resolveFilterDefinitions(resolvedColumns, {
        filterOptions,
        explicitDefinitions: explicitFilterDefinitions,
        t,
      }),
    [explicitFilterDefinitions, filterOptions, resolvedColumns, t],
  )
  const filterUrlKeys = useMemo(() => getFilterUrlKeysFromDefinitions(filterDefinitions), [filterDefinitions])
  const columnSearchKeys = useMemo(() => getColumnSearchKeysFromDefinitions(filterDefinitions), [filterDefinitions])
  const clearableFilterKeys = useMemo(() => collectClearableFilterKeys(filterDefinitions), [filterDefinitions])
  const {
    mounted: filtersMounted,
    addedKeys: addedFilterKeys,
    addFilter,
    removeFilter: removeAddedFilter,
    setAddedFilterKeys,
  } = useAddedFilters({ tableId, definitions: filterDefinitions })
  const [pinnedFilterKeys, setPinnedFilterKeys] = useState<readonly string[]>(pinnedFilterKeysProp)
  const pinFilterKeys = useCallback((keys: readonly string[]) => {
    setPinnedFilterKeys((current) => nextPinnedFilterKeysIfChanged(current, keys))
  }, [])

  useEffect(() => {
    setPinnedFilterKeys((current) => nextPinnedFilterKeysIfChanged(current, pinnedFilterKeysProp))
  }, [pinnedFilterKeysProp])

  const resolvedInitialPageSize: DataTablePageSize = isDataTablePageSize(initialPageSize ?? Number.NaN)
    ? (initialPageSize as DataTablePageSize)
    : readStoredDataTablePageSize()

  const [localPageIndex, setLocalPageIndex] = useState(() => Math.max(0, initialPageIndex))
  const [localLimit, setLocalLimit] = useState<DataTablePageSize>(resolvedInitialPageSize)
  const [localSearch, setLocalSearch] = useState("")
  const [localColumnSearch, setLocalColumnSearch] = useState<Record<string, string>>({})

  const pageIndex = syncUrl ? urlPageIndex : localPageIndex
  const limit = syncUrl ? urlLimit : localLimit
  const searchQuery = syncUrl ? (searchParams.get("q") ?? "") : localSearch

  const setPagination = useCallback(
    (page: number, nextLimit: number) => {
      if (!isDataTablePageSize(nextLimit)) {
        return
      }
      if (syncUrl) {
        urlSetPagination(page, nextLimit)
        return
      }
      const nextPageIndex = Math.max(0, page - 1)
      setLocalPageIndex(nextPageIndex)
      setLocalLimit(nextLimit)
      onPaginationChangeProp?.(nextPageIndex, nextLimit)
    },
    [onPaginationChangeProp, syncUrl, urlSetPagination],
  )

  const setSearch = useCallback(
    (q: string) => {
      if (syncUrl) {
        urlSetSearch(q)
        return
      }
      const next = q.trim()
      setLocalSearch(next)
      setColumnFilters((prev) => {
        const withoutDisplay = prev.filter((filter) => filter.id !== String(displayKey))
        if (next === "") {
          return withoutDisplay
        }
        return [...withoutDisplay, { id: String(displayKey), value: next }]
      })
      setLocalPageIndex(0)
      onPaginationChangeProp?.(0, localLimit)
    },
    [displayKey, localLimit, onPaginationChangeProp, syncUrl, urlSetSearch],
  )

  const setSorting = useCallback(
    (sortBy: string | null, sortDir: "asc" | "desc" | null) => {
      if (syncUrl) {
        urlSetSorting(sortBy, sortDir)
        return
      }
      if (!sortBy || !sortDir) {
        setSortingState([])
        return
      }
      setSortingState([{ id: sortBy, desc: sortDir === "desc" }])
    },
    [syncUrl, urlSetSorting],
  )

  const setFilter = useCallback(
    (key: string, value: string | string[] | null) => {
      if (!syncUrl) {
        return
      }
      urlSetFilter(key, value)
    },
    [syncUrl, urlSetFilter],
  )

  const setColumnSearch = useCallback(
    (key: string, value: string | null) => {
      if (syncUrl) {
        urlSetColumnSearch(key, value)
        return
      }
      const next = value?.trim() ?? ""
      const columnId = filterDefinitions.find((definition) => definition.key === key)?.columnId ?? key
      setLocalColumnSearch((current) => {
        const { [key]: _removed, ...rest } = current
        return next === "" ? rest : { ...rest, [key]: next }
      })
      setColumnFilters((prev) => {
        const withoutColumn = prev.filter((filter) => filter.id !== columnId)
        return next === "" ? withoutColumn : [...withoutColumn, { id: columnId, value: next }]
      })
      setLocalPageIndex(0)
      onPaginationChangeProp?.(0, localLimit)
    },
    [filterDefinitions, localLimit, onPaginationChangeProp, syncUrl, urlSetColumnSearch],
  )

  const clearFilters = useCallback(
    (keysToRemove?: string[]) => {
      if (syncUrl) {
        urlClearFilters(keysToRemove && keysToRemove.length > 0 ? keysToRemove : clearableFilterKeys)
        return
      }
      setLocalSearch("")
      setLocalColumnSearch({})
      setColumnFilters([])
    },
    [clearableFilterKeys, syncUrl, urlClearFilters],
  )

  // Removing a chip forgets the visibility preference and drops its applied URL values.
  const removeFilter = useCallback(
    (key: string) => {
      removeAddedFilter(key)
      // One URL write per removal: value-list filters clear `key`, search-only filters `cs.<key>`.
      const definition = filterDefinitions.find((entry) => entry.key === key)
      if (definition && definition.options === null && definition.search) {
        setColumnSearch(key, null)
        return
      }
      setFilter(key, null)
    },
    [filterDefinitions, removeAddedFilter, setColumnSearch, setFilter],
  )

  // Drop cross-page selection when list filters change (status tabs, faceted filters).
  // Keep selection across page/limit/sort/search so multi-page bulk actions still work.
  const listFilterSignature = useMemo(() => {
    if (!syncUrl) {
      return ""
    }
    const params = new URLSearchParams(searchParams.toString())
    for (const key of ["page", "limit", "q", "sortBy", "sortDir"] as const) {
      params.delete(key)
    }
    return params.toString()
  }, [searchParams, syncUrl])

  const previousListFilterSignatureRef = useRef(listFilterSignature)
  useEffect(() => {
    if (!syncUrl) {
      previousListFilterSignatureRef.current = listFilterSignature
      return
    }
    if (previousListFilterSignatureRef.current === listFilterSignature) {
      return
    }
    previousListFilterSignatureRef.current = listFilterSignature
    clearSelection()
  }, [clearSelection, listFilterSignature, syncUrl])

  const searchParamsQuery = searchParams.toString()

  useEffect(() => {
    if (!syncUrl) {
      return
    }

    const params = new URLSearchParams(searchParamsQuery)
    const sortBy = params.get("sortBy")
    const sortDir = params.get("sortDir")
    if (sortBy && (sortDir === "asc" || sortDir === "desc")) {
      setSortingState(sanitizeSorting([{ id: sortBy, desc: sortDir === "desc" }]))
      return
    }

    setSortingState([])
  }, [sanitizeSorting, searchParamsQuery, syncUrl])

  const currentFilters = useMemo(() => {
    if (!syncUrl) {
      return {}
    }
    const params = new URLSearchParams(searchParamsQuery)
    const filters: Record<string, string[]> = {}
    for (const key of filterUrlKeys) {
      filters[key] = readFilterValuesFromSearchParams(params, key)
    }
    return filters
  }, [filterUrlKeys, searchParamsQuery, syncUrl])

  const columnSearch = useMemo(() => {
    if (!syncUrl) {
      return localColumnSearch
    }
    return readColumnSearchFromSearchParams(new URLSearchParams(searchParamsQuery), columnSearchKeys)
  }, [columnSearchKeys, localColumnSearch, searchParamsQuery, syncUrl])

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize: limit,
    }),
    [pageIndex, limit],
  )

  const onPaginationChange = useCallback(
    (updater: Updater<PaginationState>) => {
      const current = { pageIndex, pageSize: limit }
      const next = typeof updater === "function" ? updater(current) : updater
      setPagination(next.pageIndex + 1, next.pageSize)
    },
    [pageIndex, limit, setPagination],
  )

  const resolveRowCanExpand = useCallback(
    (row: Parameters<NonNullable<DataTableGetRowCanExpand<TData>>>[0]) => {
      if (getRowCanExpand) {
        return getRowCanExpand(row)
      }
      return Boolean(renderExpanded)
    },
    [getRowCanExpand, renderExpanded],
  )

  const table = useReactTable({
    data,
    columns: resolvedColumns,
    getRowId,
    state: {
      sorting,
      columnVisibility,
      columnOrder,
      columnPinning,
      rowSelection,
      columnFilters,
      pagination,
      expanded,
    },
    pageCount: pageCount ?? -1,
    manualPagination: true,
    manualSorting: true,
    enableRowSelection,
    enableExpanding: Boolean(renderExpanded),
    getRowCanExpand: resolveRowCanExpand,
    onExpandedChange: setExpanded,
    onPaginationChange,
    onRowSelectionChange,
    onSortingChange,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const hasSelectedRows = selectedCount > 0
  const showBulkBar = hasSelectedRows && bulkActions
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false)
  const rowModel = table.getRowModel().rows
  const hasRows = rowModel.length > 0
  const footerGroups = table.getFooterGroups()
  const hasColumnFooters = footerGroups.length > 0
  const showListFooter = Boolean(listFooter && hasRows)
  const showTableFooter = hasColumnFooters || showListFooter
  const leftStickyColumnIds = resolveLeftStickyColumnIds(
    table.getVisibleLeafColumns().map((column) => column.id),
    pinnedLeft,
    fixedAfterSelectIds,
  )
  const hasSelectColumn = leftStickyColumnIds.includes(STICKY_COLUMN_IDS.SELECT)
  const selectColumnDef = resolvedColumns.find((column) => column.id === STICKY_COLUMN_IDS.SELECT)
  const showSelectAllInHeader =
    (selectColumnDef?.meta as DataTableColumnMeta | undefined)?.showSelectAllHeader !== false
  const showSelectionOnlyHeader =
    hideTableHeader && hasSelectColumn && Boolean(enableRowSelection) && showSelectAllInHeader
  const showTableHeader = showSelectionOnlyHeader || !hideTableHeader
  const tableScrollContainerRef = useRef<HTMLDivElement>(null)
  const getStickyColumnWidth = useCallback(
    (columnId: string) => {
      const column = table.getColumn(columnId)
      return getStickyColumnWidthPx(columnId, column?.getSize())
    },
    [table],
  )
  const stickyOffsetMeasureKey = useMemo(
    () =>
      [
        columnOrder.join("\0"),
        leftStickyColumnIds.join("\0"),
        hasRows ? "rows" : "empty",
        showTableHeader ? "header" : "no-header",
        String(data.length),
      ].join("|"),
    [columnOrder, leftStickyColumnIds, hasRows, showTableHeader, data.length],
  )
  const leftStickyOffsets = useMeasuredLeftStickyOffsets({
    containerRef: tableScrollContainerRef,
    leftStickyColumnIds,
    getFallbackColumnWidth: getStickyColumnWidth,
    measureKey: stickyOffsetMeasureKey,
  })
  const stickyClassOptions = useMemo(
    () => ({
      leftStickyColumnIds,
      pinnedLeft,
      fixedAfterSelectIds,
      leftStickyOffsets,
      disableRowHover: disableRowHover || hideTableHeader,
    }),
    [disableRowHover, fixedAfterSelectIds, hideTableHeader, leftStickyColumnIds, leftStickyOffsets, pinnedLeft],
  )
  const resolvedDisableRowHover = disableRowHover || hideTableHeader
  const showBodySkeleton = isPending || isFetching
  const visibleColumnCount = table.getVisibleLeafColumns().length

  const handleTableScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
    const scrolled = event.currentTarget.scrollTop > 0
    setIsHeaderScrolled((previous) => (previous === scrolled ? previous : scrolled))
  }, [])

  const resolvedBodyHeightClassName = bodyHeightClassName ?? "min-h-0 flex-1"
  const resolvedShellClassName =
    shellClassName ??
    "flex mt-2 h-auto min-h-0 flex-col justify-between gap-0 border-0 bg-surface p-2 pt-0 shadow-none ring-0"

  const tableShell = (
    <Card className={resolvedShellClassName}>
      <CardContent
        className={cn(
          "shrink-0 rounded-t-lg border border-border bg-surface",
          DATA_TABLE_TOOLBAR_PANEL_CLASS,
          toolbarPanelClassName,
        )}>
        <DataTableToolbar />
      </CardContent>
      <CardContent
        className={cn(
          "relative flex flex-col rounded-none border-x bg-surface p-0",
          isFullscreenOpen ? "h-full" : resolvedBodyHeightClassName,
          bodyPanelClassName,
        )}>
        <div
          ref={tableScrollContainerRef}
          aria-busy={showBodySkeleton || undefined}
          className={cn(
            "relative min-h-0 flex-1 overflow-auto",
            "**:data-[slot=table-container]:overflow-visible",
            showBulkBar && "pb-19",
          )}
          onScroll={handleTableScroll}>
          <Table
            className={cn(
              "border-separate border-spacing-0 bg-surface",
              fillTableWidth ? "w-full table-fixed" : "w-max min-w-full",
              !hasRows && !showBodySkeleton && "h-full",
            )}>
            {showTableHeader ? (
              <TableHeader className={cn(getStickyHeaderRowClassName(), "rounded-none rounded-t-lg")}>
                {table?.getHeaderGroups()?.map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="border-b-0 bg-surface hover:bg-transparent">
                    {headerGroup.headers.map((header) => {
                      const stickySide = getStickyColumnSide(header.column.id, pinnedLeft)
                      const columnMeta = header.column.columnDef.meta as DataTableColumnMeta | undefined
                      const isSelectHeaderWithoutSelectAll =
                        header.column.id === STICKY_COLUMN_IDS.SELECT && columnMeta?.showSelectAllHeader === false
                      const isHiddenHeader = (showSelectionOnlyHeader && !stickySide) || isSelectHeaderWithoutSelectAll
                      const stickyHeaderStyle = getStickyHeaderStyle(header.column.id, stickyClassOptions)

                      return (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          {...{ [DATA_TABLE_COLUMN_ID_ATTR]: header.column.id }}
                          style={
                            isHiddenHeader
                              ? undefined
                              : { ...getHeaderCellStyle(isHeaderScrolled), ...stickyHeaderStyle }
                          }
                          className={cn(
                            isHiddenHeader ? "h-0 max-h-0 overflow-hidden border-0 p-0 leading-none" : undefined,
                            !isHiddenHeader && getStickyHeaderClassName(header.column.id, stickyClassOptions),
                            !isHiddenHeader &&
                              getScrollingHeaderClassName(header.column.id, pinnedLeft, fixedAfterSelectIds),
                            !stickySide && !isHiddenHeader && DATA_TABLE_HEAD_PADDING_X_CLASS,
                          )}
                          {...(isHiddenHeader ? { "aria-hidden": true } : {})}>
                          {isHiddenHeader
                            ? null
                            : header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
            ) : null}
            {showBodySkeleton ? (
              <DataTableBodySkeleton
                columnCount={visibleColumnCount}
                rowCount={limit}
                hasSelectColumn={hasSelectColumn}
                {...(skeletonVariant ? { variant: skeletonVariant } : {})}
                {...(skeletonRowClassName ? { skeletonRowClassName } : {})}
              />
            ) : (
              <DataTableBody
                table={table}
                columns={resolvedColumns}
                stickyClassOptions={stickyClassOptions}
                disableRowHover={resolvedDisableRowHover}
                {...(emptyState ? { emptyState } : {})}
                {...(renderExpanded ? { renderExpanded } : {})}
                {...(getRowClassName ? { getRowClassName } : {})}
              />
            )}
            {showTableFooter ? (
              <TableFooter className="m-0 bg-surface p-0">
                {hasColumnFooters
                  ? footerGroups.map((footerGroup) => (
                      <TableRow
                        key={footerGroup.id}
                        className="border-b-0 hover:bg-transparent">
                        {footerGroup.headers.map((header) => (
                          <TableCell
                            key={header.id}
                            style={getStickyCellStyle(header.column.id, stickyClassOptions)}
                            className={getStickyCellClassName(header.column.id, stickyClassOptions)}>
                            {flexRender(header.column.columnDef.footer, header.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : null}
                {showListFooter ? (
                  <TableRow className="border-b-0 hover:bg-transparent">
                    <TableCell
                      colSpan={resolvedColumns.length}
                      className="border-border border-t py-2 text-muted-foreground text-xs">
                      {listFooter}
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableFooter>
            ) : null}
          </Table>
        </div>
        {showBulkBar ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex justify-center bg-gradient-to-t from-surface via-surface/90 to-transparent px-4 pt-6 pb-3">
            <div className="pointer-events-auto max-w-full">{bulkActions}</div>
          </div>
        ) : null}
      </CardContent>
      <CardFooter className={cn("h-10 w-full shrink-0 rounded-b-lg border bg-surface p-0", footerPanelClassName)}>
        <DataTablePagination />
      </CardFooter>
    </Card>
  )

  return (
    <ConfirmationDialogProvider>
      <DataTableProvider
        value={{
          table,
          displayKey,
          ...(tableId ? { tableId } : {}),
          selectionKey,
          selectedRows,
          selectedCount,
          hasSelectedRows,
          clearSelection,
          filters: currentFilters,
          setSearch,
          clearFilters,
          setSorting,
          searchQuery,
          setPagination,
          limit,
          syncUrl,
          setFilter,
          filterDefinitions,
          columnSearch,
          setColumnSearch,
          sorting,
          addedFilterKeys,
          addFilter,
          removeFilter,
          setAddedFilterKeys,
          pinnedFilterKeys,
          pinFilterKeys,
          filtersMounted,
          headerFilters: !hideTableHeader,
          rowCount: rowCount ?? data.length,
          ...(fullscreenEnabled
            ? {
                fullscreenEnabled: true,
                isFullscreenOpen,
                setFullscreenOpen: setIsFullscreenOpen,
                fullscreenTitle,
              }
            : {}),
          ...(toolbarTrailing ? { toolbarTrailing } : {}),
          ...(toolbarLeading ? { toolbarLeading } : {}),
          ...(toolbarAfterSearch ? { toolbarAfterSearch } : {}),
          ...(toolbarSearchLabelKey ? { toolbarSearchLabelKey } : {}),
          ...(toolbarSearchPlaceholderKey ? { toolbarSearchPlaceholderKey } : {}),
          ...(hideViewOptions ? { hideViewOptions: true } : {}),
        }}>
        {!isFullscreenOpen ? tableShell : <DataTableFullscreenPlaceholder />}
        {fullscreenEnabled ? (
          <DataTableFullscreenDialog
            open={isFullscreenOpen}
            onOpenChange={setIsFullscreenOpen}
            title={fullscreenTitle}>
            {isFullscreenOpen ? tableShell : null}
          </DataTableFullscreenDialog>
        ) : null}
      </DataTableProvider>
    </ConfirmationDialogProvider>
  )
}
