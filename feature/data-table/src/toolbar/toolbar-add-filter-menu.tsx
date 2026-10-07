"use client"
// Reads column visibility off the stable, in-place mutating TanStack table instance during render.
"use no memo"

import { ListFilter, Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { Button } from "@/packages/ui/components/button"
import { Checkbox } from "@/packages/ui/components/checkbox"
import { Label } from "@/packages/ui/components/label"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/packages/ui/components/popover"
import { cn } from "@/packages/ui/lib/utils"

import { DATA_TABLE_TOOLBAR_FILTER_TRIGGER_CLASS } from "../constants"
import { useDataTableContext } from "../core"
import { buildAddedFilterKeysFromSelection } from "../filter"
import { getToolbarFilterDefinitions } from "./utils"

export type DataTableToolbarAddFilterMenuProps = {
  /** When true, omits outer layout wrapper for use inside {@link ButtonGroup}. */
  embedded?: boolean
}

/**
 * Toolbar filter visibility manager: checkbox draft for which filters appear as chips.
 * Lists only fields whose column is hidden (visible columns already filter from their header).
 * Apply persists visibility and clears URL values for unchecked filters.
 * Clear all hides every listed filter and clears their URL values immediately.
 */
export function DataTableToolbarAddFilterMenu<TData>({ embedded = false }: DataTableToolbarAddFilterMenuProps) {
  const t = useTranslations()
  const {
    table,
    filterDefinitions = [],
    addedFilterKeys = [],
    setAddedFilterKeys,
    filters,
    columnSearch,
    setFilter,
    setColumnSearch,
    headerFilters = true,
  } = useDataTableContext<TData>()

  // Recomputed every render: column visibility lives on the (stable) table instance.
  const optionDefinitions = getToolbarFilterDefinitions(filterDefinitions, table, headerFilters)
  const optionKeys = optionDefinitions.map((definition) => definition.key)

  const [open, setOpen] = useState(false)
  const [draftSelected, setDraftSelected] = useState<ReadonlySet<string>>(() => new Set())

  if (optionDefinitions.length === 0 || !setAddedFilterKeys) {
    return null
  }

  const beginDraft = () => {
    setDraftSelected(new Set(addedFilterKeys))
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      beginDraft()
    }
    setOpen(nextOpen)
  }

  const toggleDraftKey = (key: string, checked: boolean) => {
    setDraftSelected((current) => {
      const next = new Set(current)
      if (checked) {
        next.add(key)
      } else {
        next.delete(key)
      }
      return next
    })
  }

  // Clear only filters that actually hold a value, one URL write each.
  const clearOptionFilterValues = (keysToClear: readonly string[]) => {
    for (const key of keysToClear) {
      const definition = optionDefinitions.find((entry) => entry.key === key)
      if (!definition) {
        continue
      }
      if (definition.options !== null && (filters?.[key]?.length ?? 0) > 0) {
        setFilter?.(key, null)
      }
      if (definition.search && (columnSearch?.[key]?.trim() ?? "") !== "") {
        setColumnSearch?.(key, null)
      }
    }
  }

  const handleClearAll = () => {
    setDraftSelected(new Set())
    setAddedFilterKeys([])
    clearOptionFilterValues(optionKeys)
  }

  const handleApply = () => {
    const next = buildAddedFilterKeysFromSelection(draftSelected, optionKeys)
    setAddedFilterKeys(next)
    const removedKeys = optionKeys.filter((key) => !draftSelected.has(key))
    clearOptionFilterValues(removedKeys)
    setOpen(false)
  }

  const label = t("dataTable.filter.addFilter")
  const checkedCount = draftSelected.size

  const trigger = (
    <PopoverTrigger asChild>
      <Button
        type="button"
        variant="outline"
        className={cn(DATA_TABLE_TOOLBAR_FILTER_TRIGGER_CLASS, embedded && "rounded-s-none border-s-0")}
        aria-label={label}>
        <Plus
          data-icon="inline-start"
          aria-hidden
        />
        <span>{label}</span>
      </Button>
    </PopoverTrigger>
  )

  const panel = (
    <PopoverContent
      align="start"
      className="w-[min(20rem,calc(100vw-2rem))] gap-0 overflow-hidden p-0">
      <PopoverHeader className="gap-1.5 border-border border-b bg-muted/20 px-3 py-2">
        <div className="flex items-start gap-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <ListFilter
              className="size-4"
              aria-hidden
            />
          </span>
          <div className="min-w-0">
            <PopoverTitle>{label}</PopoverTitle>
            <PopoverDescription className="mt-0.5">{t("dataTable.filter.addFilterHint")}</PopoverDescription>
          </div>
        </div>
      </PopoverHeader>

      <ul className="m-0 flex max-h-72 list-none flex-col gap-1 overflow-y-auto p-2">
        {optionDefinitions.map((definition) => {
          const inputId = `toolbar-add-filter-${definition.key}`
          const checked = draftSelected.has(definition.key)
          return (
            <li key={definition.key}>
              <div className="flex items-center gap-2 rounded-md px-1 py-1 hover:bg-muted/40">
                <Checkbox
                  id={inputId}
                  checked={checked}
                  onCheckedChange={(value) => toggleDraftKey(definition.key, value === true)}
                />
                <Label
                  htmlFor={inputId}
                  className="min-w-0 flex-1 cursor-pointer font-normal">
                  <span className="truncate">{definition.label}</span>
                </Label>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="flex items-center justify-between gap-2 border-border border-t bg-muted/20 px-3 py-2">
        <span className="text-muted-foreground text-xs">
          {t("dataTable.filter.addFilterSelectedCount", { count: checkedCount })}
        </span>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={handleClearAll}>
            {t("dataTable.filter.clearAdded")}
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-8"
            onClick={handleApply}>
            {t("dataTable.filter.apply")}
          </Button>
        </div>
      </div>
    </PopoverContent>
  )

  const popover = (
    <Popover
      open={open}
      onOpenChange={handleOpenChange}>
      {trigger}
      {panel}
    </Popover>
  )

  if (embedded) {
    return popover
  }

  return <div className="flex h-10 shrink-0 items-center">{popover}</div>
}
