"use client"

import type { FieldValues, Path } from "react-hook-form"
import type { TimeFieldProps } from "../field-types"

import { ClockIcon } from "lucide-react"
import { Controller, useFormContext } from "react-hook-form"

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/packages/ui/components/input-group"
import { cn } from "@/packages/ui/lib/utils"

import { FIELD_CONTROL_HEIGHT_CLASS } from "../../constants"
import { toTimeValue } from "../../utils/utils-date"
import { FieldShell } from "../field-shell"
import { useFieldFlags } from "../field-use-flags"

export function FieldTime<TValues extends FieldValues, TName extends Path<TValues>>(
  props: TimeFieldProps<TValues, TName>,
) {
  const { control } = useFormContext<TValues>()
  const { disabled, hidden } = useFieldFlags<TValues>({
    disabled: props.disabled,
    hidden: props.hidden,
  })
  const size = props.size ?? "default"
  const id = String(props.name)

  if (hidden) return null

  return (
    <Controller
      control={control}
      name={props.name}
      render={({ field, fieldState }) => {
        const invalid = fieldState.invalid
        const isDisabled = disabled || props.readOnly === true || props.loading === true

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
            <InputGroup className={cn(FIELD_CONTROL_HEIGHT_CLASS[size], "w-full")}>
              <InputGroupAddon align="inline-start">
                <ClockIcon aria-hidden />
              </InputGroupAddon>
              <InputGroupInput
                id={id}
                name={id}
                type="time"
                value={toTimeValue(field.value)}
                placeholder={props.placeholder}
                disabled={isDisabled}
                readOnly={props.readOnly}
                aria-invalid={invalid}
                aria-required={props.required}
                data-field-name={id}
                step={props.step}
                min={props.min}
                max={props.max}
                onBlur={field.onBlur}
                onChange={(event) => {
                  const next = event.target.value
                  field.onChange(next === "" ? undefined : next)
                }}
              />
            </InputGroup>
          </FieldShell>
        )
      }}
    />
  )
}
