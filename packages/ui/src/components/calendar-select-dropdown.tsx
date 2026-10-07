"use client"

import type { ChangeEvent } from "react"
import type { DropdownProps } from "react-day-picker"

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

export function CalendarSelectDropdown({
  options,
  value,
  onChange,
  disabled,
  className,
  "aria-label": ariaLabel,
}: DropdownProps) {
  const [open, setOpen] = useState(false)

  const handleValueChange = (newValue: string) => {
    onChange?.({
      target: { value: newValue },
    } as ChangeEvent<HTMLSelectElement>)
    setOpen(false)
  }

  const selectedValue = value === undefined || value === null ? "" : String(value)
  const selectedLabel = options?.find((option) => String(option.value) === selectedValue)?.label ?? selectedValue

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-label={ariaLabel}
          aria-expanded={open}
          disabled={disabled === true}
          className={cn("relative z-10 min-w-0 justify-between bg-background px-2 font-normal", className)}
          size="sm">
          <span className="truncate">{selectedLabel}</span>
          <ChevronsUpDownIcon className="size-3.5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn("z-[100]", COMBOBOX_POPOVER_CONTENT_CLASS)}>
        <Command>
          <CommandInput placeholder="Search…" />
          <CommandList>
            {(options?.length ?? 0) === 0 ? (
              <div className="px-3 py-6 text-center text-muted-foreground text-xs">No options available.</div>
            ) : (
              <>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {options?.map((option) => {
                    const optionValue = option.value.toString()
                    const isSelected = optionValue === selectedValue
                    return (
                      <CommandItem
                        key={optionValue}
                        value={`${option.label} ${optionValue}`}
                        disabled={option.disabled}
                        onSelect={() => handleValueChange(optionValue)}>
                        <CheckIcon className={cn("size-3.5 shrink-0", isSelected ? "opacity-100" : "opacity-0")} />
                        <span className="whitespace-nowrap">{option.label}</span>
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
