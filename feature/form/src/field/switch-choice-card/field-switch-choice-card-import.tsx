"use client"

import type { FieldValues, Path } from "react-hook-form"
import type { SwitchChoiceCardFieldProps } from "../field-types"

import { FieldPending } from "../field-pending"
import { FieldSlot } from "../field-slot"
import { useLazyField } from "../field-use-lazy"

const loadFieldSwitchChoiceCard = () => import("./field-switch-choice-card").then((mod) => mod.FieldSwitchChoiceCard)

export function FieldSwitchChoiceCard<TValues extends FieldValues, TName extends Path<TValues>>(
  props: SwitchChoiceCardFieldProps<TValues, TName>,
) {
  const Comp = useLazyField("field-switch-choice-card", loadFieldSwitchChoiceCard)
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
        <Comp {...(fieldProps as SwitchChoiceCardFieldProps<FieldValues, Path<FieldValues>>)} />
      )}
    </FieldSlot>
  )
}
