"use client"

import { useEffect, useRef } from "react"

export type DebouncedCallback<TArgs extends unknown[]> = ((...args: TArgs) => void) & {
  cancel: () => void
  flush: () => void
}

/**
 * Trailing-edge debounce: invokes with the latest args after `delayMs` of quiet.
 * Flushes any pending invocation on unmount so the last value is not dropped.
 */
export function useDebouncedCallback<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delayMs: number,
): DebouncedCallback<TArgs> {
  const callbackRef = useRef(callback)
  const delayRef = useRef(delayMs)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingArgsRef = useRef<TArgs | null>(null)
  const debouncedRef = useRef<DebouncedCallback<TArgs> | null>(null)

  callbackRef.current = callback
  delayRef.current = delayMs

  if (debouncedRef.current === null) {
    const cancel = () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      pendingArgsRef.current = null
    }

    const flush = () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      const pending = pendingArgsRef.current
      pendingArgsRef.current = null
      if (pending !== null) {
        callbackRef.current(...pending)
      }
    }

    const run = ((...args: TArgs) => {
      pendingArgsRef.current = args
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null
        const pending = pendingArgsRef.current
        pendingArgsRef.current = null
        if (pending !== null) {
          callbackRef.current(...pending)
        }
      }, delayRef.current)
    }) as DebouncedCallback<TArgs>

    run.cancel = cancel
    run.flush = flush
    debouncedRef.current = run
  }

  useEffect(() => {
    return () => {
      debouncedRef.current?.flush()
    }
  }, [])

  return debouncedRef.current
}
