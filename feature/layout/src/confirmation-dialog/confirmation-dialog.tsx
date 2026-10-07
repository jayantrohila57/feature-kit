"use client"

import type { ConfirmationDialogProps } from "./confirmation-dialog-types"

import { useTranslations } from "next-intl"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/packages/ui/components/alert-dialog"
import { cn } from "@/packages/ui/lib/utils"

export function ConfirmationDialog({ open, options, onOpenChange, onConfirm, onCancel }: ConfirmationDialogProps) {
  const t = useTranslations()
  const isDestructive = options?.variant === "destructive"

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isDestructive ? "⚠️ " : ""}
            {options?.title ?? t("common.confirmAction")}
          </AlertDialogTitle>
          {options?.description ? <AlertDialogDescription>{options.description}</AlertDialogDescription> : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{options?.cancelLabel ?? t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            className={cn(isDestructive && "bg-destructive text-destructive-foreground hover:bg-destructive/90")}
            onClick={onConfirm}>
            {options?.confirmLabel ?? t("common.continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
