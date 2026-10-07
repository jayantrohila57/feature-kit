import type { DataTableFilterDefinition } from "../filter-types"

import { describe, expect, it } from "vitest"

import {
  collectClearableFilterKeys,
  columnSearchParamKey,
  filterKeyFromColumnSearchParam,
  readColumnSearchFromSearchParams,
} from "./utils-filter-url"

function definition(partial: Partial<DataTableFilterDefinition> & { key: string }): DataTableFilterDefinition {
  return {
    columnId: partial.key,
    label: partial.key,
    search: false,
    sort: false,
    options: null,
    multi: true,
    ...partial,
  }
}

describe("column search params", () => {
  it("round-trips the cs. prefix", () => {
    expect(columnSearchParamKey("bankName")).toBe("cs.bankName")
    expect(filterKeyFromColumnSearchParam("cs.bankName")).toBe("bankName")
    expect(filterKeyFromColumnSearchParam("bankName")).toBeNull()
    expect(filterKeyFromColumnSearchParam("cs.")).toBeNull()
  })

  it("reads only non-empty values for the requested keys", () => {
    const params = new URLSearchParams("cs.bankName=hdfc&cs.remarks=%20&cs.other=x&q=global")
    expect(readColumnSearchFromSearchParams(params, ["bankName", "remarks", "missing"])).toEqual({ bankName: "hdfc" })
  })
})

describe("collectClearableFilterKeys", () => {
  const definitions = [
    definition({ key: "bankType", options: [] }),
    definition({ key: "bankName", search: true, sort: true }),
    definition({ key: "updated", sort: true }),
  ]

  it("includes option keys, cs.* keys, q and the legacy list but never page/limit/sort", () => {
    const keys = collectClearableFilterKeys(definitions)
    expect(keys).toContain("bankType")
    expect(keys).toContain("cs.bankName")
    expect(keys).toContain("q")
    expect(keys).toContain("status")
    expect(keys).not.toContain("bankName")
    expect(keys).not.toContain("updated")
    expect(keys).not.toContain("page")
    expect(keys).not.toContain("limit")
    expect(keys).not.toContain("sortBy")
    expect(keys).not.toContain("sortDir")
    expect(keys).not.toContain("view")
    expect(keys).not.toContain("bucket")
  })

  it("clears sort only when opted in", () => {
    const keys = collectClearableFilterKeys(definitions, { includeSort: true, extraKeys: ["hostCode"] })
    expect(keys).toContain("sortBy")
    expect(keys).toContain("sortDir")
    expect(keys).toContain("hostCode")
  })
})
