import type { CSSProperties } from "react"

import { cn } from "@/packages/ui/lib/utils"

import {
  DEFAULT_PINNED_DATA_COLUMN_WIDTH_PX,
  ICON_STICKY_COLUMN_WIDTH_PX,
  LOCKED_COLUMN_IDS,
} from "../view-options/view-options-constants"

export const STICKY_COLUMN_IDS = {
  EXPAND: "expand",
  SELECT: "select",
  ACTIONS: "actions",
} as const

export type StickyColumnSide = "left" | "right"

/**
 * z-index layers (low → high):
 * scrolling body → sticky body → sticky body hover → header row → corner headers
 *
 * Header row must stay above body hover (z-30) so tbody never paints over thead
 * when rows are hovered or vertically scrolled under sticky header cells.
 */
export const STICKY_Z_INDEX = {
  SCROLLING: 0,
  BODY: 20,
  BODY_RIGHT: 22,
  BODY_HOVER: 30,
  HEADER: 40,
  CORNER: 50,
} as const

/**
 * Tailwind only emits utilities it can find as complete string literals in source.
 * Never build `shadow-[…]` via template strings — those classes are silently missing from CSS.
 */
const LEFT_EDGE_SHADOW = "shadow-[4px_0_8px_-4px_color-mix(in_oklch,var(--border)_80%,transparent)]"
const RIGHT_EDGE_SHADOW = "shadow-[-4px_0_8px_-4px_color-mix(in_oklch,var(--border)_80%,transparent)]"

const stickyOpaqueBackgroundClassName = "bg-surface"

/** Sticky header row/cell positioning — border + scroll shadow live in inline styles (see getHeaderCellStyle). */
const headerCellBaseClassName = cn("sticky top-0", "bg-surface-band")

/** Inset bottom line + optional drop shadow — survives border-collapse and Tailwind purge. */
const HEADER_BORDER_INSET = "inset 0 -1px 0 var(--border)"
const HEADER_SCROLL_DROP_SHADOW =
  "0 2px 4px -1px color-mix(in oklch, var(--foreground) 5%, transparent), 0 1px 2px -1px color-mix(in oklch, var(--foreground) 3%, transparent)"

export function getHeaderCellStyle(isScrolled: boolean): CSSProperties {
  return {
    boxShadow: isScrolled ? `${HEADER_BORDER_INSET}, ${HEADER_SCROLL_DROP_SHADOW}` : HEADER_BORDER_INSET,
  }
}

/**
 * Selected tint applied on cells only — never on the row.
 * Row + cell alpha stacking made scrolling columns ~2× darker than intended.
 * Uses --selection (blue) from globals.css so sticky and scrolling columns match.
 */
// Opaque mixes over --surface (not `bg-selection/10`): a translucent tint let scrolled columns show
// through the sticky code / name cells of a selected row.
const cellSelectedClassName = "group-data-[state=selected]:bg-[color-mix(in_oklab,var(--selection)_10%,var(--surface))]"

/** Slightly stronger tint when a selected row is hovered. */
const cellSelectedHoverClassName =
  "group-data-[state=selected]:group-hover:bg-[color-mix(in_oklab,var(--selection)_15%,var(--surface))]"

function stickyBodyStateClassName(options?: StickyClassOptions): string {
  return cn(
    stickyOpaqueBackgroundClassName,
    // Opaque mix of the row-hover tint (`hover:bg-info/[0.06]` on TableRow) so
    // sticky and scrolling cells read as one row.
    !options?.disableRowHover && "transition-colors group-hover:bg-[color-mix(in_oklab,var(--info)_6%,var(--surface))]",
    cellSelectedClassName,
    !options?.disableRowHover && cellSelectedHoverClassName,
  )
}

export function isIconStickyColumn(columnId: string): boolean {
  return (
    columnId === STICKY_COLUMN_IDS.EXPAND ||
    columnId === STICKY_COLUMN_IDS.SELECT ||
    columnId === STICKY_COLUMN_IDS.ACTIONS
  )
}

