"use client"

import type { ReactNode } from "react"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/packages/ui/components/dialog"

type DataTableFullscreenDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
}

export function DataTableFullscreenDialog({ open, onOpenChange, title, children }: DataTableFullscreenDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}>
      <DialogContent
        variant="fullscreen"
        showCloseButton={false}
        className="gap-0 p-2 pt-0">
        <DialogHeader className="shrink-0 space-y-0 border-border border-b px-2 py-2 text-start">
          <DialogTitle className="min-h-7 font-bold font-heading text-[21px] leading-7 tracking-[-0.025em]">
            {title}
          </DialogTitle>
          <DialogDescription className="sr-only">{title}</DialogDescription>
        </DialogHeader>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
