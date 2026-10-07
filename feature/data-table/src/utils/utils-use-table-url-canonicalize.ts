"use client"

import type { DataTablePageSize } from "../constants"

import { hasInFlightAppPathname } from "layout/sidebar/app-pathname"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

import { readStoredDataTablePageSize } from "./utils-page-size-preference"
import { shallowReplaceSearchParams } from "./utils-shallow-search-params"
import { useEffectiveSearchParams } from "./utils-use-effective-search-params"

/**
 * Writes missing table navigation params to the URL on first mount so listings
 * start with a bookmarkable canonical query string (e.g. ?page=1&limit=20).
 * Pass `enabled: false` for embedded tables that own pagination locally.
 */
export function useTableUrlCanonicalize({ enabled = true }: { enabled?: boolean } = {}) {
  const pathname = usePathname()
  const searchParams = useEffectiveSearchParams()
  const didCanonicalize = useRef(false)

  useEffect(() => {
    if (!enabled || didCanonicalize.current || hasInFlightAppPathname(pathname)) {
      return
    }

    const needsPage = !searchParams.has("page")
    const needsLimit = !searchParams.has("limit")

    didCanonicalize.current = true

    if (!needsPage && !needsLimit) {
      return
    }

    shallowReplaceSearchParams(pathname, (current) => {
      if (needsPage) {
        current.set("page", "1")
      }

      if (needsLimit) {
        current.set("limit", String(readStoredDataTablePageSize() as DataTablePageSize))
      }
    })
  }, [enabled, pathname, searchParams])
}
