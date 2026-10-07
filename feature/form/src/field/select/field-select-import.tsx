"use client"

import type { FieldValues, Path } from "react-hook-form"
import type { SelectFieldProps } from "../field-types"

import { FieldPending } from "../field-pending"
import { FieldSlot } from "../field-slot"
import { useLazyField } from "../field-use-lazy"

const loadFieldSelect = () => import("./field-select").then((mod) => mod.FieldSelect)

export function FieldSelect<TValues extends FieldValues, TName extends Path<TValues>>(
  props: SelectFieldProps<TValues, TName>,
) {
  const Comp = useLazyField("field-select", loadFieldSelect)
  const { className, ...fieldProps } = props
  const id = String(props.name)

  return (
    <FieldSlot className={className}>
      {Comp == null ? (
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
        <Comp {...(fieldProps as SelectFieldProps<FieldValues, Path<FieldValues>>)} />
      )}
    </FieldSlot>
  )
}