export function getStickyColumnSide(
  columnId: string,
  pinnedLeft: readonly string[] = [],
  fixedAfterSelectIds: readonly string[] = [],
): StickyColumnSide | undefined {
  if (columnId === STICKY_COLUMN_IDS.EXPAND || columnId === STICKY_COLUMN_IDS.SELECT) {
    return "left"
  }

  if (columnId === STICKY_COLUMN_IDS.ACTIONS) {
    return "right"
  }

  if (fixedAfterSelectIds.includes(columnId) || pinnedLeft.includes(columnId)) {
    return "left"
  }

  return undefined
}

export type StickyClassOptions = {
  /** Visible left-sticky column ids in left→right order (e.g. `["expand","select","name"]`). */
  leftStickyColumnIds?: string[]
  /** User-pinned hideable column ids. */
  pinnedLeft?: string[]
  /** Non-hideable columns pinned after select (e.g. master code). */
  fixedAfterSelectIds?: string[]
  /** Pixel `left` offsets keyed by column id. */
  leftStickyOffsets?: Map<string, number>
  /** When true, skip row-hover background changes on sticky/scrolling body cells. */
  disableRowHover?: boolean
}

/** Icon-width sticky columns (select, expand, actions) clip overflow so checkboxes do not paint over neighbors. */
const iconStickyCellClassName = "w-10 min-w-10 max-w-10 overflow-hidden px-0 align-top"

/** Each left sticky icon column is `w-10` (2.5rem). Keep as complete Tailwind literals. */
function getLeftStickyOffsetClass(columnId: string, leftStickyColumnIds?: string[]): string {
  const ordered = leftStickyColumnIds?.length ? leftStickyColumnIds : [columnId]
  const index = ordered.indexOf(columnId)
  if (index <= 0) return "left-0"
  if (index === 1) return "left-10"
  if (index === 2) return "left-20"
  return "left-0"
}

function getLeftStickyStyle(columnId: string, options?: StickyClassOptions): CSSProperties | undefined {
  const offset = options?.leftStickyOffsets?.get(columnId)
  if (offset === undefined) {
    return undefined
  }

  return { left: offset }
}

function isLastLeftSticky(columnId: string, leftStickyColumnIds?: string[]): boolean {
  if (!leftStickyColumnIds?.length) return true
  return leftStickyColumnIds[leftStickyColumnIds.length - 1] === columnId
}

function getPinnedDataColumnClassName(columnId: string, options?: StickyClassOptions): string | undefined {
  const pinnedLeft = getPinnedLeftIds(options)
  if (isIconStickyColumn(columnId) || !pinnedLeft.includes(columnId)) {
    return undefined
  }

  return cn("min-w-32", isLastLeftSticky(columnId, options?.leftStickyColumnIds) ? LEFT_EDGE_SHADOW : undefined)
}

function getPinnedLeftIds(options?: StickyClassOptions): string[] {
  return [...(options?.fixedAfterSelectIds ?? []), ...(options?.pinnedLeft ?? [])]
}

export function getStickyHeaderClassName(columnId: string, options?: StickyClassOptions): string | undefined {
  const side = getStickyColumnSide(columnId, options?.pinnedLeft, options?.fixedAfterSelectIds)
  if (!side) {
    return undefined
  }

  const leftStyle = getLeftStickyStyle(columnId, options)
  const useTailwindOffset = !leftStyle && isIconStickyColumn(columnId)

  return cn(
    headerCellBaseClassName,
    "isolate z-50",
    side === "left"
      ? cn(
          useTailwindOffset ? getLeftStickyOffsetClass(columnId, options?.leftStickyColumnIds) : undefined,
          isIconStickyColumn(columnId) ? iconStickyCellClassName : "px-3",
          getPinnedDataColumnClassName(columnId, options),
        )
      : cn("right-0", iconStickyCellClassName, "border-l", RIGHT_EDGE_SHADOW),
  )
}

export function getStickyHeaderStyle(columnId: string, options?: StickyClassOptions): CSSProperties | undefined {
  return getLeftStickyStyle(columnId, options)
}

