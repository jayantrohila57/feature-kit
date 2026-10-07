"use client"
// `row.getIsExpanded()` reads a stable row object that mutates in place on expand.
"use no memo"

import type { Row } from "@tanstack/react-table"

import { ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/packages/ui/components/button"
import { cn } from "@/packages/ui/lib/utils"

import { STICKY_CELL_CONTENT_CLASS } from "../column"

export function DataTableExpandToggle<TData>({ row }: { row: Row<TData> }) {
  const t = useTranslations()
  const canExpand = row.getCanExpand()
  const isExpanded = row.getIsExpanded()

  if (!canExpand) {
    return <div className={STICKY_CELL_CONTENT_CLASS} />
  }

  return (
    <div className={STICKY_CELL_CONTENT_CLASS}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-7"
        aria-expanded={isExpanded}
        aria-label={isExpanded ? t("dataTable.column.collapseRow") : t("dataTable.column.expandRow")}
        onClick={() => row.toggleExpanded()}>
        <ChevronRight className={cn("size-4 transition-transform", isExpanded && "rotate-90")} />
      </Button>
    </div>
  )
}
