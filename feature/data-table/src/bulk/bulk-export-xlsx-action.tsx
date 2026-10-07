"use client"

import type { BulkExportActionProps } from "./bulk-action-bar-types"

import { exportToXlsx } from "export"
import { useConfirmationDialog } from "layout/confirmation-dialog"
import { FileSpreadsheet } from "lucide-react"
import { useTranslations } from "next-intl"
import { useCallback, useState } from "react"

import { Button } from "@/packages/ui/components/button"
import { cn } from "@/packages/ui/lib/utils"

import { useDataTableContext } from "../core"
import { bulkActionButtonClassName } from "./constants"

export function BulkExportXlsxAction<TData>({
  filename,
  columns,
  label,
  confirmTitle,
  confirmDescription,
  confirmLabel,
  className,
}: BulkExportActionProps<TData>) {
  const t = useTranslations()
  const { confirm } = useConfirmationDialog()
  const { selectedRows, selectedCount } = useDataTableContext<TData>()
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = useCallback(async () => {
    if (selectedCount === 0 || columns.length === 0) {
      return
    }

    const description =
      typeof confirmDescription === "function"
        ? confirmDescription(selectedCount)
        : (confirmDescription ?? t("dataTable.bulk.exportXlsxConfirmDescription", { count: selectedCount }))

    const confirmed = await confirm({
      title: confirmTitle ?? t("dataTable.bulk.exportXlsxConfirmTitle"),
      description,
      confirmLabel: confirmLabel ?? t("dataTable.bulk.exportConfirmAction"),
    })

    if (!confirmed) {
      return
    }

    setIsExporting(true)
    try {
      await exportToXlsx(selectedRows, columns, filename)
    } finally {
      setIsExporting(false)
    }
  }, [columns, confirm, confirmDescription, confirmLabel, confirmTitle, filename, selectedCount, selectedRows, t])

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn(bulkActionButtonClassName, className)}
      disabled={selectedCount === 0 || columns.length === 0 || isExporting}
      onClick={() => {
        void handleExport()
      }}>
      <FileSpreadsheet data-icon="inline-start" />
      {label ?? t("dataTable.bulk.exportXlsx")}
    </Button>
  )
}
