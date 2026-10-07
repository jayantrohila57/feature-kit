import type { ReactNode } from "react"
import type { DefaultValues, FieldValues } from "react-hook-form"
import type { z } from "zod"
import type { MapServerErrorResult } from "../field/field-types"

export type FormKitResetOnSuccess = boolean | "keepDirtyValues" | DefaultValues<FieldValues>

export type FormKitProps<TSchema extends z.ZodTypeAny> = {
  schema: TSchema
  defaultValues: DefaultValues<z.input<TSchema> & FieldValues>
  onSubmit: (values: z.output<TSchema>) => void | Promise<void>
  isPending?: boolean
  resetOnSuccess?: FormKitResetOnSuccess
  mapServerError?: (error: unknown) => MapServerErrorResult
  /** Map Zod / server error message keys to localized strings. */
  translateError?: (message: string) => string
  onSuccess?: (values: z.output<TSchema>) => void
  onError?: (error: unknown) => void
  className?: string
  /** When false, fields flow in a parent scroll body (multi-section pages). Default true. */
  scrollBody?: boolean
  children: ReactNode
}

export type FormKitSubmitProps = {
  label?: ReactNode
  pendingLabel?: ReactNode
  className?: string
  disabled?: boolean
}

export type FormKitResetProps = {
  label?: ReactNode
  className?: string
  disabled?: boolean
}
