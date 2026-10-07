"use client"

import type { FieldSize } from "../../constants"

import { Skeleton } from "@/packages/ui/components/skeleton"
import { cn } from "@/packages/ui/lib/utils"

type FieldTextareaSkeletonProps = {
  size?: FieldSize | undefined
  className?: string | undefined
  withLabel?: boolean | undefined
  rows?: number | undefined
}

export function FieldTextareaSkeleton({ className, withLabel = true, rows = 3 }: FieldTextareaSkeletonProps) {
  const minHeight = Math.max(4.5, rows * 1.5)

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      {withLabel ? <Skeleton className="h-3 w-20" /> : null}
      <Skeleton
        className="w-full rounded-md"
        style={{ minHeight: `${minHeight}rem` }}
      />
    </div>
  )
}
