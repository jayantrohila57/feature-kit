"use client"

import { useSyncExternalStore } from "react"

const emptySubscribe = () => () => {}

/**
 * Avoids hydration mismatch while column visibility restores from localStorage.
 * Server snapshot is false (generic label); client snapshot is true immediately.
 */
export function useViewOptionsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )
}
