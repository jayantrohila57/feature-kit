import type { UploaderColumn, UploaderParseError, UploaderParseResult, UploaderRecord } from "../uploader-types"

function normalizeHeader(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "")
}

function normalizeCell(value: unknown): string {
  if (value === null || value === undefined) {
    return ""
  }

  if (typeof value === "string") {
    return value.trim()
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }

  return String(value).trim()
}

function rowHasContent(values: unknown[]): boolean {
  return values.some((value) => normalizeCell(value) !== "")
}

function resolveHeaderIndex(headerIndexes: Map<string, number>, column: UploaderColumn): number | undefined {
  const candidates = [column.header, column.key]
  for (const candidate of candidates) {
    const index = headerIndexes.get(normalizeHeader(candidate))
    if (index !== undefined) {
      return index
    }
  }
  return undefined
}

export async function parseSpreadsheetFile(file: File, columns: UploaderColumn[]): Promise<UploaderParseResult> {
  const XLSX = await import("xlsx")
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: "array" })
  const firstSheetName = workbook.SheetNames[0]
  const worksheet = firstSheetName ? workbook.Sheets[firstSheetName] : undefined

  if (!worksheet) {
    return {
      records: [],
      errors: [{ row: 1, message: "The selected file does not contain a readable sheet." }],
      skippedRowCount: 0,
      headerLabels: [],
    }
  }

  const matrix = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
    header: 1,
    defval: "",
    blankrows: false,
  })

  if (matrix.length === 0) {
    return {
      records: [],
      errors: [{ row: 1, message: "The selected file is empty." }],
      skippedRowCount: 0,
      headerLabels: [],
    }
  }

  const rawHeaders = matrix[0] ?? []
  const headerLabels = rawHeaders.map((value) => String(value ?? "").trim())
  const headerIndexes = new Map(headerLabels.map((header, index) => [normalizeHeader(header), index]))

  const errors: UploaderParseError[] = []
  let matchedColumnCount = 0

  for (const column of columns) {
    if (resolveHeaderIndex(headerIndexes, column) === undefined) {
      errors.push({
        row: 1,
        column: column.header,
        message: `Missing required template column "${column.header}". Download the latest template and try again.`,
      })
    } else {
      matchedColumnCount += 1
    }
  }

  if (matchedColumnCount === 0) {
    errors.unshift({
      row: 1,
      message:
        "None of the file headers match the import template. Download the sample template and use those column names.",
    })
  }

  const records: UploaderRecord[] = []
  let skippedRowCount = 0

  for (const [index, row] of matrix.slice(1).entries()) {
    const values = Array.isArray(row) ? row : []

    if (!rowHasContent(values)) {
      skippedRowCount += 1
      continue
    }

    const record: UploaderRecord = {}

    for (const column of columns) {
      const headerIndex = resolveHeaderIndex(headerIndexes, column)
      const value = headerIndex === undefined ? "" : normalizeCell(values[headerIndex])

      if (value !== "") {
        record[column.key] = value
      }
    }

    if (Object.keys(record).length === 0) {
      skippedRowCount += 1
      errors.push({
        row: index + 2,
        message: "This row could not be mapped to any known upload columns.",
      })
      continue
    }

    records.push(record)
  }

  return {
    records,
    errors,
    skippedRowCount,
    headerLabels,
  }
}
