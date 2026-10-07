import type { ExportColumn } from "../export-types"

import { downloadBlob, ensureFileExtension } from "../utils"

function formatCellValue(value: string | number | boolean | null | undefined): string | number | boolean {
  if (value === null || value === undefined) {
    return ""
  }

  return value
}

export async function exportToXlsx<T>(rows: T[], columns: ExportColumn<T>[], filename: string): Promise<void> {
  const XLSX = await import("xlsx")

  const sheetData = rows.map((row) => {
    const record: Record<string, string | number | boolean> = {}

    for (const column of columns) {
      record[column.header] = formatCellValue(column.accessor(row))
    }

    return record
  })

  const worksheet = XLSX.utils.json_to_sheet(sheetData, {
    header: columns.map((column) => column.header),
  })
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")

  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" }) as ArrayBuffer
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })

  downloadBlob(blob, ensureFileExtension(filename, ".xlsx"))
}
