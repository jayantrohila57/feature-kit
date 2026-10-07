import type { ColumnFilterConfig, ColumnFilterOption, DataTableColumnMeta, TranslateFn } from "../../view-options"
import type {
  DataTableColumnFilterInput,
  DataTableColumnFilterMeta,
  DataTableFilterDefinition,
  DataTableFilterKind,
} from "../filter-types"

import { humanizeColumnId } from "../../view-options"

/** Minimal column-def shape needed to resolve filter definitions (no table instance required). */
export type FilterColumnDefLike = {
  id?: unknown
  accessorKey?: unknown
  accessorFn?: unknown
  enableSorting?: boolean
  header?: unknown
  meta?: unknown
}

export type ResolveFilterDefinitionsOptions = {
  /** Distinct option lists keyed by filter key (full dataset, resolved by the page). */
  filterOptions?: Record<string, ColumnFilterOption[]> | undefined
  /** Definitions declared outside column meta (toolbar-only filters). Same key overrides the column one. */
  explicitDefinitions?: readonly DataTableFilterDefinition[] | undefined
  t: TranslateFn
}

function isLegacyFilterConfig(input: DataTableColumnFilterInput): input is ColumnFilterConfig {
  return typeof (input as ColumnFilterConfig).urlKey === "string"
}

/** Normalise legacy `{ urlKey, options }` into capability meta; new meta passes through. */
export function normalizeColumnFilterMeta(
  input: DataTableColumnFilterInput | undefined,
): DataTableColumnFilterMeta | undefined {
  if (!input) {
    return undefined
  }

  if (isLegacyFilterConfig(input)) {
    return {
      key: input.urlKey,
      options: true,
      staticOptions: input.options,
      ...(input.multi !== undefined ? { multi: input.multi } : {}),
      ...(input.matchesValue ? { matchesValue: input.matchesValue } : {}),
    }
  }

  return input
}

export function readColumnDefId(column: FilterColumnDefLike): string | null {
  if (typeof column.id === "string" && column.id) {
    return column.id
  }
  if (typeof column.accessorKey === "string" && column.accessorKey) {
    return column.accessorKey
  }
  return null
}

function readColumnDefMeta(column: FilterColumnDefLike): DataTableColumnMeta | undefined {
  return column.meta as DataTableColumnMeta | undefined
}

/** Def-level label resolution mirroring `resolveColumnLabel` (which needs a live column). */
export function resolveColumnDefLabel(column: FilterColumnDefLike, columnId: string, t: TranslateFn): string {
  const meta = readColumnDefMeta(column)

  if (meta?.labelKey) {
    if (t.has?.(meta.labelKey)) {
      return t(meta.labelKey)
    }
    if (!t.has) {
      try {
        return t(meta.labelKey)
      } catch {
        // Missing translation key — fall through.
      }
    }
  }

  if (meta?.label) {
    return meta.label
  }

  if (typeof column.header === "string" && column.header.trim()) {
    return column.header
  }

  return humanizeColumnId(columnId)
}

/** TanStack enables sorting for accessor columns unless `enableSorting: false`. */
function columnDefCanSort(column: FilterColumnDefLike): boolean {
  if (column.enableSorting === false) {
    return false
  }
  return typeof column.accessorKey === "string" || typeof column.accessorFn === "function"
}

/**
 * Resolve one filter definition from a column def, or `null` when the column exposes no capability.
 *
 * Legacy defaults (no `meta.filter`): sort follows `enableSorting`, search is opt-in via
 * `meta.search === true` (the column search param is backend-specific).
 */
export function resolveColumnFilterDefinition(
  column: FilterColumnDefLike,
  options: Pick<ResolveFilterDefinitionsOptions, "filterOptions" | "t">,
): DataTableFilterDefinition | null {
  const columnId = readColumnDefId(column)
  if (!columnId) {
    return null
  }

  const meta = readColumnDefMeta(column)
  const filterMeta = normalizeColumnFilterMeta(meta?.filter)
  const key = filterMeta?.key ?? columnId
  const canSort = columnDefCanSort(column)

  const sort = filterMeta?.sort ?? (meta?.sort === undefined ? canSort : meta.sort && canSort)
  const search = filterMeta?.search ?? meta?.search === true
  const wantsOptions = filterMeta?.options === true
  const optionList = wantsOptions ? (options.filterOptions?.[key] ?? filterMeta?.staticOptions ?? []) : null

  if (!sort && !search && !wantsOptions) {
    return null
  }

  return {
    key,
    columnId,
    label: resolveColumnDefLabel(column, columnId, options.t),
    search,
    sort,
    options: optionList,
    multi: filterMeta?.multi !== false,
    ...(filterMeta?.matchesValue ? { matchesValue: filterMeta.matchesValue } : {}),
  }
}

/**
 * Resolve every filter definition for a table: column-declared capabilities plus explicit
 * toolbar-only definitions. One definition per key; explicit definitions win.
 */
export function resolveFilterDefinitions(
  columns: readonly FilterColumnDefLike[],
  options: ResolveFilterDefinitionsOptions,
): DataTableFilterDefinition[] {
  const byKey = new Map<string, DataTableFilterDefinition>()

  for (const column of columns) {
    const definition = resolveColumnFilterDefinition(column, options)
    if (definition && !byKey.has(definition.key)) {
      byKey.set(definition.key, definition)
    }
  }

  for (const definition of options.explicitDefinitions ?? []) {
    byKey.set(definition.key, definition)
  }

  return Array.from(byKey.values())
}

/** URL keys of option-capable definitions (what `filters` reads from the URL). */
export function getFilterUrlKeysFromDefinitions(definitions: readonly DataTableFilterDefinition[]): string[] {
  return definitions.filter((definition) => definition.options !== null).map((definition) => definition.key)
}

/** Keys that can be added as toolbar chips: value-list and text-search filters. */
export function getToolbarChipKeysFromDefinitions(definitions: readonly DataTableFilterDefinition[]): string[] {
  return definitions
    .filter((definition) => definition.options !== null || definition.search)
    .map((definition) => definition.key)
}

/** Definitions that can render a toolbar chip / header option list. */
export function getOptionFilterDefinitions(
  definitions: readonly DataTableFilterDefinition[],
): DataTableFilterDefinition[] {
  return definitions.filter((definition) => definition.options !== null)
}

export function findFilterDefinitionByColumnId(
  definitions: readonly DataTableFilterDefinition[] | undefined,
  columnId: string,
): DataTableFilterDefinition | undefined {
  return definitions?.find((definition) => definition.columnId === columnId)
}

export function findFilterDefinitionByKey(
  definitions: readonly DataTableFilterDefinition[] | undefined,
  key: string,
): DataTableFilterDefinition | undefined {
  return definitions?.find((definition) => definition.key === key)
}

/** Capabilities a definition enables, in render order. */
export function getEnabledFilterKinds(
  definition: DataTableFilterDefinition,
  allowed?: readonly DataTableFilterKind[],
): DataTableFilterKind[] {
  const kinds: DataTableFilterKind[] = []
  if (definition.search) kinds.push("search")
  if (definition.sort) kinds.push("sort")
  if (definition.options !== null) kinds.push("options")
  if (!allowed) {
    return kinds
  }
  const allowedSet = new Set(allowed)
  return kinds.filter((kind) => allowedSet.has(kind))
}
