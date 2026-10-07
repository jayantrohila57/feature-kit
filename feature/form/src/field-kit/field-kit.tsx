"use client"

import type { FieldValues, Path } from "react-hook-form"
import type { z } from "zod"
import type { FormFieldProps } from "../field/field-types"
import type { FieldKitProps } from "./field-kit-types"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"

import { FieldGroup } from "@/packages/ui/components/field"
import { cn } from "@/packages/ui/lib/utils"

import { FormFieldView } from "../field/field-view"

function FieldKitRoot<TSchema extends z.ZodTypeAny>({
  schema,
  mode = "uncontrolled",
  values,
  defaultValues,
  onValuesChange,
  className,
  children,
}: FieldKitProps<TSchema>) {
  type Values = z.input<TSchema> & FieldValues

  const form = useForm<Values>({
    // Zod 4 schemas are supported by @hookform/resolvers 5.x
    resolver: zodResolver(schema as never),
    defaultValues: (defaultValues ?? values) as DefaultValuesCompat<Values>,
    mode: "onChange",
    reValidateMode: "onChange",
    shouldFocusError: true,
  })

  const onValuesChangeRef = useRef(onValuesChange)
  onValuesChangeRef.current = onValuesChange

  useEffect(() => {
    if (mode !== "controlled" || values === undefined) return
    const current = form.getValues()
    if (JSON.stringify(current) === JSON.stringify(values)) return
    form.reset(values as Values)
  }, [mode, values, form])

  useEffect(() => {
    if (!onValuesChangeRef.current) return
    const subscription = form.watch((next) => {
      onValuesChangeRef.current?.(next as Values)
    })
    return () => subscription.unsubscribe()
  }, [form])

  return (
    <FormProvider {...form}>
      <div className={cn("w-full", className)}>
        <FieldGroup>{children}</FieldGroup>
      </div>
    </FormProvider>
  )
}

type DefaultValuesCompat<T extends FieldValues> = import("react-hook-form").DefaultValues<T>

function FieldKitField<TValues extends FieldValues, TName extends Path<TValues>>(
  props: FormFieldProps<TValues, TName>,
) {
  return <FormFieldView {...props} />
}

export const FieldKit = Object.assign(FieldKitRoot, {
  Field: FieldKitField,
})
