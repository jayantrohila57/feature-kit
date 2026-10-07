import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import type { FieldValues, Path } from "react-hook-form"
import type { FieldSize } from "../constants"

export type FieldOption<TValue extends string = string> = {
  value: TValue
  label: ReactNode
  disabled?: boolean
  fixed?: boolean
  /** Lucide (or compatible) component — FormKit renders `<Icon />`, do not pass raw component types as label. */
  icon?: LucideIcon
  /** Extra text included in combobox search matching. */
  keywords?: string
  description?: ReactNode
  meta?: Record<string, unknown>
}

export type FieldContext<TValues extends FieldValues> = {
  values: TValues
}

export type FieldFlag<TValues extends FieldValues> = boolean | ((ctx: FieldContext<TValues>) => boolean)

export type FieldBaseProps<TValues extends FieldValues, TName extends Path<TValues>> = {
  name: TName
  label?: ReactNode
  description?: ReactNode
  helperText?: ReactNode
  placeholder?: string
  required?: boolean
  className?: string
  size?: FieldSize
  disabled?: FieldFlag<TValues>
  hidden?: FieldFlag<TValues>
  readOnly?: boolean
  /** Async value / dependency in flight — show field skeleton instead of the control. */
  loading?: boolean
}

export type TextFieldProps<TValues extends FieldValues, TName extends Path<TValues>> = FieldBaseProps<
  TValues,
  TName
> & {
  type: "text"
  /** Native input type. Prefer `tel` / `email` / `password` for those keyboards; never `number` (drops leading zeros). */
  inputType?: "text" | "tel" | "email" | "password"
  autoComplete?: string
  inputMode?: "text" | "numeric" | "decimal" | "tel" | "email"
  maxLength?: number
  autoCapitalize?: "off" | "none" | "on" | "sentences" | "words" | "characters"
  /** Characters that do not match are stripped as the user types. */
  allowedChars?: RegExp
  transform?: "uppercase" | "lowercase"
}

export type SelectFieldProps<TValues extends FieldValues, TName extends Path<TValues>> = FieldBaseProps<
  TValues,
  TName
> & {
  type: "select"
  options: FieldOption[]
  /** Async / remote options in flight — shows list skeleton and disables interaction. */
  loading?: boolean
  searchPlaceholder?: string
  /** Shown when `options` is empty and not loading. */
  emptyMessage?: string
  /** Shown when search filter matches nothing. */
  noResultsMessage?: string
  /** Shown inside the dropdown when option loading fails. */
  optionsError?: string
  clearable?: boolean
}

export type MultiSelectFieldProps<TValues extends FieldValues, TName extends Path<TValues>> = FieldBaseProps<
  TValues,
  TName
> & {
  type: "multi-select"
  options: FieldOption[]
  showSelectedCount?: boolean
  showSelectedValues?: boolean
  clearable?: boolean
  selectAll?: boolean
  selectAllLabel?: string
  clearLabel?: string
  maxSelected?: number
  loading?: boolean
  searchPlaceholder?: string
  emptyMessage?: string
  noResultsMessage?: string
  optionsError?: string
}

export type CheckboxFieldProps<TValues extends FieldValues, TName extends Path<TValues>> = FieldBaseProps<
  TValues,
  TName
> & {
  type: "checkbox"
}

/** Boolean checkbox rendered as a bordered choice card (title + description). */
export type CheckboxChoiceCardFieldProps<TValues extends FieldValues, TName extends Path<TValues>> = FieldBaseProps<
  TValues,
  TName
> & {
  type: "checkbox-choice-card"
}

export type SwitchFieldProps<TValues extends FieldValues, TName extends Path<TValues>> = FieldBaseProps<
  TValues,
  TName
> & {
  type: "switch"
}

/** Boolean switch rendered as a bordered choice card (title + description). */
export type SwitchChoiceCardFieldProps<TValues extends FieldValues, TName extends Path<TValues>> = FieldBaseProps<
  TValues,
  TName
> & {
  type: "switch-choice-card"
}

