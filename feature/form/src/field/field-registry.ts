"use client"

import type { ComponentType } from "react"
import type { FieldType, FormFieldProps } from "./field-types"

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

export const fieldRegistry: Record<FieldType, ComponentType<FormFieldProps>> = {
  text: FieldText as ComponentType<FormFieldProps>,
  textarea: FieldTextarea as ComponentType<FormFieldProps>,
  select: FieldSelect as ComponentType<FormFieldProps>,
  "multi-select": FieldMultiSelect as ComponentType<FormFieldProps>,
  checkbox: FieldCheckbox as ComponentType<FormFieldProps>,
  "checkbox-choice-card": FieldCheckboxChoiceCard as ComponentType<FormFieldProps>,
  switch: FieldSwitch as ComponentType<FormFieldProps>,
  "switch-choice-card": FieldSwitchChoiceCard as ComponentType<FormFieldProps>,
  "radio-group": FieldRadioGroup as ComponentType<FormFieldProps>,
  "radio-choice-card": FieldRadioChoiceCard as ComponentType<FormFieldProps>,
  date: FieldDate as ComponentType<FormFieldProps>,
  "date-range": FieldDateRange as ComponentType<FormFieldProps>,
  month: FieldMonth as ComponentType<FormFieldProps>,
  quarter: FieldQuarter as ComponentType<FormFieldProps>,
  time: FieldTime as ComponentType<FormFieldProps>,
}
