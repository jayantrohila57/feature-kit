"use client"

import type { FieldValues, Path } from "react-hook-form"
import type { FieldBaseProps } from "../field-types"

import { Controller, useFormContext } from "react-hook-form"

import { Textarea } from "@/packages/ui/components/textarea"
import { cn } from "@/packages/ui/lib/utils"

import { FieldShell } from "../field-shell"
import { useFieldFlags } from "../field-use-flags"

export type TextareaFieldProps<TValues extends FieldValues, TName extends Path<TValues>> = FieldBaseProps<
  TValues,
  TName
> & {
  type: "textarea"
  rows?: number
}

export function FieldTextarea<TValues extends FieldValues, TName extends Path<TValues>>(
  props: TextareaFieldProps<TValues, TName>,
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
            className={props.className}>
            <Textarea
              {...field}
              id={id}
              name={id}
              value={field.value ?? ""}
              rows={props.rows ?? 3}
              placeholder={props.placeholder}
              disabled={disabled}
              readOnly={props.readOnly}
              aria-invalid={invalid}
              aria-required={props.required}
              aria-busy={props.loading || undefined}
              className={cn("min-h-20 w-full")}
            />
          </FieldShell>
        )
      }}
    />
  )
}
