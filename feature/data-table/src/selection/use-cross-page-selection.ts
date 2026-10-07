"use client"

import type { OnChangeFn, RowSelectionState } from "@tanstack/react-table"
import type { CrossPageSelectionState, SelectionKey } from "./selection-cross-page-types"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { resolveSelectionKey } from "./selection-cross-page-types"

export function useCrossPageSelection<TData>({
  selectionKey,
  data,
}: {
  selectionKey: SelectionKey<TData>
  data: TData[]
}): CrossPageSelectionState<TData> {
  const [selectedMap, setSelectedMap] = useState(() => new Map<string, TData>())
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const selectedMapRef = useRef(selectedMap)
  selectedMapRef.current = selectedMap

  const getRowKey = useCallback((row: TData) => resolveSelectionKey(selectionKey, row), [selectionKey])

  const getRowId = useCallback((row: TData) => getRowKey(row), [getRowKey])

  // Reconcile TanStack page selection when paginated data changes.
  useEffect(() => {
    const pageSelection: RowSelectionState = {}
    for (const row of data) {
      const key = getRowKey(row)
      if (selectedMapRef.current.has(key)) {
        pageSelection[key] = true
      }
    }
    setRowSelection(pageSelection)
  }, [data, getRowKey])

  const onRowSelectionChange: OnChangeFn<RowSelectionState> = useCallback((updater) => {
    setRowSelection((prev) => (typeof updater === "function" ? updater(prev) : updater))
  }, [])

  // Keep cross-page selection map in sync with current-page checkbox changes.
  useEffect(() => {
    setSelectedMap((map) => {
      let changed = false
      const nextMap = new Map(map)

      for (const row of data) {
        const key = getRowKey(row)
        const selected = Boolean(rowSelection[key])

        if (selected) {
          if (!nextMap.has(key) || nextMap.get(key) !== row) {
            nextMap.set(key, row)
            changed = true
          }
        } else if (nextMap.has(key)) {
          nextMap.delete(key)
          changed = true
        }
      }

      return changed ? nextMap : map
    })
  }, [data, getRowKey, rowSelection])

  const clearSelection = useCallback(() => {
    setSelectedMap(new Map())
    setRowSelection({})
  }, [])

  const selectedRows = useMemo(() => Array.from(selectedMap.values()), [selectedMap])
  const selectedCount = selectedMap.size

  return {
    selectionKey,
    selectedRows,
    selectedCount,
    rowSelection,
    onRowSelectionChange,
    getRowId,
    clearSelection,
  }
}
