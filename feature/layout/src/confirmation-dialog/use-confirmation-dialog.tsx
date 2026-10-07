"use client"

import type { ConfirmationDialogContextValue } from "./confirmation-dialog-types"

import { createContext, use } from "react"

const ConfirmationDialogContext = createContext<ConfirmationDialogContextValue | null>(null)

export function useConfirmationDialog(): ConfirmationDialogContextValue {
  const context = use(ConfirmationDialogContext)

  if (!context) {
    throw new Error("useConfirmationDialog must be used within ConfirmationDialogProvider")
  }

  return context
}

export { ConfirmationDialogContext }
