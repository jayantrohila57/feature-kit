"use client"

import { X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useMemo } from "react"

import { Button } from "@/packages/ui/components/button"

import { DATA_TABLE_ACTIVE_FILTER_CHIP_CLASS } from "../constants"
import { useDataTableContext } from "../core"
import { resolveAppliedFilterGroupsFromDefinitions } from "./utils"

/**
 * Row of active-filter chips under the toolbar (`Bank type: Public, Private ✕`) plus "Clear all",
 * so applied filters are visible at a glance without opening each header. Hidden when nothing applies.
 */
export function DataTableActiveFilterBar<TData>() {
  const t = useTranslations()
  const { filterDefinitions, filters, columnSearch, setFilter, setColumnSearch, clearFilters } =
    useDataTableContext<TData>()

  const groups = useMemo(
    () => resolveAppliedFilterGroupsFromDefinitions(filterDefinitions, filters, columnSearch),
    [columnSearch, filterDefinitions, filters],
  )

  if (groups.length === 0) {
    return null
  }

  return (
    <ul
      aria-label={t("dataTable.filter.appliedAria")}
      className="m-0 flex w-full list-none flex-wrap items-center gap-1.5 p-0 pb-2">
      {groups.map((group) => {
        const valueText = group.values.map((entry) => entry.option?.label ?? entry.value).join(", ")
        return (
          <li
            key={`${group.kind ?? "options"}:${group.urlKey}`}
            className={DATA_TABLE_ACTIVE_FILTER_CHIP_CLASS}>
            <span className="shrink-0 text-muted-foreground">{group.fieldLabel}:</span>
            <span
              className="min-w-0 max-w-48 truncate font-medium"
              title={valueText}>
              {valueText}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="size-5 shrink-0 rounded-full text-muted-foreground hover:bg-info/15 hover:text-foreground"
              aria-label={t("dataTable.filter.clearField", { field: group.fieldLabel })}
              onClick={() => {
                if (group.kind === "search") {
                  setColumnSearch?.(group.urlKey, null)
                  return
                }
                setFilter?.(group.urlKey, null)
              }}>
              <X
                className="size-3"
                aria-hidden
              />
            </Button>
          </li>
        )
      })}
      <li>
        <Button
          type="button"
          variant="link"
          size="sm"
          className="h-6 px-1 text-muted-foreground text-xs"
          onClick={() => clearFilters?.()}>
          {t("dataTable.filter.clearAll")}
        </Button>
      </li>
    </ul>
  )
}
