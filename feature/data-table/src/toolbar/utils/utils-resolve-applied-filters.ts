import type { Column, Table } from "@tanstack/react-table"
import type { DataTableFilterDefinition } from "../../filter"
import type { ColumnFilterOption, DataTableColumnMeta } from "../../view-options"

import { normalizeColumnFilterMeta } from "../../filter"
import { resolveColumnLabel } from "../../view-options"

export type AppliedFilterValue = {
  /** Stable React key for this value chip. */
  id: string
  value: string
  option: ColumnFilterOption | undefined
}

export type AppliedFilterGroup = {
  urlKey: string
  fieldLabel: string
  values: AppliedFilterValue[]
  /** `options` (repeated `<key>=v` params) or `search` (single `cs.<key>` text). Defaults to `options`. */
  kind?: "options" | "search"
}

/**
 * Build applied groups from resolved filter definitions: option values first, then column searches.
 * This is the definition-driven replacement for {@link resolveAppliedFilterGroups}.
 */
export function resolveAppliedFilterGroupsFromDefinitions(
  definitions: readonly DataTableFilterDefinition[] | undefined,
  filters: Record<string, string[]> | undefined,
  columnSearch: Record<string, string> | undefined,
): AppliedFilterGroup[] {
  if (!definitions) {
    return []
  }

  const groups: AppliedFilterGroup[] = []

  for (const definition of definitions) {
    if (definition.options === null) {
      continue
    }
    const appliedValues = filters?.[definition.key] ?? []
    if (appliedValues.length === 0) {
      continue
    }
    const matchesValue = definition.matchesValue ?? ((applied, option) => applied === option)
    const options = definition.options
    groups.push({
      urlKey: definition.key,
      fieldLabel: definition.label,
      kind: "options",
      values: appliedValues.map((value) => ({
        id: `${definition.key}:${value}`,
        value,
        option: options.find((entry) => matchesValue(value, entry.value)),
      })),
    })
  }

  for (const definition of definitions) {
    if (!definition.search) {
      continue
    }
    const text = columnSearch?.[definition.key]?.trim()
    if (!text) {
      continue
    }
    groups.push({
      urlKey: definition.key,
      fieldLabel: definition.label,
      kind: "search",
      values: [{ id: `cs:${definition.key}`, value: text, option: undefined }],
    })
  }

  return groups
}

/** @deprecated Prefer `AppliedFilterGroup` — kept for any external consumers. */
export type AppliedFilterChip = AppliedFilterValue & {
  urlKey: string
  fieldLabel: string
}

type TranslateFn = (key: string) => string

function readColumnMeta(column: Column<unknown, unknown>): DataTableColumnMeta | undefined {
  return column.columnDef.meta as DataTableColumnMeta | undefined
}

/**
 * Build one group per applied URL filter field, with values nested under the field label.
 * @deprecated Prefer `resolveAppliedFilterGroupsFromDefinitions` (definition-driven, no table instance).
 */
export function resolveAppliedFilterGroups<TData>(
  table: Table<TData>,
  filters: Record<string, string[]> | undefined,
  t: TranslateFn,
): AppliedFilterGroup[] {
  if (!filters) {
    return []
  }

  const groups: AppliedFilterGroup[] = []
  const seenUrlKeys = new Set<string>()

  for (const column of table.getAllColumns()) {
    const meta = readColumnMeta(column as Column<unknown, unknown>)
    const filterConfig = normalizeColumnFilterMeta(meta?.filter)
    if (!filterConfig?.options) {
      continue
    }

    const urlKey = filterConfig.key ?? column.id
    const options = filterConfig.staticOptions ?? []
    if (seenUrlKeys.has(urlKey)) {
      continue
    }
    seenUrlKeys.add(urlKey)

    const appliedValues = filters[urlKey] ?? []
    if (appliedValues.length === 0) {
      continue
    }

    const fieldLabel = resolveColumnLabel(column as Column<unknown, unknown>, t)

    const matchesValue = filterConfig.matchesValue ?? ((applied, option) => applied === option)

    groups.push({
      urlKey,
      fieldLabel,
      values: appliedValues.map((value) => ({
        id: `${urlKey}:${value}`,
        value,
        option: options.find((entry) => matchesValue(value, entry.value)),
      })),
    })
  }

  return groups
}

/**
 * @deprecated Prefer `resolveAppliedFilterGroups`. Flattens groups into per-value chips.
 */
export function resolveAppliedFilterChips<TData>(
  table: Table<TData>,
  filters: Record<string, string[]> | undefined,
  t: TranslateFn,
): AppliedFilterChip[] {
  return resolveAppliedFilterGroups(table, filters, t).flatMap((group) =>
    group.values.map((entry) => ({
      ...entry,
      urlKey: group.urlKey,
      fieldLabel: group.fieldLabel,
    })),
  )
}

/** URL keys that currently have at least one applied filter value. */
export function getActiveFilterUrlKeys(filters: Record<string, string[]> | undefined): string[] {
  if (!filters) {
    return []
  }

  return Object.entries(filters)
    .filter(([, values]) => values.length > 0)
    .map(([key]) => key)
}
