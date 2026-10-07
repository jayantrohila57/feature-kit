import type { ExportColumn } from "../export-types"

import { downloadBlob, ensureFileExtension } from "../utils"

function formatCellValue(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) {
    return ""
  }

  return String(value)
}

function escapeCsvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }

  return value
}

export function buildCsvContent<T>(rows: T[], columns: ExportColumn<T>[]): string {
  const headerLine = columns.map((column) => escapeCsvCell(column.header)).join(",")
  const dataLines = rows.map((row) =>
    columns.map((column) => escapeCsvCell(formatCellValue(column.accessor(row)))).join(","),
  )

  return [headerLine, ...dataLines].join("\r\n")
}

export function exportToCsv<T>(rows: T[], columns: ExportColumn<T>[], filename: string): void {
  const csvContent = buildCsvContent(rows, columns)
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  downloadBlob(blob, ensureFileExtension(filename, ".csv"))
}
