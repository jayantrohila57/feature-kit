"use client"

import { X } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/packages/ui/components/button"
import { cn } from "@/packages/ui/lib/utils"

import { useDataTableContext } from "../core"
import { bulkActionButtonClassName } from "./constants"

type BulkClearSelectionActionProps = {
  className?: string
}

export function BulkClearSelectionAction({ className }: BulkClearSelectionActionProps) {
  const t = useTranslations()
  const { clearSelection } = useDataTableContext()

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn(bulkActionButtonClassName, className)}
      onClick={clearSelection}
      aria-label={t("dataTable.selection.clearAria")}>
      <X data-icon="inline-start" />
      {t("dataTable.selection.clear")}
    </Button>
  )
}
