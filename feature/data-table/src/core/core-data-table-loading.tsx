import { Card, CardContent, CardFooter } from "@/packages/ui/components/card"
import { Skeleton } from "@/packages/ui/components/skeleton"
import { cn } from "@/packages/ui/lib/utils"

import { DATA_TABLE_PAGINATION_FOOTER_CLASS } from "../constants"

const ROW_KEYS = ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8"] as const
const COL_WIDTHS = [
  { id: "col-1", className: "w-12" },
  { id: "col-2", className: "w-32" },
  { id: "col-3", className: "w-24" },
  { id: "col-4", className: "w-20" },
  { id: "col-5", className: "w-28" },
  { id: "col-6", className: "w-20" },
  { id: "col-7", className: "w-16" },
] as const

const DEFAULT_SHELL_CLASS =
  "mt-2 flex h-auto min-h-0 flex-1 flex-col justify-between gap-0 border-0 bg-transparent p-2 pt-0 shadow-none ring-0"
const DEFAULT_BODY_CLASS = "min-h-0 flex-1"

type DataTableLoadingProps = {
  shellClassName?: string
  bodyHeightClassName?: string
}

/**
 * Matches {@link DataTable} chrome so `useSearchParams()` suspense does not
 * leave an empty white hole after the route `loading.tsx` unmounts.
 */
export function DataTableLoading({ shellClassName, bodyHeightClassName }: DataTableLoadingProps = {}) {
  return (
    <Card className={shellClassName ?? DEFAULT_SHELL_CLASS}>
      <CardContent className="shrink-0 rounded-t-lg border border-border bg-card p-2">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-10 w-full max-w-xl rounded-md" />
          <div className="flex shrink-0 items-center gap-2">
            <Skeleton className="size-10 rounded-md" />
            <Skeleton className="size-10 rounded-md" />
            <Skeleton className="size-10 rounded-md" />
          </div>
        </div>
      </CardContent>
      <CardContent
        className={cn(
          "relative flex flex-col rounded-none border-x bg-background p-0",
          bodyHeightClassName ?? DEFAULT_BODY_CLASS,
        )}>
        <div className="flex items-center gap-4 border-border border-b bg-background px-3 py-2.5">
          <Skeleton className="size-4" />
          {COL_WIDTHS.map(({ id, className }) => (
            <Skeleton
              key={id}
              className={`h-3.5 ${className}`}
            />
          ))}
        </div>
        {ROW_KEYS.map((rowKey) => (
          <div
            key={rowKey}
            className="flex items-center gap-4 border-border border-b px-3 py-3 last:border-b-0">
            <Skeleton className="size-4" />
            {COL_WIDTHS.map(({ id, className }) => (
              <Skeleton
                key={`${rowKey}-${id}`}
                className={`h-3.5 ${className}`}
              />
            ))}
          </div>
        ))}
      </CardContent>
      <CardFooter className="h-10 w-full shrink-0 rounded-b-lg border bg-card p-0">
        <div className={DATA_TABLE_PAGINATION_FOOTER_CLASS}>
          <Skeleton className="h-3.5 w-32" />
          <div className="flex shrink-0 items-center gap-2">
            <Skeleton className="h-8 w-16 rounded-md" />
            <Skeleton className="size-8 rounded-md" />
            <Skeleton className="size-8 rounded-md" />
            <Skeleton className="h-8 w-16 rounded-md" />
          </div>
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
      </CardFooter>
    </Card>
  )
}
