"use client"

import type { LucideIcon } from "lucide-react"
import type { ComponentProps } from "react"

import { Funnel } from "lucide-react"

import { Button } from "@/packages/ui/components/button"
import { cn } from "@/packages/ui/lib/utils"

import { DATA_TABLE_HEADER_TRIGGER_CLASS, DATA_TABLE_TOOLBAR_FILTER_TRIGGER_CLASS } from "../constants"
import { FILTER_ACTIVE_DOT_CLASS } from "../filter"

export type ColumnHeaderFunnelTriggerProps = Omit<ComponentProps<typeof Button>, "children"> & {
  /** Left label icon (kept); the single trailing icon is always the funnel. */
  icon?: LucideIcon
  title: string
  /** Number of active capabilities (search / sort / options) — drives the red dot + aria label. */
  activeCount: number
  /** Accessible label describing the menu (e.g. "Filter Bank type, 2 active"). */
  menuLabel: string
  /** Table headers use ghost triggers; toolbar variants use outline. */
  appearance?: "table" | "toolbar"
  open: boolean
}

/** Header trigger: label icon + title + ONE funnel icon with a red dot when anything is active. */
export function ColumnHeaderFunnelTrigger({
  icon: Icon,
  title,
  activeCount,
  menuLabel,
  appearance = "table",
  open,
  className,
  ...buttonProps
}: ColumnHeaderFunnelTriggerProps) {
  const isToolbarAppearance = appearance === "toolbar"
  const isActive = activeCount > 0

  return (
    <Button
      type="button"
      variant={isToolbarAppearance ? "outline" : "ghost"}
      aria-expanded={open}
      aria-haspopup="dialog"
      aria-label={menuLabel}
      className={cn(
        isToolbarAppearance ? DATA_TABLE_TOOLBAR_FILTER_TRIGGER_CLASS : DATA_TABLE_HEADER_TRIGGER_CLASS,
        "data-[state=open]:bg-muted",
        isActive && "text-foreground",
        className,
      )}
      {...buttonProps}>
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
        {Icon ? (
          <Icon
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden
          />
        ) : null}
        {title ? (
          <span className={cn(isToolbarAppearance ? "text-foreground" : "font-semibold text-foreground")}>{title}</span>
        ) : null}
      </span>
      <span className="relative inline-flex shrink-0 items-center">
        <Funnel
          data-icon="inline-end"
          className={cn("size-3.5", isActive ? "text-foreground" : "text-muted-foreground")}
          aria-hidden
        />
        {isActive ? (
          <span
            className={FILTER_ACTIVE_DOT_CLASS}
            aria-hidden
          />
        ) : null}
      </span>
    </Button>
  )
}
