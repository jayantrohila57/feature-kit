"use client"

import type { BulkActionBarProps } from "./bulk-action-bar-types"

import { useTranslations } from "next-intl"

import { cn } from "@/packages/ui/lib/utils"

import { useDataTableContext } from "../core"
import { bulkActionBarActionsMaxHeightClass } from "./constants"

export function BulkActionBar({ children, className }: BulkActionBarProps) {
  const t = useTranslations()
  const { selectedCount } = useDataTableContext()

  return (
    <div
      className={cn(
        "flex max-w-full items-center gap-2 rounded-full border border-border/80 bg-background/90 px-2 py-1 shadow-lg ring-1 ring-black/5 backdrop-blur-md dark:ring-white/10",
        "fade-in slide-in-from-bottom-2 animate-in duration-200",
        className,
      )}
      role="toolbar"
      aria-label={t("dataTable.bulk.toolbarAria")}>
      <div className="flex shrink-0 items-center gap-1.5 self-center ps-0.5">
        <span
          className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1.5 font-semibold text-primary-foreground text-xs tabular-nums"
          aria-hidden="true">
          {selectedCount}
        </span>
        <span className="hidden font-medium text-foreground text-xs sm:inline">
          {t("dataTable.selection.selected")}
        </span>
        <span className="sr-only">{t("dataTable.bulk.selectedCount", { count: selectedCount })}</span>
      </div>
      {children ? (
        <>
          <div
            className="mx-0.5 h-4 w-px shrink-0 self-center bg-border"
            aria-hidden="true"
          />
          <div
            className={cn(
              "flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1",
              bulkActionBarActionsMaxHeightClass,
            )}>
            {children}
          </div>
        </>
      ) : null}
    </div>
  )
}
