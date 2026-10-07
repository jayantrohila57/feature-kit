"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { DataTableExpandToggle } from "./row-expand-toggle"

export const DATA_TABLE_EXPAND_COLUMN_ID = "expand" as const

export function expandColumn<TData>(): ColumnDef<TData>[] {
  return [
    {
      id: DATA_TABLE_EXPAND_COLUMN_ID,
      meta: { sticky: "left", labelKey: "dataTable.column.expand" },
      header: () => null,
      cell: ({ row }) => <DataTableExpandToggle row={row} />,
      enableSorting: false,
      enableHiding: false,
    },
  ]
}
