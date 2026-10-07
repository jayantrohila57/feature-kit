"use client"

import type { ReactNode } from "react"
import type { FieldSize } from "../constants"

import { Skeleton } from "@/packages/ui/components/skeleton"
import { cn } from "@/packages/ui/lib/utils"

import { FIELD_SKELETON_CONTROL_CLASS } from "../constants"
import { FieldShell } from "./field-shell"

type FieldPendingProps = {
  id: string
  label?: ReactNode | undefined
  description?: ReactNode | undefined
  helperText?: ReactNode | undefined
  required?: boolean | undefined
  size?: FieldSize | undefined
  /** Matches text/select vs textarea control height. */
  control?: "input" | "textarea" | undefined
  rows?: number | undefined
}

/**
 * Same FieldShell + label as the real field; only the control is a skeleton.
 * Heights must match the real Input / Textarea to avoid grid reflow on swap.
 */
export function FieldPending({
  id,
  label,
  description,
  helperText,
  required,
  size = "default",
  control = "input",
}: FieldPendingProps) {
  const controlSkeleton =
    control === "textarea" ? (
      // field-textarea uses `min-h-20` — keep identical
      <Skeleton className="min-h-20 w-full rounded-md" />
    ) : (
      <Skeleton className={cn(FIELD_SKELETON_CONTROL_CLASS[size], "rounded-md")} />
    )

  return (
    <FieldShell
      id={id}
      label={label}
      description={description}
      helperText={helperText}
      required={required}>
      {controlSkeleton}
    </FieldShell>
  )
}
