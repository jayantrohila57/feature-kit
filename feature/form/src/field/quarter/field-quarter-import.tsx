"use client"

import type { FieldValues, Path } from "react-hook-form"
import type { QuarterFieldProps } from "../field-types"

import { FieldPending } from "../field-pending"
import { FieldSlot } from "../field-slot"
import { useLazyField } from "../field-use-lazy"

const loadFieldQuarter = () => import("./field-quarter").then((mod) => mod.FieldQuarter)

export function FieldQuarter<TValues extends FieldValues, TName extends Path<TValues>>(
  props: QuarterFieldProps<TValues, TName>,
) {
  const Comp = useLazyField("field-quarter", loadFieldQuarter)
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
        <Comp {...(fieldProps as QuarterFieldProps<FieldValues, Path<FieldValues>>)} />
      )}
    </FieldSlot>
  )
}
