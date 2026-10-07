import type { UploaderColumn } from "../uploader-types"

import { describe, expect, it } from "vitest"

import { parseSpreadsheetFile } from "./parse-spreadsheet-file"

const columns: UploaderColumn[] = [
  { key: "bankCode", header: "Bank code", requiredIn: ["create"] },
  { key: "bankName", header: "Bank name", requiredIn: ["create"] },
]

async function buildSpreadsheetFile(rows: string[][]): Promise<File> {
  const XLSX = await import("xlsx")
  const worksheet = XLSX.utils.aoa_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" }) as ArrayBuffer
  return new File([buffer], "banks.xlsx", {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })
}

describe("parseSpreadsheetFile", () => {
  it("maps rows when headers match display labels", async () => {
    const file = await buildSpreadsheetFile([
      ["Bank code", "Bank name"],
      ["BNK001", "Sample Bank"],
    ])

    const result = await parseSpreadsheetFile(file, columns)

    expect(result.records).toEqual([{ bankCode: "BNK001", bankName: "Sample Bank" }])
    expect(result.errors).toEqual([])
  })

  it("maps rows when headers use field keys", async () => {
    const file = await buildSpreadsheetFile([
      ["bankCode", "bankName"],
      ["BNK002", "Key Header Bank"],
    ])

    const result = await parseSpreadsheetFile(file, columns)

    expect(result.records).toEqual([{ bankCode: "BNK002", bankName: "Key Header Bank" }])
  })

  it("does not emit empty objects when headers do not match", async () => {
    const file = await buildSpreadsheetFile([
      ["Wrong", "Headers"],
      ["BNK003", "Unmapped Bank"],
    ])

    const result = await parseSpreadsheetFile(file, columns)

    expect(result.records).toEqual([])
    expect(result.errors[0]?.message).toContain("None of the file headers match")
  })
})
