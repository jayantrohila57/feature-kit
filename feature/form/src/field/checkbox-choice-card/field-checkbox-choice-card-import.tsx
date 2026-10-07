"use client"

import type { FieldValues, Path } from "react-hook-form"
import type { CheckboxChoiceCardFieldProps } from "../field-types"

import { FieldPending } from "../field-pending"
import { FieldSlot } from "../field-slot"
import { useLazyField } from "../field-use-lazy"

const loadFieldCheckboxChoiceCard = () =>
  import("./field-checkbox-choice-card").then((mod) => mod.FieldCheckboxChoiceCard)

export function FieldCheckboxChoiceCard<TValues extends FieldValues, TName extends Path<TValues>>(
  props: CheckboxChoiceCardFieldProps<TValues, TName>,
) {
  const Comp = useLazyField("field-checkbox-choice-card", loadFieldCheckboxChoiceCard)
  const { className, ...fieldProps } = props
  const id = String(props.name)

  return (
    <FieldSlot className={className}>
      {Comp == null || props.loading === true ? (
        <FieldPending
          id={id}
          label={props.label}
          description={props.description}
          helperText={props.helperText}
          required={props.required}
          size={props.size}
          control="input"
        />
      ) : (
        <Comp {...(fieldProps as CheckboxChoiceCardFieldProps<FieldValues, Path<FieldValues>>)} />
      )}
    </FieldSlot>
  )
}
