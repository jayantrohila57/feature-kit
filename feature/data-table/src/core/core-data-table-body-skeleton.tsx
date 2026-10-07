import { Skeleton } from "@/packages/ui/components/skeleton"
import { TableBody, TableCell, TableRow } from "@/packages/ui/components/table"
import { cn } from "@/packages/ui/lib/utils"

import { DEFAULT_DATA_TABLE_PAGE_SIZE } from "../constants"

const COLUMN_SLOT_IDS = [
  "col-1",
  "col-2",
  "col-3",
  "col-4",
  "col-5",
  "col-6",
  "col-7",
  "col-8",
  "col-9",
  "col-10",
] as const

/** Mirrors reconciliation listing summary strip layout classes. */
const CARD_SUMMARY_PANEL_CLASS =
  "mb-3 overflow-visible rounded-lg border border-border/60 bg-surface px-3 py-2 shadow-sm"

const CARD_SUMMARY_ROW_CLASS = "flex flex-wrap items-center justify-between gap-x-4 gap-y-2"

const CARD_SUMMARY_LEFT_CLASS = "flex min-w-0 flex-1 flex-wrap items-center gap-2"

const CARD_SUMMARY_RIGHT_CLASS = "flex shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-2.5"

const CARD_SUMMARY_REASON_CLASS =
  "inline-flex min-w-0 max-w-[min(100%,24rem)] items-center gap-1 border-border/50 border-l pl-2.5"

const CARD_SUMMARY_META_GROUP_CLASS =
  "flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1 border-border/50 border-l pl-2.5 max-sm:w-full max-sm:border-l-0 max-sm:pl-0"

/** Mirrors reconciliation line card shell classes. */
const CARD_LINE_SHELL_CLASS = "w-full min-w-0 max-w-full overflow-hidden rounded-lg border border-border/70 bg-card p-1"

const CARD_LINE_INNER_CLASS = "rounded-md border-l-[3px] border-l-info bg-surface p-3"

const CARD_DETAIL_CELL_CLASS = "@container/listing-detail w-full min-w-0 max-w-full whitespace-normal py-2 pr-2"

const CARD_EXPANDED_GRID_CLASS = cn(
  "grid w-full min-w-0 max-w-full items-start gap-x-3 gap-y-2",
  "@2xl/listing-detail:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]",
  "[grid-template-areas:'bank-h'_'bank'_'book-h'_'book']",
  "@2xl/listing-detail:[grid-template-areas:'bank-h_._book-h'_'bank_arrow_book']",
)

export type DataTableBodySkeletonVariant = "default" | "card" | "card-line"

type DataTableBodySkeletonProps = {
  columnCount: number
  rowCount?: number
  variant?: DataTableBodySkeletonVariant
  /** When true, reserve the first column for a select-checkbox skeleton (card variants only). */
  hasSelectColumn?: boolean
  skeletonRowClassName?: string
}

function createRowKeys(count: number): string[] {
  return Array.from({ length: count }, (_, index) => `skeleton-row-${index}`)
}

function DefaultSkeletonRow({
  rowKey,
  columnIds,
  skeletonRowClassName,
}: {
  rowKey: string
  columnIds: readonly string[]
  skeletonRowClassName?: string
}) {
  return (
    <TableRow
      key={rowKey}
      className={cn("border-b-0 hover:bg-transparent", skeletonRowClassName)}>
      {columnIds.map((columnId) => (
        <TableCell
          key={`${rowKey}-${columnId}`}
          className="border-border border-b py-3">
          <Skeleton className="h-3.5 w-full max-w-28" />
        </TableCell>
      ))}
    </TableRow>
  )
}

function MetaFieldSkeleton() {
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <Skeleton className="size-3 shrink-0 rounded-sm" />
      <Skeleton className="h-3 w-full max-w-24" />
    </div>
  )
}

function MetaRowSkeleton() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
      <MetaFieldSkeleton />
      <MetaFieldSkeleton />
      <MetaFieldSkeleton />
    </div>
  )
}

function ReconciliationLineCardSkeleton() {
  return (
    <article className={CARD_LINE_SHELL_CLASS}>
      <div className={CARD_LINE_INNER_CLASS}>
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-4 min-w-0 flex-1" />
          <Skeleton className="h-4 w-16 shrink-0" />
        </div>

        <div
          className="my-2.5 border-border border-t"
          aria-hidden
        />

        <MetaRowSkeleton />

        <div
          className="my-2 border-border border-t"
          aria-hidden
        />

        <MetaRowSkeleton />
      </div>
    </article>
  )
}

