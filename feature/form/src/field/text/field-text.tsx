"use client"

import type { FieldValues, Path } from "react-hook-form"
import type { TextFieldProps } from "../field-types"

import { Controller, useFormContext } from "react-hook-form"

import { Input } from "@/packages/ui/components/input"
import { cn } from "@/packages/ui/lib/utils"

import { FIELD_CONTROL_HEIGHT_CLASS } from "../../constants"
import { FieldShell } from "../field-shell"
import { useFieldFlags } from "../field-use-flags"

function sanitizeFieldText(
  raw: string,
  options: {
    allowedChars?: RegExp | undefined
    transform?: "uppercase" | "lowercase" | undefined
    maxLength?: number | undefined
  },
): string {
  let next = raw
  if (options.transform === "uppercase") next = next.toUpperCase()
  if (options.transform === "lowercase") next = next.toLowerCase()
  if (options.allowedChars) {
    const flags = options.allowedChars.flags.includes("g")
      ? options.allowedChars.flags
      : `${options.allowedChars.flags}g`
    next = next.match(new RegExp(options.allowedChars.source, flags))?.join("") ?? ""
  }
  if (options.maxLength != null) next = next.slice(0, options.maxLength)
  return next
}

export function FieldText<TValues extends FieldValues, TName extends Path<TValues>>(
  props: TextFieldProps<TValues, TName>,
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
            <Input
              {...field}
              id={id}
              name={id}
              type={props.inputType ?? "text"}
              autoComplete={props.autoComplete}
              value={field.value ?? ""}
              onChange={(event) => {
                field.onChange(
                  sanitizeFieldText(event.target.value, {
                    allowedChars: props.allowedChars,
                    transform: props.transform,
                    maxLength: props.maxLength,
                  }),
                )
              }}
              placeholder={props.placeholder}
              disabled={disabled || props.readOnly}
              readOnly={props.readOnly}
              inputMode={props.inputMode}
              maxLength={props.maxLength}
              autoCapitalize={props.autoCapitalize}
              autoCorrect={props.transform ? "off" : undefined}
              spellCheck={props.transform ? false : undefined}
              aria-invalid={invalid}
              aria-required={props.required}
              className={cn(FIELD_CONTROL_HEIGHT_CLASS[size], "w-full")}
            />
          </FieldShell>
        )
      }}
    />
  )
}
