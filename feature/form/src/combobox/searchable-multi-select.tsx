"use client"

import type { ReactNode } from "react"
import type { FieldSize } from "../constants"
import type { FieldOption } from "../field/field-types"

import { ChevronsUpDownIcon, XIcon } from "lucide-react"
import { useMemo, useState } from "react"

import { Badge } from "@/packages/ui/components/badge"
import { Button } from "@/packages/ui/components/button"
import { Checkbox } from "@/packages/ui/components/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/packages/ui/components/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/packages/ui/components/popover"
import Spinner from "@/packages/ui/components/spinner"
import { COMBOBOX_POPOVER_CONTENT_CLASS } from "@/packages/ui/lib/combobox-popover"
import { MULTI_SELECT_VALUE_BADGE_CLASS } from "@/packages/ui/lib/multi-select-badge"
import { cn } from "@/packages/ui/lib/utils"

import { FIELD_CONTROL_HEIGHT_CLASS } from "../constants"
import { FieldSelectionFooter } from "../field/field-clear-selection-footer"
import { ComboboxOptionsError } from "./combobox-options-error"
import { ComboboxOptionsSkeleton } from "./combobox-options-skeleton"
import { optionSearchValue } from "./combobox-utils"

export type SearchableMultiSelectProps = {
  options: FieldOption[]
  value: string[]
  onValueChange: (value: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  noResultsMessage?: string
  optionsError?: string
  loading?: boolean
  disabled?: boolean
  selectAll?: boolean
  selectAllLabel?: string
  clearable?: boolean
  clearLabel?: string
  maxSelected?: number
  showSelectedCount?: boolean
  showSelectedValues?: boolean
  className?: string
  contentClassName?: string
  id?: string
  invalid?: boolean
  required?: boolean
  "aria-label"?: string
  modal?: boolean
  size?: FieldSize
  open?: boolean
  onOpenChange?: (open: boolean) => void
  shouldFilter?: boolean
  commandInputValue?: string
  onCommandInputValueChange?: (value: string) => void
}

function asStringArray(value: string[]): string[] {
  return value.map(String)
}

export function SearchableMultiSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyMessage = "No options available.",
  noResultsMessage = "No results found.",
  optionsError,
  loading = false,
  disabled = false,
  selectAll = false,
  selectAllLabel,
  clearable = false,
  clearLabel,
  maxSelected,
  showSelectedCount = false,
  showSelectedValues = false,
  className,
  contentClassName,
  id,
  invalid,
  required,
  "aria-label": ariaLabel,
  modal,
  size = "default",
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  shouldFilter = true,
  commandInputValue,
  onCommandInputValueChange,
}: SearchableMultiSelectProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = controlledOnOpenChange ?? setUncontrolledOpen

  const selected = asStringArray(value)
  const selectedOptions = useMemo(
    () => options.filter((option) => selected.includes(String(option.value))),
    [options, selected],
  )
  const atMax = maxSelected !== undefined && selected.length >= maxSelected
  const isDisabled = disabled || loading
  const hasError = Boolean(optionsError)

  const selectableValues = options.filter((option) => !option.disabled).map((option) => String(option.value))

  const toggle = (nextValue: string) => {
    if (isDisabled) return
    if (selected.includes(nextValue)) {
      onValueChange(selected.filter((item) => item !== nextValue))
      return
    }
    if (atMax) return
    onValueChange([...selected, nextValue])
  }

  const clear = () => {
    if (isDisabled) return
    onValueChange([])
  }

  const selectAllValues = () => {
    if (isDisabled) return
    const capped = maxSelected !== undefined ? selectableValues.slice(0, maxSelected) : selectableValues
    onValueChange(capped)
  }

  const allSelected = selectableValues.length > 0 && selectableValues.every((entry) => selected.includes(entry))
  const showSelectAllFooter = selectAll && !allSelected && selectableValues.length > 0 && !hasError
  const showClearFooter = clearable && selected.length > 0 && !hasError

  const triggerContent: ReactNode =
    selected.length === 0
      ? placeholder
      : showSelectedCount
        ? `${selected.length} selected`
        : selectedOptions.map((option) => option.label).join(", ")

  return (
    <>
      <Popover
        {...(modal !== undefined ? { modal } : {})}
        open={open}
        onOpenChange={(next) => {
          if (isDisabled) return
          setOpen(next)
        }}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            role="combobox"
            disabled={isDisabled}
            aria-invalid={invalid}
            {...(required !== undefined ? { "aria-required": required } : {})}
            aria-expanded={open}
            aria-busy={loading || undefined}
            aria-label={ariaLabel}
            data-field-name={id}
            className={cn(
              FIELD_CONTROL_HEIGHT_CLASS[size],
              "w-full justify-between font-normal",
              selected.length === 0 && "text-muted-foreground",
              className,
            )}>
            <span className="flex min-w-0 flex-1 items-center gap-2 truncate">
              {loading ? <Spinner className="size-3.5 shrink-0" /> : null}
              {triggerContent}
            </span>
            <ChevronsUpDownIcon className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(COMBOBOX_POPOVER_CONTENT_CLASS, contentClassName)}
          align="start">
          <Command shouldFilter={shouldFilter}>
            <CommandInput
              placeholder={searchPlaceholder}
              {...(commandInputValue !== undefined ? { value: commandInputValue } : {})}
              {...(onCommandInputValueChange ? { onValueChange: onCommandInputValueChange } : {})}
            />
            <CommandList>
              {hasError ? (
                <ComboboxOptionsError message={optionsError ?? ""} />
              ) : loading ? (
                <ComboboxOptionsSkeleton />
              ) : options.length === 0 ? (
                <div className="px-3 py-6 text-center text-muted-foreground text-xs">{emptyMessage}</div>
              ) : (
                <>
                  <CommandEmpty>{noResultsMessage}</CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => {
                      const optionValue = String(option.value)
                      const isSelected = selected.includes(optionValue)
                      return (
                        <CommandItem
                          key={optionValue}
                          value={optionSearchValue(option)}
                          disabled={option.disabled || (!isSelected && atMax)}
                          onSelect={() => toggle(optionValue)}>
                          <Checkbox
                            checked={isSelected}
                            className="pointer-events-none mr-2"
                            tabIndex={-1}
                            aria-hidden
                          />
                          <span className="whitespace-nowrap">{option.label}</span>
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                </>
              )}
            </CommandList>
            {showSelectAllFooter || showClearFooter ? (
              <FieldSelectionFooter
                {...(showSelectAllFooter
                  ? {
                      selectAllLabel,
                      onSelectAll: selectAllValues,
                    }
                  : {})}
                {...(showClearFooter
                  ? {
                      clearLabel,
                      onClear: clear,
                    }
                  : {})}
              />
            ) : null}
          </Command>
        </PopoverContent>
      </Popover>
      {showSelectedValues && selectedOptions.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {selectedOptions.map((option) => (
            <Badge
              key={String(option.value)}
              variant="default"
              className={MULTI_SELECT_VALUE_BADGE_CLASS}>
              {option.label}
              {clearable && !isDisabled ? (
                <button
                  type="button"
                  className="rounded-sm outline-none focus-visible:ring-2"
                  onClick={() => toggle(String(option.value))}
                  aria-label={`Remove ${String(option.label)}`}>
                  <XIcon className="size-3" />
                </button>
              ) : null}
            </Badge>
          ))}
        </div>
      ) : null}
    </>
  )
}
