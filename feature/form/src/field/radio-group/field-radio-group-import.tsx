"use client"

import type { FieldValues, Path } from "react-hook-form"
import type { RadioGroupFieldProps } from "../field-types"

import { FieldPending } from "../field-pending"
import { FieldSlot } from "../field-slot"
import { useLazyField } from "../field-use-lazy"

const loadFieldRadioGroup = () => import("./field-radio-group").then((mod) => mod.FieldRadioGroup)

export function FieldRadioGroup<TValues extends FieldValues, TName extends Path<TValues>>(
  props: RadioGroupFieldProps<TValues, TName>,
) {
  const Comp = useLazyField("field-radio-group", loadFieldRadioGroup)
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
        <Comp {...(fieldProps as RadioGroupFieldProps<FieldValues, Path<FieldValues>>)} />
      )}
    </FieldSlot>
  )
}
