"use client"
// Row expand / selection flags mutate on stable TanStack row objects.
"use no memo"

import type { DataTableColumnMeta } from "../view-options"
import type { DataTableEmptyState, DataTableGetRowClassName, DataTableRenderExpanded } from "./row-types"

import { type ColumnDef, flexRender, type Row, type Table as TanStackTable } from "@tanstack/react-table"
import { EmptyState } from "layout/common"
import { useTranslations } from "next-intl"
import { Fragment } from "react"

import { TableBody, TableCell, TableRow } from "@/packages/ui/components/table"
import { cn } from "@/packages/ui/lib/utils"

import {
  getScrollingCellClassName,
  getStickyCellClassName,
  getStickyCellStyle,
  type StickyClassOptions,
} from "../column"
import { useIsRowSelected } from "../selection/selection-use-row-selected"

type DataTableBodyProps<TData, TValue> = {
  table: TanStackTable<TData>
  columns: ColumnDef<TData, TValue>[]
  stickyClassOptions: StickyClassOptions
  disableRowHover?: boolean
  emptyState?: DataTableEmptyState
  renderExpanded?: DataTableRenderExpanded<TData>
  getRowClassName?: DataTableGetRowClassName<TData>
}

function DataTableParentRow<TData>({
  row,
  stickyClassOptions,
  getRowClassName,
}: {
  row: Row<TData>
  stickyClassOptions: StickyClassOptions
  getRowClassName?: DataTableGetRowClassName<TData>
}) {
  const isSelected = useIsRowSelected(row)

  return (
    <TableRow
      className={cn(
        "group border-b-0 hover:bg-transparent data-[state=selected]:bg-transparent",
        getRowClassName?.(row),
      )}
      data-state={isSelected && "selected"}>
      {row.getVisibleCells().map((cell) => {
        const columnMeta = cell.column.columnDef.meta as DataTableColumnMeta | undefined

        return (
          <TableCell
            key={cell.id}
            style={getStickyCellStyle(cell.column.id, stickyClassOptions)}
            className={cn(
              "border-border border-b",
              getStickyCellClassName(cell.column.id, stickyClassOptions),
              getScrollingCellClassName(cell.column.id, stickyClassOptions),
              columnMeta?.fluidCell && "w-full min-w-0 max-w-0",
              columnMeta?.filterOnlyCell && "w-0 max-w-0 overflow-hidden p-0",
            )}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        )
      })}
    </TableRow>
  )
}

function DataTableExpandedRow<TData>({
  row,
  renderExpanded,
}: {
  row: Row<TData>
  renderExpanded: DataTableRenderExpanded<TData>
}) {
  const colSpan = row.getVisibleCells().length

  return (
    <TableRow className="border-b-0 hover:bg-transparent">
      <TableCell
        colSpan={colSpan}
        className="border-border border-b bg-muted/30 p-0">
        <div className="px-3 py-3">{renderExpanded(row)}</div>
      </TableCell>
    </TableRow>
  )
}

export function DataTableBody<TData, TValue>({
  table,
  columns,
  stickyClassOptions,
  disableRowHover = false,
  emptyState,
  renderExpanded,
  getRowClassName,
}: DataTableBodyProps<TData, TValue>) {
  const t = useTranslations()
  const rows = table.getRowModel().rows
  const cellClassOptions = { ...stickyClassOptions, disableRowHover }

  return (
    <TableBody className="[&_tr:last-child_td]:border-b-0">
      {rows.length > 0 ? (
        rows.map((row) => (
          <Fragment key={row.id}>
            <DataTableParentRow
              row={row}
              stickyClassOptions={cellClassOptions}
              {...(getRowClassName ? { getRowClassName } : {})}
            />
            {renderExpanded && row.getIsExpanded() && row.getCanExpand() ? (
              <DataTableExpandedRow
                row={row}
                renderExpanded={renderExpanded}
              />
            ) : null}
          </Fragment>
        ))
      ) : (
        <TableRow className="h-full">
          <TableCell
            colSpan={columns.length}
            className="h-full min-h-128 p-0 text-center">
            <div className="flex h-full min-h-128 w-full items-stretch">
              <EmptyState
                title={emptyState?.title ?? t("dataTable.empty.title")}
                description={emptyState?.description ?? t("dataTable.empty.description")}
                {...(emptyState?.icons ? { icons: emptyState.icons } : {})}
                {...(emptyState?.action ? { action: emptyState.action } : {})}
              />
            </div>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  )
}
