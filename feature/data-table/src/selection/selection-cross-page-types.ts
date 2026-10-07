import type { OnChangeFn, RowSelectionState } from "@tanstack/react-table"

export type SelectionKey<TData> = keyof TData | ((row: TData) => string)

export const DEFAULT_SELECTION_KEY = "id" as const

export function resolveSelectionKey<TData>(selectionKey: SelectionKey<TData>, row: TData): string {
  const value = typeof selectionKey === "function" ? selectionKey(row) : row[selectionKey]
  return String(value)
}

export interface CrossPageSelectionState<TData> {
  selectionKey: SelectionKey<TData>
  selectedRows: TData[]
  selectedCount: number
  rowSelection: RowSelectionState
  onRowSelectionChange: OnChangeFn<RowSelectionState>
  getRowId: (row: TData, index: number) => string
  clearSelection: () => void
}
