"use client"

import type { DragEndEvent } from "@dnd-kit/core"
import type { ViewOptionsColumnItem, ViewOptionsDraft } from "./view-options-types"

import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Lock, Search } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRef, useState } from "react"

import { Button } from "@/packages/ui/components/button"
import { Checkbox } from "@/packages/ui/components/checkbox"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/packages/ui/components/input-group"
import { Label } from "@/packages/ui/components/label"
import { Separator } from "@/packages/ui/components/separator"
import { cn } from "@/packages/ui/lib/utils"

import { ViewOptionsSortableItem } from "./view-options-sortable-item"
import { filterOptionalColumns, orderOptionalColumns } from "./view-options-utils"

export type ViewOptionsPanelProps = {
  alwaysOn: ViewOptionsColumnItem[]
  optional: ViewOptionsColumnItem[]
  draft: ViewOptionsDraft
  search: string
  onSearchChange: (value: string) => void
  onDraftChange: (draft: ViewOptionsDraft) => void
  onShowAll: () => void
  onCancel: () => void
  onReset: () => void
  onSave: () => void
  className?: string
}

export function ViewOptionsPanel({
  alwaysOn,
  optional,
  draft,
  search,
  onSearchChange,
  onDraftChange,
  onShowAll,
  onCancel,
  onReset,
  onSave,
  className,
}: ViewOptionsPanelProps) {
  const t = useTranslations()
  const [isDragging, setIsDragging] = useState(false)
  const suppressPinClickRef = useRef(false)
  const filteredOptional = filterOptionalColumns(optional, search)
  const orderedOptional = orderOptionalColumns(filteredOptional, draft.order)
  const dragDisabled = search.trim().length > 0

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    // Block pin-button clicks before re-enabling row interactions (mouseup can synthesize a click).
    suppressPinClickRef.current = true
    window.setTimeout(() => {
      suppressPinClickRef.current = false
    }, 0)
    setIsDragging(false)

    if (!over || active.id === over.id) {
      return
    }

    const activeId = String(active.id)
    const overId = String(over.id)
    const oldIndex = draft.order.indexOf(activeId)
    const newIndex = draft.order.indexOf(overId)

    if (oldIndex < 0 || newIndex < 0) {
      return
    }

    onDraftChange({
      ...draft,
      order: arrayMove(draft.order, oldIndex, newIndex),
    })
  }

  const handleDragCancel = () => {
    suppressPinClickRef.current = true
    window.setTimeout(() => {
      suppressPinClickRef.current = false
    }, 0)
    setIsDragging(false)
  }

  const handleVisibilityChange = (columnId: string, visible: boolean) => {
    onDraftChange({
      ...draft,
      visibility: { ...draft.visibility, [columnId]: visible },
    })
  }

  const handlePinToggle = (columnId: string) => {
    if (suppressPinClickRef.current) {
      return
    }

    const isPinned = draft.pinnedLeft.includes(columnId)
    onDraftChange({
      ...draft,
      pinnedLeft: isPinned ? draft.pinnedLeft.filter((id) => id !== columnId) : [...draft.pinnedLeft, columnId],
    })
  }

  return (
    <div className={cn("flex min-h-0 flex-col gap-3", className)}>
      <InputGroup className="bg-surface shadow-xs">
        <InputGroupAddon align="inline-start">
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t("dataTable.view.searchPlaceholder")}
          aria-label={t("dataTable.view.searchPlaceholder")}
        />
      </InputGroup>

      <div className="flex max-h-96 min-h-0 flex-col gap-3 overflow-y-auto px-1">
        {alwaysOn.length > 0 ? (
          <section className="flex flex-col gap-2">
            <div className="flex flex-col gap-0.5">
              <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                {t("dataTable.view.alwaysOn")}
              </h3>
              <p className="text-muted-foreground text-xs">{t("dataTable.view.alwaysOnHint")}</p>
            </div>
            <ul className="flex flex-col gap-1.5">
              {alwaysOn.map((column) => (
                <li
                  key={column.id}
                  className="flex items-center gap-2 rounded-md px-1 py-1 opacity-70">
                  <span
                    className="size-7 shrink-0"
                    aria-hidden
                  />
                  <Checkbox
                    id={`view-options-locked-${column.id}`}
                    checked
                    disabled
                    aria-label={column.label}
                  />
                  <Label
                    htmlFor={`view-options-locked-${column.id}`}
                    className="flex min-w-0 flex-1 cursor-not-allowed items-center justify-between gap-2 font-normal">
                    <span className="truncate">{column.label}</span>
                    <Lock
                      className="size-3.5 shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                  </Label>
                  <span
                    className="size-7 shrink-0"
                    aria-hidden
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {alwaysOn.length > 0 && optional.length > 0 ? <Separator /> : null}

        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col gap-0.5">
              <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                {t("dataTable.view.optional")}
              </h3>
              <p className="text-muted-foreground text-xs">{t("dataTable.view.optionalHint")}</p>
            </div>
            {optional.length > 0 ? (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                className="h-6 shrink-0 px-2 text-xs"
                onClick={onShowAll}>
                {t("dataTable.view.showAll")}
              </Button>
            ) : null}
          </div>

          {orderedOptional.length === 0 ? (
            <p className="px-1 py-2 text-muted-foreground text-xs">{t("dataTable.view.emptySearch")}</p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragCancel={handleDragCancel}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={orderedOptional.map((column) => column.id)}
                strategy={verticalListSortingStrategy}>
                <ul className="flex flex-col gap-1.5">
                  {orderedOptional.map((column) => (
                    <ViewOptionsSortableItem
                      key={column.id}
                      column={column}
                      checked={draft.visibility[column.id] !== false}
                      pinned={draft.pinnedLeft.includes(column.id)}
                      dragDisabled={dragDisabled}
                      interactionsDisabled={isDragging}
                      onCheckedChange={(visible) => handleVisibilityChange(column.id, visible)}
                      onPinToggle={() => handlePinToggle(column.id)}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          )}
        </section>
      </div>

      <Separator />

      <div className="flex items-center justify-end gap-2 px-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}>
          {t("dataTable.view.cancel")}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onReset}>
          {t("dataTable.view.reset")}
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={onSave}>
          {t("dataTable.view.save")}
        </Button>
      </div>
    </div>
  )
}