export type RadioGroupFieldProps<TValues extends FieldValues, TName extends Path<TValues>> = FieldBaseProps<
  TValues,
  TName
> & {
  type: "radio-group"
  options: FieldOption[]
  /** Layout of the option list. Default `vertical`. */
  orientation?: "vertical" | "horizontal"
}

/** Single-select options as clickable choice cards (plan / environment style). */
export type RadioChoiceCardFieldProps<TValues extends FieldValues, TName extends Path<TValues>> = FieldBaseProps<
  TValues,
  TName
> & {
  type: "radio-choice-card"
  options: FieldOption[]
  /** Card stack columns. Default `1`. */
  columns?: 1 | 2
}

export type TextareaFieldProps<TValues extends FieldValues, TName extends Path<TValues>> = FieldBaseProps<
  TValues,
  TName
> & {
  type: "textarea"
  rows?: number
}

export type DateFieldProps<TValues extends FieldValues, TName extends Path<TValues>> = FieldBaseProps<
  TValues,
  TName
> & {
  type: "date"
  /** ISO date / Date — earliest selectable day. */
  minDate?: string | Date
  /** ISO date / Date — latest selectable day. */
  maxDate?: string | Date
  clearable?: boolean
  /** date-fns display format. Default `PPP`. */
  displayFormat?: string
  captionLayout?: "label" | "dropdown" | "dropdown-months" | "dropdown-years"
  /** First year in the calendar dropdown. Default current year − 80. */
  fromYear?: number
  /** Last year in the calendar dropdown. Default current year + 10. */
  toYear?: number
}

export type DateRangeFieldProps<TValues extends FieldValues, TName extends Path<TValues>> = FieldBaseProps<
  TValues,
  TName
> & {
  type: "date-range"
  minDate?: string | Date
  maxDate?: string | Date
  clearable?: boolean
  /** Visible months in the popover. Default `2`. */
  numberOfMonths?: number
  /** date-fns display format. Default `LLL dd, y`. */
  displayFormat?: string
  fromYear?: number
  toYear?: number
}

export type MonthFieldProps<TValues extends FieldValues, TName extends Path<TValues>> = FieldBaseProps<
  TValues,
  TName
> & {
  type: "month"
  fromYear?: number
  toYear?: number
  clearable?: boolean
  /** date-fns display format. Default `MMMM yyyy`. */
  displayFormat?: string
}

export type QuarterFieldProps<TValues extends FieldValues, TName extends Path<TValues>> = FieldBaseProps<
  TValues,
  TName
> & {
  type: "quarter"
  fromYear?: number
  toYear?: number
  clearable?: boolean
}

export type TimeFieldProps<TValues extends FieldValues, TName extends Path<TValues>> = FieldBaseProps<
  TValues,
  TName
> & {
  type: "time"
  /** Native time input step in seconds. */
  step?: number
  min?: string
  max?: string
}

/** v1 field union — extend as more field folders land. */
export type FormFieldProps<TValues extends FieldValues = FieldValues, TName extends Path<TValues> = Path<TValues>> =
  | TextFieldProps<TValues, TName>
  | TextareaFieldProps<TValues, TName>
  | SelectFieldProps<TValues, TName>
  | MultiSelectFieldProps<TValues, TName>
  | CheckboxFieldProps<TValues, TName>
  | CheckboxChoiceCardFieldProps<TValues, TName>
  | SwitchFieldProps<TValues, TName>
  | SwitchChoiceCardFieldProps<TValues, TName>
  | RadioGroupFieldProps<TValues, TName>
  | RadioChoiceCardFieldProps<TValues, TName>
  | DateFieldProps<TValues, TName>
  | DateRangeFieldProps<TValues, TName>
  | MonthFieldProps<TValues, TName>
  | QuarterFieldProps<TValues, TName>
  | TimeFieldProps<TValues, TName>

export type FieldType = FormFieldProps["type"]

export type ServerFieldError = {
  path: string
  message: string
  code?: string
}

export type MapServerErrorResult =
  | ServerFieldError[]
  | {
      form?: string
      fields?: ServerFieldError[]
    }
