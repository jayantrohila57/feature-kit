import type { DataTableFilterDefinition } from "../filter-types"

import { describe, expect, it } from "vitest"

import {
  cycleSortDirection,
  getAppliedOptionFilterKeys,
  resolveFilterActiveState,
  resolveVisibleFilterChipKeys,
} from "./utils-filter-active"

const bankType: DataTableFilterDefinition = {
  key: "bankType",
  columnId: "bankType",
  label: "Bank type",
  search: true,
  sort: true,
  options: [{ value: "PRIVATE", label: "Private" }],
  multi: true,
}

const remarks: DataTableFilterDefinition = {
  key: "remarks",
  columnId: "remarks",
  label: "Remarks",
  search: true,
  sort: false,
  options: null,
  multi: true,
}

describe("resolveFilterActiveState", () => {
  it("reports nothing active when URL state is empty", () => {
    expect(resolveFilterActiveState(bankType, { filters: {}, columnSearch: {}, sorting: [] })).toEqual({
      search: false,
      sort: false,
      options: false,
      any: false,
      count: 0,
    })
  })

  it("tracks each capability independently", () => {
    expect(
      resolveFilterActiveState(bankType, {
        filters: { bankType: ["PRIVATE"] },
        columnSearch: { bankType: "pri" },
        sorting: [{ id: "bankType", desc: true }],
      }),
    ).toEqual({ search: true, sort: true, options: true, any: true, count: 3 })
  })

  it("ignores state for capabilities the definition does not expose", () => {
    expect(
      resolveFilterActiveState(remarks, {
        filters: { remarks: ["x"] },
        columnSearch: {},
        sorting: [{ id: "remarks", desc: false }],
      }),
    ).toEqual({ search: false, sort: false, options: false, any: false, count: 0 })
  })
})

describe("resolveVisibleFilterChipKeys", () => {
  it("orders added then applied and drops non-option keys", () => {
    expect(
      resolveVisibleFilterChipKeys({
        definitions: [bankType, remarks],
        pinnedKeys: ["bankType"],
        addedKeys: ["remarks", "bankType"],
        appliedKeys: ["bankType"],
      }),
    ).toEqual(["bankType"])
  })

  it("limits chips to the given candidate keys (hidden-column filters)", () => {
    expect(
      resolveVisibleFilterChipKeys({
        definitions: [bankType, remarks],
        addedKeys: ["remarks", "bankType"],
        appliedKeys: [],
        candidateKeys: ["remarks"],
      }),
    ).toEqual(["remarks"])
  })

  it("does not show pinned keys without added or applied state", () => {
    expect(
      resolveVisibleFilterChipKeys({
        definitions: [bankType],
        pinnedKeys: ["bankType"],
        addedKeys: [],
        appliedKeys: [],
      }),
    ).toEqual([])
  })

  it("shows applied keys even when never added", () => {
    expect(getAppliedOptionFilterKeys([bankType, remarks], { bankType: ["PRIVATE"], remarks: ["x"] })).toEqual([
      "bankType",
    ])
    expect(resolveVisibleFilterChipKeys({ definitions: [bankType], addedKeys: [], appliedKeys: ["bankType"] })).toEqual(
      ["bankType"],
    )
  })
})

describe("cycleSortDirection", () => {
  it("cycles unsorted → asc → desc → unsorted", () => {
    expect(cycleSortDirection(null)).toBe("asc")
    expect(cycleSortDirection("asc")).toBe("desc")
    expect(cycleSortDirection("desc")).toBeNull()
  })
})
