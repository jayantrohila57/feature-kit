import { describe, expect, it } from "vitest"

import { isAcceptedUploadFileName, parseAcceptedFileTypes } from "./utils-format-file-size"

describe("parseAcceptedFileTypes", () => {
  it("returns spreadsheet defaults when undefined", () => {
    expect(parseAcceptedFileTypes(undefined)).toEqual([".xlsx", ".xls", ".csv"])
  })

  it("parses comma-separated extensions with optional leading dots", () => {
    expect(parseAcceptedFileTypes(".xlsx,.csv,.txt")).toEqual([".xlsx", ".csv", ".txt"])
  })
})

describe("isAcceptedUploadFileName", () => {
  it("allows .txt when accept list includes .txt", () => {
    expect(isAcceptedUploadFileName("npci_sample.txt", ".xlsx,.csv,.txt")).toBe(true)
  })

  it("rejects .txt when accept list is spreadsheet-only", () => {
    expect(isAcceptedUploadFileName("npci_sample.txt", ".xlsx,.csv")).toBe(false)
  })
})
