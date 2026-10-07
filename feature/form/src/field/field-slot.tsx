"use client"

import type { ReactNode } from "react"

import { cn } from "@/packages/ui/lib/utils"

/**
 * Stable grid item wrapper. Keep `className` (e.g. `lg:col-span-2`) here so
 * skeleton ↔ field swaps never unmount the grid cell.
 */
export function FieldSlot({ className, children }: { className?: string | undefined; children: ReactNode }) {
  return <div className={cn("w-full min-w-0", className)}>{children}</div>
}
