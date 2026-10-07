"use client"

import type { Column } from "@tanstack/react-table"
import type { ComponentType } from "react"

import { PlusCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"

import { Badge } from "@/packages/ui/components/badge"
import { Button } from "@/packages/ui/components/button"
import { Checkbox } from "@/packages/ui/components/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/packages/ui/components/command"
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/packages/ui/components/popover"
import { Separator } from "@/packages/ui/components/separator"
import {
  MULTI_SELECT_TRIGGER_BADGE_CLASS,
  MULTI_SELECT_TRIGGER_BADGE_COUNT_CLASS,
} from "@/packages/ui/lib/multi-select-badge"
import { cn } from "@/packages/ui/lib/utils"

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  options: {
    label: string
    value: string
    color: string
    icon?: ComponentType<{ className?: string }>
  }[]
  value?: string | null
  onSelect?: (value: string | null) => void
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  value = null,
  onSelect,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const t = useTranslations()
  const [open, setOpen] = useState(false)
  const facets = column?.getFacetedUniqueValues()
  const selectedValues = useMemo(() => {
    if (value !== undefined) {
      return new Set(value ? [value] : [])
    }
    return new Set((column?.getFilterValue() as string[] | undefined) ?? [])
  }, [value, column])

  const clearSelection = () => {
    if (onSelect) {
      onSelect(null)
    } else {
      column?.setFilterValue(undefined)
    }
    setOpen(false)
  }

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-expanded={open}
          className="h-8 border">
          <PlusCircle data-icon="inline-start" />
          {title}
          {selectedValues.size > 0 ? (
            <>
              <Separator
                orientation="vertical"
                className="mx-2 h-4"
              />
              <Badge
                variant="default"
                className={cn(MULTI_SELECT_TRIGGER_BADGE_COUNT_CLASS, "lg:hidden")}>
                {selectedValues.size}
              </Badge>
              <div className="hidden gap-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="default"
                    className={MULTI_SELECT_TRIGGER_BADGE_CLASS}>
                    {t("dataTable.filter.selectedCount", { count: selectedValues.size })}
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="default"
                        key={option.value}
                        className={cn(MULTI_SELECT_TRIGGER_BADGE_CLASS, option.color)}>
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[min(20rem,calc(100vw-2rem))] gap-0 p-0">
        <PopoverHeader className="border-border border-b px-3 py-2.5">
          <PopoverTitle>{title ?? t("dataTable.column.filter")}</PopoverTitle>
        </PopoverHeader>
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>{t("common.noResults")}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (onSelect) {
                        onSelect(isSelected ? null : option.value)
                        setOpen(false)
                        return
                      }
                      const nextValues = new Set(selectedValues)
                      if (isSelected) {
                        nextValues.delete(option.value)
                      } else {
                        nextValues.add(option.value)
                      }
                      const filterValues = Array.from(nextValues)
                      column?.setFilterValue(filterValues.length ? filterValues : undefined)
                    }}>
                    <Checkbox
                      checked={isSelected}
                      className="pointer-events-none"
                      tabIndex={-1}
                      aria-hidden
                    />
                    {option.icon ? <option.icon className={cn("size-4", option.color)} /> : null}
                    <span>{option.label}</span>
                    {facets?.get(option.value) ? (
                      <span className="ms-auto flex size-4 items-center justify-center text-xs">
                        {facets.get(option.value)}
                      </span>
                    ) : null}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 ? (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={clearSelection}
                    className="justify-center text-center">
                    {t("dataTable.filter.clear")}
                  </CommandItem>
                </CommandGroup>
              </>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
