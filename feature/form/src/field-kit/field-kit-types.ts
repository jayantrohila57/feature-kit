import type { ReactNode } from "react"
import type { DefaultValues, FieldValues } from "react-hook-form"
import type { z } from "zod"

export type FieldKitMode = "controlled" | "uncontrolled"

export type FieldKitProps<TSchema extends z.ZodTypeAny> = {
  schema: TSchema
  mode?: FieldKitMode
  values?: z.input<TSchema> & FieldValues
  defaultValues?: DefaultValues<z.input<TSchema> & FieldValues>
  onValuesChange?: (values: z.input<TSchema> & FieldValues) => void
  className?: string
  children: ReactNode
}
