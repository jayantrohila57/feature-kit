import { Skeleton } from "@/packages/ui/components/skeleton"
import { cn } from "@/packages/ui/lib/utils"

type BulkExportCsvActionSkeletonProps = {
  className?: string
}

/** Matches `BulkExportCsvAction` button dimensions (`size="sm"`). */
export function BulkExportCsvActionSkeleton({ className }: BulkExportCsvActionSkeletonProps = {}) {
  return (
    <Skeleton
      className={cn("h-6 w-20 shrink-0 rounded-full", className)}
      aria-hidden="true"
    />
  )
}
