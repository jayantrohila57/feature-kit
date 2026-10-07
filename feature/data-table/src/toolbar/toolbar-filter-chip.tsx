"use client"

import type { DataTableFilterDefinition } from "../filter"

import { ChevronDown, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { Button } from "@/packages/ui/components/button"
import { ButtonGroup } from "@/packages/ui/components/button-group"
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/packages/ui/components/popover"
import { cn } from "@/packages/ui/lib/utils"

import { useDataTableContext } from "../core"
import { FILTER_ACTIVE_DOT_CLASS, FILTER_CHIP_TRIGGER_CLASS, FilterPanelContent } from "../filter"

const CHIP_KINDS = ["search", "options"] as const

export type DataTableToolbarFilterChipProps = {
  definition: DataTableFilterDefinition
  /** When false, the chip has no ✕ (pinned by the table rather than added by the user). */
  removable?: boolean
}

/** `Label ▾ (+ dot when applied) | ✕` — search and/or distinct values for one hidden-column filter. */
export function DataTableToolbarFilterChip<TData>({ definition, removable = true }: DataTableToolbarFilterChipProps) {
  const t = useTranslations()
  const { filters, columnSearch, removeFilter } = useDataTableContext<TData>()
  const [open, setOpen] = useState(false)
  const hasApplied =
    (filters?.[definition.key]?.length ?? 0) > 0 ||
    (definition.search && (columnSearch?.[definition.key]?.trim() ?? "") !== "")

  return (
    <ButtonGroup
      className="h-7 shrink-0"
      aria-label={definition.label}>
      <Popover
        open={open}
        onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            aria-expanded={open}
            className={FILTER_CHIP_TRIGGER_CLASS}>
            <span className="text-foreground">{definition.label}</span>
            <span className="relative inline-flex shrink-0 items-center">
              <ChevronDown
                data-icon="inline-end"
                className={cn(hasApplied ? "text-foreground" : "text-muted-foreground")}
                aria-hidden
              />
              {hasApplied ? (
                <span
                  className={FILTER_ACTIVE_DOT_CLASS}
                  aria-hidden
                />
              ) : null}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[min(20rem,calc(100vw-2rem))] gap-0 p-0">
          <PopoverHeader className="border-border border-b px-3 py-2.5">
            <PopoverTitle>{definition.label}</PopoverTitle>
          </PopoverHeader>
          <FilterPanelContent
            definition={definition}
            kinds={CHIP_KINDS}
            menuOpen={open}
            onClose={() => setOpen(false)}
          />
        </PopoverContent>
      </Popover>
      {removable && removeFilter ? (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="text-muted-foreground hover:text-destructive"
          aria-label={t("dataTable.filter.removeFilter", { field: definition.label })}
          onClick={() => removeFilter(definition.key)}>
          <X aria-hidden />
        </Button>
      ) : null}
    </ButtonGroup>
  )
}
