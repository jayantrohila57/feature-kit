"use client"

import type { FieldValues, Path } from "react-hook-form"
import type {
  CheckboxChoiceCardFieldProps,
  CheckboxFieldProps,
  DateFieldProps,
  DateRangeFieldProps,
  FormFieldProps,
  MonthFieldProps,
  MultiSelectFieldProps,
  QuarterFieldProps,
  RadioChoiceCardFieldProps,
  RadioGroupFieldProps,
  SelectFieldProps,
  SwitchChoiceCardFieldProps,
  SwitchFieldProps,
  TextareaFieldProps,
  TextFieldProps,
  TimeFieldProps,
} from "./field-types"

import { FieldCheckbox } from "./checkbox"
import { FieldCheckboxChoiceCard } from "./checkbox-choice-card"
import { FieldDate } from "./date"
import { FieldDateRange } from "./date-range"
import { FieldMonth } from "./month"
import { FieldMultiSelect } from "./multi-select"
import { FieldQuarter } from "./quarter"
import { FieldRadioChoiceCard } from "./radio-choice-card"
import { FieldRadioGroup } from "./radio-group"
import { FieldSelect } from "./select"
import { FieldSwitch } from "./switch"
import { FieldSwitchChoiceCard } from "./switch-choice-card"
import { FieldText } from "./text"
import { FieldTextarea } from "./textarea"
import { FieldTime } from "./time"

type AnyName = Path<FieldValues>

/**
 * Explicit switch keeps `next/dynamic` field components as static JSX
 * references (safer than looking them up from a registry map).
 */
export function FormFieldView<TValues extends FieldValues, TName extends Path<TValues>>(
  props: FormFieldProps<TValues, TName>,
) {
  switch (props.type) {
    case "text":
      return <FieldText {...(props as unknown as TextFieldProps<FieldValues, AnyName>)} />
    case "textarea":
      return <FieldTextarea {...(props as unknown as TextareaFieldProps<FieldValues, AnyName>)} />
    case "select":
      return <FieldSelect {...(props as unknown as SelectFieldProps<FieldValues, AnyName>)} />
    case "multi-select":
      return <FieldMultiSelect {...(props as unknown as MultiSelectFieldProps<FieldValues, AnyName>)} />
    case "checkbox":
      return <FieldCheckbox {...(props as unknown as CheckboxFieldProps<FieldValues, AnyName>)} />
    case "checkbox-choice-card":
      return <FieldCheckboxChoiceCard {...(props as unknown as CheckboxChoiceCardFieldProps<FieldValues, AnyName>)} />
    case "switch":
      return <FieldSwitch {...(props as unknown as SwitchFieldProps<FieldValues, AnyName>)} />
    case "switch-choice-card":
      return <FieldSwitchChoiceCard {...(props as unknown as SwitchChoiceCardFieldProps<FieldValues, AnyName>)} />
    case "radio-group":
      return <FieldRadioGroup {...(props as unknown as RadioGroupFieldProps<FieldValues, AnyName>)} />
    case "radio-choice-card":
      return <FieldRadioChoiceCard {...(props as unknown as RadioChoiceCardFieldProps<FieldValues, AnyName>)} />
    case "date":
      return <FieldDate {...(props as unknown as DateFieldProps<FieldValues, AnyName>)} />
    case "date-range":
      return <FieldDateRange {...(props as unknown as DateRangeFieldProps<FieldValues, AnyName>)} />
    case "month":
      return <FieldMonth {...(props as unknown as MonthFieldProps<FieldValues, AnyName>)} />
    case "quarter":
      return <FieldQuarter {...(props as unknown as QuarterFieldProps<FieldValues, AnyName>)} />
    case "time":
      return <FieldTime {...(props as unknown as TimeFieldProps<FieldValues, AnyName>)} />
    default:
      return null
  }
}
