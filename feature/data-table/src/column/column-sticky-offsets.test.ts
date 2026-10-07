import { describe, expect, it } from "vitest"

import { computeLeftStickyOffsets } from "./column-sticky-classes"

describe("computeLeftStickyOffsets", () => {
  it("accumulates widths in column order", () => {
    const offsets = computeLeftStickyOffsets(["select", "bankCode", "shortName"], (id) => {
      if (id === "select") return 40
      if (id === "bankCode") return 128
      return 96
    })

    expect(offsets.get("select")).toBe(0)
    expect(offsets.get("bankCode")).toBe(40)
    expect(offsets.get("shortName")).toBe(168)
  })
})
