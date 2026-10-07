"use client"

import type { FieldValues, Path } from "react-hook-form"
import type { z } from "zod"
import type { FormFieldProps } from "../field/field-types"
import type { FormKitProps, FormKitResetProps, FormKitSubmitProps } from "./form-kit-types"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  use,
  useEffect,
  useLayoutEffect,
  useState,
} from "react"
import { FormProvider, useForm, useFormContext, useFormState } from "react-hook-form"

import { Button } from "@/packages/ui/components/button"
import Spinner from "@/packages/ui/components/spinner"
import { cn } from "@/packages/ui/lib/utils"

import { FORM_KIT_ACTIONS_CLASS, FORM_KIT_ROOT_CLASS, FORM_KIT_VALIDATION } from "../constants"
import { FormFieldView } from "../field/field-view"
import { applyServerErrors, focusFirstError, mapUnknownServerError } from "../utils"
import { FormKitMetaProvider, useFormKitMeta } from "./form-kit-meta"
import { FormKitScrollBody } from "./form-kit-scroll-body"

type FormKitActionsRegistrar = Dispatch<SetStateAction<ReactNode>>

const FormKitActionsContext = createContext<FormKitActionsRegistrar | null>(null)

function FormKitRoot<TSchema extends z.ZodTypeAny>({
  schema,
  defaultValues,
  onSubmit,
  isPending = false,
  resetOnSuccess = false,
  mapServerError = mapUnknownServerError,
  translateError,
  onSuccess,
  onError,
  className,
  scrollBody = true,
  children,
}: FormKitProps<TSchema>) {
  type InputValues = z.input<TSchema> & FieldValues
  type OutputValues = z.output<TSchema>

  const [actions, setActions] = useState<ReactNode>(null)

  const form = useForm<InputValues, unknown, OutputValues>({
    resolver: zodResolver(schema as never),
    defaultValues,
    ...FORM_KIT_VALIDATION,
  })

  const handleSubmit = form.handleSubmit(
    async (values) => {
      try {
        await onSubmit(values)
        onSuccess?.(values)
        if (resetOnSuccess === true) {
          form.reset(defaultValues)
        } else if (resetOnSuccess === "keepDirtyValues") {
          form.reset(values as InputValues, { keepDirtyValues: true })
        } else if (resetOnSuccess && typeof resetOnSuccess === "object") {
          form.reset(resetOnSuccess as InputValues)
        }
      } catch (error) {
        const mapped = mapServerError(error)
        const applied = applyServerErrors(form.setError, mapped)
        focusFirstError({ ...form.formState.errors, ...applied })
        onError?.(error)
      }
    },
    (errors) => {
      focusFirstError(errors)
    },
  )

  return (
    <FormProvider {...form}>
      <FormKitMetaProvider
        isPending={isPending}
        translateError={translateError}>
        <FormKitActionsContext value={setActions}>
          <form
            onSubmit={handleSubmit}
            className={cn(scrollBody ? FORM_KIT_ROOT_CLASS : "flex w-full flex-col", className)}
            noValidate>
            {scrollBody ? <FormKitScrollBody>{children}</FormKitScrollBody> : children}
            {actions}
          </form>
        </FormKitActionsContext>
      </FormKitMetaProvider>
    </FormProvider>
  )
}

function FormKitField<TValues extends FieldValues, TName extends Path<TValues>>(props: FormFieldProps<TValues, TName>) {
  return <FormFieldView {...props} />
}

function FormKitSubmit({ label = "Submit", pendingLabel = "Submitting…", className, disabled }: FormKitSubmitProps) {
  const { isPending } = useFormKitMeta()
  const { isSubmitting } = useFormState()
  const pending = isPending || isSubmitting

  return (
    <Button
      type="submit"
      disabled={disabled || pending}
      className={className}>
      {pending ? <Spinner className="size-4" /> : null}
      {pending ? pendingLabel : label}
    </Button>
  )
}

function FormKitReset({ label = "Reset", className, disabled }: FormKitResetProps) {
  const form = useFormContext()
  const { isPending } = useFormKitMeta()

  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled || isPending}
      className={className}
      onClick={() => form.reset()}>
      {label}
    </Button>
  )
}

function FormKitActions({ children, className }: { children: React.ReactNode; className?: string }) {
  const setActions = use(FormKitActionsContext)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useLayoutEffect(() => {
    if (!hydrated || !setActions) return

    setActions(<div className={cn(FORM_KIT_ACTIONS_CLASS, className)}>{children}</div>)
    return () => setActions(null)
  }, [hydrated, setActions, children, className])

  if (!setActions || !hydrated) {
    return <div className={cn(FORM_KIT_ACTIONS_CLASS, className)}>{children}</div>
  }

  return null
}

export const FormKit = Object.assign(FormKitRoot, {
  Field: FormKitField,
  Submit: FormKitSubmit,
  Reset: FormKitReset,
  Actions: FormKitActions,
})
