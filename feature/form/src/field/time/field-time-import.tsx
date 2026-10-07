"use client"

import type { FieldValues, Path } from "react-hook-form"
import type { TimeFieldProps } from "../field-types"

import { FieldPending } from "../field-pending"
import { FieldSlot } from "../field-slot"
import { useLazyField } from "../field-use-lazy"

const loadFieldTime = () => import("./field-time").then((mod) => mod.FieldTime)

export function FieldTime<TValues extends FieldValues, TName extends Path<TValues>>(
  props: TimeFieldProps<TValues, TName>,
) {
  const Comp = useLazyField("field-time", loadFieldTime)
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
        <Comp {...(fieldProps as TimeFieldProps<FieldValues, Path<FieldValues>>)} />
      )}
    </FieldSlot>
  )
}
