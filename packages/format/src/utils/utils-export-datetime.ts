export type ExportDateTimeFormat = "table" | "dateOnly"

export type ExportDateTimeFormatter = {
  dateTime: (value: Date, format: ExportDateTimeFormat) => string
}

export type ExportDateFormatters = {
  dateTime: (value: Date | string | number | null | undefined) => string
  date: (value: Date | string | number | null | undefined) => string
}

export function formatExportDateTime(
  formatter: ExportDateTimeFormatter,
  value: Date | string | number | null | undefined,
  format: ExportDateTimeFormat = "table",
): string {
  if (value == null || value === "") return ""

  try {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ""
    return formatter.dateTime(date, format)
  } catch {
    return ""
  }
}

export function createExportDateFormatters(formatter: ExportDateTimeFormatter): ExportDateFormatters {
  return {
    dateTime: (value) => formatExportDateTime(formatter, value, "table"),
    date: (value) => formatExportDateTime(formatter, value, "dateOnly"),
  }
}
