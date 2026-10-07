import { describe, expect, it } from "vitest"

import { formatJsonTreePrimitive, jsonTreeChildCount, parseJsonTreeValue } from "./json-tree-view-parse"

describe("parseJsonTreeValue", () => {
  it("parses valid JSON strings", () => {
    expect(parseJsonTreeValue('{"a":1}')).toEqual({ ok: true, data: { a: 1 } })
  })

  it("returns empty for nullish values", () => {
    expect(parseJsonTreeValue(null)).toEqual({ ok: false, error: "empty", isEmpty: true })
    expect(parseJsonTreeValue("   ")).toEqual({ ok: false, error: "empty", isEmpty: true })
  })

  it("returns error for invalid JSON", () => {
    const result = parseJsonTreeValue("{bad")
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.isEmpty).toBe(false)
    }
  })

  it("accepts already-parsed objects", () => {
    expect(parseJsonTreeValue({ x: true })).toEqual({ ok: true, data: { x: true } })
  })
})

describe("formatJsonTreePrimitive", () => {
  it("quotes strings and formats null", () => {
    expect(formatJsonTreePrimitive("hello")).toBe('"hello"')
    expect(formatJsonTreePrimitive(null)).toBe("null")
  })
})

describe("jsonTreeChildCount", () => {
  it("counts object keys and array items", () => {
    expect(jsonTreeChildCount({ a: 1, b: 2 })).toBe(2)
    expect(jsonTreeChildCount([1, 2, 3])).toBe(3)
    expect(jsonTreeChildCount("text")).toBeNull()
  })
})
