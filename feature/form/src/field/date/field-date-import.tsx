"use client"

import type { FieldValues, Path } from "react-hook-form"
import type { DateFieldProps } from "../field-types"

import { FieldPending } from "../field-pending"
import { FieldSlot } from "../field-slot"
import { useLazyField } from "../field-use-lazy"

const loadFieldDate = () => import("./field-date").then((mod) => mod.FieldDate)

export function FieldDate<TValues extends FieldValues, TName extends Path<TValues>>(
  props: DateFieldProps<TValues, TName>,
) {
  const Comp = useLazyField("field-date", loadFieldDate)
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
        <Comp {...(fieldProps as DateFieldProps<FieldValues, Path<FieldValues>>)} />
      )}
    </FieldSlot>
  )
}
