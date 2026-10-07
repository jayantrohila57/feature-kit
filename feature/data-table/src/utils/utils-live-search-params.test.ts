import { describe, expect, it } from "vitest"

import { createLiveSearchParams, mergeSearchParams, resolveLiveQueryString } from "./utils-live-search-params"

describe("resolveLiveQueryString", () => {
  it("prefers the document query string when present", () => {
    expect(resolveLiveQueryString(new URLSearchParams("page=2"), "?page=1&bankType=RETAIL")).toBe(
      "page=1&bankType=RETAIL",
    )
  })

  it("falls back to App Router search params when the document query is empty", () => {
    expect(resolveLiveQueryString(new URLSearchParams("page=1&limit=20"), "")).toBe("page=1&limit=20")
  })

  it("merges App Router filters with shallow canonical page/limit on the document", () => {
    expect(resolveLiveQueryString(new URLSearchParams("approvalStatus=DRAFT&page=1"), "?page=1&limit=20")).toBe(
      "approvalStatus=DRAFT&page=1&limit=20",
    )
  })
})

describe("createLiveSearchParams", () => {
  it("reads filter keys from the live document URL", () => {
    const params = createLiveSearchParams(new URLSearchParams("page=2"), "?page=1&formatType=CSV")
    expect(params.get("page")).toBe("1")
    expect(params.get("formatType")).toBe("CSV")
  })
})

describe("mergeSearchParams", () => {
  it("preserves repeated keys when seeding an empty target", () => {
    const target = new URLSearchParams()
    const source = new URLSearchParams()
    source.append("status", "OPEN")
    source.append("status", "CLOSED")
    source.set("page", "1")

    mergeSearchParams(target, source)

    expect(target.getAll("status")).toEqual(["OPEN", "CLOSED"])
    expect(target.get("page")).toBe("1")
  })
})
