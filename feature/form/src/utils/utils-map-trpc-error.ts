import type { FieldErrors, FieldValues, UseFormSetError } from "react-hook-form"
import type { MapServerErrorResult, ServerFieldError } from "../field/field-types"

function normalizeServerErrors(result: MapServerErrorResult): {
  form?: string
  fields: ServerFieldError[]
} {
  if (Array.isArray(result)) {
    return { fields: result }
  }
  const normalized: { form?: string; fields: ServerFieldError[] } = {
    fields: result.fields ?? [],
  }
  if (result.form) normalized.form = result.form
  return normalized
}

export function applyServerErrors<TValues extends FieldValues>(
  setError: UseFormSetError<TValues>,
  result: MapServerErrorResult,
): FieldErrors<TValues> {
  const { form, fields } = normalizeServerErrors(result)
  const applied: FieldErrors<TValues> = {}

  if (form) {
    setError("root.server" as never, { type: "server", message: form })
  }

  for (const field of fields) {
    setError(field.path as never, {
      type: "server",
      message: field.message,
    })
    ;(applied as Record<string, { message: string; type: string }>)[field.path] = {
      type: "server",
      message: field.message,
    }
  }

  return applied
}

/** Best-effort map for common tRPC / Zod flatten shapes. */
export function mapUnknownServerError(error: unknown): MapServerErrorResult {
  if (!error || typeof error !== "object") {
    return { form: "Something went wrong. Please try again." }
  }

  const record = error as {
    message?: string
    data?: {
      zodError?: {
        fieldErrors?: Record<string, string[] | undefined>
        formErrors?: string[]
      }
      flat?: {
        fieldErrors?: Record<string, string[] | undefined>
        formErrors?: string[]
      }
    }
  }

  const fieldErrors = record.data?.zodError?.fieldErrors ?? record.data?.flat?.fieldErrors ?? undefined
  const formErrors = record.data?.zodError?.formErrors ?? record.data?.flat?.formErrors ?? undefined

  const fields: ServerFieldError[] = []
  if (fieldErrors) {
    for (const [path, messages] of Object.entries(fieldErrors)) {
      const message = messages?.[0]
      if (message) fields.push({ path, message })
    }
  }

  const formMessage = formErrors?.[0] ?? (fields.length === 0 ? record.message : undefined)
  const result: MapServerErrorResult = { fields }
  if (formMessage) {
    return { form: formMessage, fields }
  }
  return result
}
