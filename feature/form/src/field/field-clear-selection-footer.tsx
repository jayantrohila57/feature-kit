"use client"

import { CheckIcon, XIcon } from "lucide-react"

import { Button } from "@/packages/ui/components/button"
import { CommandSeparator } from "@/packages/ui/components/command"

type FieldSelectionFooterProps = {
  clearLabel?: string
  onClear?: () => void
  selectAllLabel?: string
  onSelectAll?: () => void
}

export function FieldSelectionFooter({
  clearLabel = "Clear",
  onClear,
  selectAllLabel = "Select all",
  onSelectAll,
}: FieldSelectionFooterProps) {
  if (!onClear && !onSelectAll) return null

  return (
    <>
      <CommandSeparator />
      <div className="flex justify-end gap-1 p-1.5">
        {onSelectAll ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5"
            onClick={(event) => {
              event.preventDefault()
              onSelectAll()
            }}>
            <CheckIcon
              className="size-3.5"
              aria-hidden
            />
            {selectAllLabel}
          </Button>
        ) : null}
        {onClear ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={(event) => {
              event.preventDefault()
              onClear()
            }}>
            <XIcon
              className="size-3.5"
              aria-hidden
            />
            {clearLabel}
          </Button>
        ) : null}
      </div>
    </>
  )
}

type FieldClearSelectionFooterProps = {
  label?: string
  onClear: () => void
}

/** @deprecated Prefer FieldSelectionFooter when select-all is also needed. */
export function FieldClearSelectionFooter({ label = "Clear", onClear }: FieldClearSelectionFooterProps) {
  return (
    <FieldSelectionFooter
      clearLabel={label}
      onClear={onClear}
    />
  )
}
