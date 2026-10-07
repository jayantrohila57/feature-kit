"use client"

import { ArrowDown, ArrowUp, X } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/packages/ui/components/button"

export type FilterSortPanelProps = {
  direction: "asc" | "desc" | null
  onSort: (direction: "asc" | "desc") => void
  onClear: () => void
}

/** Sort asc / desc buttons (plus clear when sorted) for one filter definition. */
export function FilterSortPanel({ direction, onSort, onClear }: FilterSortPanelProps) {
  const t = useTranslations()

  return (
    <div className="flex flex-col gap-1 p-2">
      <Button
        type="button"
        variant="ghost"
        aria-pressed={direction === "asc"}
        className="justify-start aria-pressed:bg-muted"
        onClick={() => onSort("asc")}>
        <ArrowUp data-icon="inline-start" />
        {t("dataTable.column.sortAsc")}
      </Button>
      <Button
        type="button"
        variant="ghost"
        aria-pressed={direction === "desc"}
        className="justify-start aria-pressed:bg-muted"
        onClick={() => onSort("desc")}>
        <ArrowDown data-icon="inline-start" />
        {t("dataTable.column.sortDesc")}
      </Button>
      {direction ? (
        <Button
          type="button"
          variant="ghost"
          className="justify-start"
          onClick={onClear}>
          <X data-icon="inline-start" />
          {t("dataTable.column.clearSort")}
        </Button>
      ) : null}
    </div>
  )
}
