import type { ReactNode } from "react"

import { cn } from "@/packages/ui/lib/utils"

import { DATA_TABLE_FILTER_CONTENT_CLASS } from "../constants"

type DataTableFilterContentProps = {
  children: ReactNode
  className?: string
}

/** Wraps filter option content so table cell wrappers do not inflate chip/menu rows. */
export function DataTableFilterContent({ children, className }: DataTableFilterContentProps) {
  return <span className={cn(DATA_TABLE_FILTER_CONTENT_CLASS, className)}>{children}</span>
}
