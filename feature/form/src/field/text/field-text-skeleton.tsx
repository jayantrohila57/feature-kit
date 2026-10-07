"use client"

import type { FieldSize } from "../../constants"

import { FieldControlSkeleton } from "../field-control-skeleton"

type FieldTextSkeletonProps = {
  size?: FieldSize | undefined
  className?: string | undefined
  withLabel?: boolean | undefined
}

export function FieldTextSkeleton({ size = "default", className, withLabel = true }: FieldTextSkeletonProps) {
  return (
    <FieldControlSkeleton
      size={size}
      className={className}
      withLabel={withLabel}
    />
  )
}
