"use client"

import type { ComponentProps, ReactNode, RefObject } from "react"

import { ArrowDown } from "lucide-react"
import { useRef } from "react"

import { Button } from "@/packages/ui/components/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/packages/ui/components/tooltip"
import { cn } from "@/packages/ui/lib/utils"

import { useScrollOverflowHint } from "./common-use-scroll-overflow-hint"

type ScrollOverflowHintIndicatorProps = {
  show: boolean
  tooltip: string
  onActivate: () => void
  className?: string
}

export function ScrollOverflowHintIndicator({
  show,
  tooltip,
  onActivate,
  className,
}: ScrollOverflowHintIndicatorProps) {
  if (!show) return null

  return (
    <div
      className={cn("pointer-events-none absolute inset-x-0 z-20 flex justify-center", className ?? "bottom-4")}
      aria-hidden={!show}>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="pointer-events-auto size-8 rounded-full border-border bg-background shadow-sm"
              aria-label={tooltip}
              onClick={onActivate}>
              <ArrowDown
                className="size-4"
                aria-hidden
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">{tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

type ScrollOverflowHintContainerProps = {
  children: ReactNode
  className?: string
  scrollClassName?: string
  tooltip: string
  hintClassName?: string
  scrollProps?: Omit<ComponentProps<"div">, "children" | "className" | "ref">
}

/** Scrollable region with a centered bottom hint when more content is available above the fold. */
export function ScrollOverflowHintContainer({
  children,
  className,
  scrollClassName,
  tooltip,
  hintClassName,
  scrollProps,
}: ScrollOverflowHintContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { showHint, scrollDown } = useScrollOverflowHint(scrollRef)

  return (
    <div className={cn("relative min-h-0", className)}>
      <div
        ref={scrollRef}
        className={scrollClassName}
        {...scrollProps}>
        {children}
      </div>
      <ScrollOverflowHintIndicator
        show={showHint}
        tooltip={tooltip}
        onActivate={scrollDown}
        {...(hintClassName ? { className: hintClassName } : {})}
      />
    </div>
  )
}

type ScrollOverflowHintTargetProps = {
  scrollRef: RefObject<HTMLElement | null>
  tooltip: string
  hintClassName?: string
}

/** Hint overlay for an existing scroll container (dialogs, custom panels). */
export function ScrollOverflowHintTarget({ scrollRef, tooltip, hintClassName }: ScrollOverflowHintTargetProps) {
  const { showHint, scrollDown } = useScrollOverflowHint(scrollRef)

  return (
    <ScrollOverflowHintIndicator
      show={showHint}
      tooltip={tooltip}
      onActivate={scrollDown}
      {...(hintClassName ? { className: hintClassName } : {})}
    />
  )
}
