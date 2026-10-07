export const FIELD_SIZES = ["sm", "default", "lg"] as const

export type FieldSize = (typeof FIELD_SIZES)[number]

export const FIELD_CONTROL_HEIGHT_CLASS: Record<FieldSize, string> = {
  sm: "h-6",
  default: "h-7",
  lg: "h-9",
}

export const FIELD_SKELETON_CONTROL_CLASS: Record<FieldSize, string> = {
  sm: "h-6 w-full",
  default: "h-7 w-full",
  lg: "h-9 w-full",
}
