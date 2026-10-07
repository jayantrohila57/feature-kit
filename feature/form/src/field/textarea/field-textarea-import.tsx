"use client"

import type { FieldValues, Path } from "react-hook-form"
import type { TextareaFieldProps } from "../field-types"

import { FieldPending } from "../field-pending"
import { FieldSlot } from "../field-slot"
import { useLazyField } from "../field-use-lazy"

const loadFieldTextarea = () => import("./field-textarea").then((mod) => mod.FieldTextarea)

export function FieldTextarea<TValues extends FieldValues, TName extends Path<TValues>>(
  props: TextareaFieldProps<TValues, TName>,
) {
  const Comp = useLazyField("field-textarea", loadFieldTextarea)
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
          control="textarea"
          rows={props.rows}
        />
      ) : (
        <Comp {...(fieldProps as TextareaFieldProps<FieldValues, Path<FieldValues>>)} />
      )}
    </FieldSlot>
  )
}
