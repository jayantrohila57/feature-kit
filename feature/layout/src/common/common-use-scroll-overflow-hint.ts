"use client"

import type { RefObject } from "react"

import { useCallback, useEffect, useState } from "react"

import {
  SCROLL_OVERFLOW_HINT_OVERFLOW_TOLERANCE_PX,
  SCROLL_OVERFLOW_HINT_SCROLL_STEP_RATIO,
  SCROLL_OVERFLOW_HINT_TOP_THRESHOLD_PX,
} from "./constants/constants-scroll-overflow-hint"

function canScrollDown(element: HTMLElement): boolean {
  return (
    element.scrollHeight > element.clientHeight + SCROLL_OVERFLOW_HINT_OVERFLOW_TOLERANCE_PX &&
    element.scrollTop <= SCROLL_OVERFLOW_HINT_TOP_THRESHOLD_PX
  )
}

export function useScrollOverflowHint(scrollRef: RefObject<HTMLElement | null>) {
  const [showHint, setShowHint] = useState(false)

  const updateHint = useCallback(() => {
    const element = scrollRef.current
    if (!element) {
      setShowHint(false)
      return
    }
    setShowHint(canScrollDown(element))
  }, [scrollRef])

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    updateHint()

    const resizeObserver = new ResizeObserver(updateHint)
    resizeObserver.observe(element)

    const mutationObserver = new MutationObserver(updateHint)
    mutationObserver.observe(element, { childList: true, subtree: true, attributes: true, characterData: true })

    element.addEventListener("scroll", updateHint, { passive: true })
    window.addEventListener("resize", updateHint, { passive: true })

    return () => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
      element.removeEventListener("scroll", updateHint)
      window.removeEventListener("resize", updateHint)
    }
  }, [scrollRef, updateHint])

  const scrollDown = useCallback(() => {
    const element = scrollRef.current
    if (!element) return

    const remaining = element.scrollHeight - element.scrollTop - element.clientHeight
    const step = Math.max(element.clientHeight * SCROLL_OVERFLOW_HINT_SCROLL_STEP_RATIO, 120)
    element.scrollBy({ top: Math.min(step, remaining), behavior: "smooth" })
  }, [scrollRef])

  return { showHint, scrollDown, updateHint }
}
