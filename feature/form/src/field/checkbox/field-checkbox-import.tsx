"use client"

import type { FieldValues, Path } from "react-hook-form"
import type { CheckboxFieldProps } from "../field-types"

import { FieldPending } from "../field-pending"
import { FieldSlot } from "../field-slot"
import { useLazyField } from "../field-use-lazy"

const loadFieldCheckbox = () => import("./field-checkbox").then((mod) => mod.FieldCheckbox)

export function FieldCheckbox<TValues extends FieldValues, TName extends Path<TValues>>(
  props: CheckboxFieldProps<TValues, TName>,
) {
  const Comp = useLazyField("field-checkbox", loadFieldCheckbox)
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
          size="sm"
          control="input"
        />
      ) : (
        <Comp {...(fieldProps as CheckboxFieldProps<FieldValues, Path<FieldValues>>)} />
      )}
    </FieldSlot>
  )
}
