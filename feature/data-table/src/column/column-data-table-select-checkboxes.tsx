"use client"
// `row.getIsSelected()` reads a stable row object that mutates in place on selection.
"use no memo"

import type { Row } from "@tanstack/react-table"

import { useTranslations } from "next-intl"

import { Checkbox } from "@/packages/ui/components/checkbox"

import { useIsRowSelected } from "../selection/selection-use-row-selected"
import { STICKY_CELL_CONTENT_CLASS } from "./column-sticky-classes"

export { DataTableSelectAllCheckbox } from "../selection/selection-select-all-checkbox"

export function DataTableSelectRowCheckbox<T>({ row }: { row: Row<T> }) {
  const t = useTranslations()
  const checked = useIsRowSelected(row)

  return (
    <div className={STICKY_CELL_CONTENT_CLASS}>
      <Checkbox
        checked={checked}
        disabled={!row.getCanSelect()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={t("dataTable.column.selectRow")}
      />
    </div>
  )
}
