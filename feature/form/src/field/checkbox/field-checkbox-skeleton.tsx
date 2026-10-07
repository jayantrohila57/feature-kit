"use client"

import { FieldControlSkeleton } from "../field-control-skeleton"

export function FieldCheckboxSkeleton({ className }: { className?: string | undefined } = {}) {
  return (
    <FieldControlSkeleton
      size="sm"
      className={className}
    />
  )
}
