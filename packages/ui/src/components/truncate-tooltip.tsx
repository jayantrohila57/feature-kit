"use client"

import type * as React from "react"

import { useLayoutEffect, useRef, useState } from "react"

import { cn } from "@/packages/ui/lib/utils"

import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

type TruncateTooltipProps = {
  children: React.ReactNode
  /** Tooltip text. Defaults to `children` when it is a string. */
  content?: string
  side?: React.ComponentProps<typeof TooltipContent>["side"]
  className?: string
}

function TruncateTooltip({ children, content, side = "bottom", className }: TruncateTooltipProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [overflows, setOverflows] = useState(false)
  const tooltipText = content ?? (typeof children === "string" ? children : "")

  useLayoutEffect(() => {
    const node = ref.current
    if (!node) {
      setOverflows(false)
      return
    }

    const checkOverflow = () => {
      setOverflows(tooltipText.length > 0 && node.scrollWidth > node.clientWidth)
    }

    checkOverflow()

    const observer = new ResizeObserver(checkOverflow)
    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [tooltipText])

  const label = (
    <span
      ref={ref}
      className={cn("block min-w-0 truncate", className)}>
      {children}
    </span>
  )

  if (!tooltipText) {
    return label
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{label}</TooltipTrigger>
      {overflows ? <TooltipContent side={side}>{tooltipText}</TooltipContent> : null}
    </Tooltip>
  )
}

export { TruncateTooltip }
