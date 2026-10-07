export type ConfirmationDialogVariant = "default" | "destructive"

export type ConfirmationOptions = {
  /** Dialog title. Falls back to `common.confirmAction` when omitted. */
  title?: string
  /** Body copy shown below the title. */
  description: string
  /** Visual emphasis for destructive mutations (delete, bulk remove, etc.). */
  variant?: ConfirmationDialogVariant
  /** Primary action label. Falls back to `common.continue` when omitted. */
  confirmLabel?: string
  /** Secondary action label. Falls back to `common.cancel` when omitted. */
  cancelLabel?: string
}

export type ConfirmationDialogProps = {
  open: boolean
  options: ConfirmationOptions | null
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  onCancel: () => void
}

export type ConfirmationDialogContextValue = {
  confirm: (options: ConfirmationOptions) => Promise<boolean>
}
