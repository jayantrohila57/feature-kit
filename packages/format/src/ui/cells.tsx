"use client"

import type { ComponentProps } from "react"

import { useFormat } from "../hooks"
import { parseDisplayDate } from "./cells.utils"

const PLACEHOLDER = "-"

/** Intl dateStyle values — format date-only (pair with TimeCell for stacked columns). */
const DATE_STYLE_FORMATS = new Set<string>(["full", "long", "medium", "short"])

type CellProps<T> = {
  value?: T | null
  format?: string
  fallback?: React.ReactNode
} & Omit<ComponentProps<"span">, "children">

export function DateCell({
  value,
  format = "medium",
  fallback = PLACEHOLDER,
  ...props
}: CellProps<Date | string | number>) {
  const formatter = useFormat()
  if (!value) return <span {...props}>{fallback}</span>

  try {
    const date = parseDisplayDate(value, format)
    if (!date) return <span {...props}>{fallback}</span>
    const formatted = DATE_STYLE_FORMATS.has(format)
      ? formatter.dateTime(date, { dateStyle: format as NonNullable<Intl.DateTimeFormatOptions["dateStyle"]> })
      : formatter.dateTime(date, format)
    return <span {...props}>{formatted}</span>
  } catch {
    return <span {...props}>{fallback}</span>
  }
}

export function NumberCell({
  value,
  format = "decimal",
  fallback = PLACEHOLDER,
  ...props
}: CellProps<number | bigint | string>) {
  const formatter = useFormat()
  if (value == null) return <span {...props}>{fallback}</span>

  try {
    const num = Number(value)
    if (Number.isNaN(num)) return <span {...props}>{fallback}</span>
    return <span {...props}>{formatter.number(num, format)}</span>
  } catch {
    return <span {...props}>{fallback}</span>
  }
}

export function CurrencyCell({
  value,
  format = "currency",
  fallback = PLACEHOLDER,
  ...props
}: CellProps<number | bigint | string>) {
  const formatter = useFormat()
  if (value == null) return <span {...props}>{fallback}</span>

  try {
    const num = Number(value)
    if (Number.isNaN(num)) return <span {...props}>{fallback}</span>
    return <span {...props}>{formatter.number(num, format)}</span>
  } catch {
    return <span {...props}>{fallback}</span>
  }
}

export function TimeCell({
  value,
  format = "short",
  fallback = PLACEHOLDER,
  ...props
}: CellProps<Date | string | number>) {
  const formatter = useFormat()
  if (!value) return <span {...props}>{fallback}</span>

  try {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return <span {...props}>{fallback}</span>
    // Next-intl format.dateTime can take timeStyle
    return (
      <span {...props}>
        {formatter.dateTime(date, { timeStyle: format as NonNullable<Intl.DateTimeFormatOptions["timeStyle"]> })}
      </span>
    )
  } catch {
    return <span {...props}>{fallback}</span>
  }
}

export function DateTimeCell({
  value,
  format = "shortDateTime",
  fallback = PLACEHOLDER,
  ...props
}: CellProps<Date | string | number>) {
  const formatter = useFormat()
  if (!value) return <span {...props}>{fallback}</span>

  try {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return <span {...props}>{fallback}</span>
    return <span {...props}>{formatter.dateTime(date, format)}</span>
  } catch {
    return <span {...props}>{fallback}</span>
  }
}

// Stub for other cells (RelativeTimeCell, PercentageCell, FileSizeCell, PhoneCell, EmailCell, BooleanBadge, StatusBadge, LinkCell)
// which can be expanded by the team.
