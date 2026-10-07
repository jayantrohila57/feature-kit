"use client"

import type { ReactNode } from "react"
import type { ConfirmationOptions } from "./confirmation-dialog-types"

import { useCallback, useRef, useState } from "react"

import { ConfirmationDialog } from "./confirmation-dialog"
import { ConfirmationDialogContext } from "./use-confirmation-dialog"

type PendingConfirmation = {
  options: ConfirmationOptions
  resolve: (confirmed: boolean) => void
}

export function ConfirmationDialogProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingConfirmation | null>(null)
  const pendingRef = useRef<PendingConfirmation | null>(null)

  const settle = useCallback((confirmed: boolean) => {
    const current = pendingRef.current
    if (!current) {
      return
    }

    pendingRef.current = null
    setPending(null)
    current.resolve(confirmed)
  }, [])

  const confirm = useCallback((options: ConfirmationOptions) => {
    return new Promise<boolean>((resolve) => {
      if (pendingRef.current) {
        pendingRef.current.resolve(false)
      }

      const next: PendingConfirmation = { options, resolve }
      pendingRef.current = next
      setPending(next)
    })
  }, [])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        settle(false)
      }
    },
    [settle],
  )

  return (
    <ConfirmationDialogContext value={{ confirm }}>
      {children}
      <ConfirmationDialog
        open={pending !== null}
        options={pending?.options ?? null}
        onOpenChange={handleOpenChange}
        onConfirm={() => {
          settle(true)
        }}
        onCancel={() => {
          settle(false)
        }}
      />
    </ConfirmationDialogContext>
  )
}
