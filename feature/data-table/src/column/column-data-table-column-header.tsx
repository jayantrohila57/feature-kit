"use client"
// Reads the stable, in-place mutating TanStack column instance during render.
"use no memo"

import type { Column } from "@tanstack/react-table"
import type { LucideIcon } from "lucide-react"
import type { HTMLAttributes } from "react"

import { ArrowDown, ArrowUp, Funnel } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { Button } from "@/packages/ui/components/button"
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/packages/ui/components/popover"
import { cn } from "@/packages/ui/lib/utils"

import { DATA_TABLE_FILTER_HEADER_WRAPPER_CLASS, DATA_TABLE_HEADER_TRIGGER_CLASS } from "../constants"
import { useDataTableContext } from "../core"
import {
  cycleSortDirection,
  FILTER_ACTIVE_DOT_CLASS,
  FilterPanelContent,
  findFilterDefinitionByColumnId,
  resolveDefinitionSortDirection,
  resolveFilterActiveState,
} from "../filter"
import { humanizeColumnId } from "../view-options/view-options-utils"
import { ColumnHeaderFunnelTrigger } from "./column-header-funnel-trigger"

type DataTableColumnHeaderAppearance = "table" | "toolbar"

interface DataTableColumnHeaderProps<TData, TValue> extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title?: string
  titleKey?: string
  /**
   * @deprecated Ignored in table headers — the label already names the column, so type icons were
   * dropped for a quieter header. Still rendered by the legacy `appearance="toolbar"` trigger.
   */
  icon?: LucideIcon
  /** Table headers use ghost triggers; toolbar filters use outline to match view options. */
  appearance?: DataTableColumnHeaderAppearance
}

function resolveColumnTitle(t: ReturnType<typeof useTranslations>, titleKey: string, title?: string): string {
  if (t.has(titleKey)) {
    return t(titleKey)
  }
  if (title?.trim()) {
    return title
  }
  const leaf = titleKey.split(".").pop() ?? titleKey
  return humanizeColumnId(leaf)
}

function ColumnHeaderLabel({
  title,
  appearance = "table",
}: {
  title: string
  appearance?: DataTableColumnHeaderAppearance
}) {
  if (!title) {
    return null
  }
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap",
        appearance === "toolbar" ? "text-foreground" : "font-semibold text-foreground",
      )}>
      {title}
    </span>
  )
}

const TABLE_HEADER_FILTER_KINDS = ["search", "options"] as const

/**
 * Column header. Clicking the label cycles sort (asc → desc → none); the arrow shows only when
 * sorted (faint on hover). A separate funnel — visible on hover, or in info blue when this column
 * is filtered — opens a live search / values popover. No column-type icons.
 */
export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  titleKey,
  icon,
  appearance = "table",
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const t = useTranslations()
  const { filters, columnSearch, sorting = [], filterDefinitions, setSorting } = useDataTableContext<TData>()
  const [menuOpen, setMenuOpen] = useState(false)
  const displayTitle = titleKey ? resolveColumnTitle(t, titleKey, title) : (title ?? "")
  const definition = findFilterDefinitionByColumnId(filterDefinitions, column.id)

  if (!definition) {
    return (
      <div className={cn(className)}>
        <ColumnHeaderLabel
          title={displayTitle}
          appearance={appearance}
        />
      </div>
    )
  }

  const active = resolveFilterActiveState(definition, { filters, columnSearch, sorting })
  const menuTitle = displayTitle.trim() ? displayTitle : definition.label

  if (appearance === "toolbar") {
    return (
      <div className={cn("flex shrink-0", className)}>
        <Popover
          open={menuOpen}
          onOpenChange={setMenuOpen}>
          <PopoverTrigger asChild>
            <ColumnHeaderFunnelTrigger
              {...(icon ? { icon } : {})}
              title={displayTitle}
              activeCount={active.count}
              menuLabel={t("dataTable.column.filterMenuAria", { field: menuTitle, count: active.count })}
              appearance="toolbar"
              open={menuOpen}
            />
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-[min(20rem,calc(100vw-2rem))] gap-0 p-0">
            <PopoverHeader className="border-border border-b px-3 py-2.5">
              <PopoverTitle>{menuTitle}</PopoverTitle>
            </PopoverHeader>
            <FilterPanelContent
              definition={definition}
              menuOpen={menuOpen}
              onClose={() => setMenuOpen(false)}
            />
          </PopoverContent>
        </Popover>
      </div>
    )
  }

  // Table header: the label sorts on click, the funnel (search / values only) filters.
  const sortDirection = resolveDefinitionSortDirection(definition, sorting)
  const canSort = definition.sort && definition.columnId !== null
  const canFilter = definition.search || definition.options !== null
  const isFiltered = active.search || active.options
  const filterCount = Number(active.search) + Number(active.options)
  const SortIcon = sortDirection === "desc" ? ArrowDown : ArrowUp

  return (
    <div className={cn(DATA_TABLE_FILTER_HEADER_WRAPPER_CLASS, "group/header items-center gap-0.5", className)}>
      {canSort ? (
        <Button
          type="button"
          variant="ghost"
          className={cn(DATA_TABLE_HEADER_TRIGGER_CLASS, "group/sort gap-1")}
          aria-label={t("dataTable.column.sortAria", { field: menuTitle, direction: sortDirection ?? "none" })}
          onClick={() => {
            const next = cycleSortDirection(sortDirection)
            if (next && definition.columnId) {
              setSorting?.(definition.columnId, next)
            } else {
              setSorting?.(null, null)
            }
          }}>
          <span className="font-semibold text-foreground">{displayTitle}</span>
          <SortIcon
            data-icon="inline-end"
            aria-hidden
            className={cn(
              "size-3.5 transition-opacity",
              sortDirection ? "text-foreground opacity-100" : "opacity-0 group-hover/sort:opacity-40",
            )}
          />
        </Button>
      ) : (
        <ColumnHeaderLabel
          title={displayTitle}
          appearance={appearance}
        />
      )}
      {canFilter ? (
        <Popover
          open={menuOpen}
          onOpenChange={setMenuOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-expanded={menuOpen}
              aria-haspopup="dialog"
              aria-label={t("dataTable.column.filterMenuAria", { field: menuTitle, count: filterCount })}
              className={cn(
                "relative size-6 shrink-0 transition-opacity",
                isFiltered
                  ? "text-info opacity-100 hover:text-info"
                  : "text-muted-foreground opacity-0 focus-visible:opacity-100 group-hover/header:opacity-100 data-[state=open]:opacity-100 [@media(hover:none)]:opacity-60",
              )}>
              <Funnel
                className="size-3.5"
                aria-hidden
              />
              {isFiltered ? (
                <span
                  className={FILTER_ACTIVE_DOT_CLASS}
                  aria-hidden
                />
              ) : null}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-[min(20rem,calc(100vw-2rem))] gap-0 p-0">
            <PopoverHeader className="border-border border-b px-3 py-2.5">
              <PopoverTitle>{menuTitle}</PopoverTitle>
            </PopoverHeader>
            <FilterPanelContent
              definition={definition}
              kinds={TABLE_HEADER_FILTER_KINDS}
              menuOpen={menuOpen}
              onClose={() => setMenuOpen(false)}
            />
          </PopoverContent>
        </Popover>
      ) : null}
    </div>
  )
}
