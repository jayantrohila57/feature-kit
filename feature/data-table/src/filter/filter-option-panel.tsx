"use client"

import type { ColumnFilterOption } from "../view-options/view-options-types"

import { useTranslations } from "next-intl"

import { Button } from "@/packages/ui/components/button"
import { Checkbox } from "@/packages/ui/components/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/packages/ui/components/command"
import { cn } from "@/packages/ui/lib/utils"

import { DATA_TABLE_FILTER_CONTENT_CLASS } from "../constants"

export type FilterOptionPanelProps = {
  options: readonly ColumnFilterOption[]
  /** When false, selecting an option replaces the current selection. Default true. */
  multi?: boolean
  matchesValue?: (appliedValue: string, optionValue: string) => boolean
  /** Resolved display title (already translated). */
  title?: string
  appliedValues: string[]
  /** Kept for API compatibility; selections apply immediately so no draft needs resetting. */
  menuOpen?: boolean
  onApply: (values: string[]) => void
  onClear: () => void
}

/** Checkbox list of distinct values; each toggle applies immediately (no Apply step). */
export function FilterOptionPanel({
  options,
  multi = true,
  matchesValue,
  title,
  appliedValues,
  onApply,
  onClear,
}: FilterOptionPanelProps) {
  const t = useTranslations()
  const hasAppliedFilter = appliedValues.length > 0
  const groupHeading = title?.trim() ? title : t("dataTable.column.filter")
  const matches = matchesValue ?? ((applied: string, candidate: string) => applied === candidate)

  const toggleValue = (value: string) => {
    if (appliedValues.some((applied) => matches(applied, value))) {
      onApply(appliedValues.filter((applied) => !matches(applied, value)))
      return
    }
    onApply(multi ? [...appliedValues, value] : [value])
  }

  return (
    <div className="flex flex-col">
      <Command
        shouldFilter
        className="rounded-none border-0 bg-transparent shadow-none">
        <CommandInput placeholder={t("dataTable.column.filterSearch")} />
        <CommandList className="max-h-60">
          <CommandEmpty>{t("common.noResults")}</CommandEmpty>
          <CommandGroup heading={groupHeading}>
            {options.map((option) => {
              const isSelected = appliedValues.some((applied) => matches(applied, option.value))
              const searchValue = option.searchText ?? option.label

              return (
                <CommandItem
                  key={option.value}
                  value={searchValue}
                  onSelect={() => {
                    toggleValue(option.value)
                  }}
                  className="group/command-item gap-2">
                  <Checkbox
                    checked={isSelected}
                    className="pointer-events-none"
                    tabIndex={-1}
                    aria-hidden
                  />
                  <span className={cn("flex min-w-0 flex-1 items-center", DATA_TABLE_FILTER_CONTENT_CLASS)}>
                    {option.content ?? (
                      <>
                        {option.icon ? <option.icon className={cn("size-4", option.color)} /> : null}
                        {option.label}
                      </>
                    )}
                  </span>
                </CommandItem>
              )
            })}
          </CommandGroup>
        </CommandList>
      </Command>
      {hasAppliedFilter ? (
        <div className="flex justify-end border-t px-2 py-1.5">
          <Button
            type="button"
            variant="link"
            size="sm"
            className="h-auto p-0 text-muted-foreground text-xs"
            onClick={onClear}>
            {t("dataTable.column.clearFilter")}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
