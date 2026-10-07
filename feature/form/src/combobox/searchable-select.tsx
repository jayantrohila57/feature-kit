"use client"

import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import type { FieldSize } from "../constants"
import type { FieldOption } from "../field/field-types"

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"
import { useMemo, useState } from "react"

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
import Spinner from "@/packages/ui/components/spinner"
import { COMBOBOX_POPOVER_CONTENT_CLASS } from "@/packages/ui/lib/combobox-popover"
import { cn } from "@/packages/ui/lib/utils"

import { FIELD_CONTROL_HEIGHT_CLASS } from "../constants"
import { FieldClearSelectionFooter } from "../field/field-clear-selection-footer"
import { ComboboxOptionRow } from "./combobox-option-row"
import { ComboboxOptionsError } from "./combobox-options-error"
import { ComboboxOptionsSkeleton } from "./combobox-options-skeleton"
import { optionSearchValue } from "./combobox-utils"

export type SearchableSelectProps = {
  options: FieldOption[]
  value?: string
  onValueChange: (value: string) => void
  onClear?: () => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  noResultsMessage?: string
  optionsError?: string
  loading?: boolean
  disabled?: boolean
  clearable?: boolean
  clearLabel?: string
  className?: string
  contentClassName?: string
  id?: string
  invalid?: boolean
  required?: boolean
  "aria-label"?: string
  modal?: boolean
  size?: FieldSize
  icon?: LucideIcon
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** When set, used as the trigger label instead of the selected option label. */
  displayValue?: ReactNode
  shouldFilter?: boolean
  commandInputValue?: string
  onCommandInputValueChange?: (value: string) => void
}

function TriggerIcon({ icon: Icon, loading }: { icon?: LucideIcon; loading: boolean }) {
  if (loading) {
    return <Spinner className="size-3.5 shrink-0" />
  }

  if (!Icon) return null

  return (
    <Icon
      className="size-3.5 shrink-0 text-muted-foreground"
      aria-hidden
    />
  )
}

export function SearchableSelect({
  options,
  value = "",
  onValueChange,
  onClear,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyMessage = "No options available.",
  noResultsMessage = "No results found.",
  optionsError,
  loading = false,
  disabled = false,
  clearable = false,
  clearLabel,
  className,
  contentClassName,
  id,
  invalid,
  required,
  "aria-label": ariaLabel,
  modal,
  size = "default",
  icon,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  displayValue,
  shouldFilter = true,
  commandInputValue,
  onCommandInputValueChange,
}: SearchableSelectProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = controlledOnOpenChange ?? setUncontrolledOpen

  const current = value == null || value === "" ? "" : String(value)
  const selected = useMemo(() => options.find((option) => String(option.value) === current), [current, options])
  const isDisabled = disabled || loading
  const hasError = Boolean(optionsError)
  const showClearFooter = clearable && current && !hasError

  const clear = () => {
    if (isDisabled) return
    if (onClear) {
      onClear()
    } else {
      onValueChange("")
    }
    setOpen(false)
  }

  const triggerLabel = displayValue ?? (selected ? <ComboboxOptionRow option={selected} /> : placeholder)

  return (
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
            "w-full justify-between px-2 font-normal",
            !selected && !displayValue && "text-muted-foreground",
            className,
          )}>
          <span className="flex min-w-0 flex-1 items-center gap-2 truncate">
            <TriggerIcon
              {...(icon ? { icon } : {})}
              loading={loading}
            />
            {triggerLabel}
          </span>
          <ChevronsUpDownIcon className="size-3.5 shrink-0 opacity-50" />
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
                    const isSelected = optionValue === current
                    return (
                      <CommandItem
                        key={optionValue}
                        value={optionSearchValue(option)}
                        disabled={option.disabled === true}
                        data-checked={isSelected || undefined}
                        onSelect={() => {
                          onValueChange(optionValue)
                          setOpen(false)
                        }}>
                        <CheckIcon className={cn("size-3.5 shrink-0", isSelected ? "opacity-100" : "opacity-0")} />
                        <ComboboxOptionRow
                          option={option}
                          truncateLabel={false}
                        />
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>
          {showClearFooter ? (
            <FieldClearSelectionFooter
              {...(clearLabel ? { label: clearLabel } : {})}
              onClear={clear}
            />
          ) : null}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
