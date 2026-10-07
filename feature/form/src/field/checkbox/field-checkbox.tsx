"use client"

import type { FieldValues, Path } from "react-hook-form"
import type { CheckboxFieldProps } from "../field-types"

import { Controller, useFormContext } from "react-hook-form"

import { Checkbox } from "@/packages/ui/components/checkbox"

import { FieldShell } from "../field-shell"
import { useFieldFlags } from "../field-use-flags"

export function FieldCheckbox<TValues extends FieldValues, TName extends Path<TValues>>(
  props: CheckboxFieldProps<TValues, TName>,
) {
  const { control } = useFormContext<TValues>()
  const { disabled, hidden } = useFieldFlags<TValues>({
    disabled: props.disabled,
    hidden: props.hidden,
  })
  const id = String(props.name)

  if (hidden) return null

  return (
    <Controller
      control={control}
      name={props.name}
      render={({ field, fieldState }) => {
        const invalid = fieldState.invalid
        return (
          <FieldShell
            id={id}
            label={props.label}
            description={props.description}
            helperText={props.helperText}
            required={props.required}
            disabled={disabled || props.readOnly}
            invalid={invalid}
            errorMessage={fieldState.error?.message}
            className={props.className}
            orientation="horizontal">
            <Checkbox
              id={id}
              name={id}
              checked={Boolean(field.value)}
              onCheckedChange={(checked) => field.onChange(checked === true)}
              disabled={disabled || props.readOnly}
              aria-invalid={invalid}
              aria-required={props.required}
              data-field-name={id}
            />
          </FieldShell>
        )
      }}
    />
  )
}
