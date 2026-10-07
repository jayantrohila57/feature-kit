import { describe, expect, it } from "vitest"

import { formatExportCurrency, formatExportMonthYear } from "./utils-export-values"

describe("formatExportCurrency", () => {
  it("returns empty string for nullish values", () => {
    const formatter = { number: () => "₹0.00" }

    expect(formatExportCurrency(formatter, null)).toBe("")
    expect(formatExportCurrency(formatter, undefined)).toBe("")
    expect(formatExportCurrency(formatter, "")).toBe("")
  })

  it("formats numeric amounts with the currency preset", () => {
    const formatter = { number: (value: number, format: string) => `${format}:${value}` }

    expect(formatExportCurrency(formatter, 1250.5)).toBe("currency:1250.5")
    expect(formatExportCurrency(formatter, "99.00")).toBe("currency:99")
  })
})

describe("formatExportMonthYear", () => {
  it("returns empty string for nullish values", () => {
    const formatter = { dateTime: () => "August 2026" }

    expect(formatExportMonthYear(formatter, null)).toBe("")
    expect(formatExportMonthYear(formatter, undefined)).toBe("")
    expect(formatExportMonthYear(formatter, "")).toBe("")
  })

  it("formats YYYY-MM with the monthYear preset", () => {
    const formatter = {
      dateTime: (value: Date, format: string) => `${format}:${value.getFullYear()}-${value.getMonth() + 1}`,
    }

    expect(formatExportMonthYear(formatter, "2026-08")).toBe("monthYear:2026-8")
  })

  it("returns the original value when the period is not YYYY-MM", () => {
    const formatter = { dateTime: () => "unused" }

    expect(formatExportMonthYear(formatter, "2026")).toBe("2026")
  })
})
