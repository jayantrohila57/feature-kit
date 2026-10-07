import type { TranslateFn } from "../../view-options"

import { describe, expect, it } from "vitest"

import {
  getEnabledFilterKinds,
  getFilterUrlKeysFromDefinitions,
  getToolbarChipKeysFromDefinitions,
  normalizeColumnFilterMeta,
  resolveColumnFilterDefinition,
  resolveFilterDefinitions,
} from "./utils-filter-definitions"

const catalog: Record<string, string> = {
  "bank.column.bankType": "Bank type",
  "bank.column.name": "Bank name",
}

const t = Object.assign((key: string) => catalog[key] ?? key, {
  has: (key: string) => key in catalog,
}) as TranslateFn

const options = [
  { value: "PRIVATE", label: "Private" },
  { value: "PUBLIC", label: "Public" },
]

describe("normalizeColumnFilterMeta", () => {
  it("returns undefined for no filter", () => {
    expect(normalizeColumnFilterMeta(undefined)).toBeUndefined()
  })

  it("normalises legacy { urlKey, options } into capability meta", () => {
    expect(normalizeColumnFilterMeta({ urlKey: "bankType", options, multi: false })).toEqual({
      key: "bankType",
      options: true,
      staticOptions: options,
      multi: false,
    })
  })

  it("passes capability meta through untouched", () => {
    const meta = { key: "bankType", search: true, sort: true, options: true }
    expect(normalizeColumnFilterMeta(meta)).toBe(meta)
  })
})

describe("resolveColumnFilterDefinition", () => {
  it("returns null for display columns without capabilities", () => {
    expect(resolveColumnFilterDefinition({ id: "actions" }, { t })).toBeNull()
  })

  it("defaults text accessor columns to sort-only (legacy IAM behaviour)", () => {
    const definition = resolveColumnFilterDefinition({ accessorKey: "email" }, { t })
    expect(definition).toEqual({
      key: "email",
      columnId: "email",
      label: "Email",
      search: false,
      sort: true,
      options: null,
      multi: true,
    })
  })

  it("respects enableSorting: false and deprecated meta.sort", () => {
    expect(resolveColumnFilterDefinition({ accessorKey: "email", enableSorting: false }, { t })).toBeNull()
    expect(resolveColumnFilterDefinition({ accessorKey: "email", meta: { sort: false } }, { t })).toBeNull()
  })

  it("resolves legacy option filters with static options", () => {
    const definition = resolveColumnFilterDefinition(
      {
        id: "bankType",
        accessorKey: "bankType",
        enableSorting: false,
        meta: { labelKey: "bank.column.bankType", filter: { urlKey: "bankTypeKey", options } },
      },
      { t },
    )
    expect(definition).toMatchObject({
      key: "bankTypeKey",
      columnId: "bankType",
      label: "Bank type",
      search: false,
      sort: false,
      options,
    })
  })

  it("prefers filterOptions from the table over static options", () => {
    const fromTable = [{ value: "FOREIGN", label: "Foreign" }]
    const definition = resolveColumnFilterDefinition(
      {
        id: "bankType",
        accessorKey: "bankType",
        meta: { labelKey: "bank.column.bankType", filter: { options: true, search: true, sort: true } },
      },
      { t, filterOptions: { bankType: fromTable } },
    )
    expect(definition).toMatchObject({ key: "bankType", search: true, sort: true, options: fromTable })
  })

  it("keeps search/sort independent of options", () => {
    const definition = resolveColumnFilterDefinition(
      { id: "description", accessorKey: "description", meta: { filter: { search: true, sort: false } } },
      { t },
    )
    expect(definition).toMatchObject({ search: true, sort: false, options: null })
    expect(getEnabledFilterKinds(definition as NonNullable<typeof definition>)).toEqual(["search"])
  })
})

describe("resolveFilterDefinitions", () => {
  it("dedupes by key and lets explicit definitions override", () => {
    const definitions = resolveFilterDefinitions(
      [
        { id: "bankType", accessorKey: "bankType", meta: { filter: { options: true } } },
        { id: "bankType2", accessorKey: "bankType2", meta: { filter: { key: "bankType", options: true } } },
      ],
      {
        t,
        explicitDefinitions: [
          { key: "status", columnId: null, label: "Status", search: false, sort: false, options, multi: true },
        ],
      },
    )
    expect(definitions.map((definition) => definition.key)).toEqual(["bankType", "status"])
    expect(getFilterUrlKeysFromDefinitions(definitions)).toEqual(["bankType", "status"])
  })
})

describe("getToolbarChipKeysFromDefinitions", () => {
  it("includes search-only filters as well as value lists", () => {
    const base = { columnId: null, label: "", sort: false, multi: true }
    expect(
      getToolbarChipKeysFromDefinitions([
        { ...base, key: "bankType", search: false, options: [] },
        { ...base, key: "createdBy", search: true, options: null },
        { ...base, key: "sortOnly", search: false, options: null },
      ]),
    ).toEqual(["bankType", "createdBy"])
  })
})
