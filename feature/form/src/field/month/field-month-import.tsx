"use client"

import type { FieldValues, Path } from "react-hook-form"
import type { MonthFieldProps } from "../field-types"

import { FieldPending } from "../field-pending"
import { FieldSlot } from "../field-slot"
import { useLazyField } from "../field-use-lazy"

const loadFieldMonth = () => import("./field-month").then((mod) => mod.FieldMonth)

export function FieldMonth<TValues extends FieldValues, TName extends Path<TValues>>(
  props: MonthFieldProps<TValues, TName>,
) {
  const Comp = useLazyField("field-month", loadFieldMonth)
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
        <Comp {...(fieldProps as MonthFieldProps<FieldValues, Path<FieldValues>>)} />
      )}
    </FieldSlot>
  )
}
