"use client"

import type { FieldValues, Path } from "react-hook-form"
import type { MonthFieldProps } from "../field-types"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useState } from "react"
import { Controller, useFormContext } from "react-hook-form"

import { Button } from "@/packages/ui/components/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/packages/ui/components/popover"
import { cn } from "@/packages/ui/lib/utils"

import { DEFAULT_MONTH_DISPLAY_FORMAT, MONTH_INDEXES } from "../../constants/constants-date"
import { formatDateDisplay, monthStart, toDate, toISOMonth } from "../../utils/utils-date"
import { FieldPickerTrigger } from "../field-picker-trigger"
import { FieldShell } from "../field-shell"
import { useFieldFlags } from "../field-use-flags"

function resolveYearBounds(fromYear?: number, toYear?: number) {
  const now = new Date().getFullYear()
  return {
    start: fromYear ?? now - 50,
    end: toYear ?? now + 10,
  }
}

export function FieldMonth<TValues extends FieldValues, TName extends Path<TValues>>(
  props: MonthFieldProps<TValues, TName>,
) {
  const { control } = useFormContext<TValues>()
  const { disabled, hidden } = useFieldFlags<TValues>({
    disabled: props.disabled,
    hidden: props.hidden,
  })
  const size = props.size ?? "default"
  const id = String(props.name)
  const [open, setOpen] = useState(false)
  const [year, setYear] = useState(() => new Date().getFullYear())
  const displayFormat = props.displayFormat ?? DEFAULT_MONTH_DISPLAY_FORMAT
  const { start: fromYear, end: toYear } = resolveYearBounds(props.fromYear, props.toYear)

  if (hidden) return null

  return (
    <Controller
      control={control}
      name={props.name}
      render={({ field, fieldState }) => {
        const invalid = fieldState.invalid
        const selected = toDate(field.value)
        const isDisabled = disabled || props.readOnly === true || props.loading === true
        const label = formatDateDisplay(field.value, displayFormat)
        const empty = !label

        return (
          <FieldShell
            id={id}
            label={props.label}
            description={props.description}
            helperText={props.helperText}
            required={props.required}
            disabled={isDisabled}
            invalid={invalid}
            errorMessage={fieldState.error?.message}
            className={props.className}>
            <Popover
              open={open}
              onOpenChange={(next) => {
                if (isDisabled) return
                if (next) setYear(selected?.getFullYear() ?? new Date().getFullYear())
                setOpen(next)
              }}>
              <PopoverTrigger asChild>
                <FieldPickerTrigger
                  id={id}
                  open={open}
                  disabled={isDisabled}
                  invalid={invalid}
                  required={props.required}
                  empty={empty}
                  size={size}
                  placeholder={props.placeholder ?? "Pick a month"}>
                  {label}
                </FieldPickerTrigger>
              </PopoverTrigger>
              <PopoverContent
                className="w-64 p-3"
                align="start">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={year <= fromYear}
                    onClick={() => setYear((current) => Math.max(fromYear, current - 1))}>
                    <ChevronLeftIcon />
                  </Button>
                  <span className="font-medium text-sm tabular-nums">{year}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={year >= toYear}
                    onClick={() => setYear((current) => Math.min(toYear, current + 1))}>
                    <ChevronRightIcon />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {MONTH_INDEXES.map((monthIndex) => {
                    const monthDate = monthStart(year, monthIndex)
                    const value = toISOMonth(monthDate)
                    const isSelected =
                      selected != null && selected.getFullYear() === year && selected.getMonth() === monthIndex
                    return (
                      <Button
                        key={monthIndex}
                        type="button"
                        variant={isSelected ? "default" : "ghost"}
                        className={cn("h-8 font-normal", isSelected && "font-medium")}
                        onClick={() => {
                          field.onChange(value)
                          field.onBlur()
                          setOpen(false)
                        }}>
                        {formatDateDisplay(monthDate, "MMM")}
                      </Button>
                    )
                  })}
                </div>
                {props.clearable && selected ? (
                  <div className="mt-2 border-t pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-7 w-full"
                      onClick={() => {
                        field.onChange(undefined)
                        field.onBlur()
                        setOpen(false)
                      }}>
                      Clear
                    </Button>
                  </div>
                ) : null}
              </PopoverContent>
            </Popover>
          </FieldShell>
        )
      }}
    />
  )
}
