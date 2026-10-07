"use client"

import { type Dispatch, type RefObject, type SetStateAction, useLayoutEffect, useMemo, useRef, useState } from "react"

import { computeLeftStickyOffsets } from "./column-sticky-classes"
import { measureLeftStickyOffsetsFromDom } from "./column-sticky-offsets"

const TABLE_SELECTOR = "table[data-slot='table']"

function offsetsEqual(left: Map<string, number>, right: Map<string, number>): boolean {
  if (left.size !== right.size) {
    return false
  }

  for (const [id, offset] of left) {
    if (right.get(id) !== offset) {
      return false
    }
  }

  return true
}

function setOffsetsIfChanged(
  setOffsets: Dispatch<SetStateAction<Map<string, number>>>,
  next: Map<string, number>,
): void {
  setOffsets((previous) => (offsetsEqual(previous, next) ? previous : next))
}

type UseMeasuredLeftStickyOffsetsOptions = {
  containerRef: RefObject<HTMLElement | null>
  leftStickyColumnIds: readonly string[]
  getFallbackColumnWidth: (columnId: string) => number
  /** Serialized deps that change rendered column widths (order, visibility, data). */
  measureKey: string
}

/**
 * Sticky `left` offsets from measured header cell widths so pinned columns sit flush.
 * TanStack `column.getSize()` defaults do not match auto-sized table layout.
 */
export function useMeasuredLeftStickyOffsets({
  containerRef,
  leftStickyColumnIds,
  getFallbackColumnWidth,
  measureKey,
}: UseMeasuredLeftStickyOffsetsOptions): Map<string, number> {
  const getFallbackColumnWidthRef = useRef(getFallbackColumnWidth)
  getFallbackColumnWidthRef.current = getFallbackColumnWidth

  const leftStickyColumnIdsRef = useRef(leftStickyColumnIds)
  leftStickyColumnIdsRef.current = leftStickyColumnIds

  const fallbackOffsets = useMemo(
    () => computeLeftStickyOffsets(leftStickyColumnIds, getFallbackColumnWidth),
    [getFallbackColumnWidth, leftStickyColumnIds],
  )
  const [offsets, setOffsets] = useState<Map<string, number>>(fallbackOffsets)

  useLayoutEffect(() => {
    if (!measureKey) {
      return
    }

    const ids = leftStickyColumnIdsRef.current

    const computeFallback = () =>
      computeLeftStickyOffsets(ids, (columnId) => getFallbackColumnWidthRef.current(columnId))

    const container = containerRef.current
    if (!container || ids.length === 0) {
      setOffsetsIfChanged(setOffsets, computeFallback())
      return
    }

    const tableElement = container.querySelector(TABLE_SELECTOR)
    if (!(tableElement instanceof HTMLTableElement)) {
      setOffsetsIfChanged(setOffsets, computeFallback())
      return
    }

    const measure = () => {
      const measured = measureLeftStickyOffsetsFromDom(tableElement, ids)
      setOffsetsIfChanged(setOffsets, measured)
    }

    measure()

    let resizeFrame = 0
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame)
      resizeFrame = requestAnimationFrame(() => {
        measure()
      })
    })
    observer.observe(tableElement)
    return () => {
      cancelAnimationFrame(resizeFrame)
      observer.disconnect()
    }
  }, [containerRef, measureKey])

  return offsets
}
