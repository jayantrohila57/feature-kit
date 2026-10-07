"use client"

import type { ReactNode } from "react"

import { Field, FieldDescription, FieldError, FieldLabel } from "@/packages/ui/components/field"
import { cn } from "@/packages/ui/lib/utils"

import { resolveFieldErrorMessage } from "../utils/utils-resolve-field-error"
import { useFieldErrorMeta } from "./field-error-meta"

type FieldShellProps = {
  id: string
  label?: ReactNode | undefined
  description?: ReactNode | undefined
  helperText?: ReactNode | undefined
  required?: boolean | undefined
  disabled?: boolean | undefined
  invalid?: boolean | undefined
  errorMessage?: string | undefined
  className?: string | undefined
  children: ReactNode
  orientation?: "vertical" | "horizontal" | undefined
}

export function FieldShell({
  id,
  label,
  description,
  helperText,
  required,
  disabled,
  invalid,
  errorMessage,
  className,
  children,
  orientation = "vertical",
}: FieldShellProps) {
  const hint = helperText ?? description
  const { translateError } = useFieldErrorMeta()
  const displayError = resolveFieldErrorMessage(errorMessage, translateError)

  return (
    <Field
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      data-field-name={id}
      orientation={orientation}
      className={cn(className)}>
      {label ? (
        <FieldLabel
          htmlFor={id}
          aria-required={required || undefined}>
          {label}
          {required ? (
            <span
              className="text-destructive"
              aria-hidden="true">
              {" "}
              *
            </span>
          ) : null}
        </FieldLabel>
      ) : null}
      {children}
      {hint ? <FieldDescription>{hint}</FieldDescription> : null}
      {invalid && displayError ? <FieldError>{displayError}</FieldError> : null}
    </Field>
  )
}
