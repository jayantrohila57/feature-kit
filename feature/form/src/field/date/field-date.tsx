"use client"

import type { FieldValues, Path } from "react-hook-form"
import type { DateFieldProps } from "../field-types"

import { useState } from "react"
import { Controller, useFormContext } from "react-hook-form"

import { Button } from "@/packages/ui/components/button"
import { Calendar } from "@/packages/ui/components/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/packages/ui/components/popover"

import { DEFAULT_DATE_DISPLAY_FORMAT } from "../../constants/constants-date"
import { calendarNavRange, disabledMatcher, formatDateDisplay, toDate, toISODate } from "../../utils/utils-date"
import { FieldPickerTrigger } from "../field-picker-trigger"
import { FieldShell } from "../field-shell"
import { useFieldFlags } from "../field-use-flags"

export function FieldDate<TValues extends FieldValues, TName extends Path<TValues>>(
  props: DateFieldProps<TValues, TName>,
) {
  const { control } = useFormContext<TValues>()
  const { disabled, hidden } = useFieldFlags<TValues>({
    disabled: props.disabled,
    hidden: props.hidden,
  })
  const size = props.size ?? "default"
  const id = String(props.name)
  const [open, setOpen] = useState(false)
  const displayFormat = props.displayFormat ?? DEFAULT_DATE_DISPLAY_FORMAT
  const nav = calendarNavRange({
    fromYear: props.fromYear,
    toYear: props.toYear,
    minDate: props.minDate,
    maxDate: props.maxDate,
  })

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
        const dayDisabled = disabledMatcher(props.minDate, props.maxDate)

        const commit = (next: string) => {
          field.onChange(next)
          field.onBlur()
          setOpen(false)
        }

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
                  placeholder={props.placeholder ?? "Pick a date"}>
                  {label}
                </FieldPickerTrigger>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0"
                align="start"
                onOpenAutoFocus={(event) => {
                  event.preventDefault()
                }}
                onCloseAutoFocus={(event) => {
                  event.preventDefault()
                }}
                onPointerDownOutside={(event) => {
                  const target = event.target
                  if (target instanceof Element && target.closest("select, [data-slot=calendar]")) {
                    event.preventDefault()
                  }
                }}>
                <Calendar
                  mode="single"
                  selected={selected}
                  defaultMonth={selected ?? new Date()}
                  startMonth={nav.startMonth}
                  endMonth={nav.endMonth}
                  captionLayout={props.captionLayout ?? "label"}
                  required={props.required === true}
                  {...(dayDisabled ? { disabled: dayDisabled } : {})}
                  onSelect={(date: Date | undefined) => {
                    if (!date) {
                      if (props.required === true) return
                      commit("")
                      return
                    }
                    commit(toISODate(date) ?? "")
                  }}
                />
                {props.clearable && selected && props.required !== true ? (
                  <div className="border-t p-2">
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-7 w-full"
                      onClick={() => {
                        commit("")
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
