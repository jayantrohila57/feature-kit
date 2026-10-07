"use client"
// Selection flags come from the stable, in-place mutating TanStack table instance.
"use no memo"

import type { Table } from "@tanstack/react-table"

import { useTranslations } from "next-intl"

import { Checkbox } from "@/packages/ui/components/checkbox"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/packages/ui/components/tooltip"

import { STICKY_CELL_CONTENT_CLASS } from "../column/column-sticky-classes"
import { usePageSelectionCheckboxState } from "./selection-use-row-selected"

export function DataTableSelectAllCheckbox<T>({ table }: { table: Table<T> }) {
  const t = useTranslations()
  const pageRows = table.getRowModel().rows
  const { allPageSelected, somePageSelected } = usePageSelectionCheckboxState(pageRows)
  const tooltipKey =
    allPageSelected || somePageSelected
      ? "dataTable.selection.deselectAllOnPage"
      : "dataTable.selection.selectAllOnPage"

  return (
    <div className={STICKY_CELL_CONTENT_CLASS}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center justify-center">
            <Checkbox
              checked={allPageSelected ? true : somePageSelected ? "indeterminate" : false}
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label={t(tooltipKey)}
            />
          </span>
        </TooltipTrigger>
        <TooltipContent>{t(tooltipKey)}</TooltipContent>
      </Tooltip>
    </div>
  )
}
