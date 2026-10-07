"use client"

import { createContext, useContext } from "react"

import { FieldErrorMetaProvider } from "../field/field-error-meta"

type FormKitMeta = {
  isPending: boolean
}

const FormKitMetaContext = createContext<FormKitMeta>({ isPending: false })

export function FormKitMetaProvider({
  isPending,
  translateError,
  children,
}: {
  isPending: boolean
  translateError?: ((message: string) => string) | undefined
  children: React.ReactNode
}) {
  return (
    <FormKitMetaContext.Provider value={{ isPending }}>
      <FieldErrorMetaProvider translateError={translateError}>{children}</FieldErrorMetaProvider>
    </FormKitMetaContext.Provider>
  )
}

export function useFormKitMeta() {
  return useContext(FormKitMetaContext)
}
