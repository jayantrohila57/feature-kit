export type ExportFormatter = {
  dateTime: (value: Date, format: string) => string
  number: (value: number, format: string) => string
}

export type ExportNumberFormatter = Pick<ExportFormatter, "number">

export type ExportMonthYearFormatter = Pick<ExportFormatter, "dateTime">

export function formatExportCurrency(
  formatter: ExportNumberFormatter,
  value: number | string | null | undefined,
): string {
  if (value == null || value === "") return ""
  const num = typeof value === "number" ? value : Number(value)
  if (Number.isNaN(num)) return String(value)

  try {
    return formatter.number(num, "currency")
  } catch {
    return String(num)
  }
}

export function formatExportMonthYear(formatter: ExportMonthYearFormatter, period: string | null | undefined): string {
  if (!period) return ""
  const match = /^(\d{4})-(\d{2})$/.exec(period.trim())
  if (!match) return period

  const year = Number(match[1])
  const month = Number(match[2])
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) return period

  try {
    return formatter.dateTime(new Date(year, month - 1, 1), "monthYear")
  } catch {
    return period
  }
}
