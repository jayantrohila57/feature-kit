"use client"

import type { FieldSize } from "../constants"

import { Skeleton } from "@/packages/ui/components/skeleton"
import { cn } from "@/packages/ui/lib/utils"

import { FIELD_SKELETON_CONTROL_CLASS } from "../constants"

type FieldControlSkeletonProps = {
  size?: FieldSize | undefined
  className?: string | undefined
  withLabel?: boolean | undefined
}

export function FieldControlSkeleton({ size = "default", className, withLabel = true }: FieldControlSkeletonProps) {
  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      {withLabel ? <Skeleton className="h-3 w-20" /> : null}
      <Skeleton className={FIELD_SKELETON_CONTROL_CLASS[size]} />
    </div>
  )
}
