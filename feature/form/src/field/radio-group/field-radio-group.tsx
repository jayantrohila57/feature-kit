"use client"

import type { FieldValues, Path } from "react-hook-form"
import type { RadioGroupFieldProps } from "../field-types"

import { Controller, useFormContext } from "react-hook-form"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/packages/ui/components/field"
import { RadioGroup, RadioGroupItem } from "@/packages/ui/components/radio-group"
import { cn } from "@/packages/ui/lib/utils"

import { resolveFieldErrorMessage } from "../../utils/utils-resolve-field-error"
import { useFieldErrorMeta } from "../field-error-meta"
import { useFieldFlags } from "../field-use-flags"

export function FieldRadioGroup<TValues extends FieldValues, TName extends Path<TValues>>(
  props: RadioGroupFieldProps<TValues, TName>,
) {
  const { control } = useFormContext<TValues>()
  const { disabled, hidden } = useFieldFlags<TValues>({
    disabled: props.disabled,
    hidden: props.hidden,
  })
  const id = String(props.name)
  const { translateError } = useFieldErrorMeta()
  const orientation = props.orientation ?? "vertical"

  if (hidden) return null

  return (
    <Controller
      control={control}
      name={props.name}
      render={({ field, fieldState }) => {
        const invalid = fieldState.invalid
        const isDisabled = disabled || props.readOnly === true || props.loading === true
        const current = field.value == null ? "" : String(field.value)
        const hint = props.helperText ?? props.description
        const displayError = resolveFieldErrorMessage(fieldState.error?.message, translateError)

        return (
          <div
            data-field-name={id}
            data-invalid={invalid || undefined}
            data-disabled={isDisabled || undefined}
            className={cn("flex w-full flex-col gap-2", props.className)}>
            <FieldSet>
              {props.label ? (
                <FieldLegend>
                  {props.label}
                  {props.required ? (
                    <span
                      className="text-destructive"
                      aria-hidden="true">
                      {" "}
                      *
                    </span>
                  ) : null}
                </FieldLegend>
              ) : null}
              {hint ? <FieldDescription>{hint}</FieldDescription> : null}
              <RadioGroup
                value={current}
                disabled={isDisabled}
                aria-invalid={invalid}
                aria-required={props.required}
                aria-labelledby={props.label ? undefined : id}
                className={cn(orientation === "horizontal" && "auto-cols-fr grid-flow-col")}
                onValueChange={(value) => {
                  field.onChange(value)
                  field.onBlur()
                }}>
                {props.options.map((option) => {
                  const optionId = `${id}-${option.value}`
                  const optionDisabled = isDisabled || option.disabled === true
                  return (
                    <Field
                      key={option.value}
                      orientation="horizontal"
                      data-disabled={optionDisabled || undefined}>
                      <RadioGroupItem
                        id={optionId}
                        value={option.value}
                        disabled={optionDisabled}
                        aria-invalid={invalid}
                      />
                      <FieldContent>
                        <FieldLabel
                          htmlFor={optionId}
                          className="font-normal">
                          {option.label}
                        </FieldLabel>
                        {option.description ? <FieldDescription>{option.description}</FieldDescription> : null}
                      </FieldContent>
                    </Field>
                  )
                })}
              </RadioGroup>
            </FieldSet>
            {invalid && displayError ? <FieldError>{displayError}</FieldError> : null}
          </div>
        )
      }}
    />
  )
}
