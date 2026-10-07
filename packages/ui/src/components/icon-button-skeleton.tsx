import { cn } from "@/packages/ui/lib/utils"

import { Skeleton } from "./skeleton"

/** Matches `Button size="icon"` (size-7) used in shell headers. */
export function IconButtonSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn("size-7 shrink-0 rounded-md", className)} />
}
