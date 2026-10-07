"use client"

import { createContext, useContext } from "react"

type FieldErrorMeta = {
  translateError?: ((message: string) => string) | undefined
}

const FieldErrorMetaContext = createContext<FieldErrorMeta>({})

export function FieldErrorMetaProvider({
  translateError,
  children,
}: {
  translateError?: ((message: string) => string) | undefined
  children: React.ReactNode
}) {
  return <FieldErrorMetaContext.Provider value={{ translateError }}>{children}</FieldErrorMetaContext.Provider>
}

export function useFieldErrorMeta() {
  return useContext(FieldErrorMetaContext)
}
