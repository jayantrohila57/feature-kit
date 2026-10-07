import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  SHALLOW_SEARCH_PARAMS_EVENT,
  shallowReplaceSearchParams,
  subscribeShallowSearchParams,
} from "./utils-shallow-search-params"

function createWindowStub() {
  const listeners = new Map<string, Set<EventListener>>()

  return {
    location: {
      pathname: "/process/manual-reconciliation",
      search: "?page=1",
      hash: "",
    },
    history: {
      replaceState(_state: unknown, _title: string, url: string) {
        const parsed = new URL(url, "http://localhost")
        window.location.pathname = parsed.pathname
        window.location.search = parsed.search
        window.location.hash = parsed.hash
      },
      state: {},
    },
    addEventListener(type: string, listener: EventListener) {
      const set = listeners.get(type) ?? new Set<EventListener>()
      set.add(listener)
      listeners.set(type, set)
    },
    removeEventListener(type: string, listener: EventListener) {
      listeners.get(type)?.delete(listener)
    },
    dispatchEvent(event: Event) {
      for (const listener of listeners.get(event.type) ?? []) {
        listener(event)
      }
      return true
    },
  }
}

describe("shallowReplaceSearchParams", () => {
  beforeEach(() => {
    vi.stubGlobal("window", createWindowStub())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it("updates the query string and notifies shallow search subscribers", () => {
    const listener = vi.fn()
    const unsubscribe = subscribeShallowSearchParams(listener)

    shallowReplaceSearchParams("/process/manual-reconciliation", (params) => {
      params.set("matchType", "ONE_TO_ONE")
      params.set("status", "CLOSED")
    })

    expect(window.location.search).toBe("?page=1&matchType=ONE_TO_ONE&status=CLOSED")
    expect(listener).toHaveBeenCalledTimes(1)

    unsubscribe()
  })

  it("dispatches the shallow search params event", () => {
    const listener = vi.fn()
    window.addEventListener(SHALLOW_SEARCH_PARAMS_EVENT, listener)

    shallowReplaceSearchParams("/process/manual-reconciliation", (params) => {
      params.set("status", "PARTIAL")
    })

    expect(listener).toHaveBeenCalledTimes(1)
  })

  it("updates the visible document query even when the hook pathname differs", () => {
    window.location.pathname = "/reconciliation/en-IN/file-processing/import-history"
    window.location.search = "?processName=bank&hostType=INTERNAL&hostCode=SELF"

    shallowReplaceSearchParams("/process/recon-process", (params) => {
      params.delete("processName")
    })

    const next = new URLSearchParams(window.location.search)
    expect(next.has("processName")).toBe(false)
    expect(next.get("hostType")).toBe("INTERNAL")
    expect(next.get("hostCode")).toBe("SELF")
  })

  it("preserves unrelated query params when updating a single filter", () => {
    window.location.search = "?page=3&limit=50&q=acme&bankType=RETAIL&sortBy=bankName&sortDir=asc"

    shallowReplaceSearchParams("/process/manual-reconciliation", (params) => {
      params.delete("approvalStatus")
      params.append("approvalStatus", "DRAFT")
      params.set("page", "1")
    })

    const next = new URLSearchParams(window.location.search)
    expect(next.get("approvalStatus")).toBe("DRAFT")
    expect(next.get("page")).toBe("1")
    expect(next.get("limit")).toBe("50")
    expect(next.get("q")).toBe("acme")
    expect(next.get("bankType")).toBe("RETAIL")
    expect(next.get("sortBy")).toBe("bankName")
    expect(next.get("sortDir")).toBe("asc")
  })
})
