import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  buildAddedFilterKeysFromSelection,
  getFilterStorageKey,
  pruneStoredFilterKeys,
  readStoredFilterPreferences,
  resolveInitialAddedFilterKeys,
  writeStoredFilterPreferences,
} from "./filter-persistence"

function createMemoryStorage(): Storage {
  const map = new Map<string, string>()
  return {
    get length() {
      return map.size
    },
    clear() {
      map.clear()
    },
    getItem(key: string) {
      return map.has(key) ? (map.get(key) ?? null) : null
    },
    key(index: number) {
      return [...map.keys()][index] ?? null
    },
    removeItem(key: string) {
      map.delete(key)
    },
    setItem(key: string, value: string) {
      map.set(key, value)
    },
  }
}

describe("filter-persistence", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createMemoryStorage())
    vi.stubGlobal("window", { localStorage: globalThis.localStorage })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("builds a versioned storage key", () => {
    expect(getFilterStorageKey("bank")).toBe("data-table:filters:v1:bank")
  })

  it("round-trips added keys only", () => {
    writeStoredFilterPreferences("bank", { added: ["bankType", "countryCode"] })
    expect(JSON.parse(localStorage.getItem(getFilterStorageKey("bank")) ?? "{}")).toEqual({
      added: ["bankType", "countryCode"],
    })
    expect(readStoredFilterPreferences("bank")).toEqual({ added: ["bankType", "countryCode"] })
  })

  it("returns null for missing or invalid payloads", () => {
    expect(readStoredFilterPreferences("missing")).toBeNull()
    localStorage.setItem(getFilterStorageKey("bad"), "not-json")
    expect(readStoredFilterPreferences("bad")).toBeNull()
    localStorage.setItem(getFilterStorageKey("shape"), JSON.stringify({ added: "bankType" }))
    expect(readStoredFilterPreferences("shape")).toBeNull()
  })

  it("prunes unknown and duplicate keys, preserving order", () => {
    expect(pruneStoredFilterKeys(["gone", "b", "a", "b"], ["a", "b"])).toEqual(["b", "a"])
  })

  it("resolves initial keys from storage pruned to definitions", () => {
    writeStoredFilterPreferences("bank", { added: ["countryCode", "removedColumn"] })
    expect(resolveInitialAddedFilterKeys("bank", ["bankType", "countryCode"])).toEqual(["countryCode"])
    expect(resolveInitialAddedFilterKeys(undefined, ["bankType"])).toEqual([])
  })

  it("builds added keys in definition order from selection", () => {
    expect(buildAddedFilterKeysFromSelection(new Set(["c", "a"]), ["a", "b", "c"])).toEqual(["a", "c"])
    expect(buildAddedFilterKeysFromSelection(new Set(), ["a", "b"])).toEqual([])
  })

  it("swallows storage write failures", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => null,
      setItem: () => {
        throw new Error("quota")
      },
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0,
    } satisfies Storage)
    vi.stubGlobal("window", { localStorage: globalThis.localStorage })

    expect(() => writeStoredFilterPreferences("bank", { added: ["bankType"] })).not.toThrow()
  })
})
