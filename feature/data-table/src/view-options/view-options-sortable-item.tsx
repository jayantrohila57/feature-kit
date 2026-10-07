"use client"

import type { CSSProperties } from "react"
import type { ViewOptionsColumnItem } from "./view-options-types"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Pin } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/packages/ui/components/button"
import { Checkbox } from "@/packages/ui/components/checkbox"
import { Label } from "@/packages/ui/components/label"
import { cn } from "@/packages/ui/lib/utils"

export type ViewOptionsSortableItemProps = {
  column: ViewOptionsColumnItem
  checked: boolean
  pinned: boolean
  dragDisabled?: boolean
  /** Blocks pin/checkbox clicks while a drag is active (avoids accidental pin on drop). */
  interactionsDisabled?: boolean
  onCheckedChange: (visible: boolean) => void
  onPinToggle: () => void
}

export function ViewOptionsSortableItem({
  column,
  checked,
  pinned,
  dragDisabled = false,
  interactionsDisabled = false,
  onCheckedChange,
  onPinToggle,
}: ViewOptionsSortableItemProps) {
  const t = useTranslations()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
    disabled: dragDisabled,
  })

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const inputId = `view-options-${column.id}`

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-2 rounded-md px-1 py-1 hover:bg-accent/50",
        isDragging && "opacity-60",
        pinned && "bg-muted/40",
      )}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          "size-7 shrink-0 cursor-grab touch-none text-muted-foreground active:cursor-grabbing",
          dragDisabled && "pointer-events-none opacity-30",
        )}
        disabled={dragDisabled}
        aria-label={t("dataTable.view.dragHandle")}
        {...attributes}
        {...listeners}>
        <GripVertical className="size-3.5" />
      </Button>

      <Checkbox
        id={inputId}
        checked={checked}
        onCheckedChange={(value) => {
          onCheckedChange(value === true)
        }}
      />

      <Label
        htmlFor={inputId}
        className="min-w-0 flex-1 cursor-pointer truncate font-normal">
        {column.label}
      </Label>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          "size-7 shrink-0 text-muted-foreground opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100",
          pinned && "text-primary opacity-100",
          interactionsDisabled && "pointer-events-none",
        )}
        onClick={onPinToggle}
        aria-label={pinned ? t("dataTable.view.unpinColumn") : t("dataTable.view.pinColumn")}
        aria-pressed={pinned}
        tabIndex={interactionsDisabled ? -1 : undefined}>
        <Pin className={cn("size-3.5", pinned && "fill-current")} />
      </Button>
    </li>
  )
}
