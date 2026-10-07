"use client"

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"
import { useState } from "react"

import { Button } from "@/packages/ui/components/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/packages/ui/components/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/packages/ui/components/popover"
import { COMBOBOX_POPOVER_CONTENT_CLASS } from "@/packages/ui/lib/combobox-popover"
import { cn } from "@/packages/ui/lib/utils"

type PaginationPageSizeOption = {
  value: string
  label: string
}

type PaginationPageSizeSelectProps = {
  value: string
  options: PaginationPageSizeOption[]
  disabled?: boolean
  onValueChange: (value: string) => void
  searchPlaceholder?: string
  emptyMessage?: string
  noResultsMessage?: string
  className?: string
}

export function PaginationPageSizeSelect({
  value,
  options,
  disabled = false,
  onValueChange,
  searchPlaceholder = "Search…",
  emptyMessage = "No page sizes available.",
  noResultsMessage = "No matching page sizes.",
  className,
}: PaginationPageSizeSelectProps) {
  const [open, setOpen] = useState(false)
  const selectedLabel = options.find((option) => option.value === value)?.label ?? value

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("h-8 w-37.5 justify-between bg-transparent px-2 font-normal", className)}>
          <span className="truncate">{selectedLabel}</span>
          <ChevronsUpDownIcon className="size-3.5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="top"
        className={COMBOBOX_POPOVER_CONTENT_CLASS}>
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            {options.length === 0 ? (
              <div className="px-3 py-6 text-center text-muted-foreground text-xs">{emptyMessage}</div>
            ) : (
              <>
                <CommandEmpty>{noResultsMessage}</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => {
                    const isSelected = option.value === value
                    return (
                      <CommandItem
                        key={option.value}
                        value={`${option.label} ${option.value}`}
                        onSelect={() => {
                          onValueChange(option.value)
                          setOpen(false)
                        }}>
                        <CheckIcon className={cn("size-3.5 shrink-0", isSelected ? "opacity-100" : "opacity-0")} />
                        <span className="truncate">{option.label}</span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
