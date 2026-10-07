"use client"

import type { FieldValues } from "react-hook-form"
import type { FieldContext, FieldFlag } from "./field-types"

import { useFormContext, useWatch } from "react-hook-form"

import { useFormKitMeta } from "../form-kit/form-kit-meta"
import { resolveFieldFlag } from "../utils/utils-field-flags"

export function useFieldFlags<TValues extends FieldValues>(options: {
  disabled?: FieldFlag<TValues> | undefined
  hidden?: FieldFlag<TValues> | undefined
}): { disabled: boolean; hidden: boolean; values: TValues } {
  const { control } = useFormContext<TValues>()
  const { isPending } = useFormKitMeta()
  const values = useWatch({ control }) as TValues
  const ctx: FieldContext<TValues> = { values }
  return {
    values,
    disabled: isPending || resolveFieldFlag(options.disabled, ctx, false),
    hidden: resolveFieldFlag(options.hidden, ctx, false),
  }
}
