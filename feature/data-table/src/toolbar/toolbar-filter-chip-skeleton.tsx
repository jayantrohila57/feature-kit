import { Skeleton } from "@/packages/ui/components/skeleton"
import { cn } from "@/packages/ui/lib/utils"

import { FILTER_CHIP_SKELETON_CLASS } from "../filter"

/** Matches the `DataTableToolbarFilterChip` footprint while filter preferences hydrate. */
export function DataTableToolbarFilterChipSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn(FILTER_CHIP_SKELETON_CLASS, "shrink-0", className)} />
}
