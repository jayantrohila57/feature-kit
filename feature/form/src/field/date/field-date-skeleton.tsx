"use client"

import type { FieldSize } from "../../constants"

import { FieldControlSkeleton } from "../field-control-skeleton"

export function FieldDateSkeleton({
  size = "default",
  className,
}: {
  size?: FieldSize | undefined
  className?: string | undefined
}) {
  return (
    <FieldControlSkeleton
      size={size}
      className={className}
    />
  )
}
