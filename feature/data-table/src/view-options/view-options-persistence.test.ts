import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  getViewOptionsStorageKey,
  mergeStoredPreferences,
  mergeStoredVisibility,
  readStoredColumnPreferences,
  resolveInitialColumnPreferences,
  writeStoredColumnPreferences,
} from "./view-options-persistence"

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

describe("view-options-persistence", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createMemoryStorage())
    vi.stubGlobal("window", { localStorage: globalThis.localStorage })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("builds a versioned storage key", () => {
    expect(getViewOptionsStorageKey("identity-users")).toBe("data-table:columns:v2:identity-users")
  })

  it("round-trips preferences through localStorage", () => {
    writeStoredColumnPreferences("identity-users", {
      visibility: { email: false, username: true },
      order: ["username", "email"],
      pinnedLeft: ["username"],
    })
    expect(readStoredColumnPreferences("identity-users")).toEqual({
      visibility: { email: false, username: true },
      order: ["username", "email"],
      pinnedLeft: ["username"],
    })
  })

  it("migrates legacy v1 visibility-only payloads", () => {
    localStorage.setItem("data-table:columns:v1:legacy", JSON.stringify({ email: false, username: true }))
    expect(readStoredColumnPreferences("legacy")).toEqual({
      visibility: { email: false, username: true },
    })
  })

  it("returns null for missing or invalid JSON", () => {
    expect(readStoredColumnPreferences("missing")).toBeNull()
    localStorage.setItem(getViewOptionsStorageKey("bad"), "not-json")
    expect(readStoredColumnPreferences("bad")).toBeNull()
    localStorage.setItem(getViewOptionsStorageKey("array"), "[]")
    expect(readStoredColumnPreferences("array")).toBeNull()
  })

  it("merges stored visibility with known column ids", () => {
    const merged = mergeStoredVisibility({ email: false, gone: false, username: true }, ["email", "username", "active"])
    expect(merged).toEqual({ email: false, username: true })
  })

  it("merges stored order and pins with known column ids", () => {
    const merged = mergeStoredPreferences(
      {
        visibility: { email: false },
        order: ["gone", "email", "username"],
        pinnedLeft: ["gone", "email"],
      },
      ["select", "email", "username", "actions"],
    )

    expect(merged).toEqual({
      visibility: { email: false },
      order: ["email", "username"],
      pinnedLeft: ["email"],
    })
  })

  it("resolveInitialColumnPreferences returns defaults without tableId", () => {
    expect(
      resolveInitialColumnPreferences(undefined, ["select", "email", "actions"], {
        visibility: { email: false },
        pinnedLeft: ["email"],
      }),
    ).toEqual({
      visibility: { email: false },
      order: ["email"],
      pinnedLeft: ["email"],
    })
  })

  it("uses default pins when storage has no pinnedLeft preference", () => {
    writeStoredColumnPreferences("identity-users", {
      visibility: { email: true },
      order: ["email", "username"],
    })

    expect(
      resolveInitialColumnPreferences("identity-users", ["select", "email", "username", "actions"], {
        pinnedLeft: ["email"],
      }),
    ).toEqual({
      visibility: { email: true },
      order: ["email", "username"],
      pinnedLeft: ["email"],
    })
  })

  it("keeps stored empty pins when user explicitly saved them", () => {
    writeStoredColumnPreferences("identity-users", {
      visibility: { email: true },
      order: ["email", "username"],
      pinnedLeft: [],
    })

    expect(
      resolveInitialColumnPreferences("identity-users", ["select", "email", "username", "actions"], {
        pinnedLeft: ["email"],
      }),
    ).toEqual({
      visibility: { email: true },
      order: ["email", "username"],
      pinnedLeft: [],
    })
  })

  it("swallows localStorage write failures", () => {
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

    expect(() =>
      writeStoredColumnPreferences("t", { visibility: { email: false }, order: ["email"], pinnedLeft: [] }),
    ).not.toThrow()
  })
})
