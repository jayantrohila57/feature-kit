import type { Row } from "@tanstack/react-table"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

export type DataTableEmptyState = {
  title: string
  description: string
  icons?: LucideIcon[]
  /** Omit when the CTA would only reload the same page. */
  action?: {
    label: string
    url: string
  }
}

/** Renders nested / detail content under an expanded parent row. */
export type DataTableRenderExpanded<TData> = (row: Row<TData>) => ReactNode

/** When omitted and `renderExpanded` is set, every row can expand. */
export type DataTableGetRowCanExpand<TData> = (row: Row<TData>) => boolean

/**
 * Per-row className override for the parent row (e.g. highlight matched rows).
 * Called during render; return `undefined` for no extra classes.
 */
export type DataTableGetRowClassName<TData> = (row: Row<TData>) => string | undefined

export type DataTableRowExpansionProps<TData> = {
  /**
   * Opt-in expandable row panel. When set, an expand control column is
   * prepended (unless the columns already include `id: "expand"`).
   */
  renderExpanded?: DataTableRenderExpanded<TData>
  /** Limit which rows show an expand control. Defaults to all rows when `renderExpanded` is set. */
  getRowCanExpand?: DataTableGetRowCanExpand<TData>
  /**
   * When false, skip the per-row chevron column. Rows start expanded and
   * collapse/expand from the toolbar button. Default true.
   */
  showExpandColumn?: boolean
}
