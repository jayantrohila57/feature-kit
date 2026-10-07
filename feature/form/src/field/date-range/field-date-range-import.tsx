"use client"

import type { FieldValues, Path } from "react-hook-form"
import type { DateRangeFieldProps } from "../field-types"

import { FieldPending } from "../field-pending"
import { FieldSlot } from "../field-slot"
import { useLazyField } from "../field-use-lazy"

const loadFieldDateRange = () => import("./field-date-range").then((mod) => mod.FieldDateRange)

export function FieldDateRange<TValues extends FieldValues, TName extends Path<TValues>>(
  props: DateRangeFieldProps<TValues, TName>,
) {
  const Comp = useLazyField("field-date-range", loadFieldDateRange)
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
        <Comp {...(fieldProps as DateRangeFieldProps<FieldValues, Path<FieldValues>>)} />
      )}
    </FieldSlot>
  )
}
