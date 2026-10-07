import type { FieldValues } from "react-hook-form"
import type { FieldContext, FieldFlag } from "../field/field-types"

export function resolveFieldFlag<TValues extends FieldValues>(
  flag: FieldFlag<TValues> | undefined,
  ctx: FieldContext<TValues>,
  fallback = false,
): boolean {
  if (flag === undefined) return fallback
  if (typeof flag === "function") return flag(ctx)
  return flag
}
