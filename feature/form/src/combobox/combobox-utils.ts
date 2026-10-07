import type { FieldOption } from "../field/field-types"

export function optionSearchValue(option: FieldOption): string {
  const labelText = typeof option.label === "string" ? option.label : String(option.value)
  return [labelText, option.value, option.keywords].filter(Boolean).join(" ")
}

/** Keep a stored value visible when it is missing from the current option catalog. */
export function optionsIncluding(options: FieldOption[], value: string): FieldOption[] {
  if (!value || options.some((option) => String(option.value) === value)) return options
  return [...options, { value, label: value, keywords: value }]
}
