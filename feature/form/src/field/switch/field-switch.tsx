"use client"

import type { FieldValues, Path } from "react-hook-form"
import type { SwitchFieldProps } from "../field-types"

import { Controller, useFormContext } from "react-hook-form"

import { Switch } from "@/packages/ui/components/switch"

import { FieldShell } from "../field-shell"
import { useFieldFlags } from "../field-use-flags"

export function FieldSwitch<TValues extends FieldValues, TName extends Path<TValues>>(
  props: SwitchFieldProps<TValues, TName>,
) {
  const { control } = useFormContext<TValues>()
  const { disabled, hidden } = useFieldFlags<TValues>({
    disabled: props.disabled,
    hidden: props.hidden,
  })
  const id = String(props.name)
  const size = props.size === "sm" ? "sm" : "default"

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
            <Switch
              id={id}
              name={id}
              size={size}
              checked={Boolean(field.value)}
              onCheckedChange={field.onChange}
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
