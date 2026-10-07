import type { ReactNode } from "react"

const SKELETON_KEYS = ["a", "b", "c", "d"] as const

export function ComboboxOptionsSkeleton(): ReactNode {
  return (
    <div className="flex flex-col gap-1.5 p-2">
      {SKELETON_KEYS.map((key) => (
        <div
          key={key}
          className="h-7 w-full animate-pulse rounded-md bg-muted"
        />
      ))}
    </div>
  )
}
