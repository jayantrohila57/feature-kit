"use client"

import type { FieldValues, Path } from "react-hook-form"
import type { MultiSelectFieldProps } from "../field-types"

import { FieldPending } from "../field-pending"
import { FieldSlot } from "../field-slot"
import { useLazyField } from "../field-use-lazy"

const loadFieldMultiSelect = () => import("./field-multi-select").then((mod) => mod.FieldMultiSelect)

export function FieldMultiSelect<TValues extends FieldValues, TName extends Path<TValues>>(
  props: MultiSelectFieldProps<TValues, TName>,
) {
  const Comp = useLazyField("field-multi-select", loadFieldMultiSelect)
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
        <Comp {...(fieldProps as MultiSelectFieldProps<FieldValues, Path<FieldValues>>)} />
      )}
    </FieldSlot>
  )
}
