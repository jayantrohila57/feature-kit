"use client"

import type { FieldValues, Path } from "react-hook-form"
import type { MultiSelectFieldProps } from "../field-types"

import { useState } from "react"
import { Controller, useFormContext } from "react-hook-form"

import { SearchableMultiSelect } from "../../combobox"
import { FieldShell } from "../field-shell"
import { useFieldFlags } from "../field-use-flags"

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map(String)
}

export function FieldMultiSelect<TValues extends FieldValues, TName extends Path<TValues>>(
  props: MultiSelectFieldProps<TValues, TName>,
) {
  const { control } = useFormContext<TValues>()
  const { disabled, hidden } = useFieldFlags<TValues>({
    disabled: props.disabled,
    hidden: props.hidden,
  })
  const size = props.size ?? "default"
  const id = String(props.name)
  const [open, setOpen] = useState(false)
  const loading = props.loading === true
  const emptyMessage = props.emptyMessage ?? "No options available."
  const noResultsMessage = props.noResultsMessage ?? "No results found."
  const searchPlaceholder = props.searchPlaceholder ?? "Search…"

  if (hidden) return null

  return (
    <Controller
      control={control}
      name={props.name}
      render={({ field, fieldState }) => {
        const selected = asStringArray(field.value)
        const invalid = fieldState.invalid
        const isDisabled = Boolean(disabled || props.readOnly || loading)

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
            <SearchableMultiSelect
              id={id}
              options={props.options}
              value={selected}
              onValueChange={field.onChange}
              placeholder={props.placeholder ?? "Select…"}
              searchPlaceholder={searchPlaceholder}
              emptyMessage={emptyMessage}
              noResultsMessage={noResultsMessage}
              {...(props.optionsError ? { optionsError: props.optionsError } : {})}
              loading={loading}
              disabled={isDisabled}
              selectAll={props.selectAll === true}
              {...(props.selectAllLabel ? { selectAllLabel: props.selectAllLabel } : {})}
              clearable={props.clearable === true}
              {...(props.clearLabel ? { clearLabel: props.clearLabel } : {})}
              {...(props.maxSelected !== undefined ? { maxSelected: props.maxSelected } : {})}
              showSelectedCount={props.showSelectedCount === true}
              showSelectedValues={props.showSelectedValues === true}
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
