"use client"

import { type ComponentType, useEffect, useState } from "react"

const cache = new Map<string, ComponentType<never>>()
const inflight = new Map<string, Promise<ComponentType<never>>>()

/**
 * Lazy-load a field implementation without `next/dynamic`'s empty mount frame
 * (that blank frame collapses the form grid, then expands it when the field appears).
 */
export function useLazyField<P>(key: string, loader: () => Promise<ComponentType<P>>): ComponentType<P> | null {
  const [mounted, setMounted] = useState(false)
  const [Comp, setComp] = useState<ComponentType<P> | null>(
    () => (cache.get(key) as ComponentType<P> | undefined) ?? null,
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const cached = cache.get(key) as ComponentType<P> | undefined
    if (cached) {
      setComp(() => cached)
      return
    }

    let alive = true
    let promise = inflight.get(key) as Promise<ComponentType<P>> | undefined
    if (!promise) {
      promise = loader().then((Loaded) => {
        cache.set(key, Loaded as ComponentType<never>)
        inflight.delete(key)
        return Loaded
      })
      inflight.set(key, promise as Promise<ComponentType<never>>)
    }

    void promise.then((Loaded) => {
      if (alive) setComp(() => Loaded)
    })

    return () => {
      alive = false
    }
  }, [key, loader, mounted])

  if (!mounted) return null

  return Comp
}
