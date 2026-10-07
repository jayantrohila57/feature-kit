"use client"

import type { FieldValues, Path } from "react-hook-form"
import type { SelectFieldProps } from "../field-types"

import { useState } from "react"
import { Controller, useFormContext } from "react-hook-form"

import { SearchableSelect } from "../../combobox"
import { FieldShell } from "../field-shell"
import { useFieldFlags } from "../field-use-flags"

export function FieldSelect<TValues extends FieldValues, TName extends Path<TValues>>(
  props: SelectFieldProps<TValues, TName>,
) {
  const { control } = useFormContext<TValues>()
  const { disabled, hidden } = useFieldFlags<TValues>({
    disabled: props.disabled,
    hidden: props.hidden,
  })
  const size = props.size ?? "default"
  const id = String(props.name)
  const [open, setOpen] = useState(false)

  if (hidden) return null

  const loading = props.loading === true
  const emptyMessage = props.emptyMessage ?? "No options available."
  const noResultsMessage = props.noResultsMessage ?? "No results found."
  const searchPlaceholder = props.searchPlaceholder ?? "Search…"

  return (
    <Controller
      control={control}
      name={props.name}
      render={({ field, fieldState }) => {
        const invalid = fieldState.invalid
        const current = field.value == null || field.value === "" ? "" : String(field.value)
        const isDisabled = disabled || props.readOnly === true || loading

        return (
          <FieldShell
            id={id}
            label={props.label}
            description={props.description}
            helperText={props.helperText}
            required={props.required}
            disabled={isDisabled}
            invalid={invalid}
            errorMessage={fieldState.error?.message}
            className={props.className}>
            <SearchableSelect
              id={id}
              options={props.options}
              value={current}
              onValueChange={(value) => {
                field.onChange(value)
                setOpen(false)
              }}
              onClear={() => {
                field.onChange(undefined)
                setOpen(false)
              }}
              placeholder={props.placeholder ?? "Select…"}
              searchPlaceholder={searchPlaceholder}
              emptyMessage={emptyMessage}
              noResultsMessage={noResultsMessage}
              {...(props.optionsError ? { optionsError: props.optionsError } : {})}
              loading={loading}
              disabled={isDisabled}
              clearable={props.clearable === true}
              invalid={invalid}
              {...(props.required !== undefined ? { required: props.required } : {})}
              size={size}
              open={open}
              onOpenChange={setOpen}
            />
          </FieldShell>
        )
      }}
    />
  )
}
