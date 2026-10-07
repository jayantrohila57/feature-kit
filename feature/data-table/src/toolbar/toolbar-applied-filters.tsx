"use client"
// Reads columns off the stable, in-place mutating TanStack table instance during render.
"use no memo"

import type { AppliedFilterGroup, AppliedFilterValue } from "./utils"

import { Filter, ListFilter, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { Fragment, useMemo, useState } from "react"

import { Badge } from "@/packages/ui/components/badge"
import { Button } from "@/packages/ui/components/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/packages/ui/components/popover"
import { Separator } from "@/packages/ui/components/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/packages/ui/components/tooltip"
import { cn } from "@/packages/ui/lib/utils"

import {
  DATA_TABLE_APPLIED_FILTER_CHIP_CLASS,
  DATA_TABLE_FILTER_COUNT_BADGE_CLASS,
  DATA_TABLE_TOOLBAR_FILTER_BUTTON_GROUP_LEFT_CLASS,
  DATA_TABLE_TOOLBAR_FILTER_TRIGGER_CLASS,
} from "../constants"
import { useDataTableContext } from "../core"
import { DataTableFilterContent } from "./toolbar-filter-content"
import { resolveAppliedFilterGroups, resolveAppliedFilterGroupsFromDefinitions } from "./utils"

type AppliedFilterValueChipProps = {
  group: AppliedFilterGroup
  entry: AppliedFilterValue
  onRemove: () => void
}

function AppliedFilterValueChip({ group, entry, onRemove }: AppliedFilterValueChipProps) {
  const t = useTranslations()
  const valueLabel = entry.option?.label ?? entry.value
  const clearLabel = t("dataTable.filter.clearValueTooltip", {
    field: group.fieldLabel,
    value: valueLabel,
  })

  return (
    <li className={DATA_TABLE_APPLIED_FILTER_CHIP_CLASS}>
      <DataTableFilterContent className="min-w-0 flex-1">{entry.option?.content ?? valueLabel}</DataTableFilterContent>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        className="shrink-0 text-muted-foreground hover:text-destructive"
        aria-label={clearLabel}
        onClick={(event) => {
          event.stopPropagation()
          onRemove()
        }}>
        <X className="size-3" />
      </Button>
    </li>
  )
}

type AppliedFilterGroupSectionProps = {
  group: AppliedFilterGroup
  onClearField: () => void
  onClearValue: (value: string) => void
}

function AppliedFilterGroupSection({ group, onClearField, onClearValue }: AppliedFilterGroupSectionProps) {
  const t = useTranslations()

  return (
    <section className="flex flex-col gap-1.5 px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <h3 className="min-w-0 font-semibold text-foreground text-xs">{group.fieldLabel}</h3>
          <Badge
            variant="secondary"
            className="h-5 rounded-full px-1.5 font-normal tabular-nums">
            {group.values.length}
          </Badge>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="size-6 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          aria-label={t("dataTable.filter.clearField", { field: group.fieldLabel })}
          onClick={(event) => {
            event.stopPropagation()
            onClearField()
          }}>
          <X aria-hidden />
        </Button>
      </div>
      <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
        {group.values.map((entry) => (
          <AppliedFilterValueChip
            key={entry.id}
            group={group}
            entry={entry}
            onRemove={() => onClearValue(entry.value)}
          />
        ))}
      </ul>
    </section>
  )
}

/**
 * Common-filter icon button: opens the applied-filters summary popover.
 * Always rendered (disabled when nothing is applied) so the toolbar never shifts.
 */
export type DataTableAppliedFiltersProps = {
  /** When true, omits outer layout wrapper for use inside {@link ButtonGroup}. */
  embedded?: boolean
}

export function DataTableAppliedFilters<TData>({ embedded = false }: DataTableAppliedFiltersProps) {
  const t = useTranslations()
  const { table, filters, columnSearch, filterDefinitions, setFilter, setColumnSearch, clearFilters } =
    useDataTableContext<TData>()
  const [open, setOpen] = useState(false)

  const groups = useMemo(
    () =>
      filterDefinitions
        ? resolveAppliedFilterGroupsFromDefinitions(filterDefinitions, filters, columnSearch)
        : resolveAppliedFilterGroups(table, filters, t),
    [columnSearch, filterDefinitions, filters, t, table],
  )
  const activeFieldCount = groups.length
  const activeValueCount = useMemo(() => groups.reduce((total, group) => total + group.values.length, 0), [groups])
  const hasApplied = groups.length > 0

  const clearValue = (group: AppliedFilterGroup, value: string) => {
    if (group.kind === "search") {
      setColumnSearch?.(group.urlKey, null)
      return
    }
    const current = filters?.[group.urlKey] ?? []
    const remaining = current.filter((entry) => entry !== value)
    setFilter?.(group.urlKey, remaining.length > 0 ? remaining : null)
  }

  const clearField = (group: AppliedFilterGroup) => {
    if (group.kind === "search") {
      setColumnSearch?.(group.urlKey, null)
      return
    }
    setFilter?.(group.urlKey, null)
  }

  const clearAll = () => {
    // Clear through the complete filter contract (definition keys, `cs.*`, `q`, legacy shared keys).
    // The core decides the key list so route-level redirect filters are cleared too.
    clearFilters?.()
    setOpen(false)
  }

  const triggerLabel = hasApplied
    ? t("dataTable.filter.activeValues", { count: activeValueCount })
    : t("dataTable.filter.iconButtonTooltip")

  const content = (
    <Popover
      open={open && hasApplied}
      onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className={cn(
                  DATA_TABLE_TOOLBAR_FILTER_TRIGGER_CLASS,
                  "relative w-7",
                  embedded && DATA_TABLE_TOOLBAR_FILTER_BUTTON_GROUP_LEFT_CLASS,
                  embedded && !hasApplied && "text-muted-foreground",
                )}
                disabled={!hasApplied}
                aria-label={triggerLabel}
                aria-expanded={open && hasApplied}>
                <Filter aria-hidden />
                {hasApplied ? (
                  <Badge
                    variant="outline"
                    aria-hidden
                    className={cn(DATA_TABLE_FILTER_COUNT_BADGE_CLASS, "absolute -end-1.5 -top-1.5 ms-0 h-4 px-1")}>
                    {activeFieldCount}
                  </Badge>
                ) : null}
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>{triggerLabel}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent
        align="start"
        className="w-[min(24rem,calc(100vw-2rem))] gap-0 overflow-hidden p-0">
        <PopoverHeader className="gap-1.5 border-border border-b bg-muted/20 px-3 py-2">
          <div className="flex items-start gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <ListFilter
                className="size-4"
                aria-hidden
              />
            </span>
            <div className="min-w-0">
              <PopoverTitle>{t("dataTable.filter.appliedAria")}</PopoverTitle>
              <PopoverDescription className="mt-0.5">
                {t("dataTable.filter.activeSummary", {
                  fields: activeFieldCount,
                  values: activeValueCount,
                })}
              </PopoverDescription>
            </div>
          </div>
        </PopoverHeader>

        <div className="flex max-h-80 flex-col overflow-y-auto">
          {groups.map((group, index) => (
            <Fragment key={`${group.kind ?? "options"}:${group.urlKey}`}>
              {index > 0 ? <Separator className="my-0" /> : null}
              <AppliedFilterGroupSection
                group={group}
                onClearField={() => clearField(group)}
                onClearValue={(value) => clearValue(group, value)}
              />
            </Fragment>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-border border-t bg-muted/20 px-3 py-2">
          <span className="text-muted-foreground text-xs">
            {t("dataTable.filter.activeValues", { count: activeValueCount })}
          </span>
          <Button
            type="button"
            variant="outline"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={clearAll}>
            <X
              data-icon="inline-start"
              aria-hidden
            />
            {t("dataTable.filter.clear")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )

  return embedded ? content : <div className="flex h-10 shrink-0 items-center">{content}</div>
}
