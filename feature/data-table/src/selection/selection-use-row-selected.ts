"use client"

import type { Row } from "@tanstack/react-table"

import { useDataTableContext } from "../core"
import { resolveSelectionKey } from "./selection-cross-page-types"

/** Whether a row is in the cross-page selection store (re-renders when selection changes). */
export function useIsRowSelected<TData>(row: Row<TData>): boolean {
  const { selectionKey, selectedRows } = useDataTableContext<TData>()
  const rowKey = resolveSelectionKey(selectionKey, row.original)
  return selectedRows.some((selected) => resolveSelectionKey(selectionKey, selected) === rowKey)
}

/** Page-level select-all checkbox state derived from the selection store. */
export function usePageSelectionCheckboxState<TData>(rows: Row<TData>[]) {
  const { selectionKey, selectedRows } = useDataTableContext<TData>()
  const selectedKeys = new Set(selectedRows.map((row) => resolveSelectionKey(selectionKey, row)))
  const selectableRows = rows.filter((row) => row.getCanSelect())
  const selectedOnPage = selectableRows.filter((row) =>
    selectedKeys.has(resolveSelectionKey(selectionKey, row.original)),
  )
  const allPageSelected = selectableRows.length > 0 && selectedOnPage.length === selectableRows.length
  const somePageSelected = selectedOnPage.length > 0 && !allPageSelected

  return { allPageSelected, somePageSelected }
}
