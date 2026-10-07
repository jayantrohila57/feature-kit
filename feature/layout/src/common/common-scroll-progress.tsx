"use client"

import { startTransition, useEffect, useState } from "react"

import { cn } from "@/packages/ui/lib/utils"

export function ScrollProgress({ className }: { className?: string }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      startTransition(() => {
        setProgress(scrollPercent)
      })
    }

    updateProgress()
    window.addEventListener("scroll", updateProgress, { passive: true })
    return () => {
      window.removeEventListener("scroll", updateProgress)
    }
  }, [])

  return (
    <div
      className={cn("fixed top-0 left-0 z-[9999] h-px w-full", className)}
      aria-hidden>
      <div
        className="h-full bg-primary transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
