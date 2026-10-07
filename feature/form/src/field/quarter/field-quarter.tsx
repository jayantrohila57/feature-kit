"use client"

import type { FieldValues, Path } from "react-hook-form"
import type { QuarterFieldProps } from "../field-types"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useState } from "react"
import { Controller, useFormContext } from "react-hook-form"

import { Button } from "@/packages/ui/components/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/packages/ui/components/popover"
import { cn } from "@/packages/ui/lib/utils"

import { QUARTER_LABELS, QUARTER_VALUES, type QuarterNumber } from "../../constants/constants-date"
import { formatQuarterDisplay, parseQuarter, toISOQuarter } from "../../utils/utils-date"
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

export function FieldQuarter<TValues extends FieldValues, TName extends Path<TValues>>(
  props: QuarterFieldProps<TValues, TName>,
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
  const { start: fromYear, end: toYear } = resolveYearBounds(props.fromYear, props.toYear)

  if (hidden) return null

  return (
    <Controller
      control={control}
      name={props.name}
      render={({ field, fieldState }) => {
        const invalid = fieldState.invalid
        const selected = parseQuarter(field.value)
        const isDisabled = disabled || props.readOnly === true || props.loading === true
        const label = formatQuarterDisplay(field.value)
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
                if (next) setYear(selected?.year ?? new Date().getFullYear())
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
                  placeholder={props.placeholder ?? "Pick a quarter"}>
                  {label}
                </FieldPickerTrigger>
              </PopoverTrigger>
              <PopoverContent
                className="w-56 p-3"
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
                <div className="grid grid-cols-2 gap-1.5">
                  {QUARTER_VALUES.map((quarter) => {
                    const isSelected = selected?.year === year && selected.quarter === quarter
                    return (
                      <Button
                        key={quarter}
                        type="button"
                        variant={isSelected ? "default" : "ghost"}
                        className={cn("h-9 font-normal", isSelected && "font-medium")}
                        onClick={() => {
                          field.onChange(toISOQuarter(year, quarter as QuarterNumber))
                          field.onBlur()
                          setOpen(false)
                        }}>
                        {QUARTER_LABELS[quarter]}
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