export function getStickyCellClassName(columnId: string, options?: StickyClassOptions): string | undefined {
  const side = getStickyColumnSide(columnId, options?.pinnedLeft, options?.fixedAfterSelectIds)
  if (!side) {
    return undefined
  }

  const leftStyle = getLeftStickyStyle(columnId, options)
  const useTailwindOffset = !leftStyle && isIconStickyColumn(columnId)
  const isActionsColumn = columnId === STICKY_COLUMN_IDS.ACTIONS

  return cn(
    "sticky isolate",
    isActionsColumn ? "z-[22] group-hover:z-[32]" : "z-20 group-hover:z-30",
    stickyBodyStateClassName(options),
    side === "left"
      ? cn(
          useTailwindOffset ? getLeftStickyOffsetClass(columnId, options?.leftStickyColumnIds) : undefined,
          isIconStickyColumn(columnId) ? iconStickyCellClassName : "px-3",
          getPinnedDataColumnClassName(columnId, options),
        )
      : cn("right-0", iconStickyCellClassName, "border-border border-l", RIGHT_EDGE_SHADOW),
  )
}

export function getStickyCellStyle(columnId: string, options?: StickyClassOptions): CSSProperties | undefined {
  return getLeftStickyStyle(columnId, options)
}

/** Full-size wrapper so sticky cell content fills the td edge-to-edge. */
export const STICKY_CELL_CONTENT_CLASS = "flex w-full items-start justify-center pt-2.5"

/** @deprecated Use STICKY_CELL_CONTENT_CLASS */
export const STICKY_SELECT_CELL_CONTENT_CLASS = STICKY_CELL_CONTENT_CLASS

/** Keeps horizontally scrolling cells below sticky select/actions columns. */
export function getScrollingCellClassName(columnId: string, options?: StickyClassOptions): string | undefined {
  return getStickyColumnSide(columnId, options?.pinnedLeft, options?.fixedAfterSelectIds)
    ? undefined
    : cn("relative z-0", stickyBodyStateClassName(options))
}

/** Non-corner header cells: sticky top; border/shadow via getHeaderCellStyle on the th. */
export function getScrollingHeaderClassName(
  columnId: string,
  pinnedLeft: readonly string[] = [],
  fixedAfterSelectIds: readonly string[] = [],
): string | undefined {
  return getStickyColumnSide(columnId, pinnedLeft, fixedAfterSelectIds)
    ? undefined
    : cn(headerCellBaseClassName, "z-40")
}

/** Applied to thead — stacking context only; each th owns sticky positioning. */
export function getStickyHeaderRowClassName(): string {
  return stickyOpaqueBackgroundClassName
}

export function resolveLeftStickyColumnIds(
  columnIds: readonly string[],
  pinnedLeft: readonly string[] = [],
  fixedAfterSelectIds: readonly string[] = [],
): string[] {
  const fixedLeft = [STICKY_COLUMN_IDS.SELECT, STICKY_COLUMN_IDS.EXPAND].filter((id) => columnIds.includes(id))
  const fixedAfterSelect = fixedAfterSelectIds.filter((id) => columnIds.includes(id) && !LOCKED_COLUMN_IDS.has(id))
  const fixedAfterSelectSet = new Set(fixedAfterSelect)
  const pinned = pinnedLeft.filter(
    (id) => columnIds.includes(id) && !LOCKED_COLUMN_IDS.has(id) && !fixedAfterSelectSet.has(id),
  )
  return [...fixedLeft, ...fixedAfterSelect, ...pinned]
}

export function getStickyColumnWidthPx(columnId: string, size?: number): number {
  if (isIconStickyColumn(columnId)) {
    return ICON_STICKY_COLUMN_WIDTH_PX
  }

  if (typeof size === "number" && size > 0) {
    return size
  }

  return DEFAULT_PINNED_DATA_COLUMN_WIDTH_PX
}

export function computeLeftStickyOffsets(
  leftStickyColumnIds: readonly string[],
  getColumnWidth: (columnId: string) => number,
): Map<string, number> {
  const offsets = new Map<string, number>()
  let current = 0

  for (const id of leftStickyColumnIds) {
    offsets.set(id, current)
    current += getColumnWidth(id)
  }

  return offsets
}
