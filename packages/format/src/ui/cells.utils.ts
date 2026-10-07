export function parseYearMonth(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})/.exec(value)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) return null
  const date = new Date(year, month - 1, 1)
  return Number.isNaN(date.getTime()) ? null : date
}

export function parseDisplayDate(value: Date | string | number, format: string): Date | null {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value
  if (typeof value === "string") {
    const trimmed = value.trim()
    if (format === "monthYear" || format === "month") {
      const monthYear = parseYearMonth(trimmed)
      if (monthYear) return monthYear
    }
    if (format === "year") {
      const yearMatch = /^(\d{4})/.exec(trimmed)
      if (yearMatch) {
        const year = Number(yearMatch[1])
        if (Number.isInteger(year)) {
          const date = new Date(year, 0, 1)
          return Number.isNaN(date.getTime()) ? null : date
        }
      }
    }
    const useCalendarDate = format === "dateOnly" || /^\d{4}-\d{2}-\d{2}$/.test(trimmed)
    if (useCalendarDate) {
      const ymd = /^(\d{4}-\d{2}-\d{2})/.exec(trimmed)?.[1]
      if (ymd) {
        const [yearText, monthText, dayText] = ymd.split("-")
        const year = Number(yearText)
        const month = Number(monthText)
        const day = Number(dayText)
        if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return null
        const date = new Date(year, month - 1, day)
        return Number.isNaN(date.getTime()) ? null : date
      }
    }
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}