function ReconciliationListingSummarySkeleton() {
  return (
    <div className={CARD_SUMMARY_PANEL_CLASS}>
      <div className={CARD_SUMMARY_ROW_CLASS}>
        <div className={CARD_SUMMARY_LEFT_CLASS}>
          <Skeleton className="h-5 w-10 rounded-full" />
          <Skeleton className="h-4 w-36 max-w-[min(100%,14rem)]" />
          <div className={CARD_SUMMARY_REASON_CLASS}>
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-40 max-w-[min(100%,12rem)]" />
          </div>
        </div>
        <div className={CARD_SUMMARY_RIGHT_CLASS}>
          <Skeleton className="h-5 w-16 rounded-full" />
          <div className={CARD_SUMMARY_META_GROUP_CLASS}>
            <Skeleton className="h-3.5 w-10" />
            <Skeleton className="h-3.5 w-20" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ReconciliationSideHeadingSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-1.5">
        <Skeleton className="size-3.5 shrink-0 rounded-sm" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      <Skeleton className="h-4 w-16 shrink-0" />
    </div>
  )
}

function ReconciliationMatchConnectorSkeleton() {
  return (
    <div
      className="relative @2xl/listing-detail:flex hidden w-10 shrink-0 @2xl/listing-detail:items-center @2xl/listing-detail:justify-center self-stretch [grid-area:arrow]"
      aria-hidden>
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border" />
      <Skeleton className="relative z-10 size-8 rounded-full" />
    </div>
  )
}

function ReconciliationExpandedSkeleton() {
  return (
    <div className={CARD_EXPANDED_GRID_CLASS}>
      <div className="[grid-area:bank-h]">
        <ReconciliationSideHeadingSkeleton />
      </div>
      <div className="[grid-area:book-h]">
        <ReconciliationSideHeadingSkeleton />
      </div>
      <div className="min-w-0 [grid-area:bank]">
        <ReconciliationLineCardSkeleton />
      </div>
      <ReconciliationMatchConnectorSkeleton />
      <div className="min-w-0 [grid-area:book]">
        <ReconciliationLineCardSkeleton />
      </div>
    </div>
  )
}

function ReconciliationListingCardSkeleton({ layout }: { layout: "full" | "line" }) {
  if (layout === "line") {
    return <ReconciliationLineCardSkeleton />
  }

  return (
    <div className="space-y-3">
      <ReconciliationListingSummarySkeleton />
      <ReconciliationExpandedSkeleton />
    </div>
  )
}

function CardSkeletonRow({
  rowKey,
  columnCount,
  layout,
  hasSelectColumn = false,
  skeletonRowClassName,
}: {
  rowKey: string
  columnCount: number
  layout: "full" | "line"
  hasSelectColumn?: boolean
  skeletonRowClassName?: string
}) {
  const showSelectSkeleton = hasSelectColumn && columnCount > 1
  const detailColSpan = showSelectSkeleton ? columnCount - 1 : columnCount

  return (
    <TableRow
      key={rowKey}
      className={cn("border-b-0 hover:bg-transparent", skeletonRowClassName)}>
      {showSelectSkeleton ? (
        <TableCell className="border-border border-b py-3 align-top">
          <Skeleton className="size-4 rounded-sm" />
        </TableCell>
      ) : null}
      <TableCell
        colSpan={detailColSpan}
        className={cn("border-border border-b", CARD_DETAIL_CELL_CLASS)}>
        <ReconciliationListingCardSkeleton layout={layout} />
      </TableCell>
    </TableRow>
  )
}

/**
 * Placeholder tbody while search queries are pending or refetching.
 * Matches {@link DataTable} row chrome so listing tables keep layout stable.
 */
export function DataTableBodySkeleton({
  columnCount,
  rowCount = DEFAULT_DATA_TABLE_PAGE_SIZE,
  variant = "default",
  hasSelectColumn = false,
  skeletonRowClassName,
}: DataTableBodySkeletonProps) {
  const resolvedColumnCount = Math.max(1, columnCount)
  const resolvedRowCount = Math.max(1, rowCount)
  const columnIds = COLUMN_SLOT_IDS.slice(0, Math.min(resolvedColumnCount, COLUMN_SLOT_IDS.length))
  const rowKeys = createRowKeys(resolvedRowCount)
  const isCardVariant = variant === "card" || variant === "card-line"

  return (
    <TableBody
      aria-busy="true"
      aria-live="polite"
      className="[&_tr:last-child_td]:border-b-0">
      {rowKeys.map((rowKey) =>
        isCardVariant ? (
          <CardSkeletonRow
            key={rowKey}
            rowKey={rowKey}
            columnCount={resolvedColumnCount}
            layout={variant === "card-line" ? "line" : "full"}
            hasSelectColumn={hasSelectColumn}
            {...(skeletonRowClassName ? { skeletonRowClassName } : {})}
          />
        ) : (
          <DefaultSkeletonRow
            key={rowKey}
            rowKey={rowKey}
            columnIds={columnIds}
            {...(skeletonRowClassName ? { skeletonRowClassName } : {})}
          />
        ),
      )}
    </TableBody>
  )
}
