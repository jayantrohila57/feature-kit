"use client"

import type { FieldValues, Path } from "react-hook-form"
import type { TextFieldProps } from "../field-types"

import { FieldPending } from "../field-pending"
import { FieldSlot } from "../field-slot"
import { useLazyField } from "../field-use-lazy"

const loadFieldText = () => import("./field-text").then((mod) => mod.FieldText)

export function FieldText<TValues extends FieldValues, TName extends Path<TValues>>(
  props: TextFieldProps<TValues, TName>,
) {
  const Comp = useLazyField("field-text", loadFieldText)
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
        <Comp {...(fieldProps as TextFieldProps<FieldValues, Path<FieldValues>>)} />
      )}
    </FieldSlot>
  )
}
