import type { ExportColumn } from "export"
import type { ReactNode } from "react"

export type BulkActionBarProps = {
  children?: ReactNode
  className?: string
}

export type BulkExportActionProps<TData> = {
  /** Base filename without extension (e.g. `"users"`). */
  filename: string
  /** Columns included in the exported file. */
  columns: ExportColumn<TData>[]
  /** Button label. Falls back to a CSV/XLSX-specific default. */
  label?: string
  /** Confirmation dialog title. Falls back to `common.confirmAction`. */
  confirmTitle?: string
  /** Confirmation dialog body. Falls back to a count-based default. */
  confirmDescription?: string | ((selectedCount: number) => string)
  /** Primary action label in the confirmation dialog. */
  confirmLabel?: string
  className?: string
}
