"use client"

import type { ReactNode } from "react"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/packages/ui/components/field"
import { cn } from "@/packages/ui/lib/utils"

import { resolveFieldErrorMessage } from "../utils/utils-resolve-field-error"
import { useFieldErrorMeta } from "./field-error-meta"

type FieldBooleanChoiceCardShellProps = {
  id: string
  label?: ReactNode | undefined
  description?: ReactNode | undefined
  helperText?: ReactNode | undefined
  required?: boolean | undefined
  disabled?: boolean | undefined
  invalid?: boolean | undefined
  checked?: boolean | undefined
  errorMessage?: string | undefined
  className?: string | undefined
  control: ReactNode
}

/**
 * shadcn choice-card pattern for boolean controls:
 * FieldLabel wraps Field so the whole card is clickable.
 */
export function FieldBooleanChoiceCardShell({
  id,
  label,
  description,
  helperText,
  required,
  disabled,
  invalid,
  checked,
  errorMessage,
  className,
  control,
}: FieldBooleanChoiceCardShellProps) {
  const hint = helperText ?? description
  const { translateError } = useFieldErrorMeta()
  const displayError = resolveFieldErrorMessage(errorMessage, translateError)

  return (
    <div
      data-field-name={id}
      className={cn("flex w-full flex-col gap-2", className)}>
      <FieldLabel
        htmlFor={id}
        className="w-full">
        <Field
          orientation="horizontal"
          data-invalid={invalid || undefined}
          data-disabled={disabled || undefined}
          data-checked={checked || undefined}>
          <FieldContent>
            {label ? (
              <FieldTitle>
                {label}
                {required ? (
                  <span
                    className="text-destructive"
                    aria-hidden="true">
                    {" "}
                    *
                  </span>
                ) : null}
              </FieldTitle>
            ) : null}
            {hint ? <FieldDescription>{hint}</FieldDescription> : null}
          </FieldContent>
          {control}
        </Field>
      </FieldLabel>
      {invalid && displayError ? <FieldError>{displayError}</FieldError> : null}
    </div>
  )
}
