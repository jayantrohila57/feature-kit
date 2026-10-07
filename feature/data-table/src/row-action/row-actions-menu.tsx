"use client"

import type { Row } from "@tanstack/react-table"
import type { RowActionComponent } from "./row-action-types"

import { MoreHorizontal } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/packages/ui/components/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/packages/ui/components/dropdown-menu"

export type RowActionsMenuProps<TData> = {
  row: Row<TData>
  actions: RowActionComponent<TData>[]
}

export function RowActionsMenu<TData>({ row, actions }: RowActionsMenuProps<TData>) {
  const t = useTranslations()
  const data = row.original

  if (actions.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 rounded-md data-[state=open]:bg-muted">
          <MoreHorizontal className="size-4" />
          <span className="sr-only">{t("dataTable.row.openMenu")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[160px]">
        {actions.map((Action, index) => (
          <Action
            key={Action.displayName ?? Action.name ?? index}
            row={row}
            data={data}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
