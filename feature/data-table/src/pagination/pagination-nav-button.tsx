"use client"

import type { ReactNode } from "react"

import { Button } from "@/packages/ui/components/button"
import Spinner from "@/packages/ui/components/spinner"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/packages/ui/components/tooltip"

type PaginationNavButtonProps = {
  label: string
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  children: ReactNode
}

export function PaginationNavButton({
  label,
  onClick,
  disabled = false,
  loading = false,
  children,
}: PaginationNavButtonProps) {
  const isDisabled = disabled || loading

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onClick}
          disabled={isDisabled}
          aria-busy={loading}
          aria-label={label}>
          {loading ? <Spinner className="size-4" /> : children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  )
}
