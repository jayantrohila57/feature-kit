import { describe, expect, it } from "vitest"

import { resolveTableUrlSyncOptions } from "./utils-use-table-url-sync"

describe("resolveTableUrlSyncOptions", () => {
  it("serverRsc mode uses router.replace path without shallow writes", () => {
    expect(resolveTableUrlSyncOptions({ mode: "serverRsc" })).toEqual({
      shallow: false,
      serverRefresh: true,
    })
  })

  it("clientQuery mode uses shallow replaceState without RSC refresh", () => {
    expect(resolveTableUrlSyncOptions({ mode: "clientQuery" })).toEqual({
      shallow: true,
      serverRefresh: false,
    })
  })

  it("cascadeClientQuery matches clientQuery write strategy", () => {
    expect(resolveTableUrlSyncOptions({ mode: "cascadeClientQuery" })).toEqual({
      shallow: true,
      serverRefresh: false,
    })
  })

  it("legacy serverRefresh: true defaults shallow to false", () => {
    expect(resolveTableUrlSyncOptions({ serverRefresh: true })).toEqual({
      shallow: false,
      serverRefresh: true,
    })
  })

  it("mode overrides conflicting shallow/serverRefresh flags", () => {
    expect(
      resolveTableUrlSyncOptions({
        mode: "serverRsc",
        shallow: true,
        serverRefresh: false,
      }),
    ).toEqual({
      shallow: false,
      serverRefresh: true,
    })
  })
})
