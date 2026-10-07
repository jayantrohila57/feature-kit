"use client"

import type { FieldValues, Path } from "react-hook-form"
import type { SwitchFieldProps } from "../field-types"

import { FieldPending } from "../field-pending"
import { FieldSlot } from "../field-slot"
import { useLazyField } from "../field-use-lazy"

const loadFieldSwitch = () => import("./field-switch").then((mod) => mod.FieldSwitch)

export function FieldSwitch<TValues extends FieldValues, TName extends Path<TValues>>(
  props: SwitchFieldProps<TValues, TName>,
) {
  const Comp = useLazyField("field-switch", loadFieldSwitch)
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
        <Comp {...(fieldProps as SwitchFieldProps<FieldValues, Path<FieldValues>>)} />
      )}
    </FieldSlot>
  )
}
