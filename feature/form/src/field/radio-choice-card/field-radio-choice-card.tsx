"use client"

import type { FieldValues, Path } from "react-hook-form"
import type { RadioChoiceCardFieldProps } from "../field-types"

import { Controller, useFormContext } from "react-hook-form"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/packages/ui/components/field"
import { RadioGroup, RadioGroupItem } from "@/packages/ui/components/radio-group"
import { cn } from "@/packages/ui/lib/utils"

import { resolveFieldErrorMessage } from "../../utils/utils-resolve-field-error"
import { useFieldErrorMeta } from "../field-error-meta"
import { useFieldFlags } from "../field-use-flags"

export function FieldRadioChoiceCard<TValues extends FieldValues, TName extends Path<TValues>>(
  props: RadioChoiceCardFieldProps<TValues, TName>,
) {
  const { control } = useFormContext<TValues>()
  const { disabled, hidden } = useFieldFlags<TValues>({
    disabled: props.disabled,
    hidden: props.hidden,
  })
  const id = String(props.name)
  const { translateError } = useFieldErrorMeta()
  const columns = props.columns ?? 1

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
                className={cn(columns === 2 && "grid-cols-2")}
                onValueChange={(value) => {
                  field.onChange(value)
                  field.onBlur()
                }}>
                {props.options.map((option) => {
                  const optionId = `${id}-${option.value}`
                  const optionDisabled = isDisabled || option.disabled === true
                  const isChecked = current === String(option.value)
                  return (
                    <FieldLabel
                      key={option.value}
                      htmlFor={optionId}
                      className="w-full">
                      <Field
                        orientation="horizontal"
                        data-invalid={invalid || undefined}
                        data-disabled={optionDisabled || undefined}
                        data-checked={isChecked || undefined}>
                        <FieldContent>
                          <FieldTitle>{option.label}</FieldTitle>
                          {option.description ? <FieldDescription>{option.description}</FieldDescription> : null}
                        </FieldContent>
                        <RadioGroupItem
                          id={optionId}
                          value={option.value}
                          disabled={optionDisabled}
                          aria-invalid={invalid}
                        />
                      </Field>
                    </FieldLabel>
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
