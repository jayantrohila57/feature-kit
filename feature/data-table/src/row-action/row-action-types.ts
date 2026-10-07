import type { Row } from "@tanstack/react-table"
import type { ComponentType } from "react"

export type RowActionComponentProps<TData> = {
  row: Row<TData>
  /** Full domain object — same as `row.original`. */
  data: TData
}

export type RowActionComponent<TData> = ComponentType<RowActionComponentProps<TData>>
