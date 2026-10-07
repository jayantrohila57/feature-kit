"use client"

import type { RowActionComponentProps } from "../row-action-types"

import { useConfirmationDialog } from "layout/confirmation-dialog"
import { Trash } from "lucide-react"
import { useTranslations } from "next-intl"
import { useCallback } from "react"

import { DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut } from "@/packages/ui/components/dropdown-menu"

export type RowActionDeleteProps<TData> = RowActionComponentProps<TData> & {
  onDelete: (data: TData) => void | Promise<void>
  isPending?: boolean
  confirmTitle?: string
  confirmDescription?: string | ((data: TData) => string)
  confirmLabel?: string
  label?: string
  showSeparator?: boolean
}

export function RowActionDelete<TData>({
  data,
  onDelete,
  isPending = false,
  confirmTitle,
  confirmDescription,
  confirmLabel,
  label,
  showSeparator = true,
}: RowActionDeleteProps<TData>) {
  const t = useTranslations()
  const { confirm } = useConfirmationDialog()

  const handleDelete = useCallback(async () => {
    const description = typeof confirmDescription === "function" ? confirmDescription(data) : confirmDescription

    const confirmed = await confirm({
      title: confirmTitle ?? t("common.confirmAction"),
      description: description ?? t("dataTable.row.deleteConfirmDescription"),
      variant: "destructive",
      confirmLabel: confirmLabel ?? t("common.delete"),
    })

    if (!confirmed) {
      return
    }

    try {
      await onDelete(data)
    } catch {
      // Delete actions report API failures via toast. Do not rethrow — an unhandled
      // rejection can replace the page with the route error boundary.
    }
  }, [confirm, confirmDescription, confirmLabel, confirmTitle, data, onDelete, t])

  return (
    <>
      {showSeparator ? <DropdownMenuSeparator /> : null}
      <DropdownMenuItem
        variant="destructive"
        disabled={isPending}
        onClick={() => {
          void handleDelete()
        }}>
        <Trash data-icon="inline-start" />
        {label ?? t("common.delete")}
        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
      </DropdownMenuItem>
    </>
  )
}
