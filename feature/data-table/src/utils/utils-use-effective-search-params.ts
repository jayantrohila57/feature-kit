"use client"

import { useSearchParams } from "next/navigation"
import { useMemo, useSyncExternalStore } from "react"

import { createLiveSearchParams } from "./utils-live-search-params"
import { getShallowSearchParamsSnapshot, subscribeShallowSearchParams } from "./utils-shallow-search-params"

/** App Router search params plus shallow `history.replaceState` updates from listing filters. */
export function useEffectiveSearchParams(): URLSearchParams {
  const searchParams = useSearchParams()
  const liveSearch = useSyncExternalStore(subscribeShallowSearchParams, getShallowSearchParamsSnapshot, () =>
    searchParams.toString(),
  )

  return useMemo(() => {
    if (typeof window === "undefined") {
      return new URLSearchParams(searchParams.toString())
    }

    return createLiveSearchParams(searchParams, liveSearch)
  }, [searchParams, liveSearch])
}
