"use client"
// `getIsAllRowsExpanded()` reads a stable table instance that mutates in place on expand.
"use no memo"

import { ChevronsDown, ChevronsUp } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/packages/ui/components/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/packages/ui/components/tooltip"

import { useDataTableContext } from "../core"

/** Toolbar icon toggle that expands or collapses every expandable row. Hidden when none can expand. */
export function DataTableExpandAllToggle() {
  const t = useTranslations()
  const { table } = useDataTableContext()

  if (!table.options.enableExpanding || !table.getCanSomeRowsExpand()) {
    return null
  }

  const allExpanded = table.getIsAllRowsExpanded()
  const label = allExpanded ? t("dataTable.expand.collapseAll") : t("dataTable.expand.expandAll")

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => table.toggleAllRowsExpanded(!allExpanded)}
            aria-pressed={allExpanded}
            aria-label={label}>
            {allExpanded ? <ChevronsUp aria-hidden /> : <ChevronsDown aria-hidden />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
