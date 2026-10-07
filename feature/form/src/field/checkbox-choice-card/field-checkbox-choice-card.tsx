"use client"

import type { FieldValues, Path } from "react-hook-form"
import type { CheckboxChoiceCardFieldProps } from "../field-types"

import { Controller, useFormContext } from "react-hook-form"

import { Checkbox } from "@/packages/ui/components/checkbox"

import { FieldBooleanChoiceCardShell } from "../field-boolean-choice-card-shell"
import { useFieldFlags } from "../field-use-flags"

export function FieldCheckboxChoiceCard<TValues extends FieldValues, TName extends Path<TValues>>(
  props: CheckboxChoiceCardFieldProps<TValues, TName>,
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
        const isDisabled = disabled || props.readOnly === true || props.loading === true
        const checked = Boolean(field.value)

        return (
          <FieldBooleanChoiceCardShell
            id={id}
            label={props.label}
            description={props.description}
            helperText={props.helperText}
            required={props.required}
            disabled={isDisabled}
            invalid={invalid}
            checked={checked}
            errorMessage={fieldState.error?.message}
            className={props.className}
            control={
              <Checkbox
                id={id}
                name={id}
                checked={checked}
                onCheckedChange={(next) => {
                  field.onChange(next === true)
                  field.onBlur()
                }}
                disabled={isDisabled}
                aria-invalid={invalid}
                aria-required={props.required}
                data-field-name={id}
              />
            }
          />
        )
      }}
    />
  )
}
