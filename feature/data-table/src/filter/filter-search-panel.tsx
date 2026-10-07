"use client"

import { Search } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/packages/ui/components/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/packages/ui/components/input-group"

import { DATA_TABLE_SEARCH_DEBOUNCE_MS } from "../constants/constants-search"
import { useDebouncedCallback } from "../utils/utils-use-debounced-callback"

export type FilterSearchPanelProps = {
  appliedValue: string
  menuOpen: boolean
  /** Placeholder override (defaults to the generic column search placeholder). */
  placeholder?: string
  /** Called (debounced) while typing, and immediately on Enter. */
  onApply: (value: string) => void
  onClear: () => void
  /** Called after Enter so the host popover can close. */
  onDone?: () => void
}

/** Live text search for one filter definition: applies as you type; Enter closes; Clear resets. */
export function FilterSearchPanel({
  appliedValue,
  menuOpen,
  placeholder,
  onApply,
  onClear,
  onDone,
}: FilterSearchPanelProps) {
  const t = useTranslations()
  const [draftValue, setDraftValue] = useState(appliedValue)
  const committedRef = useRef(appliedValue)
  const debouncedApply = useDebouncedCallback((value: string) => {
    committedRef.current = value.trim()
    onApply(value)
  }, DATA_TABLE_SEARCH_DEBOUNCE_MS)

  // Adopt the applied value only when it changes from outside (chip removed, clear all, back/forward).
  useEffect(() => {
    if (!menuOpen || appliedValue.trim() === committedRef.current) {
      return
    }
    committedRef.current = appliedValue.trim()
    debouncedApply.cancel()
    setDraftValue(appliedValue)
  }, [menuOpen, appliedValue, debouncedApply])

  const hasValue = draftValue.trim() !== "" || appliedValue.trim() !== ""

  return (
    <div className="flex flex-col gap-1.5 p-2">
      <InputGroup className="bg-background shadow-xs">
        <InputGroupAddon align="inline-start">
          <Search className="size-3.5" />
        </InputGroupAddon>
        <InputGroupInput
          autoFocus
          value={draftValue}
          placeholder={placeholder ?? t("dataTable.column.columnSearchPlaceholder")}
          onChange={(event) => {
            setDraftValue(event.target.value)
            debouncedApply(event.target.value)
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              debouncedApply.cancel()
              committedRef.current = draftValue.trim()
              onApply(draftValue)
              onDone?.()
            }
          }}
        />
      </InputGroup>
      {hasValue ? (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="link"
            size="sm"
            className="h-auto p-0 text-muted-foreground text-xs"
            onClick={() => {
              debouncedApply.cancel()
              committedRef.current = ""
              setDraftValue("")
              onClear()
            }}>
            {t("dataTable.column.clearSearch")}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
