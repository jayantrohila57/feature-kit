"use client"
// Column visibility is derived from the stable, in-place mutating TanStack table instance.
"use no memo"

import type { ViewOptionsDraft } from "./view-options-types"

import { useConfirmationDialog } from "layout/confirmation-dialog"
import { Columns3 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/packages/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/packages/ui/components/dialog"

import { useDataTableContext } from "../core"
import { useViewOptionsMounted } from "./hook"
import { ViewOptionsPanel } from "./view-options-panel"
import {
  mergeStoredPreferences,
  readStoredColumnPreferences,
  writeStoredColumnPreferences,
} from "./view-options-persistence"
import {
  buildColumnOrder,
  buildColumnPinning,
  countVisibleInDraft,
  createDefaultViewOptionsDraft,
  createViewOptionsDraft,
  draftToVisibilityState,
  getFixedAfterSelectColumnIdsFromTable,
  getViewOptionsColumns,
  mergeColumnOrder,
} from "./view-options-utils"

export function DataTableViewOptions<TData>() {
  const t = useTranslations()
  const { confirm } = useConfirmationDialog()
  const { table, tableId } = useDataTableContext<TData>()
  const mounted = useViewOptionsMounted()

  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<ViewOptionsDraft>({ visibility: {}, order: [], pinnedLeft: [] })
  const [search, setSearch] = useState("")

  const { alwaysOn, optional } = getViewOptionsColumns(table, t)
  const optionalIds = optional.map((column) => column.id)

  const appliedDraft = createViewOptionsDraft(table)
  const { visible, total } = countVisibleInDraft(appliedDraft)

  const beginDraft = () => {
    const fromTable = createViewOptionsDraft(table)

    // `columnOrder` is physical (pinned hideable cols first). Prefer stored user order when available.
    if (tableId) {
      const columnIds = table.getAllLeafColumns().map((column) => column.id)
      const stored = mergeStoredPreferences(readStoredColumnPreferences(tableId), columnIds)
      if (stored.order && stored.order.length > 0) {
        fromTable.order = mergeColumnOrder(
          fromTable.order,
          stored.order.filter((id) => fromTable.order.includes(id)),
        )
      }
    }

    setDraft(fromTable)
    setSearch("")
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      beginDraft()
    } else {
      setSearch("")
    }
    setOpen(nextOpen)
  }

  const handleShowAll = () => {
    setDraft(createDefaultViewOptionsDraft(optionalIds))
  }

  const applyAndClose = (nextDraft: ViewOptionsDraft, toastMessage: string) => {
    const columnIds = table.getAllLeafColumns().map((column) => column.id)
    const fixedAfterSelectIds = getFixedAfterSelectColumnIdsFromTable(table)
    const visibility = draftToVisibilityState(nextDraft)
    const columnOrder = buildColumnOrder(columnIds, nextDraft, fixedAfterSelectIds)
    const columnPinning = buildColumnPinning(columnIds, nextDraft, fixedAfterSelectIds)

    table.setColumnVisibility(visibility)
    table.setColumnOrder(columnOrder)
    table.setColumnPinning(columnPinning)

    if (tableId) {
      writeStoredColumnPreferences(tableId, {
        visibility,
        order: nextDraft.order,
        pinnedLeft: nextDraft.pinnedLeft,
      })
    }

    setOpen(false)
    setSearch("")
    toast.success(toastMessage)
  }

  const handleSave = () => {
    applyAndClose(draft, t("dataTable.view.saved"))
  }

  const handleCancel = () => {
    setOpen(false)
    setSearch("")
  }

  const handleReset = () => {
    void (async () => {
      const confirmed = await confirm({
        title: t("dataTable.view.resetConfirmTitle"),
        description: t("dataTable.view.resetConfirmDescription"),
        confirmLabel: t("dataTable.view.resetConfirmAction"),
        cancelLabel: t("dataTable.view.cancel"),
      })
      if (!confirmed) {
        return
      }
      const defaults = createDefaultViewOptionsDraft(optionalIds)
      applyAndClose(defaults, t("dataTable.view.resetDone"))
    })()
  }

  const triggerLabel = mounted && total > 0 ? t("dataTable.view.count", { visible, total }) : t("dataTable.view.toggle")

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="ms-auto"
          aria-label={t("dataTable.view.toggleColumns")}>
          <Columns3 data-icon="inline-start" />
          <span className="truncate">{triggerLabel}</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton
        className="gap-4 p-5 sm:max-w-lg">
        <DialogHeader className="pe-8">
          <DialogTitle>{t("dataTable.view.toggleColumns")}</DialogTitle>
          <DialogDescription>{t("dataTable.view.description")}</DialogDescription>
        </DialogHeader>
        <ViewOptionsPanel
          alwaysOn={alwaysOn}
          optional={optional}
          draft={draft}
          search={search}
          onSearchChange={setSearch}
          onDraftChange={setDraft}
          onShowAll={handleShowAll}
          onCancel={handleCancel}
          onReset={handleReset}
          onSave={handleSave}
        />
      </DialogContent>
    </Dialog>
  )
}
