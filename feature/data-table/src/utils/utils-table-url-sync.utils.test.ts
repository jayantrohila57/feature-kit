import { describe, expect, it } from "vitest"

import {
  mutateTableColumnSearch,
  mutateTableFilter,
  mutateTablePagination,
  mutateTableSearch,
  mutateTableSorting,
  parseLimitFromSearchParams,
  parsePageFromSearchParams,
  resolveTableLimit,
  resolveTablePage,
} from "./utils-table-url-sync.utils"

function params(input: string) {
  return new URLSearchParams(input)
}

describe("parsePageFromSearchParams", () => {
  it("returns null when page is absent", () => {
    expect(parsePageFromSearchParams(params(""))).toBeNull()
  })

  it("returns null for invalid page values", () => {
    expect(parsePageFromSearchParams(params("page=0"))).toBeNull()
    expect(parsePageFromSearchParams(params("page=abc"))).toBeNull()
  })

  it("returns a positive integer page", () => {
    expect(parsePageFromSearchParams(params("page=3"))).toBe(3)
  })
})

describe("parseLimitFromSearchParams", () => {
  it("returns null when limit is absent", () => {
    expect(parseLimitFromSearchParams(params(""))).toBeNull()
  })

  it("returns null for out-of-range limits", () => {
    expect(parseLimitFromSearchParams(params("limit=10"))).toBeNull()
    expect(parseLimitFromSearchParams(params("limit=2000"))).toBeNull()
  })

  it("returns supported page sizes", () => {
    expect(parseLimitFromSearchParams(params("limit=50"))).toBe(50)
  })
})

describe("resolveTablePage", () => {
  it("prefers the URL page over the fallback", () => {
    expect(resolveTablePage(params("page=4"), 1)).toBe(4)
  })
})

describe("resolveTableLimit", () => {
  it("prefers the URL limit over the fallback", () => {
    expect(resolveTableLimit(params("limit=100"), 20)).toBe(100)
  })
})

describe("listing URL mutations", () => {
  it("scenario 1/8: tab filter resets page but preserves other filters", () => {
    const current = params("page=3&limit=50&q=acme&bankType=RETAIL&sortBy=bankName&sortDir=asc&approvalStatus=APPROVED")

    mutateTableFilter(current, "approvalStatus", "DRAFT")

    expect(current.get("approvalStatus")).toBe("DRAFT")
    expect(current.get("page")).toBe("1")
    expect(current.get("limit")).toBe("50")
    expect(current.get("q")).toBe("acme")
    expect(current.get("bankType")).toBe("RETAIL")
    expect(current.get("sortBy")).toBe("bankName")
    expect(current.get("sortDir")).toBe("asc")
  })

  it("scenario 2: column filter apply updates URL key and resets page", () => {
    const current = params("page=2&limit=20&bankType=RETAIL")

    mutateTableFilter(current, "bankType", ["RETAIL", "CORPORATE"])

    expect(current.getAll("bankType")).toEqual(["RETAIL", "CORPORATE"])
    expect(current.get("page")).toBe("1")
    expect(current.get("limit")).toBe("20")
  })

  it("scenario 3: pagination updates page only", () => {
    const current = params("page=1&limit=20&approvalStatus=DRAFT&q=foo")

    mutateTablePagination(current, 4, 20)

    expect(current.get("page")).toBe("4")
    expect(current.get("limit")).toBe("20")
    expect(current.get("approvalStatus")).toBe("DRAFT")
    expect(current.get("q")).toBe("foo")
  })

  it("scenario 4: page size change updates limit and page", () => {
    const current = params("page=3&limit=20&approvalStatus=DRAFT")

    mutateTablePagination(current, 1, 50)

    expect(current.get("page")).toBe("1")
    expect(current.get("limit")).toBe("50")
    expect(current.get("approvalStatus")).toBe("DRAFT")
  })

  it("scenario 5: toolbar search updates q and resets page", () => {
    const current = params("page=2&limit=20&approvalStatus=DRAFT&bankType=RETAIL")

    mutateTableSearch(current, "  acme  ")

    expect(current.get("q")).toBe("acme")
    expect(current.get("page")).toBe("1")
    expect(current.get("approvalStatus")).toBe("DRAFT")
    expect(current.get("bankType")).toBe("RETAIL")
  })

  it("scenario 5: clearing search removes q", () => {
    const current = params("page=2&q=acme")

    mutateTableSearch(current, "   ")

    expect(current.has("q")).toBe(false)
    expect(current.get("page")).toBe("1")
  })

  it("scenario 6: sort header updates sort keys and resets page", () => {
    const current = params("page=5&limit=20&approvalStatus=DRAFT&q=acme")

    mutateTableSorting(current, "bankName", "desc")

    expect(current.get("sortBy")).toBe("bankName")
    expect(current.get("sortDir")).toBe("desc")
    expect(current.get("page")).toBe("1")
    expect(current.get("approvalStatus")).toBe("DRAFT")
    expect(current.get("q")).toBe("acme")
  })

  it("scenario 7: combined tab + filter + pagination can coexist in URL", () => {
    const current = params("page=1&limit=20")

    mutateTableFilter(current, "approvalStatus", "IN_REVIEW")
    mutateTableFilter(current, "bankType", "RETAIL")
    mutateTableSearch(current, "hdfc")
    mutateTableSorting(current, "bankName", "asc")
    mutateTablePagination(current, 2, 50)

    expect(current.get("approvalStatus")).toBe("IN_REVIEW")
    expect(current.get("bankType")).toBe("RETAIL")
    expect(current.get("page")).toBe("2")
    expect(current.get("limit")).toBe("50")
    expect(current.get("q")).toBe("hdfc")
    expect(current.get("sortBy")).toBe("bankName")
    expect(current.get("sortDir")).toBe("asc")
  })

  it("scenario 8: clearing a tab filter removes the key but keeps other filters", () => {
    const current = params("page=4&limit=50&q=acme&bankType=RETAIL&approvalStatus=DRAFT")

    mutateTableFilter(current, "approvalStatus", null)

    expect(current.has("approvalStatus")).toBe(false)
    expect(current.get("page")).toBe("1")
    expect(current.get("limit")).toBe("50")
    expect(current.get("q")).toBe("acme")
    expect(current.get("bankType")).toBe("RETAIL")
  })
})

describe("mutateTableColumnSearch", () => {
  it("writes cs.<key> and resets page", () => {
    const current = params("page=3&cs.bankName=old&q=global")
    mutateTableColumnSearch(current, "bankName", "  hdfc ")
    expect(current.get("cs.bankName")).toBe("hdfc")
    expect(current.get("page")).toBe("1")
    expect(current.get("q")).toBe("global")
  })

  it("removes the param for empty or null values", () => {
    const current = params("page=3&cs.bankName=old")
    mutateTableColumnSearch(current, "bankName", "  ")
    expect(current.has("cs.bankName")).toBe(false)
    expect(current.get("page")).toBe("1")

    const again = params("cs.bankName=old")
    mutateTableColumnSearch(again, "bankName", null)
    expect(again.has("cs.bankName")).toBe(false)
  })
})
