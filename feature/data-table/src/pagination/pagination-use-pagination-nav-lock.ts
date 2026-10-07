"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { DATA_TABLE_PAGINATION_LOCK_MS } from "../constants"

export type PaginationNavActionId = "first" | "previous" | "next" | "last" | "pageSize"

export function usePaginationNavLock() {
  const [isLocked, setIsLocked] = useState(false)
  const [activeAction, setActiveAction] = useState<PaginationNavActionId | null>(null)
  const lockedUntilRef = useRef(0)
  const isLockedRef = useRef(false)
  const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearUnlockTimer = useCallback(() => {
    if (unlockTimerRef.current !== null) {
      clearTimeout(unlockTimerRef.current)
      unlockTimerRef.current = null
    }
  }, [])

  const releaseLock = useCallback(() => {
    clearUnlockTimer()
    lockedUntilRef.current = 0
    isLockedRef.current = false
    setIsLocked(false)
    setActiveAction(null)
  }, [clearUnlockTimer])

  const runLockedAction = useCallback(
    (actionId: PaginationNavActionId, action: () => void) => {
      const now = Date.now()
      if (isLockedRef.current || now < lockedUntilRef.current) {
        return
      }

      const unlockAt = now + DATA_TABLE_PAGINATION_LOCK_MS
      lockedUntilRef.current = unlockAt
      isLockedRef.current = true
      setIsLocked(true)
      setActiveAction(actionId)

      action()

      clearUnlockTimer()
      unlockTimerRef.current = setTimeout(releaseLock, DATA_TABLE_PAGINATION_LOCK_MS)
    },
    [clearUnlockTimer, releaseLock],
  )

  useEffect(() => {
    return () => {
      clearUnlockTimer()
    }
  }, [clearUnlockTimer])

  const isActionLoading = useCallback(
    (actionId: PaginationNavActionId) => isLocked && activeAction === actionId,
    [activeAction, isLocked],
  )

  return {
    isLocked,
    activeAction,
    runLockedAction,
    isActionLoading,
  }
}
