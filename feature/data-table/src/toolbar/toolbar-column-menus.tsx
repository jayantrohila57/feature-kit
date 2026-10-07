"use client"

import { useEffect } from "react"

import { useDataTableContext } from "../core"
import { findFilterDefinitionByColumnId } from "../filter"

type DataTableToolbarColumnMenusProps = {
  columnIds: string[]
}

/**
 * @deprecated Header-less tables get toolbar option filters from column `meta.filter` automatically.
 * This wrapper only pins the given columns' filter chips to the toolbar (non-removable) so existing
 * call sites keep their always-visible filters. Prefer letting users add chips via "Add filter".
 */
export function DataTableToolbarColumnMenus<TData>({ columnIds }: DataTableToolbarColumnMenusProps) {
  const { filterDefinitions, pinFilterKeys } = useDataTableContext<TData>()
  const keys = columnIds.flatMap((columnId) => {
    const definition = findFilterDefinitionByColumnId(filterDefinitions, columnId)
    return definition && definition.options !== null ? [definition.key] : []
  })
  const keysSignature = keys.join("\0")

  useEffect(() => {
    pinFilterKeys?.(keysSignature ? keysSignature.split("\0") : [])
    return () => {
      pinFilterKeys?.([])
    }
  }, [keysSignature, pinFilterKeys])

  return null
}
