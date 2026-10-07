import type { DateRange } from "react-day-picker"
import type { QuarterNumber } from "../constants/constants-date"

import { format, isValid, parse } from "date-fns"

import {
  DATE_ISO_PATTERN,
  DATE_ISO_PREFIX_PATTERN,
  DEFAULT_DATE_FROM_YEAR_OFFSET,
  DEFAULT_DATE_TO_YEAR_OFFSET,
  MONTH_ISO_PATTERN,
  QUARTER_ISO_PATTERN,
  QUARTER_LABELS,
  TIME_HM_PATTERN,
} from "../constants/constants-date"

export type DateRangeValue = {
  from?: string | undefined
  to?: string | undefined
}

function isDateInstance(value: unknown): value is Date {
  return value instanceof Date
}

function parseLocalYmd(value: string): Date | undefined {
  const parsed = parse(value, "yyyy-MM-dd", new Date())
  return isValid(parsed) ? parsed : undefined
}

/**
 * Calendar dates (`YYYY-MM-DD`) are local midnights — never UTC.
 * `parseISO("2024-01-15")` is UTC and shifts the day in negative-offset timezones.
 */
export function toDate(value: unknown): Date | undefined {
  if (value == null || value === "") return undefined
  if (isDateInstance(value)) return isValid(value) ? value : undefined
  if (typeof value !== "string") return undefined

  const trimmed = value.trim()
  if (DATE_ISO_PATTERN.test(trimmed)) {
    return parseLocalYmd(trimmed)
  }

  const ymd = DATE_ISO_PREFIX_PATTERN.exec(trimmed)?.[1]
  if (ymd) {
    return parseLocalYmd(ymd)
  }

  if (MONTH_ISO_PATTERN.test(trimmed)) {
    return parseLocalYmd(`${trimmed}-01`)
  }

  const fallback = new Date(trimmed)
  return isValid(fallback) ? fallback : undefined
}

export function toISODate(value: Date | undefined): string | undefined {
  if (!value || !isValid(value)) return undefined
  return format(value, "yyyy-MM-dd")
}

/** Platform `LocalDate` fields reject ISO datetimes — keep only `YYYY-MM-DD`. */
export function toLocalDateString(value: unknown): string {
  if (value == null || value === "") return ""
  if (typeof value === "string") {
    const trimmed = value.trim()
    if (DATE_ISO_PATTERN.test(trimmed)) return trimmed
    const ymd = DATE_ISO_PREFIX_PATTERN.exec(trimmed)?.[1]
    if (ymd) return ymd
  }
  return toISODate(toDate(value)) ?? ""
}

export function calendarNavRange(options?: {
  fromYear?: number | undefined
  toYear?: number | undefined
  minDate?: unknown
  maxDate?: unknown
}): { startMonth: Date; endMonth: Date } {
  const now = new Date()
  const fromYear = options?.fromYear ?? now.getFullYear() - DEFAULT_DATE_FROM_YEAR_OFFSET
  const toYear = options?.toYear ?? now.getFullYear() + DEFAULT_DATE_TO_YEAR_OFFSET
  let startMonth = new Date(fromYear, 0, 1)
  let endMonth = new Date(toYear, 11, 1)

  const min = toDate(options?.minDate)
  const max = toDate(options?.maxDate)
  if (min && min > startMonth) startMonth = new Date(min.getFullYear(), min.getMonth(), 1)
  if (max && max < endMonth) endMonth = new Date(max.getFullYear(), max.getMonth(), 1)
  if (startMonth > endMonth) {
    return { startMonth: endMonth, endMonth: startMonth }
  }
  return { startMonth, endMonth }
}

export function toISOMonth(value: Date | undefined): string | undefined {
  if (!value || !isValid(value)) return undefined
  return format(value, "yyyy-MM")
}

export function formatDateDisplay(value: unknown, displayFormat: string, empty = ""): string {
  const date = toDate(value)
  if (!date) return empty
  return format(date, displayFormat)
}

export function toDateRange(value: unknown): DateRange | undefined {
  if (value == null) return undefined

  if (typeof value === "object" && !Array.isArray(value)) {
    const record = value as Record<string, unknown>
    const from = toDate(record["from"] ?? record["start"])
    const to = toDate(record["to"] ?? record["end"])
    if (!from && !to) return undefined
    return { from, to }
  }

  return undefined
}

export function toDateRangeValue(range: DateRange | undefined): DateRangeValue | undefined {
  if (!range?.from && !range?.to) return undefined
  return {
    from: toISODate(range.from),
    to: toISODate(range.to),
  }
}

export function formatDateRangeDisplay(value: unknown, displayFormat: string, empty = ""): string {
  const range = toDateRange(value)
  if (!range?.from) return empty
  if (!range.to) return format(range.from, displayFormat)
  return `${format(range.from, displayFormat)} – ${format(range.to, displayFormat)}`
}

export function toTimeValue(value: unknown): string {
  if (value == null || value === "") return ""
  if (typeof value === "string" && TIME_HM_PATTERN.test(value)) {
    return value.slice(0, 5)
  }
  if (isDateInstance(value) && isValid(value)) {
    return format(value, "HH:mm")
  }
  return ""
}

export function quarterFromDate(date: Date): QuarterNumber {
  return (Math.floor(date.getMonth() / 3) + 1) as QuarterNumber
}

export function parseQuarter(value: unknown): { year: number; quarter: QuarterNumber } | undefined {
  if (typeof value !== "string" || !QUARTER_ISO_PATTERN.test(value)) return undefined
  const [yearPart, quarterPart] = value.split("-Q")
  const year = Number(yearPart)
  const quarter = Number(quarterPart) as QuarterNumber
  if (!Number.isInteger(year) || quarter < 1 || quarter > 4) return undefined
  return { year, quarter }
}

export function toISOQuarter(year: number, quarter: QuarterNumber): string {
  return `${year}-Q${quarter}`
}

export function formatQuarterDisplay(value: unknown, empty = ""): string {
  const parsed = parseQuarter(value)
  if (!parsed) return empty
  return `${QUARTER_LABELS[parsed.quarter]} ${parsed.year}`
}

export function monthStart(year: number, monthIndex: number): Date {
  return new Date(year, monthIndex, 1)
}

export function disabledMatcher(minDate?: unknown, maxDate?: unknown) {
  const min = toDate(minDate)
  const max = toDate(maxDate)
  if (!min && !max) return undefined
  return (date: Date) => {
    if (min) {
      const start = new Date(min.getFullYear(), min.getMonth(), min.getDate())
      if (date < start) return true
    }
    if (max) {
      const end = new Date(max.getFullYear(), max.getMonth(), max.getDate())
      if (date > end) return true
    }
    return false
  }
}
