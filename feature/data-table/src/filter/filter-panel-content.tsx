"use client"

import type { DataTableFilterDefinition, DataTableFilterKind } from "./filter-types"

import { Fragment } from "react"

import { Separator } from "@/packages/ui/components/separator"

import { filterRenderers } from "./filter-renderers"
import { getEnabledFilterKinds } from "./utils"

export type FilterPanelContentProps = {
  definition: DataTableFilterDefinition
  menuOpen: boolean
  onClose: () => void
  /** Restrict which capabilities render (toolbar chips show `["options"]` only). */
  kinds?: readonly DataTableFilterKind[]
}

/** Composes the enabled capability renderers of a definition, separated by dividers. */
export function FilterPanelContent({ definition, menuOpen, onClose, kinds }: FilterPanelContentProps) {
  const enabledKinds = getEnabledFilterKinds(definition, kinds)

  return (
    <>
      {enabledKinds.map((kind, index) => {
        const Renderer = filterRenderers[kind]
        return (
          <Fragment key={kind}>
            {index > 0 ? <Separator className="my-0" /> : null}
            <Renderer
              definition={definition}
              menuOpen={menuOpen}
              onClose={onClose}
            />
          </Fragment>
        )
      })}
    </>
  )
}
