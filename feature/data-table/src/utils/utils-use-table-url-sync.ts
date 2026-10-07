"use client"

import type { Route } from "next"

import { buildDisplayedAppHref } from "layout/sidebar/app-pathname"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useQueryStates } from "nuqs"
import { useCallback, useMemo } from "react"

import { DATA_TABLE_CLEAR_FILTER_URL_KEYS, isDataTablePageSize } from "../constants"
import { mergeSearchParams } from "./utils-live-search-params"
import { shallowReplaceSearchParams } from "./utils-shallow-search-params"
import { tableUrlParsers, tableUrlShallowUpdateOptions, tableUrlUpdateOptions } from "./utils-table-url-parsers"
import {
  mutateTableColumnSearch,
  mutateTableFilter,
  mutateTablePagination,
  mutateTableSearch,
  mutateTableSorting,
  resolveTableLimit,
  resolveTablePage,
} from "./utils-table-url-sync.utils"
import { useEffectiveSearchParams } from "./utils-use-effective-search-params"

/** Listing URL write/read strategy — one mode per route, no mixed shallow + refresh. */
export type TableUrlListingMode = "clientQuery" | "serverRsc" | "cascadeClientQuery"

export type TableUrlSyncOptions = {
  /**
   * Preferred listing mode. Overrides ad-hoc `shallow` / `serverRefresh` when set.
   *
   * - `clientQuery` / `cascadeClientQuery` — shallow `replaceState`; client queries read merged URL
   * - `serverRsc` — `router.replace` + RSC refresh (IAM server listings)
   */
  mode?: TableUrlListingMode
  /**
   * When true (default for client listings), URL writes use `history.replaceState` without an RSC refetch.
   * Ignored when `mode` is set.
   */
  shallow?: boolean
  /** After URL writes, re-fetch server components. Ignored when `mode` is set. */
  serverRefresh?: boolean
}

export function resolveTableUrlSyncOptions(options?: TableUrlSyncOptions): {
  shallow: boolean
  serverRefresh: boolean
} {
  if (options?.mode) {
    switch (options.mode) {
      case "clientQuery":
      case "cascadeClientQuery":
        return { shallow: true, serverRefresh: false }
      case "serverRsc":
        return { shallow: false, serverRefresh: true }
    }
  }

  const serverRefresh = options?.serverRefresh ?? false
  const shallow = options?.shallow ?? !serverRefresh
  return { shallow, serverRefresh }
}

export function useTableUrlSync(options?: TableUrlSyncOptions) {
  const { shallow, serverRefresh } = resolveTableUrlSyncOptions(options)
  const updateOptions = shallow ? tableUrlShallowUpdateOptions : tableUrlUpdateOptions
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const effectiveSearchParams = useEffectiveSearchParams()
  const readParams = shallow ? effectiveSearchParams : searchParams

  const refreshServer = useCallback(() => {
    if (serverRefresh) {
      router.refresh()
    }
  }, [router, serverRefresh])

  // nuqs backs non-shallow navigations; shallow listings read/write the live query string.
  const [tableParams, setTableParams] = useQueryStates(tableUrlParsers, updateOptions)

  const page = useMemo(() => {
    return resolveTablePage(readParams, tableParams.page)
  }, [readParams, tableParams.page])

  const limit = useMemo(() => {
    return resolveTableLimit(readParams, tableParams.limit)
  }, [readParams, tableParams.limit])

  const pushSearchParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      if (shallow) {
        const didWrite = shallowReplaceSearchParams(pathname, (current) => {
          if (!current.toString() && readParams.toString()) {
            mergeSearchParams(current, readParams)
          }
          mutate(current)
        })
        if (didWrite) {
          refreshServer()
        }
        return
      }

      const current = new URLSearchParams(
        typeof window === "undefined" ? Array.from(searchParams.entries()) : window.location.search,
      )
      mutate(current)
      const href = buildDisplayedAppHref(pathname, current.toString())
      if (href === null) return
      router.replace(href as Route, { scroll: false })
      refreshServer()
    },
    [pathname, readParams, refreshServer, router, searchParams, shallow],
  )

  const setFilter = useCallback(
    (key: string, value: string | string[] | null | undefined) => {
      pushSearchParams((current) => {
        mutateTableFilter(current, key, value)
      })
    },
    [pushSearchParams],
  )

  const setColumnSearch = useCallback(
    (key: string, value: string | null | undefined) => {
      pushSearchParams((current) => {
        mutateTableColumnSearch(current, key, value)
      })
    },
    [pushSearchParams],
  )

  const setPagination = useCallback(
    (nextPage: number, nextLimit: number) => {
      if (!isDataTablePageSize(nextLimit)) {
        return
      }

      const normalizedPage = Math.max(1, nextPage)

      if (shallow) {
        pushSearchParams((current) => {
          mutateTablePagination(current, normalizedPage, nextLimit)
        })
        return
      }

      void setTableParams({
        page: normalizedPage,
        limit: nextLimit,
      })
      refreshServer()
    },
    [pushSearchParams, refreshServer, setTableParams, shallow],
  )

  const setSearch = useCallback(
    (q: string) => {
      const next = q.trim()

      if (shallow) {
        pushSearchParams((current) => {
          mutateTableSearch(current, q)
        })
        return
      }

      void setTableParams({
        q: next === "" ? null : next,
        page: 1,
      })
      refreshServer()
    },
    [pushSearchParams, refreshServer, setTableParams, shallow],
  )

  const setSorting = useCallback(
    (sortBy: string | null | undefined, sortDir: "asc" | "desc" | null | undefined) => {
      if (shallow) {
        pushSearchParams((current) => {
          mutateTableSorting(current, sortBy, sortDir)
        })
        return
      }

      void setTableParams({
        sortBy: sortBy ?? null,
        sortDir: sortDir ?? null,
        page: 1,
      })
      refreshServer()
    },
    [pushSearchParams, refreshServer, setTableParams, shallow],
  )

  const clearFilters = useCallback(
    (keysToRemove?: string[]) => {
      pushSearchParams((current) => {
        const keys = keysToRemove && keysToRemove.length > 0 ? keysToRemove : DATA_TABLE_CLEAR_FILTER_URL_KEYS
        for (const key of keys) {
          current.delete(key)
        }
        current.set("page", "1")
      })
    },
    [pushSearchParams],
  )

  return {
    page,
    limit,
    pageIndex: page - 1,
    setFilter,
    setColumnSearch,
    setPagination,
    setSearch,
    setSorting,
    clearFilters,
  }
}
