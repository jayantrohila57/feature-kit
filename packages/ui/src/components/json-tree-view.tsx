"use client"

import { ChevronRight } from "lucide-react"
import { useState } from "react"

import { formatJsonTreePrimitive, jsonTreeChildCount, parseJsonTreeValue } from "../lib/json-tree-view-parse"
import { cn } from "../lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible"

export type JsonTreeViewProps = {
  value: string | object | null | undefined
  className?: string
  emptyMessage?: string
  invalidJsonMessage?: string
  maxHeight?: string | number
}

type JsonTreeNodeProps = {
  label: string
  value: unknown
  depth: number
  defaultOpen?: boolean
}

function branchSummary(value: unknown): string {
  const count = jsonTreeChildCount(value)
  if (Array.isArray(value)) {
    return count === 1 ? "[1 item]" : `[${count ?? 0} items]`
  }
  if (value !== null && typeof value === "object") {
    return count === 1 ? "{1 key}" : `{${count ?? 0} keys}`
  }
  return ""
}

function JsonTreeLeaf({ label, value, depth }: { label: string; value: unknown; depth: number }) {
  return (
    <div
      className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-start gap-3 py-0.5"
      style={{ paddingLeft: depth * 12 }}>
      <span className="truncate font-medium text-foreground text-xs">{label}</span>
      <span className="wrap-break-word font-mono text-muted-foreground text-xs">{formatJsonTreePrimitive(value)}</span>
    </div>
  )
}

function JsonTreeNode({ label, value, depth, defaultOpen = false }: JsonTreeNodeProps) {
  const [open, setOpen] = useState(defaultOpen)
  const childCount = jsonTreeChildCount(value)

  if (childCount === null) {
    return (
      <JsonTreeLeaf
        label={label}
        value={value}
        depth={depth}
      />
    )
  }

  const entries: Array<{ key: string; value: unknown }> = Array.isArray(value)
    ? value.map((entry, index) => ({ key: `[${index}]`, value: entry }))
    : Object.entries(value as Record<string, unknown>).map(([key, entry]) => ({ key, value: entry }))

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="space-y-0.5">
      <div
        className="grid grid-cols-[auto_minmax(0,1fr)_minmax(0,1.2fr)] items-start gap-2 py-0.5"
        style={{ paddingLeft: depth * 12 }}>
        <CollapsibleTrigger
          type="button"
          className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-sm text-muted-foreground hover:bg-muted/60"
          aria-label={open ? `Collapse ${label}` : `Expand ${label}`}>
          <ChevronRight className={cn("size-3.5 transition-transform", open && "rotate-90")} />
        </CollapsibleTrigger>
        <span className="truncate font-medium text-foreground text-xs">{label}</span>
        <span className="text-muted-foreground text-xs">{branchSummary(value)}</span>
      </div>
      <CollapsibleContent className="space-y-0.5">
        {entries.map((entry) => (
          <JsonTreeNode
            key={entry.key}
            label={entry.key}
            value={entry.value}
            depth={depth + 1}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

export function JsonTreeView({
  value,
  className,
  emptyMessage = "No JSON to display.",
  invalidJsonMessage = "Invalid JSON.",
  maxHeight = "20rem",
}: JsonTreeViewProps) {
  const parsed = parseJsonTreeValue(value)

  if (!parsed.ok) {
    return (
      <div
        className={cn(
          "rounded-md border bg-muted/20 px-3 py-2 text-muted-foreground text-sm",
          !parsed.isEmpty && "border-destructive/40 text-destructive",
          className,
        )}>
        {parsed.isEmpty ? emptyMessage : `${invalidJsonMessage} ${parsed.error}`}
      </div>
    )
  }

  const resolvedMaxHeight = typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight
  const childCount = jsonTreeChildCount(parsed.data)

  return (
    <div
      className={cn("overflow-auto rounded-md border bg-background p-3", className)}
      style={{ maxHeight: resolvedMaxHeight }}>
      {childCount === null ? (
        <JsonTreeLeaf
          label="value"
          value={parsed.data}
          depth={0}
        />
      ) : (
        (Array.isArray(parsed.data)
          ? parsed.data.map((entry, index) => ({ key: `[${index}]`, value: entry }))
          : Object.entries(parsed.data as Record<string, unknown>).map(([key, entry]) => ({
              key,
              value: entry,
            }))
        ).map((entry) => (
          <JsonTreeNode
            key={entry.key}
            label={entry.key}
            value={entry.value}
            depth={0}
            defaultOpen
          />
        ))
      )}
    </div>
  )
}
