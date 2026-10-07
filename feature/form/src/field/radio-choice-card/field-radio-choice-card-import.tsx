"use client"

import type { FieldValues, Path } from "react-hook-form"
import type { RadioChoiceCardFieldProps } from "../field-types"

import { FieldPending } from "../field-pending"
import { FieldSlot } from "../field-slot"
import { useLazyField } from "../field-use-lazy"

const loadFieldRadioChoiceCard = () => import("./field-radio-choice-card").then((mod) => mod.FieldRadioChoiceCard)

export function FieldRadioChoiceCard<TValues extends FieldValues, TName extends Path<TValues>>(
  props: RadioChoiceCardFieldProps<TValues, TName>,
) {
  const Comp = useLazyField("field-radio-choice-card", loadFieldRadioChoiceCard)
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
        <Comp {...(fieldProps as RadioChoiceCardFieldProps<FieldValues, Path<FieldValues>>)} />
      )}
    </FieldSlot>
  )
}
