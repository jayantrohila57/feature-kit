"use client"

import type { DataTableFilterDefinition } from "../filter-types"

import { useCallback, useEffect, useMemo, useState } from "react"

import { useViewOptionsMounted } from "../../view-options"
import {
  buildAddedFilterKeysFromSelection,
  resolveInitialAddedFilterKeys,
  writeStoredFilterPreferences,
} from "../filter-persistence"
import { getToolbarChipKeysFromDefinitions } from "../utils"

export type UseAddedFiltersOptions = {
  tableId: string | undefined
  definitions: readonly DataTableFilterDefinition[]
}

export type UseAddedFiltersResult = {
  /** False during SSR / first client render, before localStorage is read. */
  mounted: boolean
  addedKeys: string[]
  addFilter: (key: string) => void
  removeFilter: (key: string) => void
  /** Replace toolbar visibility preferences (localStorage `added` only). */
  setAddedFilterKeys: (keys: readonly string[]) => void
}

/**
 * Owns toolbar filter *visibility* (`localStorage` per `tableId`). Applied values stay in the URL.
 * Without a `tableId`, added filters live only for the current mount.
 */
export function useAddedFilters({ tableId, definitions }: UseAddedFiltersOptions): UseAddedFiltersResult {
  const mounted = useViewOptionsMounted()
  // Search-only filters (e.g. "Created by") can be added as chips too, not just value lists.
  const optionKeys = useMemo(() => getToolbarChipKeysFromDefinitions(definitions), [definitions])
  const optionKeysSignature = optionKeys.join("\0")
  const [addedKeys, setAddedKeys] = useState<string[]>([])

  useEffect(() => {
    if (!tableId) {
      return
    }
    setAddedKeys(resolveInitialAddedFilterKeys(tableId, optionKeysSignature.split("\0").filter(Boolean)))
  }, [tableId, optionKeysSignature])

  const persist = useCallback(
    (next: string[]) => {
      if (tableId) {
        writeStoredFilterPreferences(tableId, { added: next })
      }
    },
    [tableId],
  )

  const addFilter = useCallback(
    (key: string) => {
      setAddedKeys((current) => {
        if (current.includes(key)) {
          return current
        }
        const next = [...current, key]
        persist(next)
        return next
      })
    },
    [persist],
  )

  const removeFilter = useCallback(
    (key: string) => {
      setAddedKeys((current) => {
        if (!current.includes(key)) {
          return current
        }
        const next = current.filter((entry) => entry !== key)
        persist(next)
        return next
      })
    },
    [persist],
  )

  const setAddedFilterKeys = useCallback(
    (keys: readonly string[]) => {
      const next = buildAddedFilterKeysFromSelection(new Set(keys), optionKeys)
      setAddedKeys(next)
      persist(next)
    },
    [optionKeys, persist],
  )

  return { mounted, addedKeys, addFilter, removeFilter, setAddedFilterKeys }
}
