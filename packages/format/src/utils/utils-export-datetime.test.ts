import { describe, expect, it } from "vitest"

import { createExportDateFormatters, type ExportDateTimeFormatter, formatExportDateTime } from "./utils-export-datetime"

function createMockFormatter(): ExportDateTimeFormatter {
  return {
    dateTime: (date, format) => {
      if (format === "dateOnly") {
        return `date:${date.toISOString()}`
      }
      return `table:${date.toISOString()}`
    },
  }
}

describe("formatExportDateTime", () => {
  it("returns empty string for nullish values", () => {
    const formatter = createMockFormatter()

    expect(formatExportDateTime(formatter, null)).toBe("")
    expect(formatExportDateTime(formatter, undefined)).toBe("")
    expect(formatExportDateTime(formatter, "")).toBe("")
  })

  it("formats valid ISO strings with the requested preset", () => {
    const formatter = createMockFormatter()
    const value = "2026-08-10T12:30:00.000Z"

    expect(formatExportDateTime(formatter, value, "table")).toBe(`table:${new Date(value).toISOString()}`)
    expect(formatExportDateTime(formatter, value, "dateOnly")).toBe(`date:${new Date(value).toISOString()}`)
  })

  it("returns empty string for invalid dates", () => {
    const formatter = createMockFormatter()

    expect(formatExportDateTime(formatter, "not-a-date")).toBe("")
  })
})

describe("createExportDateFormatters", () => {
  it("creates dateTime and date helpers", () => {
    const formatter = createMockFormatter()
    const { dateTime, date } = createExportDateFormatters(formatter)
    const value = "2026-08-10T12:30:00.000Z"

    expect(dateTime(value)).toBe(`table:${new Date(value).toISOString()}`)
    expect(date(value)).toBe(`date:${new Date(value).toISOString()}`)
  })
})
